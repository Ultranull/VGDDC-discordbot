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


    var banned = ['fuck', 'shit', 'cunt', 'dick']
    var replacements = ['xoth', 'vhoorl', 'Trai Corte', 'octopus tentacle']

    for (var i = 0; i < banned.length; i++) {
        if (msg.indexOf(banned[i]) >= 0) {
            message.reply('hey thats a bad word! use ' + replacements[i] + ' instead!')
        }
    }



    let sced = message.guild.roles.find('name', 'sacrificed');
    let member = message.mentions.members.first();
    if (msg.substring(0, 1) === prefix) {
        switch (cmd) {
            case 'ping':
                message.channel.send('pong!')
                break

            case 'sacrifice':
                member.addRole(sced).catch(console.error);
                message.channel.send(member.user.username + "'s soul has been consumed by the mighty lord!");
                break
            case 'resurrect':
                member.removeRole(sced).catch(console.error);
                message.channel.send(member.user.username + "'s soul has been pulled from the underworld!");

                break;
            case 'help':
                message.channel.send('i cant help you ' + message.author.username)
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