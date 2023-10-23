const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const { API_VERSION } = require("./constants.js")


const app = express()

//configurar body parser

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//configurar carpeta static
app.use(express.static("uploads"))

//configurar headers HTTP - CORS
app.use(cors())

// importar ruta
const authRoutes = require("./router/auth.router.js")
const userRoutes = require("./router/user.router.js")
const menuRoutes = require("./router/menu.router.js")
const courseRoutes = require("./router/course.router.js")
const postRoutes = require("./router/post.router.js")
const newsletterRoutes = require("./router/newsletter.router.js")

//configurar rutas
app.use(`/api/${API_VERSION}`, authRoutes)
app.use(`/api/${API_VERSION}`, userRoutes)
app.use(`/api/${API_VERSION}`, menuRoutes)
app.use(`/api/${API_VERSION}`, courseRoutes)
app.use(`/api/${API_VERSION}`, postRoutes)
app.use(`/api/${API_VERSION}`, newsletterRoutes)

module.exports = app 