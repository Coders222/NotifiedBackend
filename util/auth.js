const Authkey = require(`../models/authkey.model`);

function authenticate (key){
    return new Promise(function(resolve, reject) {
         Authkey.findOne({key:key}).then((user) => {
            
            if (user == undefined){
                console.log('key not found')
                reject('key not found')
            } else {
                resolve({
                    'user id': user.accountId,
                    'user type': user.accountType,
                })
            }
            
        })
    })
}

module.exports = {authenticate};