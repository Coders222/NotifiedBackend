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
router.route('/testkey').post((req,res)=>{
    const authkey = req.body.authkey;

    auth.authenticate(authkey).then((user) => {
        console.log(user);
        res.json(user);
        return;
    })

})
router.route('/register').post((req,res)=>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    let temp = [firstName, lastName, email, password];

    for(let i in temp){
        if (temp[i] == undefined) { res.status(400); res.json([{ 'error': 'missing field(s)' }]); return; }
    }
    console.log("running register");
    Account.findOne({email}).then(
        (account) =>{
            if(account){
                res.status(400);
                res.json("Email already in use");
                return;
            }
            const newUser = new User({savedDocuments:[], viewedDocuments:[], userLevel: 0});
            newUser.save()
            .then((savedUser)=>{
                bycrypt.hash(password, 10).then((hashedPassword)=>{
                    const newAccount = new Account ({firstName, lastName, email, passwordHash:hashedPassword,accountType:1, userId: savedUser._id});
                    newAccount.save()
                    .then((savedAccount) => {
                        if(savedAccount == undefined){
                            res.status(400);
                            res.json("Save Error");
                            return;
                        }
                        crypto.randomBytes(48, function (err, buffer) {
                            if (err) { res.status(400); res.send([{ 'error': err }]); return }
                            var k = buffer.toString('hex');
                            const newAuthkey = new Authkey({key:k,accountId:savedAccount._id,userId: savedAccount._id, accountType:savedAccount.accountType});
                            newAuthkey.save()
                            .then((key) => res.json(key))
                            .catch(err => res.status(400).json('Error: ' + err))
                        })
                    })
                })
            }) 
        }
    )
})

router.route('/login').post((req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    let temp = [email,password];

    for(let i in temp){
        if(i == undefined){res.status(400);res.send("missing field");return;}
    }

    Account.findOne({email}).then((user)=>{
        if(user == undefined){
            res.status(400);
            res.json("Either password or email is wrong");
            return;
        }
        bycrypt.compare(password, user.passwordHash).then((result)=>{
            if(result){
                crypto.randomBytes(48, function (err, buffer) {
                    if (err) { res.status(400); res.send([{ 'error': err }]); return }
                    var k = buffer.toString('hex');
                    const newAuthkey = new Authkey({key:k,accountId:user._id, accountType:user.accountType});
                    newAuthkey.save()
                    .then((key) => res.json(key))
                    .catch(err => res.status(400).json('Error: ' + err))
                })
            }else{
                res.status(400);
                res.json("Either password or email is wrong");
                return;
            }
        })
    })
})
router.route('/changePassword').post((req,res)=>{
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    
    const authkey = req.body.authkey;

    let temp = [oldPassword, newPassword, authkey];

    for(let i = 0;i<temp.length;i++){
        if(temp[i] === undefined){res.status(400);res.send("missing field");return;}
    }

    auth.authenticate(authkey).then((user)=>{
        if(user == undefined){
            res.status(400);
            res.json("Login Error");
            return;
        }
        Account.findOne({_id:user['user id']}).then((account)=>{
            if(account == undefined){
                res.status(400);
                res.json("Account not found");
                return;
            }
            bycrypt.compare(oldPassword, account.passwordHash).then((result)=>{
                if(!result){
                    res.status(400);
                    res.json("old password does not match account password");
                    return;
                }else{
                    bycrypt.hash(newPassword,10).then((passwordHash)=>{
                        Account.findOneAndUpdate({_id:user['user id']},{passwordHash:passwordHash})
                        .then(()=> res.json("password has been updated"))
                        .catch(err => res.status(400).json('Error: ' + err))
                    })
                    
                }
            })
            
        })
    })

})
module.exports = router;