
const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
    type :{
        type: String,
        required: true,
    },
    sheduleDate: {
        type: Date,
        required: true
    },
    team:
        [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "team"
      }],

    checklistcategory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "checklist-category"
          }
    ],
    auditee:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "auditee"
          }
    ]
},{
    timestamps: true
    
});
module.exports = mongoose.model('audit', auditSchema);