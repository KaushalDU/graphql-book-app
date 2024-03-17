const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = Schema({
    author: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    publish_year: {
        type: String,
        required: true
    },
    borrowedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        default:null
    }
}, {
    versionKey: false
})

module.exports = mongoose.model("book", bookSchema)