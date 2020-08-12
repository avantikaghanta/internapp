
const mongoose = require('mongoose');
const passport=require("passport");

const userSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true,
        unique:true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { 
        type: String, 
        required: true
     },

    role:{
        type:String,
        require:true
    },
    team:
        [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "team"
      }],

}, {
    timestamps: true
});



module.exports = mongoose.model('User', userSchema);