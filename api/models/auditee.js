
const mongoose = require('mongoose');

const auditeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true,
        unique:true
    },
    address: {
        type: String,
        required: true,
    
    },
    email: {
        type: String,
        required: true,
        unique:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    },
},{
    timestamps: true
});
module.exports = mongoose.model('auditee', auditeeSchema);