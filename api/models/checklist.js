const mongoose = require('mongoose');

const checklistSchema =  new mongoose.Schema({
    result:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true  
    },
    checklistcategory:
        [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "checklistcategory"
      }]
    },{
    timestamps: true
});
module.exports = mongoose.model('checklist', checklistSchema);