const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    audit:
        [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "audit"
      }]
    },{
        timestamps: true
});
module.exports = mongoose.model('team', teamSchema);