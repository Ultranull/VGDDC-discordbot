console.log('running bot...')

const Discord = require('discord.js')
const auth = require('./auth.json')
const client = new Discord.Client()
const sql = require('sqlite')

client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag)
})

const prefix = '!'
client.on('message', message => {
    var msg = message.content
    console.log(message.author.username + ': ' + msg)
    var args = msg.substring(1).split(' ')
    var cmd = args[0]
    let sced = message.guild.roles.find('name', 'sacrificed')
    let member = message.mentions.members.first()
    if (message.author.bot) return
    if (message.channel.type !== 'text') return
    if (message.member.roles.has(sced.id)) {
        message.delete()
            .then(msg => {
                console.log(`Deleted message from ${msg.author}`)
                message.channel.send("A ghostly whisper of " + msg.author.username + " says \"" + msg + "\"")
            })
            .catch(console.error)

    }

    var banned = ['fuck', 'shit', 'cunt', 'dick', 'ass', 'bitch']
    var replacements = ['love making', 'fecal matter', 'Trai Corte', 'octopus tentacle', 'Joshua Jane', 'your mother']

    for (var i = 0; i < banned.length; i++) {
        if (msg.toLowerCase().indexOf(banned[i]) >= 0) {
            message.reply('hey thats a bad word! use ' + replacements[i] + ' instead!')
        }
    }
    for (var i = 0; i < banned.length; i++) {
        if (msg.toLowerCase().indexOf(replacements[i]) >= 0) {
            message.reply('thank you for complying to our language standards...for once.')
        }
    }
    if (msg.substring(0, 1) === prefix) {
        switch (cmd) {
            case 'ping':
                message.channel.send('pong!')
                break

            case 'sacrifice':
                if (member.user.username === ("bluehat") || member.user.username === "ShadowManes") {
                    message.channel.send("you cannot damn the creator!")
                    return;
                }
                member.addRole(sced).catch(console.error)
                message.channel.send(member.user.username + "'s soul has been consumed by the mighty lord!")
                break
            case 'resurrect':
                if (message.member.roles.has(sced.id)) {
                    message.reply('BE SILENT THE DEAD BELONG TO ME!')
                } else {
                    member.removeRole(sced).catch(console.error)
                    message.channel.send(member.user.username + "'s soul has been pulled from the underworld!")
                }
                break
            case 'help':
                message.channel.send('use the prefix !\n' +
                    '-- !sacrifice @<user> : send the user to the underworld, and they will be scorned each time they speak\n' +
                    '-- !resurrect @<user> : return user to the living using dark magics\n' +
                    '-- !avatar : posts the image link to your avatar\n' +
                    '-- !help : well what do you think')
                break
            case 'avatar':
                message.channel.send(message.author.avatarURL)
                break
            case 'banned':
                var m = ''
                m += ('these are the banned language: \n')
                for (var s = 0; s < banned.length; s++)
                    m += (' -' + banned[s] + '\n')
                message.channel.send(m)
                break
        }
    }
})

client.login(auth.token)