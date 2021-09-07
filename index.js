//Client
const Discord = require("discord.js")
const { Client, Intents } = require('discord.js');
const client = new Client({
  presence: {
   status: 'dnd',
   activity: {
    name: 'Welcome',
    type: 'WATCHING',
   },
  },
 }, { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//Modules
const db = require(`quick.db`)
require('dotenv').config()

//Variables
const token = process.env.TOKEN
const prefix = process.env.PREFIX

//Commands
    client.on("message", (msg) => {
      channelwelc = db.get(`channel.${msg.guild.id}`)

      if (msg.author.bot) {
          return
        } else if (msg.content === `${prefix}test`) {
          if (channelwelc === null) return
          msg.react(`✅`)
           client.emit ('guildMemberAdd', msg.member);
           
     } else if (msg.content === `${prefix}help`){
         msg.channel.bulkDelete(1)
         let helpembed = new Discord.MessageEmbed()
         .setTitle(`Owecome Setup`)
         .setDescription(`In order for the bot to work you need to set up a channel which the welcome messages will be posted in.`)
         .addField(`Set it up:`, "`?setup <channel ID>`/`?setup <channel mention>`")
         .addField(`Need help?`,`[How to set up Owecome Bot](https://i.imgur.com/OazezIS.png)`)
         .addField(`Test`, "To test if everything is working you can do `?test`")
         .setColor(`#0351`)
         .setThumbnail(`${client.user.avatarURL()}`)
         msg.channel.send(helpembed)
         }  else if (msg.content === `${prefix}invite`) {
          msg.channel.send({ embed: {
            "description": `You liked the bot? [Invite ${client.user.username}](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`,
            "color": 0351,
        }});
       } else if (msg.content.startsWith(`${prefix}setup`)) {
          const args = msg.content.trim().split(/ +/);
          const cmd = args.shift()
          var channelid = (args[0].replace('<#','').replace('>',''))
          db.set(`channel.${msg.guild.id}`, channelid)
          
          //Embed
          let successembed = new Discord.MessageEmbed()
          .setTitle(`Success`)
          .setDescription(`Thank you for choosing **Owecome**! Your new members will be now warmly welcomed by the bot in <#${channelid}>`)
          .addField(`Not Working?`,`[Join the support server](https://discord.gg/m9fJVPtKTM)`)
          .addField(`Test`, "To test if everything is working you can do `?test`")
          .setColor(`GREEN`)
          .setThumbnail(`${client.user.avatarURL()}`)
          
          msg.reply(successembed)
          } else if (msg.content == `${prefix}ping`)
          msg.channel.send({ embed: {
          "description": `Bot Response Time: 🏓**${client.ws.ping}ms**!`,
          "color": 0351,
          }});
            });



//Welcomer
var Canvas = require('canvacord');

client.on('guildMemberAdd', member => {
  channelwelc2 = db.get(`channel.${member.guild.id}`)
  let welcome = member.guild.channels.cache.get(db.get(`channel.${member.guild.id}`))

var wellcome = new Canvas.Welcomer()
.setUsername(member.user.username)
.setDiscriminator(member.user.discriminator)
.setMemberCount(member.guild.memberCount.toLocaleString())
.setGuildName(member.guild.name)
.setAvatar(member.user.displayAvatarURL({ format: "png" }))
.setColor("border", "transparent")
.setColor("username-box", "#d33a0f") //
.setColor("discriminator-box", "#d33a0f")
.setColor("title", "#d33a0f")
.setColor("avatar", "#d33a0f")
.setText("member-count", "Member {count}`th")
.setText("title", "welcome")
.setText("message", "Enjoy your stay!")
.setBackground(`https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt8029e429cd82567d/6129ab436768907ea97679aa/090121_Ep3ActIIFractureTease_Banner_v3.jpg?auto=webp&disable=upscale&height=504`)

 /*
 "https://cdn-images.win.gg/resize/w/1000/format/webp/type/progressive/fit/cover/path/wp/uploads/2021/08/Canyon-scaled.jpg"
 
 `https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt8029e429cd82567d/6129ab436768907ea97679aa/090121_Ep3ActIIFractureTease_Banner_v3.jpg?auto=webp&disable=upscale&height=504`
  
 `https://staticg.sportskeeda.com/editor/2021/09/484ec-16306917668507-800.jpg`
*/


try {
  if (channelwelc2 === null) return
    wellcome.build()            
    .then(buffer => welcome.send(`Welcome to the server,${member}!`, new Discord.MessageAttachment(buffer, "welcome.png")));
  }
  catch (e) {
    console.log(e);
  }

});

//Slash CMDS
client.on('ready', () => {

 /* client.api.applications(client.user.id).commands.post({
      data: {
          name: "ping",
          description: "Check Bot`s response time!"
      }
  })

  client.api.applications(client.user.id).commands.post({
      data: {
          name: "invite",
          description: "Add the bot to your server!"
      }
  });
*/

  client.ws.on('INTERACTION_CREATE', async interaction => {


      const command = interaction.data.name.toLowerCase();
      const args = interaction.data.options;

      if (command === 'ping'){ 
          client.api.interactions(interaction.id, interaction.token).callback.post({
              data: {
                  type: 4,
                  data: {
                    embeds: [{
                      "description": `Bot Response Time: 🏓**${client.ws.ping}ms**!`,
                      "color": 0351
                    }]
                  }
              }
          })
      }

      if (command === 'invite'){ 
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                  embeds: [{
                    "description": `You liked the bot? [Invite ${client.user.username}](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`,
                    "color": 0351
                  }]
                }
            }
        })
      }

  });
});


//Login
client.login(token)
client.on("ready", () => {
   client.user.setUsername(`Owecome`)
   client.user.setAvatar(`https://images-ext-2.discordapp.net/external/OKgA4zGcH_ilzwqv9VBbs1NO-thUbj9hTCf0UvGR5GI/%3Fsize%3D128/https/cdn.discordapp.com/app-icons/879360738060292096/fc2356059549d0dfc8d4ab1bd0b4caac.webp`)
    console.log("Bot is ready!")
  });

  
