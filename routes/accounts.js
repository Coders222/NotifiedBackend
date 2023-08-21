var express = require('express');
var router = express.Router();
let Account = require(`../models/account.model`);
let Authkey = require(`../models/authkey.model`);
var bycrypt = require('bcrypt');

router.get('/',function(req,res,next){
    res.status(200);
    res.json("connected");
    return;
})
router.route('/register').post((req,res)=>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    let temp = [firstName, lastName, email, password];

    for(let i in temp){
        if (temparr[i] == undefined) { res.status(400); res.json([{ 'error': 'missing field(s)' }]); return; }
    }
    console.log("running register");
    Account.findOne({email}).then(
        (account) =>{
            if(account){
                res.status(400);
                res.json("Email already in use");
                return;
            }
            bycrypt.hash(password, 10).then((hashedPassword)=>{
                const newAccount = new Account ({firstName, lastName, email, password:hashedPassword,accountType:1});
                newAccount.save()
                .then((savedAccount) => {
                    if(savedAccount == undefined){
                        res.status(400);
                        res.json("Save Error");
                        return;
                    }
                    const newAuthkey = new Authkey({accountId:savedAccount._id, accountType:savedAccount.accountType});
                    newAuthkey.save()
                    .then((key) => res.json(key))
                    .catch(err => res.status(400).json('Error: ' + err))
                })
            })
            
        }
    )
})

module.exports = Account;