const WS = 'ws://localhost:9090'
const copyright = ""
const golos = require('golos-js')
const redKey = "lastblocknumber"
const WebSocket = require('ws');
const ws = new WebSocket(WS);
const redis = require("redis")
const client = redis.createClient()

golos.config.set('websocket', WS);

const botname = 'robot'
const wif = '5****************ACTIVEKEY***********************'
const ammount = '0.001 GOLOS'

const blacklist = ['spamaccount','scam','badass']

const OPSFILTER = (operation) => {
    const [type, data] = operation


    if (type === 'custom_json') {
        if (typeof data.json !== 'undefined') {
            const initiator = data.required_posting_auths;
            const reblogData = JSON.parse(data.json);
            if (reblogData[0] === 'reblog') {
                // Фильтруем аккаунты бизнес молодлсти и тех, кто отписался от рассылки
                if (!reblogData[1].author.includes('bm-') || reblogData[1].author !== "oxisunbeam") {


                    // Отправляем уведомление о реблоге
                    golos.broadcast.transfer(wif, botname, reblogData[1].author, ammount, `⚡ @${initiator} сделал репост вашей записи 👉 ${reblogData[1].permlink} ${copyright}`, function (err, result) {
                        if (err) {
                            console.warn(err);
                        } else {
                            console.log(`@${initiator} сделал репост ${reblogData[1].permlink} `)
                        }

                    });

                }


            }
            // Если операция подписки, отписки, блока
            else if (reblogData[0] === 'follow') {

                const data = reblogData[1].what[0];
                const user = reblogData[1].following;
                const INITIATOR = reblogData[1].follower

                if (!user.includes('bm-') &&
                    !blacklist.includes(initiator) &&
                    !blacklist.includes(INITIATOR) &&
                    !blacklist.includes(user)
                ) {



                    golos.api.getAccounts([user, INITIATOR], (err, response) => {


                        let isNormalINIT = response[1].reputation > 10e10 && response[1].posting_rewards > 6e4;
                        let isWhaleINIT = response[1].reputation > 10e13 && response[1].posting_rewards > 6e6;
                       
                        let isNormalUSER = response[0].reputation > 10e10 && response[0].posting_rewards > 2e5;
                        let isWhaleUSER = response[0].reputation > 10e13 && response[0].posting_rewards > 6e6;

                        if ((isNormalUSER && isNormalINIT) || (isWhaleINIT || isWhaleUSER)) {


                            if (data === 'ignore') {

                                golos.broadcast.transfer(wif, botname, user, ammount, `🚩 @${initiator} добавил вас в игнор`, function (err, result) {
                                    if (err) {
                                        console.warn(err);
                                    } else {
                                        console.log(`@${initiator} добавил в игнор  ${reblogData[1].following}`)

                                    }
                                });

                            } else if (data === 'blog') {


                                golos.broadcast.transfer(wif, botname, user, ammount, `👍 @${initiator} подписался на ваш блог! ${copyright}`, function (err, result) {
                                    if (err) {
                                        console.warn(err);
                                    } else {
                                        console.log(`@${initiator} подписался на  ${reblogData[1].following}`)
                                    }
                                });
                            }
                            // В ином случае это отписка
                            else {
                                golos.api.getFollowCount(user, (err, count) => {
                                    if (err) return console.warn(err)
                                    let last = null
                                    let names = []
                                    const getfollowings = (lastname) => {
                                        golos.api.getFollowing(user, lastname, "blog", 100, (errs, followings) => {
                                            if (errs) return console.warn(errs)
                                            if (last === followings[followings.length - 1].following) {

                                                if (names.includes(initiator)) {
                                                    golos.broadcast.transfer(wif, botname, user, ammount, `❗ @${initiator} отписался от вашего блога ${copyright}`, function (err, result) {
                                                        if (err) return console.warn(err);
                                                        return console.log(`@${initiator} отписался ${reblogData[1].following}`)
                                                    });
                                                } else {
                                                    golos.broadcast.transfer(wif, botname, user, ammount, `🤝 @${initiator} перестал вас игнорить  ${copyright}`, function (err, result) {
                                                        if (err) return console.warn(err);
                                                        return console.log(`@${initiator} перестал игнорить ${reblogData[1].following}`)
                                                    });
                                                }
                                                return
                                            }

                                            for (let z of followings) names.push(z.following)
                                            last = followings[followings.length - 1].following
                                            getfollowings(last)

                                        })
                                    }

                                    getfollowings(last)
                                })





                            }

                        } else {
                            console.log(`Вероятный читер: ${INITIATOR} фолловит ${user} `)
                        }
                    });
                } else {
                    console.log(`Фрауд: ${initiator} > ${user}`)
                }
            }


        }
    }
    if (type === 'account_witness_vote') {

        if (data.approve) {
            golos.broadcast.transfer(wif, botname, data.witness, ammount, `👨🏼‍🚀 @${data.account} проголосовал за вашу ноду Делегата ${copyright}`, function (err, result) {
                if (err) {
                    return console.warn(err);
                } else {
                    console.log(`@${data.account} проголосовал за ноду ${data.witness}`)

                }

            });
        } else {
            golos.broadcast.transfer(wif, botname, data.witness, ammount, `😈 @${data.account} снял голос с вашей ноды Делегата ${copyright}`, function (err, result) {
                if (err) {
                    return console.warn(err);
                } else {
                    console.log(`@${data.account} убрал голос за ноду ${data.witness}`)

                }

            });
        }
    }





    if (type === 'comment') {
        console.log(data.author, data.permlink)

        golos.api.getContent(data.author, data.permlink, (err, result) => {
            if (err) return console.log(err)
            if (data.active !== data.created) return console.log(`Редактирование поста ${data.author} - упоминания не отправляются!`)


            const metaData = (data.json_metadata) ? JSON.parse(data.json_metadata) : false;
            if (metaData && typeof metaData.users !== 'undefined' && !blacklist.includes(data.author)) {

                const mentions = metaData.users
                if(typeof mentions !== 'object')return
                for (mention of mentions) {

                    let usname = mention.toLowerCase().replace("@", "")

                    golos.api.getAccounts([usname], (err, result)=> {
                        if(err||!result[0]) return 
                        golos.broadcast.transfer(wif, botname, usname, ammount, `💡 @${data.author} упомянул вас в сообщении  https://golos.io/@${data.author}/${data.permlink}  ${copyright}`, (err, result)=> {
                            if (err) {
                                return console.warn(err);
                            } else {
                                console.log(`@${mention} упомянут тут @${data.author}/${data.permlink}`)
    
                            }
                        });
                    });
                   


                }
            }
        });




    }
}


