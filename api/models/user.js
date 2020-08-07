
const mongoose = require('mongoose');

const userSchema =new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
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
    password: { type: String, required: true },
    confirmpassword: {
        type: String,
        required: true,
        min: 8
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