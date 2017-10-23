## A bot that reports various events of any account on GOLOS/STEEM
* https://golos.io/ru--golos/@vik/openrobot
* https://golos.io/ru--golos/@robot/obnovlenie-robot-teper-s-vozmozhnostyu-massovykh-upominanii


# Dependencies

* nodejs
* redis

### Installation
`npm install golos-js` or `npm install steem`

`npm install redis`

`npm install pm2`

### Run

From current block in blockchain
`pm2 start robot.js --now`

From last remebered block number
`pm2 start robot.js`

From custom block
`pm2 start robot.js 1245678`