const END = "\x1b[0m"
const RED = "\x1b[31m"
const GREEN = "\x1b[36m"

let height = 0
let next = 0
let nodeparam = process.argv.slice(2);
let getNOW = nodeparam[0] === "now"
let targetheight = (!isNaN(nodeparam[0])) ? nodeparam[0] : false
let fheight = 0
let timestamp = 0
if (targetheight) {
    fheight = Number(targetheight);
    client.set(redKey, fheight);
    targetheight = false;
}


const getOps = (sequentBlock, speed) => {
    ws.send(JSON.stringify({
        id: speed,
        method: 'call',
        params: ["database_api", "get_ops_in_block", [sequentBlock, "false"]]
    }), (e) => {
        if (e) return console.warn(e)
    });

}

let Tl = D => {
    let txTimes = []
    for (tx of D) {
        txTimes.push(Date.parse(tx.timestamp))
    }
    return Math.max.apply(Math, txTimes);
}

ws.on('open', open = () => {
    ws.send(JSON
        .stringify({
            id: 1,
            method: 'call',
            "params": ["database_api", "set_block_applied_callback", [0], ]
        }), (e) => {
            if (e) return console.warn(e)
        });

    const Send = (operations, ProcessedBlockNum, ProcessedOpTime) => {

        let ops = []
        for (let op of operations) {
            ops.push(op.op)
        }
        let opslength = ops.length
        let delta = height + 1 - ProcessedBlockNum
        let state = (ProcessedBlockNum > height) ? "Realtime" : "🏃 Processing missed blocks... " + delta + " Left"
        let golostime = Date.parse(timestamp)
        let ageLastOps = (golostime - ProcessedOpTime) / 1000
        console.log(`🔘 ${GREEN}${ProcessedBlockNum} ${END} ${RED}⌛️${ageLastOps} ${END} [🔴 ${height+1}] ${state}  📓 ${ops.length} 📐`)
        client.set(redKey, ProcessedBlockNum);
        if (ProcessedBlockNum <= height) getOps(ProcessedBlockNum + 1, 3)
        return ops.forEach(OPSFILTER)
    }


    ws.on('message', (raw) => {

        let data = JSON.parse(raw)

        if (data.method === "notice" && data.params) {
            let hex = data.params[1][0].previous.slice(0, 8)
            height = parseInt(hex, 16)-2
            timestamp = data.params[1][0].timestamp
            if (getNOW || height < fheight) client.set(redKey, height);
            client.get(redKey, (err, num) => {
                let lastblock = Number(num)
                next = height - 1
                if (lastblock) next = lastblock + 1
                let delta = height - next
                if (delta < 0) return getOps(next, 2)
                else if (lastblock < height) return getOps(next, 3)
            });
        } else if (data.id === 2) {
            let lastTime = Tl(data.result)
            Send(data.result, next, lastTime)
        } else if (data.id === 3) {
            client.get(redKey, (err, num) => {
                let lastblock = Number(num)
                if (lastblock > height) return
                let lastTime = Tl(data.result)
                Send(data.result, lastblock + 1, lastTime)
            })
        }
    })

});
