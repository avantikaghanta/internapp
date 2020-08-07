const mongoose = require('mongoose');

const checklistcategorySchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    
},{
    timestamps: true
});
module.exports = mongoose.model('checklistcategory', checklistcategorySchema);