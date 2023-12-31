const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authkeySchema = new Schema({
    key: {type:String, required:true},
    accountId: { type: String, required: true },    
    accountType: {type:Number, required:true},
    exprire: {type: Number}
  }, {
    timestamps: true,
  });

  const Authkey = mongoose.model('Authkey',authkeySchema );

  module.exports = Authkey;