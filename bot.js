console.log('running bot...')

const Discord = require('discord.js')
const auth = require('./auth.json')
const client = new Discord.Client()
const sql = require('sqlite')
sql.open('./score.sqlite')
sql.open('./skills.sqlite')


client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag)
})

const prefix = '!'
client.on('message', message => {
    var msg = message.content
    console.log(message.author.username + ': ' + msg)
    var args = msg.substring(1).split(' ')
    var cmd = args[0]
    if (message.author.bot) return
    if (message.channel.type !== 'text') return

    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
        if (!row) {
            sql.run(`INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)`, [message.author.id, 1, 0])
        } else {
            let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1))
            if (curLevel > row.level) {
                row.level = curLevel
                sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`)
                message.reply("You've leveled up to level " + curLevel + "! Ain't that dandy?")
            }
            sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`)
        }
    }).catch(() => {
        console.error
        sql.run(`CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)`).then(() => {
            sql.run(`INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)`, [message.author.id, 1, 0])
        })
    })
    var banned = ['fuck', 'shit', 'cunt', 'dick']
    var love = ['xoth', 'vhoorl', 'Trai Corte', 'octopus tentacle']

    for (var i = 0; i < banned.length; i++) {
        if (msg.indexOf(banned[i]) >= 0) {
            message.reply('hey thats a bad word! use ' + love[i] + ' instead!')
        }
    }

    if (msg.substring(0, 1) === prefix) {
        switch (cmd) {
            case 'ping':
                message.channel.send('pong!')
                break
            case 'level':
                sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
                    if (!row) return message.reply('Your current level is 0')
                    message.reply('Your current level is ' + row.level)
                })
                break
            case 'points':
                sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
                    if (!row) return message.reply('sadly you do not have any points yet!')
                    message.reply('you currently have ' + row.points + ' points, good going!')
                })
                break
            case 'reset':
                sql.run(`DROP TABLE scores`)
                console.log('dropping...')
                message.reply('the deed is done.')

                break
            case 'test':
                var sac = message.channel.members.get('username', args[0])
                message.channel.send('hello')
                break
            case 'help':
                message.channel.send('i cant help you ' + message.author.username)
                break
            case 'avatar':
                message.channel.send(message.author.avatarURL)
                break
            case 'banned':
                var m = "";
                m += ("these are the banned language: \n");
                for (var s = 0; s < banned.length; s++)
                    m += (" -" + banned[s] + "\n");
                message.channel.send(m);
                break
        }
    }
})

client.login(auth.token)