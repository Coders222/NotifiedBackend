const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    savedDocuments: {type:Array, required: true},
    viewedDocuments:{type:Array, required: true},
    userAccessLevel: {type:Array, required:true} 
}, {
    timestamps: true,
});

const User = mongoose.model('User',userSchema );

module.exports = User;