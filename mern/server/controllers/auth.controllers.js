const { JWT_SECRET_KEY } = require("../constants")
const User = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("../utils/jwt")

function register(req, res){
    const {firstname, lastname, email, password} = req.body
    
    // console.log(req.body);
    
    if(!email) res.status(400).send({msg: "El Email es Obligatorio"})
    if(!password) res.status(400).send({msg: "El Contraseña es Obligatoria"})

    const user = new User({
        firstname,
        lastname,
        email: email.toLowerCase(),
        role:"User",
        active: false,
    })

    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(password, salt)

    user.password = hashPassword
    
    user.save((error, userStorage) => {
        if(error){
            res.status(400).send({msg: "Error al crear el usuario"})
        } else {
            res.status(200).send(userStorage)
        }
    })
    
}
function login(req, res){
    const {email, password} = req.body
    if(!email) res.status(400).send({msg: "El Email es Obligatorio"})
    if(!password) res.status(400).send({msg: "El Contraseña es Obligatoria"})

    const emailLowerCase = email.toLowerCase()

    User.findOne({ email: emailLowerCase}, (error, userStore) => {
        if(error){
            res.status(500).send({msg: "Error del servidor"})
        } else {
            bcrypt.compare(password, userStore.password, (bcryptError, check) => {
                if (bcryptError) {
                    res.status(500).send({msg: "Error del servidor"})
                } else if (!check){
                    res.status(400).send({msg: "Usuario o Contraseña incorrecta"})
                } else if (!userStore.active) {
                    res.status(401).send({msg: "Usuario no autorizado o no activo"})
                } else {
                    res.status(200).send({
                        access: jwt.createAccessToken(userStore),
                        refresh: jwt.createRefreshToken(userStore)
                    })
                }
            })
        }
    })
}

function refreshAccessToken(req, res){
    const { token } = req.body

    if(!token) res.status(400).send({msg: "Error token requerido"})

    const { user_id } = jwt.decoded(token)

    User.findOne({ _id: user_id}, (error, userStorage) => {
        if(error){
            res.status(500).send({ msg: 'Error del Servidor' })
        } else {
            res.status(200).send({
                accessToken: jwt.createAccessToken(userStorage)
            })
        }
    })
}
module.exports = {
    register,
    login,
    refreshAccessToken
}
