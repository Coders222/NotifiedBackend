const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accountSchema = new Schema({
    firstName:{type:String, required:true},
    lastName: {type:String, required:true},
    email: {type:String, required:true},
    passwordHash: { type: String, required: true },    
    accountType: {type:Number, required:true}
  }, {
    timestamps: true,
  });

  const Account = mongoose.model('Account',accountSchema );

  module.exports = Account;