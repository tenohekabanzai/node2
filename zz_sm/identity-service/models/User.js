const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        trim: true
    },
    password:{
        type: String,
        required:true,
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
},{timestamps:true})

UserSchema.index({username:true});

const User = new mongoose.model('User',UserSchema)
module.exports = User

