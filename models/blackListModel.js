const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blackListTokenSchema = Schema({
    token: {
        type: String,
        required: true,
        unique: true,
      },
},{
    versionKey:false
})

module.exports=mongoose.model('blackListToken', blackListTokenSchema)