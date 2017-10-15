// BEWARE! 30 days hold for this ops
const golos = require('golos-js')
golos.config.set('websocket', "wss://api.golos.cf")

const login = "lorem" // your login
const pass = ""// your master password

const newRecoveryLogin = "golosio" // Login of your newest recovery account

let wif = golos.auth.getPrivateKeys(login, pass, ["owner","active","posting","memo"]);


golos.broadcast.changeRecoveryAccount(wif.owner,login,newRecoveryLogin, "", (err, result)=> {
if (err) return console.log(err);
console.log(`Done!

New recovery is ${newRecoveryLogin}

Keys:
${pass} - Master password
${wif.owner} - OWNER
${wif.active} - ACTIVE
${wif.posting} - POSTING
${wif.memo} - MEMO

`)
});
