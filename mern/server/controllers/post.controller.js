const Post = require("../models/post.model")
const image = require("../utils/image")

async function createPost(req, res){
    const post = new Post(req.body)
    post.created_at = new Date()

    const imagePath = image.getFilePath(req.files.miniature)
    post.miniature = imagePath

    post.save((error, postStrored) => {
        if (error) {
            res.status(400).send({message: "Error al crear el curso"})
    } else {
        res.status(201).send(postStrored)
    }

    })
}

function getPosts(req, res) {
    const { page = 1, limit = 10 } = req.query

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort : { created_at: "desc" }
    }

    Post.paginate({}, options, (error, postStrored) => {
        if (error) {
            res.status(400).send({ msg: "Error al obtener los post" });
        } else {
            res.status(200).send(postStrored)
        }
    })
}

async function updatePost(req, res) {
    const  {id } = req.params
    const postData = req.body

    if (req.files.miniature) {
        const imagePath = image.getFilePath(req.files.miniature)
        postData.miniature = imagePath
    }

    Post.findByIdAndUpdate({ _id: id }, postData, (error) => {
        if (error) {
             res.status(400).send({ msg: 'Error al actualizar el Post' });
        } else {
            res.status(200).send({ msg: 'actualizacion correctamente'});
        }
    })
}

async function deletePost(req, res){
    const { id } = req.params
    Post.findByIdAndDelete(id, (error) => {
        if (error) {
            res.status(400).send({ msg: "Error al eliminar el Post" })
        } else {
            res.status(200).send({ msg: "Post Eliminado" })
        }
    })
}

function getPost(req, res){
    const { path } = req.params

    Post.findOne({path}, (error, postStrored) => {
        if (error) {
            res.status(500).send({msg:"Error del servidor"})
        }  else if (!postStrored) {
            res.status(400).send({msg:"No se ha encontrado ningun post"})
        } else {
            res.status(400).send(postStrored)
        }
    })
}


module.exports = {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    getPost
}