const golos = require('golos-js')
golos.config.set('websocket', "wss://api.golos.cf")

const login = "lorem"
const wif= "5ouriuruemACTIVEKEYkjnfjnvnjfnvjnfjnvfjnvnjdu" // Active key
const newRecoveryLogin = "golosio" // Name of you newest recovery account

golos.broadcast.changeRecoveryAccount(wif,login,newRecoveryLogin, "", (err, result)=> {
if (err) return console.log(err);
console.log(`Done!

New recovery is ${newRecoveryLogin}`)
});
