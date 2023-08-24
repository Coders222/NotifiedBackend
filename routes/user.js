var express = require('express');
var router = express.Router();

let Account = require(`../models/account.model`);
let Authkey = require(`../models/authkey.model`);
let User = require(`../models/user.model`);

var bycrypt = require('bcrypt');
var crypto = require('crypto')

var auth = require(`../util/auth`);

router.get('/',function(req,res,next){
    res.status(200);
    res.json("connected");
    return;
})




module.exports = router;