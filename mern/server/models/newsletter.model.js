const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate")

const NewletterSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
    }
})

NewletterSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Newsletter", NewletterSchema)