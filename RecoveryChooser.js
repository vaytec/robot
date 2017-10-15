const golos = require('golos-js')
golos.config.set('websocket', "wss://api.golos.cf")

const login = "lorem" // your login
const wif= "5ouriuruemACTIVEKEYkjnfjnvnjfnvjnfjnvfjnvnjdu" // your OWNER key (match login)
const newRecoveryLogin = "golosio" // Login of your newest recovery account

golos.broadcast.changeRecoveryAccount(wif,login,newRecoveryLogin, "", (err, result)=> {
if (err) return console.log(err);
console.log(`Done!

New recovery is ${newRecoveryLogin}`)
});
