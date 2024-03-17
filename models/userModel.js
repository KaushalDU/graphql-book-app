const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user", "admin"],
        required:true
    },
    borrowedBooks:[
        {
            type:Schema.Types.ObjectId,
            ref:"book"
        }
    ],
    notification:[
        {
            renterId:{
                type:Schema.Types.ObjectId,
                ref:"user"
            },
            bookId:{
                type:Schema.Types.ObjectId,
                ref:"book"

            }
        }
    ]
},{
    versionKey:false
})

module.exports = mongoose.model('user', userSchema);