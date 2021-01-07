const Discord = require("discord.js");
const axios = require("axios");

require('dotenv').config();



const client = new Discord.Client();
client.login(process.env.BOT_TOKEN);

// Implementação dos comandos
const prefix = "!";

client.on("message", function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! Esse comando teve a latência de ${timeTaken}ms.`);         
        
    }

    else if(command === "gitprofile" || command === "gp") {
        if(args.length > 0) {
            const card = new Discord.MessageEmbed()
            axios.get(`https://api.github.com/users/${args[0]}`)
            .then(res => {
                console.log(res.data);
                card
                .setColor('#0099ff')
                .setTitle(res.data.login)
                .setURL(`https://github.com/${args[0]}`)
                .setAuthor(res.data.name)
                .setThumbnail(res.data.avatar_url)

                // Esses campos podem vir nulos. Vamos verificar isso antes:
                res.data.blog ? card.addField('🌐 Blog', res.data.blog, true) : false
                res.data.bio ? card.setDescription(res.data.bio) : card.setDescription('*Sem biografia*')
                res.data.location ? card.addField('🗺 Localização', res.data.location, true) : false
                res.data.company ? card.addField('👔 Trabalho', res.data.company, true) : false

                card
                .addField('📦 Repositórios', res.data.public_repos, true)
                .addField('📎 Gists', res.data.public_gists, true)
                .setTimestamp()
                .setFooter('Esse card foi criado pelo GitCord');

                message.channel.send(card);

            })



        }
        else {
            message.reply('Opa! faltou colocar o nome de usuário.')
        }

    }


  });

console.log('iniciando bot...')