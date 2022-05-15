{

// Imports

const { Client, Intents, MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js')
const fetch = require('node-fetch')

const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_WEBHOOKS ] }, { partials: [ 'MESSAGE', 'USER', 'REACTION', 'CHANNEL' ] } );

require('http').createServer((req, res) => res.end('Bot is alive!')).listen(3000)

const Sequelize = require('sequelize')
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const RealmInfo = sequelize.define('realminfo', {
  name : {
    type : Sequelize.STRING,
    unique : true,
  },
  value : {
    type : Sequelize.STRING,
  },
})

const LevelData = sequelize.define('leveldata', {
  user : {
    type : Sequelize.STRING,
    unique : true,
  },
  level : {
    type : Sequelize.INTEGER,
  },
  xp : {
    type : Sequelize.INTEGER,
  },
})

const UserData = sequelize.define('userdata', {
  user : {
    type : Sequelize.STRING,
    unique : true,
  },
  username : {
    type : Sequelize.STRING,
    unique : true,
  },
  ip : {
    type : Sequelize.STRING,
    unique : true,
  },
  token : {
    type : Sequelize.STRING,
  },
})

const UserInvites = sequelize.define('invitesdata', {
  user : {
    type : Sequelize.STRING,
    unique : true,
  },
  inviter : {
    type : Sequelize.STRING,
    unique : true,
  },
  invites : {
    type : Sequelize.INTEGER,
  },
})

const Canvas = require('canvas')
const { registerFont } = require('canvas')

const { clientId, guildId, applicationId } = require('./config.json')
const token = process.env['token']
const bearer_token = process.env['bearer_token']
const { commands } = require('./commands.json')

// Bot Connect

client.once('ready', async () => {
  try {
    
    console.log("Bot Connected")

    console.log("Starting syncing databases..")

    RealmInfo.sync()
    LevelData.sync()
    UserData.sync()
    UserInvites.sync()

    console.log("Successfully synced databases")

    console.log("Started refreshing (/) commands...")
    
    await client.guilds.cache.get(guildId).commands.set([])
    await client.guilds.cache.get(guildId).commands.set(commands)
    await client.guilds.cache.get(guildId).commands.cache.forEach(async c => {
      const url = `https://discord.com/api/v9/applications/${applicationId}/guilds/${guildId}/commands/${c.id}/permissions`
      const adminOnly = {
        permissions : [
          {
            id: '814889551180201995',
            type: 1,
            permission: true
          },
          {
            id : client.guilds.cache.get(guildId).roles.everyone.id,
            type : 1,
            permission : false
          }
        ]
      }
      const modOnly = { 
        permissions : [
          {
            id : '814887810963734568',
            type : 1,
            permission : true
          },
          {
            id : client.guilds.cache.get(guildId).roles.everyone.id,
            type : 1,
            permission : false
          },
          {
            id: '814889551180201995',
            type: 1,
            permission: true
          }
        ]
      }
      switch (c.name) {
        case 'getdata':
          await fetch(url, {
            method: "PUT",
            body: JSON.stringify(modOnly),
            headers: {
              Authorization: `Bearer ${bearer_token}`,
              Accept: 'application/json',
             'Content-Type': 'application/json'
            },
          })
        break;
        case 'poll':
          await fetch(url, {
            method: "PUT",
            body: JSON.stringify(modOnly),
            headers: {
              Authorization: `Bearer ${bearer_token}`,
              Accept: 'application/json',
             'Content-Type': 'application/json'
            },
          })
        break;
        case 'setinfo':
          await fetch(url, {
            method: "PUT",
            body: JSON.stringify(adminOnly),
            headers: {
              Authorization: `Bearer ${bearer_token}`,
              Accept: 'application/json',
             'Content-Type': 'application/json'
            },
          })
        break;
        case 'verify':
          await fetch(url, {
            method: "PUT",
            body: JSON.stringify(modOnly),
            headers: {
              Authorization: `Bearer ${bearer_token}`,
              Accept: 'application/json',
             'Content-Type': 'application/json'
            },
          })
        break;
        case 'unverify':
          await fetch(url, {
            method: "PUT",
            body: JSON.stringify(modOnly),
            headers: {
              Authorization: `Bearer ${bearer_token}`,
              Accept: 'application/json',
             'Content-Type': 'application/json'
            },
          })
        break;
      }
    })

    console.log("Successfully refresed (/) commands")
  }
  catch (error) {
    console.error(error)
  }
})

// Action Log

client.on('messageDelete', async (msg) => {
  const logChannel = msg.guild.channels.cache.find(c => c.id == '908109163169714187')
  if (logChannel) {
    const Symbols = "```"
    const DeleteEmbed = new MessageEmbed()
      .setColor('0xff0000')
      .setTitle('Mensaje Eliminado')
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(`Mensaje eliminado en ${msg.channel}.\n\nContenido : \n${Symbols}\n${msg.content || 'Sin contenido'}\n${Symbols}`)
      .setFooter(msg.author.id)
    logChannel.send({ embeds: [DeleteEmbed] })
  }
  else {
    console.error("The channel couldn't be found")
  }  
})

client.on('messageUpdate', async (msg, newmsg) => {
  const logChannel = msg.guild.channels.cache.find(c => c.id == '908109163169714187')
  if (logChannel) {
    const Symbols = "```"
    const UpdateEmbed = new MessageEmbed()
      .setColor(0xff8000)
      .setTitle('Mensaje Editado')
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(`Mensaje editado en ${msg.channel}.\n\nContenido Antiguo :\n${Symbols}\n${msg.content || "Sin Contenido"}\n${Symbols}\nNuevo Contenido :\n${Symbols}\n${newmsg.content || "Sin Contenido"}\n${Symbols}`)
      .setFooter(msg.author.id)
    logChannel.send({ embeds: [UpdateEmbed] })
  }
  else {
    console.log("The channel couldn't be found")
  }
})

client.on('channelPinsUpdate', async (channel, date) => {
  const logChannel = channel.guild.channels.cache.find(c => c.id == '908109163169714187')
  if (logChannel) {
    const Symbols = "```"
    const PinsUpdateEmbed = new MessageEmbed()
      .setColor(0x00ff00)
      .setTitle('Pins Actualizados')
      .setDescription(`Pins Actualizados en ${channel}.`)
    logChannel.send({ embeds: [PinsUpdateEmbed] })
  }
  else {
    console.log("The channel couldn't be found")
  }
})

client.on('guildMemberUpdate', async (member, newmember) => {
  const logChannel = member.guild.channels.cache.find(c => c.id == '908109163169714187')
  if (logChannel) {
    const Symbols = "```"
    const MemberUpdateEmbed = new MessageEmbed()
      .setColor(0x00ff00)
      .setAuthor(member.user.tag, member.displayAvatarURL())
      .setTitle('Miembro Actualizado')
      .setFooter(member.id)
    if (member.nickname !== newmember.nickname) {
      MemberUpdateEmbed.setDescription(`El Nickname del miembro fue actualizado.\n\nNickname Antiguo :\n${Symbols}\n${member.nickname || member.user.username}\n${Symbols}\nNuevo Nickname :\n${Symbols}\n${newmember.nickname || newmember.user.username}\n${Symbols}`)
      logChannel.send({ embeds: [ MemberUpdateEmbed ] })
    }
    else if (member.roles !== newmember.roles) {
      if (member.roles.cache.size < newmember.roles.cache.size) {
        var role = ''
        newmember.roles.cache.forEach(r => {
          const oldRole = member.roles.cache.find(ro => ro == r)
          if (!oldRole) {
            role = r.name
          }
        })
        MemberUpdateEmbed.setDescription(`Se añadio un rol del miembro.\n\nRol Añadido :${Symbols}\n${role}\n${Symbols}`)
        logChannel.send({ embeds: [ MemberUpdateEmbed ] })
      }
      else if (member.roles.cache.size > newmember.roles.cache.size) {
        var role = ''
        member.roles.cache.forEach(r => {
          const oldRole = newmember.roles.cache.find(ro => ro == r)
          if (!oldRole) {
            role = r.name
          }
        })
        MemberUpdateEmbed.setDescription(`Se removido un rol de un miembro.\n\nRol Removido :${Symbols}\n${role}\n${Symbols}`)
        logChannel.send({ embeds: [ MemberUpdateEmbed ] })
      }
    }
  }
  else {
    console.log("The channel couldn't be found")
  }
})

client.on('channelUpdate', async (channel, newchannel) => {
  const logChannel = channel.guild.channels.cache.find(c => c.id == '908109163169714187')
  if (logChannel) {
    const Symbols = "```"
    const ChannelUpdateEmbed = new MessageEmbed()
      .setColor(0xff8800)
      .setTitle('Canal Actualizado')
      .setFooter(channel.id)
    if (channel.name !== newchannel.name) {
      ChannelUpdateEmbed.setDescription(`El nombre del canal ${channel} fué cambiado.\n\nNombre Antiguo :\n${Symbols}\n${channel.name || 'Sin nombre'}\n${Symbols}\nNuevo Nombre :\n${Symbols}\n${newchannel.name || 'Sin nombre'}\n${Symbols}`)
      logChannel.send({ embeds: [ChannelUpdateEmbed] })
    }
    else if (channel.topic !== newchannel.topic) {
      ChannelUpdateEmbed.setDescription(`El Topic del canal ${channel} fué cambiado.\n\nAntiguo Topic :\n${Symbols}\n${channel.topic || 'Sin Topic'}\n${Symbols}\nNuevo Topic :\n${Symbols}\n${newchannel.topic || 'Sin Topic'}\n${Symbols}`)
      logChannel.send({ embeds: [ChannelUpdateEmbed] })
    }
  }
  else {
    console.log("The channel couldn't be found")
  }
})

client.on('channelCreate', async (channel) => {
  const logChannel = channel.guild.channels.cache.find(c => c.id == '908109163169714187')
  if (logChannel) {
    const Symbols = "```"
    const ChannelCreateEmbed = new MessageEmbed()
      .setColor(0xff8800)
      .setTitle('Canal Creado')
      .setFooter(channel.id)
    if (channel.isText) {
      ChannelCreateEmbed.setDescription(`El canal ${channel} fué creado.\n\nTipo :${Symbols}\nCanal de Texto\n${Symbols}`)
      logChannel.send({ embeds: [ChannelCreateEmbed] })
    }
    else if (channel.isVoice) {
      ChannelCreateEmbed.setDescription(`El canal ${channel} fué creado.\n\nTipo :${Symbols}\nCanal de Voz\n${Symbols}`)
      logChannel.send({ embeds: [ChannelCreateEmbed] })
    }
  }
  else {
    console.log("The channel couldn't be found")
  }
})

client.on('channelDelete', async (channel) => {
  const logChannel = channel.guild.channels.cache.find(c => c.id == '908109163169714187')
  if (logChannel) {
    const Symbols = "```"
    const ChannelDeleteEmbed = new MessageEmbed()
      .setColor(0xff8800)
      .setTitle('Canal Eliminado')
      .setDescription(`Un canal fué eliminado\n\nNombre :\n${Symbols}\n${channel.name}\n${Symbols}`)
      .setFooter(channel.id)
    logChannel.send({ embeds: [ChannelDeleteEmbed] })
  }
  else {
    console.log("The channel couldn't be found")
  }
})

client.on('threadCreate', async (thread) => {
  const logChannel = thread.guild.channels.cache.find(c => c.id == '908109163169714187')
  if (logChannel) {
    const Symbols = "```"
    const ThreadCreateEmbed = new MessageEmbed()
      .setColor(0xff8800)
      .setTitle('Thread Creado')
      .setDescription(`El Thread ${thread} fué creado.\n\nNombre :${Symbols}\n${thread.name}\n${Symbols}\nPadre :\n${Symbols}\n${thread.parent.name}\n${Symbols}`)
      .setFooter(thread.id)
    logChannel.send({ embeds: [ThreadCreateEmbed] })
  }
  else {
    console.log("The channel couldn't be found")
  }
})

client.on('threadDelete', async (thread) => {
  const logChannel = thread.guild.channels.cache.find(c => c.id == '908109163169714187')
  if (logChannel) {
    const Symbols = "```"
    const ThreadDeleteEmbed = new MessageEmbed()
      .setColor(0xff8800)
      .setTitle('Thread Eliminado')
      .setDescription(`Un Thread fué eliminado.\n\nNombre :${Symbols}\n${thread.name}\n${Symbols}\nPadre :\n${Symbols}\n${thread.parent.name}\n${Symbols}`)
      .setFooter(thread.id)
    logChannel.send({ embeds: [ThreadDeleteEmbed] })
  }
  else {
    console.log("The channel couldn't be found")
  }
})

client.on('threadUpdate', async (thread, newthread) => {
  const logChannel = thread.guild.channels.cache.find(c => c.id == '908109163169714187')
  if (logChannel) {
    const Symbols = "```"
    const ThreadUpdateEmbed = new MessageEmbed()
      .setColor(0xff8800)
      .setTitle('Thread Actualizado')
      .setFooter(thread.id)
    if (thread.name !== newthread.name) {
      ThreadUpdateEmbed.setDescription(`El Thread ${thread} fué actualizado.\n\nAntiguo Nombre :\n${Symbols}\n${thread.name}\n${Symbols}\nNuevo Nombre :\n${Symbols}\n${newthread.name}\n${Symbols}`)
      logChannel.send({ embeds: [ThreadUpdateEmbed] })
    }
    else if (!thread.locked && newthread.locked) {
      ThreadUpdateEmbed.setDescription(`El Thread ${thread} fué bloqueado/archivado.`)
      logChannel.send({ embeds: [ThreadUpdateEmbed] })
    }
    else if (thread.locked && !newthread.locked) {
      ThreadUpdateEmbed.setDescription(`El Thread ${thread} fué desbloqueado/archivado.`)
      logChannel.send({ embeds: [ThreadUpdateEmbed] })
    }
  }
  else {
    console.log("The channel couldn't be found")
  }
})

client.on('guildBanAdd', async (ban) => {
  const logChannel = ban.guild.channels.cache.find(c => c.id == '908109163169714187')
  if (logChannel) {
    const Symbols = "```"
    const BanAddEmbed = new MessageEmbed()
      .setColor(0xff0000)
      .setTitle('Miembro Baneado')
      .setAuthor(ban.user.tag, ban.user.displayAvatarURL())
      .setDescription(`El miembro ${ban.user} fué baneado del servidor.\n\nRazón :\n${Symbols}\n${ban.reason}\n${Symbols}`)
      .setFooter(ban.user.id)
    logChannel.send({ embeds: [BanAddEmbed] })
  }
  else {
    console.log("Channel couldn't be found")
  }
})

client.on('guildBanRemove', async (ban) => {
  const logChannel = ban.guild.channels.cache.find(c => c.id == '908109163169714187')
  if (logChannel) {
    const Symbols = "```"
    const BanRemoveEmbed = new MessageEmbed()
      .setColor(0xff0000)
      .setTitle('Miembro Desbaneado')
      .setAuthor(ban.user.tag, ban.user.displayAvatarURL())
      .setDescription(`El miembro ${ban.user} fué desbaneado del servidor.\n\nRazón :\n${Symbols}\n${ban.reason}\n${Symbols}`)
      .setFooter(ban.user.id)
    logChannel.send({ embeds: [BanRemoveEmbed] })
  }
  else {
    console.log("Channel couldn't be found")
  }
})

client.on('messageDeleteBulk', async (messages) => {
  const msgs = messages.toArray()
  const logChannel = msgs[0].guild.channels.cache.find(c => c.id == '908109163169714187')
  if (logChannel) {
    const Symbols = "```"
    const BulkDeleteEmbed = new MessageEmbed()
      .setColor(0xff0000)
      .setTitle('Mensajes Borrados')
      .setDescription(`Bulk Delete en ${msgs[0].channel}. \n\nCantidad :\n${Symbols}\n${msgs.length}\n${Symbols}`)
      .setFooter(msgs[0].channel.id)
    logChannel.send({ embeds: [BulkDeleteEmbed] })
  }
  else {
    console.log("Channel couldn't be found")
  }
})

// Commands

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction
  switch (commandName) {
    case 'user':
      const user = interaction.options.getUser('user')
      if (user) {
        const member = interaction.guild.members.cache.find(m => m.user.id == user.id)
        const embedFields = ['avatar', 'registered', 'flags', 'id', 'joined', 'color', 'separator', 'roles', 'permissions']
        const SlashUserEmbed = new MessageEmbed()
          .setColor(0x00ffff)
          .setTitle(`Información del Usuario : ${user.tag}`)
          .setAuthor(user.username, user.displayAvatarURL())
        embedFields.forEach(s => {
          switch (s) {
            case 'avatar':
              SlashUserEmbed.addField('Avatar', `[Click Aqui](${user.displayAvatarURL()})`, true)
            break;
            case 'registered':
              SlashUserEmbed.addField('Registrado en', `${user.createdAt.getDate()}/${user.createdAt.getMonth()}/${user.createdAt.getFullYear()}`, true)
            break;
            case 'flags':
              var Flag = []
              const userFlags = user.flags.toArray().map(flag => {
                switch (flag) {
                  case 'HOUSE_BALANCE':
                    Flag.push('Hypesquad Balance')
                  break;
                  case 'HOUSE_BRAVERY':
                    Flag.push('Hypesquad Bravery')
                  break;
                  case 'HOUSE_BRILLIANCE':
                    Flag.push('Hypesquad Brilliance')
                  break;
                  case 'BUGHUNTER_LEVEL_1':
                    Flag.push('Bughunter Nivel 1')
                  break;
                  case 'BUGHUNTER_LEVEL_2':
                    Flag.push('Bughunter Nivel 2')
                  break;
                  case 'DISCORD_EMPLOYEE':
                    Flag.push('Empleado de Discord')
                  break;
                  case 'DISCORD_PARTNER':
                    Flag.push('Socio de Discord')
                  break;
                  case 'EARLY_SUPPORTER':
                    Flag.push('Soporte Anticipado')
                  break;
                  case 'EARLY_VERIFIED_DEVELOPER':
                    Flag.push('Desarrollador de Verificado Temprano')
                  break;
                  case 'HYPESQUAD_EVENTS':
                    Flag.push('Eventos de Hypesquad')
                  break;
                  case 'PARTNERED_SERVER_OWNER':
                    Flag.push('Dueño de Servidor de Programa Partner')
                  break;
                  case 'SYSTEM':
                    Flag.push('Sistema, espera... ¡QUE!')
                  break;
                  case 'TEAM_USER':
                    Flag.push('Usuario del Equipo')
                  break;
                  case 'VERIFIED_BOT':
                    Flag.push('Bot Verificado')
                  break;
                  case 'VERIFIED_DEVELOPER':
                    Flag.push('Desarrollador Verificado')
                  break;
                }
                return `${Flag.join(', ')}`
              })
              SlashUserEmbed.addField('Medallas', `${userFlags}` || 'No tiene', true)
            break;
            case 'id':
              SlashUserEmbed.addField('ID de usuario', `${user.id}`, true)
            break;
            case 'joined':
              if (member) {
                SlashUserEmbed.addField('Miembro desde', `${member.joinedAt.getDate()}/${member.joinedAt.getMonth()}/${member.joinedAt.getFullYear()}`, true)
              }
            break;
            case 'color':
              if (member) {
                SlashUserEmbed.addField('Color', `${member.displayHexColor}`, true)
              }
            break;
            case 'separator':
              if (member) {
                SlashUserEmbed.addField('\u200B', '\u200B')
              }
            break;
            case 'roles':
              if (member) {
                var roleArray = []
                member.roles.cache.forEach(r => {
                  if (r.hexColor == '#292b2f' || r.name.startsWith('@') || r.name == '⠀') {
                    return
                  }
                  else {
                    roleArray.push(r)
                  }
                })
                SlashUserEmbed.addField('Roles', `${roleArray}`)
              }
            break;
            case 'permissions':
              if (member) {
                var permissionList = []
                const permissionsArray = member.permissions.toArray()
                permissionsArray.forEach(p => {
                  switch (p) {
                    case 'CREATE_INSTANT_INVITE':
                      permissionList.push('Crear invitación instántanea')
                    break;
                    case 'KICK_MEMBERS':
                      permissionList.push('Kickear Miembros')
                    break;
                    case 'BAN_MEMBERS':
                      permissionList.push('Banear Miembros')
                    break;
                    case 'ADMINISTRATOR':
                      permissionList.push('Administrador')
                    break;
                    case 'MANAGE_CHANNELS':
                      permissionList.push('Gestionar Canales')
                    break;
                    case 'MANAGE_GUILD':
                      permissionList.push('Gestionar Servidor')
                    break;
                    case 'ADD_REACTIONS':
                      permissionList.push('Añadir Reacciones')
                    break;
                    case 'VIEW_AUDIT_LOG':
                      permissionList.push('Ver el registro')
                    break;
                    case 'PRIORITY_SPEAKER':
                      permissionList.push('Hablante Prioritario')
                    break;
                    case 'STREAM':
                      permissionList.push('Compartir Pantalla')
                    break;
                    case 'VIEW_CHANNEL':
                      permissionList.push('Ver Canales')
                    break;
                    case 'SEND_MESSAGES':
                      permissionList.push('Enviar Mensajes')
                    break;
                    case 'SEND_TTS_MESSAGES':
                      permissionList.push('Enviar Mensajes TTS')
                    break;
                    case 'MANAGE_MESSAGES':
                      permissionList.push('Gestionar Mensajes')
                    break;
                    case 'EMBED_LINKS':
                      permissionList.push('Enviar Links Ilustrados')
                    break;
                    case 'ATTACH_FILES':
                      permissionList.push('Enviar Archivos')
                    break;
                    case 'READ_MESSAGE_HISTORY':
                      permissionList.push('Ver el Historial de Mensajes')
                    break;
                    case 'MENTION_EVERYONE':
                      permissionList.push('Hacer @everyone y @here')
                    break;
                    case 'USE_EXTERNAL_EMOJIS':
                      permissionList.push('Usar Emojis Externos')
                    break;
                    case 'VIEW_GUILD_INSIGHTS':
                      permissionList.push('Ver Estadisticas del Servidor')
                    break;
                    case 'CONNECT':
                      permissionList.push('Conectarse a Canales de Voz')
                    break;
                    case 'SPEAK':
                      permissionList.push('Hablar en Canales de Voz')
                    break;
                    case 'MUTE_MEMBERS':
                      permissionList.push('Callar Usuarios')
                    break;
                    case 'DEAFEN_MEMBERS':
                      permissionList.push('Ensordecer Usuarios')
                    break;
                    case 'MOVE_MEMBERS':
                      permissionList.push('Mover Miembros de Canales de Voz')
                    break;
                    case 'USE_VAD':
                      permissionList.push('Usar la Actividad de Voz')
                    break;
                    case 'CHANGE_NICKNAME':
                      permissionList.push('Cambiar su Nickname')
                    break;
                    case 'MANAGE_NICKNAMES':
                      permissionList.push('Gestionar los Nicknames')
                    break;
                    case 'MANAGE_ROLES':
                      permissionList.push('Gestionar Roles')
                    break;
                    case 'MANAGE_WEBHOOKS':
                      permissionList.push('Gestionar Webhooks')
                    break;
                    case 'MANAGE_EMOJIS_AND_STICKERS':
                      permissionList.push('Gestionar Emojis y Stickers')
                    break;
                    case 'USE_APPLICATION_COMMANDS':
                      permissionList.push('Usar Comandos de /')
                    break;
                    case 'REQUEST_TO_SPEAK':
                      permissionList.push('Pedir Permiso para Hablar')
                    break;
                    case 'MANAGE_THREADS':
                      permissionList.push('Gestionar Threads')
                    break;
                    case 'CREATE_PUBLIC_THREADS':
                      permissionList.push('Crear Threads Públicos')
                    break;
                    case 'CREATE_PRIVATE_THREAD':
                      permissionList.push('Crear Threads Privados')
                    break;
                    case 'USE_EXTERNAL_STICKERS':
                      permissionList.push('Usar Stickers Externos')
                    break;
                    case 'SEND_MESSAGES_IN_THREADS':
                      permissionList.push('Enviar Mensajes en Threads')
                    break;
                    case 'START_EMBEDDED_ACTIVITIES':
                      permissionList.push('Comenzar Actividades con Embed')
                    break;
                  }
                })
                const Symbols = "```"
                SlashUserEmbed.addField('Permisos', `${Symbols}\n${permissionList.join(', ')}\n${Symbols}`)
              }
            break;
          }
        })
        interaction.reply({ embeds: [SlashUserEmbed] })
      }
      else {
        const FailedEmbed = new MessageEmbed()
          .setColor(0xff0000)
          .setTitle('Comando Fallido')
          .setDescription('Se produjo un error usando /user')
          .setFooter(interaction.id)
        interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
      }
    break;
    case 'info':
      const subcommand = interaction.options.getSubcommand()
      switch (subcommand) {
        case 'server':
          const ServerInfoEmbed = new MessageEmbed()
            .setColor(0x00ffff)
            .setTitle(`Información del Servidor : ${interaction.guild.name}`)
            .addFields(
              {name : 'Icono', value : `[Click Aqui](${interaction.guild.iconURL()})`, inline : true},
              {name : 'Creado en', value : `${interaction.guild.createdAt.getDate()}/${interaction.guild.createdAt.getMonth()}/${interaction.guild.createdAt.getFullYear()}`, inline : true},
              {name : 'Cuenta de Miembros', value : `${interaction.guild.memberCount}`, inline : true},
              {name : 'ID de Servidor', value : `${interaction.guild.id}`, inline : true},
              {name : 'Canal de Reglas', value : `${interaction.guild.rulesChannel}`, inline : true},
              {name : 'Boosts', value : `${interaction.guild.premiumSubscriptionCount} Boosts`, inline : true},
              {name : 'Cuenta de Roles', value : `${interaction.guild.roles.cache.size} Roles`, inline : true},
              {name : 'Idioma Primario del Servidor', value : `Español`, inline : true}
            )
          interaction.reply({ embeds: [ServerInfoEmbed] })
        break;
        case 'realm':
          const role = interaction.guild.roles.cache.find(r => r.id == '814897824067485758')
          const realmName = await RealmInfo.findOne({ where : { name : 'name' } })
          const gameMode = await RealmInfo.findOne({ where : { name : 'gamemode' } })
          const archievements = await RealmInfo.findOne({ where : { name : 'archievements' }})
          const owner = await RealmInfo.findOne({ where : { name : 'owner' } })
          const RealmInfoEmbed = new MessageEmbed()
            .setColor(0x00ffff)
            .setTitle(`Información del Realm : ${realmName.value}`)
            .addFields(
              {name : 'Cuenta de Miembros', value : `${role.members.size}`, inline : true},
              {name : 'Nombre', value : `${realmName.value}`, inline : true},
              {name : 'Gamemode', value : `${gameMode.value}`, inline : true},
              {name : 'Logros', value : `${archievements.value}`, inline : true},
              {name : 'Dueño', value : `${owner.value}`, inline : true},
            )
          interaction.reply({ embeds : [RealmInfoEmbed] })
        break;
      }
    break;
    case 'setinfo':
      const member = interaction.member
      if (member.permissions.has('ADMINISTRATOR')) {
        const subcommand = interaction.options.getSubcommand()
          switch (subcommand) {
            case 'realm':
              const infoName = interaction.options.getString('name')
              const infoValue = interaction.options.getString('value')
              if (infoName && infoValue) {
                const infoCheck = await RealmInfo.findOne({ where: { name : infoName } })
                if (!infoCheck) {
                  const info = await RealmInfo.create({
                    name : infoName,
                    value : infoValue,
                  })
                  if (info) {
                    const SetRealmEmbed = new MessageEmbed()
                      .setColor(0x00ff00)
                      .setTitle('Comando Exitoso')
                      .setDescription(`El valor fué creado con éxito`)
                      .setFooter(`${infoName}, ${infoValue}`)
                    interaction.reply({ embeds: [SetRealmEmbed], ephemeral: true })
                  } else {
                    const FailedEmbed = new MessageEmbed()
                      .setColor(0xff0000)
                      .setTitle('Comando Fallido')
                      .setDescription('El valor no pudo ser creado')
                      .setFooter(interaction.id)
                    interaction.reply({ embeds: [FailedEmbed], ephemeral: true})
                  }
                } else {
                  const info = await RealmInfo.update({ value : infoValue }, { where : { name : infoName } })
                  if (info > 0) {
                    const SetRealmEmbed = new MessageEmbed()
                      .setColor(0x00ff00)
                      .setTitle('Comando Exitoso')
                      .setDescription(`El valor fué actulizado con éxito`)
                      .setFooter(`${infoName}, ${infoValue}`)
                    interaction.reply({ embeds: [SetRealmEmbed], ephemeral: true })
                  } else {
                    const FailedEmbed = new MessageEmbed()
                      .setColor(0xff0000)
                      .setTitle('Comando Fallido')
                      .setDescription('El valor no pudo ser actualizado')
                      .setFooter(interaction.id)
                    interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
                  }
                }
              } else {
                const FailedEmbed = new MessageEmbed()
                  .setColor(0xff0000)
                  .setTitle('Comando Fallido')
                  .setDescription('Se produjo un error usando /setinfo')
                  .setFooter(interaction.id)
                interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
              }
            break;
            case 'level':
              const infoUser = interaction.options.getUser('user')
              const infoLevel = interaction.options.getInteger('xp')
              if (infoUser && infoLevel) {
                const LevelAccount = await LevelData.findOne({ where : { user : infoUser.id } })
                if (LevelAccount) {
                  const affectedRows = await LevelData.update({ xp : infoLevel }, { where : { user : infoUser.id } })
                  if (affectedRows > 0) {
                    const SetLevelEmbed = new MessageEmbed()
                      .setColor(0xff0000)
                      .setTitle('Comando Exitoso')
                      .setDescription('El valor fue actualizado con éxito')
                      .setFooter(`${infoLevel}, ${infoUser.id}`)
                    interaction.reply({ embeds: [SetLevelEmbed], ephemeral: true })
                  }
                } else {
                  const FailedEmbed = new MessageEmbed()
                    .setColor(0xff0000)
                    .setTitle('Comando Fallido')
                    .setDescription('Este usuario no tiene una cuenta de nivel')
                    .setFooter(interaction.id)
                  interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
                }
              } else {
                const FailedEmbed = new MessageEmbed()
                  .setColor(0xff0000)
                  .setTitle('Comando Fallido')
                  .setDescription('Se produjo un error usando /setinfo')
                  .setFooter(interaction.id)
                interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
              }
            break;
            case 'invites':
              const inviteUser = interaction.options.getUser('user')
              if (inviteUser) {
                const LevelAccount = await LevelData.findOne({ where : { user : inviteUser.id } })
                if (LevelAccount) {
                  const affectedRows = await UserInvites.destroy({ where : { user : inviteUser.id } })
                  if (affectedRows > 0) {
                    const SetLevelEmbed = new MessageEmbed()
                      .setColor(0xff0000)
                      .setTitle('Comando Exitoso')
                      .setDescription('El valor fue actualizado con éxito')
                      .setFooter(`${inviteUser.id}`)
                    interaction.reply({ embeds: [SetLevelEmbed], ephemeral: true })
                  }
                } else {
                  const FailedEmbed = new MessageEmbed()
                    .setColor(0xff0000)
                    .setTitle('Comando Fallido')
                    .setDescription('Este usuario no tiene una cuenta de invitaiones')
                    .setFooter(interaction.id)
                  interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
                }
              } else {
                const FailedEmbed = new MessageEmbed()
                  .setColor(0xff0000)
                  .setTitle('Comando Fallido')
                  .setDescription('Se produjo un error usando /setinfo')
                  .setFooter(interaction.id)
                interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
              }
            break;
          }
      } else {
        const FailedEmbed = new MessageEmbed()
          .setColor(0xff0000)
          .setTitle('Comando Fallido')
          .setDescription('Este comando requiere el permiso "Administrador"')
          .setFooter(interaction.id)
        interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
      }
    break;
    case 'level':
      const levelUser = interaction.options.getUser('user')
      if (levelUser) {
        const levelAccount = await LevelData.findOne({ where : { user : levelUser.id } })
        if (levelAccount) {
          if (!levelUser.bot) {
            const level = await levelAccount.get('level')
            const xp = await levelAccount.get('xp')
            const LevelEmbed = new MessageEmbed()
              .setColor(0x00ffff)
              .setTitle(`Nivel del Usuario : ${levelUser.tag}`)
              .addFields(
                {name : 'Nivel', value : `${level}`, inline : true},
                {name : 'XP', value : `${xp}`, inline : true}
              )
              .setFooter(`${interaction.id}`)
              interaction.reply({ embeds : [LevelEmbed] })
          } else {
            const FailedEmbed = new MessageEmbed()
              .setColor(0xff0000)
              .setTitle('Comando Fallido')
              .setDescription('El usuario no puede ser un bot')
              .setFooter(interaction.id)
            interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
          }
        } else {
          const FailedEmbed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Comando Fallido')
            .setDescription(`El usuario ${levelUser.tag} no tiene una cuenta de nivel`)
            .setFooter(interaction.id)
          interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
        }
      } else {
        const FailedEmbed = new MessageEmbed()
          .setColor(0xff0000)
          .setTitle('Comando Fallido')
          .setDescription('Se produjo un error usando /level')
          .setFooter(interaction.id)
        interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
      }
    break;
    case 'verify':
      const member2 = interaction.member
      if (member2.permissions.has('KICK_MEMBERS')) {
        const verifyUser = interaction.options.getUser('user')
        const verifyUsername = interaction.options.getString('username')
        const verifyIP = interaction.options.getString('ip')
        if (verifyUser && verifyUsername && verifyIP) {
          const userCheck = await UserData.findOne({ where : { user :  verifyUser.id } })
          const usernameCheck = await UserData.findOne({ where : { username : verifyUsername } })
          const ipCheck = await UserData.findOne({ where : { ip : verifyIP } })
          if (!userCheck && !usernameCheck && !ipCheck) {

            var Symbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

            function generateCode(array) {
              let counter = array.length
              while (counter > 0) {
                let index = Math.floor(Math.random() * counter)
                counter = counter - 1
                let temp = array[counter]
                array[counter] = array[index]
                array[index] = temp
              }
              return array
            }

            generateCode(Symbols)

            while (await UserData.findOne({ where : { token : Symbols.join('') } })) {
              generateCode(Symbols)
            }

            const account = await UserData.create({ 
              user : verifyUser.id,
              username : verifyUsername,
              ip : verifyIP,
              token : Symbols.join(''),
            })
            if (account) {
              const verifyMember = interaction.guild.members.cache.find(m => m.id == verifyUser.id)
              const memberRole = interaction.guild.roles.cache.find(r => r.id == '814897824067485758')
              const colorRole = interaction.guild.roles.cache.find(r => r.id == '886383683941073026')
              const pendingRole = interaction.guild.roles.cache.find(r => r.id == '886379613763272714')
              const colorRole2 = interaction.guild.roles.cache.find(r => r.id == '886384023100862475')
              verifyMember.roles.add(memberRole)
              verifyMember.roles.add(colorRole)
              verifyMember.roles.remove(pendingRole)
              verifyMember.roles.remove(colorRole2)
              verifyMember.setNickname(`${verifyUsername}`)
              const VerifyEmbed = new MessageEmbed()
                .setColor(0x00ff00)
                .setTitle('Comando Exitoso')
                .setDescription(`El usuario fue verificado con éxito`)
              interaction.reply({ embeds : [VerifyEmbed], ephemeral : true })
              verifyMember.setNickname(verifyUsername)
            }
          } else {
            const FailedEmbed = new MessageEmbed()
              .setColor(0xff0000)
              .setTitle('Comando Fallido')
              .setDescription('Ya existe un usuario con estas credenciales')
              .setFooter(interaction.id)
            interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
          }
        } else {
          const FailedEmbed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Comando Fallido')
            .setDescription('Se produjo un error usando /verify')
            .setFooter(interaction.id)
          interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
        }
      } else {
        const FailedEmbed = new MessageEmbed()
          .setColor(0xff0000)
          .setTitle('Comando Fallido')
          .setDescription('Este comando requiere el permiso "Kickear Miembros"')
          .setFooter(interaction.id)
        interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
      }
    break;
    case 'mydata':
      const dataAccount = await UserData.findOne({ where : { user : interaction.member.id } })
      if (dataAccount) {
        const DataEmbed = new MessageEmbed()
          .setColor(0x00ff00)
          .setTitle(`Datos del usuario : ${interaction.member.user.username}`)
          .addFields(
            {name : 'Nombre de Usuario', value : `${dataAccount.username}`, inline : true},
            {name : 'Google IP', value : `${dataAccount.ip}`, inline : true},

            {name : 'Token de Verificación', value : `${dataAccount.token}`, inline : true}
          )
          .setFooter('No compartas esta información con nadie')
        interaction.reply({ embeds: [DataEmbed], ephemeral: true })
      } else {
        const FailedEmbed = new MessageEmbed()
          .setColor(0xff0000)
          .setTitle('Comando Fallido')
          .setDescription('No se encontraron los datos de tu cuenta')
          .setFooter(interaction.id)
        interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
      }
    break;
    case 'getdata':
      if (interaction.member.permissions.has('KICK_MEMBERS')) {
        const getdataUser = interaction.options.getUser('user')
        if (getdataUser) {
          const account = await UserData.findOne({ where : { user : getdataUser.id } })
          if (account) {
            const GetdataEmbed = new MessageEmbed()
              .setColor(0xffff00)
              .setTitle(`Datos del usuario : ${getdataUser.tag}`)
              .addFields(
                {name : 'Nombre de Usuario', value : `${account.username}`, inline : true},
                {name : 'Google IP', value : `${account.ip}`, inline : true},
                {name : 'Token de Verificación', value : `${account.token}`, inline : true}
              )
              .setFooter(getdataUser.id)
              interaction.reply({ embeds : [GetdataEmbed], ephemeral : true })
          } else {
            const FailedEmbed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Comando Fallido')
            .setDescription('Este usuario no se ha verificado')
            .setFooter(interaction.id)
          interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
          }
        } else {
          const FailedEmbed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Comando Fallido')
            .setDescription('Se produjo un error usando /getdata')
            .setFooter(interaction.id)
          interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
        }
      } else {
        const FailedEmbed = new MessageEmbed()
          .setColor(0xff0000)
          .setTitle('Comando Fallido')
          .setDescription('Este comando requiere el permiso "Kickear Miembros"')
          .setFooter(interaction.id)
        interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
      }
    break;
    case 'poll':
      const pollTitle = interaction.options.getString('title')
      const pollDescription = interaction.options.getString('description')
      const pollOptions = [interaction.options.getString('option1'), interaction.options.getString('option2'), interaction.options.getString('option3'), interaction.options.getString('option4'), interaction.options.getString('option5')]
      pollOptions.forEach(async (option, index) => {
        if (option == undefined) {
          pollOptions.splice(index)
        }
      })
      if (pollTitle && pollDescription && pollOptions.length > 1) {
        const pollChannel = interaction.guild.channels.cache.find(c => c.id == '867935769547919382')
        if (pollChannel) {
          const PollEmbed1 = new MessageEmbed()
            .setColor(0x00ff00)
            .setTitle('Comando Exitoso')
            .setDescription(`La encuesta fue creada con éxito`)
          interaction.reply({ embeds : [PollEmbed1], ephemeral : true })
          const emojiList = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
          const PollEmbed2 = new MessageEmbed()
            .setColor(0x000275)
            .setTitle(pollTitle)
            .setDescription(`*${pollDescription}*\n${pollOptions.map((option, index) => {
              return `${emojiList[index]} - ${option}`
            }).join('\n')}`)
          const msg = await pollChannel.send({ embeds : [PollEmbed2] })
          pollOptions.forEach(async (option, index) => {
            await msg.react(emojiList[index])
          })
        } else {
          const FailedEmbed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Comando Fallido')
            .setDescription('Se produjo un error usando /poll')
            .setFooter(interaction.id)
          interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
        }
      } else {
        const FailedEmbed = new MessageEmbed()
          .setColor(0xff0000)
          .setTitle('Comando Fallido')
          .setDescription('Se produjo un error usando /poll')
          .setFooter(interaction.id)
        interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
      }
    break;
    case 'unverify':
      const member3 = interaction.member
      if (member3.permissions.has('KICK_MEMBERS')) {
        const unverifyID = interaction.options.getString('id')
        if (unverifyID) {
          const userCheck = await UserData.findOne({ where : { user :  unverifyID } })

          if (userCheck) {
            const affectedRows = await UserData.destroy({ where : { user : unverifyID }})
            if (affectedRows) {
              const unverifyMember = interaction.guild.members.cache.find(m => m.id == unverifyID)
              const memberRole = interaction.guild.roles.cache.find(r => r.id == '886379613763272714')
              const colorRole = interaction.guild.roles.cache.find(r => r.id == '886384023100862475')
              const pendingRole = interaction.guild.roles.cache.find(r => r.id == '814897824067485758')
              const colorRole2 = interaction.guild.roles.cache.find(r => r.id == '886383683941073026')
              if (unverifyMember) {
                unverifyMember.roles.add(memberRole)
                unverifyMember.roles.add(colorRole)
                unverifyMember.roles.remove(pendingRole)
                unverifyMember.roles.remove(colorRole2)
                const VerifyEmbed = new MessageEmbed()
                  .setColor(0x00ff00)
                  .setTitle('Comando Exitoso')
                  .setDescription(`Los datos se han eliminado con éxito`)
                interaction.reply({ embeds : [VerifyEmbed], ephemeral : true })
              } else {
                const VerifyEmbed = new MessageEmbed()
                  .setColor(0x00ff00)
                  .setTitle('Comando Exitoso')
                  .setDescription(`Los datos se han eliminado con éxito`)
                interaction.reply({ embeds : [VerifyEmbed], ephemeral : true })
              }
            }
          } else {
            const FailedEmbed = new MessageEmbed()
              .setColor(0xff0000)
              .setTitle('Comando Fallido')
              .setDescription('No existe un usuario con estas credenciales')
              .setFooter(interaction.id)
            interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
          }
        } else {
          const FailedEmbed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Comando Fallido')
            .setDescription('Se produjo un error usando /unverify')
            .setFooter(interaction.id)
          interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
        }
      } else {
        const FailedEmbed = new MessageEmbed()
          .setColor(0xff0000)
          .setTitle('Comando Fallido')
          .setDescription('Este comando requiere el permiso "Kickear Miembros"')
          .setFooter(interaction.id)
        interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
      }
    break
    case 'setinviter':
      const invitedTest = await UserInvites.findOne({ where : { user : interaction.user.id }})
      if (!invitedTest) {
        const inviter = interaction.options.getUser('user')
        if (inviter) {
          async function addLevel(user) {
            const levelAccount = await LevelData.findOne({ where : { user : user.id } })
            if (levelAccount) {
              const xp = levelAccount.xp
              const affectedRows = await LevelData.update({ xp : xp + 150 }, { where: { user : user.id } })
              if (affectedRows > 0) {
                return 'Success'
              } else {
              console.log('Fail iteration 1')
                return 'Fail'
              }
            } else {
              const affectedRows = await LevelData.create({
                user : user.id,
                level : 0,
                xp : 0,
              })
              if (affectedRows) {
                addLevel(user)
              }
            }
          }
          async function addInvite(user, inviter) {
            const check = await addLevel(inviter)
            if (check == 'Success') {
              const InviterAccount = await UserInvites.findOne({ where : { user : inviter.id }})
              const UserAccount = await UserInvites.create({
                user : user.id,
                inviter : inviter.id,
                invites : 0,
              })
              if (UserAccount) {
                const invites = InviterAccount.invites
                const affectedRows = await UserInvites.update({ invites : invites + 1 }, { where : { user : inviter.id } })
                if (affectedRows) {
                    return 'Success'
                } else {
                  console.log('Fail iteration 3')
                  return 'Fail'
                }
              } else {
                console.log('Fail iteration 4')
                return 'Fail'
              }
            } else {
              console.log('Fail iteration 5')
              return 'Fail'
            }
          }
          const account = await UserInvites.findOne({ where : { user : inviter.id } })
          if (account) {
            const check = await addInvite(interaction.user, inviter)
            if (check == 'Success') {
              const VerifyEmbed = new MessageEmbed()
                .setColor(0x00ff00)
                .setTitle('Comando Exitoso')
                .setDescription(`El usuario ha sido definido como la persona que te ha invitado con éxito`)
              interaction.reply({ embeds : [VerifyEmbed], ephemeral : true })
            } else {
              console.log('Fail iteration 6')
              const FailedEmbed = new MessageEmbed()
                .setColor(0xff0000)
                .setTitle('Comando Fallido')
                .setDescription('Se produjo un error usando /setinviter')
                .setFooter(interaction.id)
              interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
            }
          } else {
            const affectedRows = await UserInvites.create({
              user : inviter.id,
              inviter : '0',
              invites : 0,
            })
            if (affectedRows) {
              const check = addInvite(interaction.user, inviter)
              if (check == 'Success') {
                const VerifyEmbed = new MessageEmbed()
                  .setColor(0x00ff00)
                  .setTitle('Comando Exitoso')
                  .setDescription(`El usuario ha sido definido como la persona que te ha invitado con éxito`)
                interaction.reply({ embeds : [VerifyEmbed], ephemeral : true })
              } else {
                console.log('Fail iteration 6')
                const FailedEmbed = new MessageEmbed()
                  .setColor(0xff0000)
                  .setTitle('Comando Fallido')
                  .setDescription('Se produjo un error usando /setinviter')
                  .setFooter(interaction.id)
                interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
              }
            } else {
              console.log('Fail iteration 7')
              const FailedEmbed = new MessageEmbed()
                .setColor(0xff0000)
                .setTitle('Comando Fallido')
                .setDescription('Se produjo un error usando /setinviter')
                .setFooter(interaction.id)
              interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
            }
          }
        } else {
          console.log('Fail iteration 8')
          const FailedEmbed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Comando Fallido')
            .setDescription('Se produjo un error usando /setinviter')
            .setFooter(interaction.id)
          interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
        }
      } else {
        const FailedEmbed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Comando Fallido')
            .setDescription('Ya has definido al usuario que te invitó')
            .setFooter(interaction.id)
          interaction.reply({ embeds: [FailedEmbed], ephemeral: true })
      }
    break;
  }
})

// Buttons

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton) return;

  switch (interaction.customId) {
    case 'Suggestion':
      const content = `${interaction.user}, haz creado un ticket para sugerir tu idea a los administradores. \nEscribe tu idea en este canal para que llegue instantáneamente a la administración del realm, o escribe "cancel" para terminar la operación.`

      await interaction.user.createDM(true)
      const channel = interaction.user.dmChannel
      if (channel) {
        await channel.send(content)
      } else console.log('DM inexistente')
    break;
    case 'Complaint':
    break;
  }
})

// Leveling System

async function levelUp(member, xp) {
  const levelAccount = await LevelData.findOne({ where : { user : member.user.id } })
  if (!levelAccount) return
  const affectedRow = await LevelData.update({ xp : levelAccount.xp + xp }, { where : { user : member.user.id } })
  if (affectedRow > 0) {
    const levelIncrement = [0, 150, 300, 450, 600, 700, 850, 1000, 1300, 1600, 1900, 2200, 2500, 3500, 4000, 4500, 5000, 6500, 8000, 9500, 10000, 12000, 14000, 16000, 18000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000, 90000, 100000]
    const updatedAccount = await LevelData.findOne({ where : { user : member.user.id } })
    levelIncrement.map(async (increment, index) => {
      if (updatedAccount.xp >= increment && updatedAccount.xp < levelIncrement[index + 1]) {
        const affectedRow = await LevelData.update({ level : index }, { where : { user : member.user.id } })
        if (affectedRow > 0) {
          const levelIncrement = [0, 150, 300, 450, 600, 700, 850, 1000, 1300, 1600, 1900, 2200, 2500, 3500, 4000, 4500, 5000, 6500, 8000, 9500, 10000, 12000, 14000, 16000, 18000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000, 90000, 100000]
          const updatedAccount = await LevelData.findOne({ where : { user : member.user.id } })
          levelIncrement.forEach(async (increment, index) => {
            if (updatedAccount.xp >= increment && updatedAccount.xp < levelIncrement[index + 1]) {
              const affectedRow = await LevelData.update({ level : index }, { where : { user : member.user.id } })
              if (affectedRow > 0) {
                const ironRole = member.guild.roles.cache.find(r => r.id == '910193481434144808')
                const copperRole = member.guild.roles.cache.find(r => r.id == '910196066350166026')
                const goldRole = member.guild.roles.cache.find(r => r.id == '910194271997550612')
                const diamondRole = member.guild.roles.cache.find(r => r.id == '910194573945483304')
                const netheriteRole = member.guild.roles.cache.find(r => r.id == '910194754027929610')
                switch (index) {
                  case 5:
                    member.roles.add(ironRole)
                    member.roles.remove(copperRole)
                    member.roles.remove(goldRole)
                    member.roles.remove(diamondRole)
                    member.roles.remove(netheriteRole)
                  break;
                  case 10:
                    member.roles.remove(ironRole)
                    member.roles.add(copperRole)
                    member.roles.remove(goldRole)
                    member.roles.remove(diamondRole)
                    member.roles.remove(netheriteRole)
                  break;
                  case 15:
                    member.roles.remove(ironRole)
                    member.roles.remove(copperRole)
                    member.roles.add(goldRole)
                    member.roles.remove(diamondRole)
                    member.roles.remove(netheriteRole)
                  break;
                  case 20:
                    member.roles.remove(ironRole)
                    member.roles.remove(copperRole)
                    member.roles.remove(goldRole)
                    member.roles.add(diamondRole)
                    member.roles.remove(netheriteRole)
                  break;
                  case 30:
                    member.roles.remove(ironRole)
                    member.roles.remove(copperRole)
                    member.roles.remove(goldRole)
                    member.roles.remove(diamondRole)
                    member.roles.add(netheriteRole)
                  break;
                }
              } else {
                console.log('Algo salió mal')
              }
            }
          })
        } else {
          console.log('Algo salió mal')
        }
      }
    })
  } else {
    console.log('Algo salió mal')
  }
}

async function levelCreate(member) {
  if (!member) return
  const account = await LevelData.create({
    user : member.user.id,
    xp : 0,
    level : 0,
  })
}

client.on('messageCreate', async (msg) => {
  if (!msg.guild) return
    const levelAccount = await LevelData.findOne({ where : { user : msg.author.id } })
    const member = msg.guild.members.cache.find(m => m.id == msg.author.id)
    if (levelAccount) {
      if (msg.content.length >= 4 && !msg.author.bot) {
        if (msg.channel.id == '882102481272840232') {
          if (msg.attachments.size > 0) {
            levelUp(member, 100)
          }
        } else {
          levelUp(member, 10)
        }
      }
    } else {
      levelCreate(member)
      if (msg.content.length >= 4) {
        if (msg.channel.id == '882102481272840232') {
          if (msg.attachments.size > 0) {
            levelUp(member, 100)
          }
        } else {
          levelUp(member, 10)
        }
      }
    }
  })
  
  var VoiceSet = []
  
  client.on('voiceStateUpdate', async (state, newstate) => {
    if (newstate.channel) {
      if (newstate.member) {
        if (!newstate.deaf && !newstate.mute) {
          VoiceSet.push(`${newstate.member.id},0`)
          let userSet = VoiceSet.find(v => v.split(',')[0] == newstate.member.id)
          function startTimer(userSet) {
            if (VoiceSet.find(v => v.split(',')[0] == newstate.member.id)) {
              let user = userSet.split(',')[0]
              let counter = parseInt(userSet.split(',')[1], 10)
              if (counter !== 60) {
                setTimeout(() => {
                  counter = counter + 1
                  const index = VoiceSet.indexOf(userSet)
                  VoiceSet[index] = `${user},${counter}`
                  userSet = VoiceSet[index]
                  startTimer(userSet)
                }, 1000)
              } else {
                levelUp(newstate.member, 20)
                counter = 0
                const index = VoiceSet.indexOf(userSet)
                VoiceSet[index] = `${user},0`
                userSet = VoiceSet[index]
                startTimer(userSet)
              }
            } else return
          }
          startTimer(userSet)
        } else {
          VoiceSet.splice(VoiceSet.indexOf(v => v.split(',')[0] == newstate.member.id))
        }
      }
    }
    else if (state.channel && !newstate.channel) {
      if (state.member) {
        VoiceSet.splice(VoiceSet.indexOf(v => v.split(',')[0] == newstate.member.id))
      }
    }
})

// Welcoming & Role assign

registerFont('./fonts/Roboto-Medium.ttf', { family: 'Roboto' })

const applyText =  async (canvas, text) => {
  const context = canvas.getContext('2d')
  let fontSize = 500

  do {
    context.font = `${fontSize -= 10}px Roboto`
  } while (context.measureText(text).width > canvas.width - 200 || context.measureText(text).height > 470)

  return context.font
}

client.on('guildMemberAdd', async (member) => {
  const guild = await client.guilds.cache.find(g => g.id == '814865334955671552')
  const welcomeChannel = guild.channels.cache.find(c => c.id == '867934116656607303')

  const canvas = Canvas.createCanvas(1365 * 2, 707 * 2)
  const context = canvas.getContext('2d')

  const background = await Canvas.loadImage('./resources/World.png')

  context.drawImage(background, 0, 0, canvas.width, canvas.height)

  context.strokeStyle = '#b55e00'
  context.strokeRect(0, 0, canvas.width, canvas.height)

  context.font = applyText(canvas, member.displayName)
  context.fillStyle = '#ffffff'
  const measuredText = context.measureText(member.displayName).width / 2
  context.fillText(member.displayName, canvas.width / 2 - measuredText, 1200)

  context.beginPath()
  context.arc(1365, 430, 350, 0, Math.PI * 2, true)
  context.closePath()
  context.clip()

  const avatar = await Canvas.loadImage(member.displayAvatarURL({ format : 'jpg' }))
  context.drawImage(avatar, 1015, 80, 700, 700)

  const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome.png')
  welcomeChannel.send({ content : `¡ Bienvenido a E.S.P.K., ${member} !`, files : [attachment] })

  const pendingRole = guild.roles.cache.find(r => r.id == '886379613763272714')
  const colorRole = guild.roles.cache.find(r => r.id == '886384023100862475')
  const separator1 = guild.roles.cache.find(r => r.id == '886380994347802625')
  const separator2 = guild.roles.cache.find(r => r.id == '886679416128811119')
  const separator3 = guild.roles.cache.find(r => r.id == '886727177998073876')
  
  member.roles.add(pendingRole)
  member.roles.add(colorRole)
  member.roles.add(separator1)
  member.roles.add(separator2)
  member.roles.add(separator3)
})

// Leaving

client.on('guildMemberRemove', async (member) => {
  const guild = await client.guilds.cache.find(g => g.id == '814865334955671552')
  const welcomeChannel = guild.channels.cache.find(c => c.id == '867934116656607303')
  welcomeChannel.send({ content : `${member} ha dejado el servidor...` })

  const account = await UserData.findOne({ where : { user : member.user.id } })
  if (account) {
    setTimeout(async () => {
      const affectedRow = await UserData.destroy({ where : { user : member.user.id } })
    }, 60000*300)
  }
})

// Suggestion System

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return

  
})

client.on('messageCreate', async (msg) => {
  const status1 = false
  const status2 = true
  if (msg.content == 'emitter' && msg.author.id == '700777107869139035' && status1) {
    const content1 = '```md\n———————————————————————————— Información General ————————————————————————————\n=============================================================================\n\n<Articulo 1 = PrivacidadﾠyﾠSeguridad>\nDe toda la información que recibimos en tu inscripción en el servidor, la unica información que será publica en nuestro servidor es el nombre de usuario de tu cuenta de Minecraft. Toda la información restante será cuidadosamente guardada y no será compartida con terceros.\n\nNuestro servidor nunca pedirá contraseñas o información de inicio de sesión de cualquier tipo, la información necesaria para nosotros es por nuestra seguridad. En caso que algún moderador o miembro te pregunte por información personal debes ignorarlo y reportarlo a un moderador.\n\nNuestro servidor almacena la siguiente información :\n\n> Nombre de usuario (Cuenta de Microsoft)\n> Account ID (Cuenta de Discord)\n> Código personal de acceso (Realm)\n> Google IP (Correo electrónico)\n\nAl aceptar unirte a nuestro servidor estás aceptando que la información anteriormente mencionada sea almacenada.\nNota extra : Todas las coordenadas que registres son anónimas !\n\n\n\n<Articulo 2 = ReglasﾠyﾠCastigos>\n\nNuestro servidor tiene una gran cantidad de reglas de servidor de Discord así como reglas del Realm, y se menciona que su ruptura puede ser razón de la revocación permanente de acceso a ambos servidores. Hay un cuidadoso procedimiento que solo puede ser alterado por el dueño para decidir las consecuencias de tales actos.\n\nEl procedimiento consiste en un sistema de strikes, todos comienzan con 0/3. Esta información se almacena en el servidor y no es alterada hasta que el usuario rompa una regla o sea perdonado. Por cada regla rota se agrega 1 strike a su cuenta y solo es revocado cuando un administrador o moderador perdona al usuario.\n\nSi el usuario llega a los tres strikes su cuenta será bloqueada de la lista de participantes de ambos servidores y su Google IP será igualmente bloqueada para evitar multicuentas.\n```'

    const content2 = '```md\n————————————————————— Información de Reglas (Parte 1) —————————————————————\n===========================================================================\n\n<Articulo 3 = Reglas>\n\nEn el servidor, podrás encontrar las reglas esenciales en el canal #〘📜〙reglas-server y #〘📜〙reglas-realm, sin embargo, no es una documentación completa de las reglas del servidor. Podrás encontrar el resto de las reglas en este canal en sus respectivos artículos.\n\nPara la lista completa de las reglas, copia el link :\n[Pronto Añadido] \nen tu explorador y lee el archivo que se descargará.\n\n<Articulo 4 = Crimenes>\n\nPara reportar reglas rotas del servidor o realm, el servidor usa el canal de #〘👮〙crimenes para que la comunidad reporte las reglas rotas y castigar al infractor.\n\nLos mensajes en ese canal deben usar el siguiente formato para ser tomados en cuenta (Copy-Paste) :\n\n**A. :** @Acusado\n**C. :** Crimen\n**I. :** Información adicional\n**P. :** Pérdidas\n*Imagen/video/link de evidencia*\n\nEn caso de que el crimen sea aceptado y el infractor sea castigado, podrás ganar XP por reportar un crimen. Si este es el caso, un moderador te contactará por DM.\n```'

    const content3 = '```md\n————————————————————— Información de Reglas (Parte 2) —————————————————————\n===========================================================================\n\n<Articulo 5 = Sospechosos>\n\nEn la mayoría de los casos, no se sabrá con exactitud quien rompió la regla. En ese caso, la víctima elejirá un sospechoso para llevarlo a un juicio y decidir si el usuario es inocente o culpable.\n\nPara balancear el derecho de llevar a un sospechoso, la victima solo puede llevar a un sospechoso por crimen. \n\nSi el sospechoso es declarado culpable, se aplicará el mismo procedimiento de un juicio y crimen normal. Si es daclarado inocente, el crimen quedara cerrado y no se reembolsará nada.\n\n<Articulo 6 = Juicios>\n\nCuando se comete un crimen, la víctima podrá reservar un lugar para un juicio y llevar a un sospechoso para declarar si es inocente o culpable. Los juicios se basarán en las pruebas y argumentos que use tanto la víctima o acusado.\n\nPara pedir un juicio, la víctima debe cumplir las siguientes condiciones :\n\n> Tener el rol "Miembro Activo" o "Miembro [ Cobre ]\n> Tener imagenes de antes y después del crimen\n> Tener al menos una razón o prueba para sospechar del acusado\n> Tener la cantidad mínima de XP para pedir un juicio\n\nLos juicios requieren un nivel mínimo de XP que se les descontará de su cuenta al inicio del juicio. Si la víctima gana el juicio, se le rembolsará completamente la XP que perdió en el juicio de la cuenta del acusado. La cantidad de XP requerida depende del nivel de juicio que sea pedido por la víctima.\n\nLos niveles de impacto de juicios son :\n\n1. Impacto Bajo   : 1000 XP\n2. Impacto Medio  : 3000 XP\n3. Impacto Alto   : 5000 XP\n4. Impacto Máximo : 10000 XP\n\nLos juicios se deben pedir en el canal #〘👮〙juicios\n\nLos mensajes en ese canal deben usar el siguiente formato para ser tomados en cuenta (Copy-Paste) :\n\n**A. :** @Acusado\n**C. :** Crimen\n**I. :** Información adicional\n**N. :** Nivel de impacto\n*Imagen/video/link de evidencia*\n```'

    const content4 = '```md\n——————————————————————————— Información del Realm ———————————————————————————\n=============================================================================\n\n<Articulo 7 = Realm>\n\nLo que se conoce en Minecraft como un "Realm" es básicamente un servidor siempre activo al que se puede entrar si rercibes una invitación o tienes un código de acceso. El mundo insertado en el Realm, los miembros y el código de acceso depende del propietario del servidor, quien edita libremente las opciones del Realm.\n\nNuestro servidor se encuentra en Minecraft Bedrock, con capacidad de 10 jugadores y tema de supervivencia, usamos código de acceso para agregar miembros pero cada uno de ellos necesita un código personal de acceso que se le otorgará al responder a las preguntas correctamente.\n\n\n\n<Articulo 8 = Reinicios>\n\nEl mundo del realm será en algún momento reemplazado por uno nuevo, dejando atrás todo el progreso hecho por el servidor, que normalmente suele ocurrir cuando el mundo esta suficientemente usado como para aburrirse.\n\nA este evento se le conoce como "reinicio", que también puede incluir ligeros regresos en el tiempo o kickeo de mantenimiento. Esto puede ocurrir en cualquier momento, no hay una fecha especifíca para que suceda. \n\nHay varias formas de reinicio que pueden suceder en cualquier momento :\n\n1. Reinicio Total :\nNormalmente avisado\nTodo el progreso perdido\nRaro\n\n2. Regreso Del Tiempo :\nNo avisado\nPérdida de progreso parcial\nPoco común\n\n3. Mantenimiento\nNo avisado\nSin pérdidas\nComún\n```'

    const content5 = '```md\n—————————————————————————— Información de Eventos ——————————————————————————\n============================================================================\n\n<Articulo 9 = Eventos>\n\nEl canal de eventos puede ser usado con multiples fines, los eventos son variados y algunos de ellos suceden en momentos aleatorios. Los tipos de eventos posibles no tienen un número definido y pueden crearse nuevos cada vez que suceda uno.\nUn evento puede ser sugerido por una persona de rango [Miembro][+] o registrado por un rango [Moderador][+] siempre y cuando lo apruebe un Administrador.\n\nLos eventos más comunes pueden incluir :\n\n1. Reinicios\n2. Cierres Temporales\n3. Eventos de Participación\n4. Reportes de Actividad\n5. Elecciones de Moderación.\n\nLos eventos deben ser registrados con un formato especifico que podrás encontrar fijado en el canal de eventos como el primer mensaje. Este formato contiene frases abreviadas con dos o más palabras usando sus primeras letras, podrás encontrar su significado en el mensaje mencionado previamente.\n\nEl formato debe ser interpretado de la siguiente manera :\n\n> T.E. : La idea principal del evento\n> C.D. : La hora en UTC en la cúal el evento iniciará\n> I.I. : La información que deberias saber antes de comenzar\n> I.P. : La persona a la cúal se le debe el evento\n> S.P. : La persona que supervisa y aprueba el evento\n> R.P. : Requerimientos que los participantes deben cumplir\n> I.A. : Información que no cabe en las otras casillas\n```'

    const content6 = '```md\n———————————————————— Información de Funciones (Parte 1) ————————————————————\n============================================================================\n<Articulo 10 = BasesﾠCompartidas>\n\nLas bases compartidas pueden convertirse en una fuente de conflictos y discuciones entre los miembros de la base, lo cúal podría arruinar tu experiencia en el servidor. Para tener un sistema eficiente contra eso, hemos decidido pedir un líder para las bases compartidas.\n\nEl líder de la base compartida puede :\n\n> Desalojar miembros\n> Gestionar el terreno y limitar el terreno a los miembros\n> Confiscar y transferir bienes\n> Desmontar o clausurar construcciones\n\nLos miembros deben estar de acuerdo con las reglas que establesca el líder de base compartida, si rompen reglas personalizadas de una base compartida pueden ser reportados en #〘👮〙crimenes y pasar por el mismo procedimiento de una regla oficial.\n\n> Nota para los líderes : Cada vez que un miembro sea desalojado o las reglas personalizadas sean actualizadas deben reportarlo en #〘🔥〙base-compartida\n\nCada vez que un miembro abandone la base compartida debe reportarlo en #〘🔥〙base-compartida, en tal situación el miembro puede llevarse todos sus bienes y debe desmontar todas las construcciones hechas en el terreno compartido. En caso de que el miembro se niegue a desmontar las construcciones el líder de base puede reportar las construcciones y el miembro a un Administrador para que el miembro sea castigado con un strike.\n\nEn casos interiores de la base el líder deberá encargarse.\n\nLas bases comunales deben ser registradas con este formato (Copy-Paste) :\n\n**C. :** Coordenadas de la base\n**M. :** Lista de miembros\n**L. :** Líder de base\n**R. :** Reglas personalizadas\n```'

    const content7 = '```md\n———————————————————— Información de Funciones (Parte 2) ————————————————————\n============================================================================\n\n<Articulo 11 = SitiosﾠComunales>\n\nLos sitios comunales son un servicio que funciona si los miembros confian en los miembros, y también es una forma funcional de saber que tan respetuosos y confiables son los miembros. Esta idea puede llegar a la destrucción total del lugar y es en ese momento que el Realm deberia reiniciarse o cerrarse.\n\nAl terminar la creación de un sitio comunal se debe registrar en #〘🔥〙sitio-comunal para que se publique en #〘⭐〙sitios-comunales y se haga publico. Sin embargo, deberás tener alguna prueba de que eres dueño tal construcción para evitar problemas.\n\nEl robo de recursos o destrucción de una base comunal afectara a todos los miembros ya que al no poder confiar en nadie, el servidor pierde su esencia. Esto va en efecto mariposa hasta terminar en el cierre del Realm o, con suerte, un reinicio.\n\nEl délito anteriormente mencionado podria terminar en un IP Ban incluso siendo la primera regla rota. Todos los daños a un sitio comunal deben ser reportados por un testigo para evaluar los daños y/o comenzar una investigación.\n\nLos sitios comunales deben ser registrados con este formato (Copy-Paste) :\n\n**C. :** Coordenadas de la construcción\n**P. :** @Propietario\n**D. :** Descripción de la construcción\n\n[Público/Privado]\n*Imagen probando que eres el dueño*\n```'

    const content8 = '```md\n———————————————————— Información de Funciones (Parte 3) ————————————————————\n============================================================================\n\n<Articulo 12 = Faccionesﾠ(Parteﾠ1)>\n\nLas facciones son pequeños grupos de personas que deciden aliarse y ayudarse mutuamente. Estos equipos podrán participar en guerras, tener bases de facción y reclutar a otros jugadores para volverse más fuertes.\n\nA los conflictos entre facciones se les considera "guerras" y tienen un sistema de reglas especial para tal acontesimiento. Las reglas son las siguientes :\n\n> Los daños a bases de facción no necesitan ser reparados\n> Después de matar a un jugador en guerra, debes dejar su loot en un cotenedor en su lugar de muerte\n> Los jugadores involucrados no pueden ser matados en su propia base.\n\nLas facciones en general tienen reglas también, por lo tanto lo que no este prohibido está permitido a menos que rompa el balance o esencia del servidor. Para mantener el orden, las facciones deben tener un líder y reglas personalizadas para cada facción.\n\nLas reglas de facción son :\n\n> Los miembros de facción no se pueden matar entre si\n> Los miembros de facción no pueden revelar coordenadas de una construcción de facción sin permiso\n> Los miembros de facción no pueden reclutar miembros (En caso de rerquerimientos)\n> Los miembros de facción no pueden questionar las reglas o al líder\n> Los líderes tienen prohibido revelar ubicaciones de bases sin permiso del dueño\n\nLas facciones tienen derecho a lo que se denomina como una "base de facción", esta base funciona como una base normal, epcepto que el propietario es el líder de facción, y todos los miembros de la facción sirven como co-propietarios.\n\nLos miembros de facción no tienen derecho a :\n\n> Destruir o robar recursos de otros miembros o la base de facción\n> Revocar cualquier permiso de los miembros de la facción\n> Construir sin el permiso del líder en la base de facción\n> Revelar la ubicación de la base de facción\n```'

    const content9 = '```md\n———————————————————— Información de Funciones (Parte 4) ————————————————————\n============================================================================\n\n<Articulo 12 = Faccionesﾠ(Parteﾠ2)>\n\nLas facciones privadas o acondicionadas tienen un limite de miembros de 10 usuarios. Por otro lado, las facciones públicas tienen derecho a un máximo de 15 miembros. Este número puede ser configurado a menos personas por el fundador de la facción.\n\nSi una facción se considera "acondicionada", tiene derecho a elejir cuales miembros se pueden unir y cuales no. Cuando un usuario desee unirse a una facción acondicionada se le notificará al líder de facción y se le permitirá hacerle las preguntas que quiera al usuario. Si el usuario califica para la facción, el líder le avisará a un Administrador para que se le otorgue acceso oficial a la facción.\n\nSi el usuario considera las preguntas personales o inapropiadas tiene derecho a no responder, por otro lado, el líder de facción tiene derecho a rechazarlo.\n\nLas facciones privadas tienen un sistema más simple, el fundador o líder de facción simplemente eligen que personas pueden entrar a la facción. Sin embargo, para unirse a una facción privada todos los miembros deben tener el rol "Miembro Activo", y para crear una el fundador debe haber estado en el servidor por más de 50 días.\n\nLas reglas para unirse facciones son :\n\n> Debes estar en el servidor por mínimo 30 días\n> No puedes estar en otra facción al mismo tiempo\n> No puedes tener ningún strike\n> No puedes ser el líder de una base compartida\n\nLas reglas para crear una facción son :\n\n> Debes estar en el servidor por mínimo 30 días\n> No puedes estar en otra facción al mismo tiempo\n> No puedes tener ningún strike\n> Debes tener el rol "Miembro Activo" o "Miembro [Diamante]"\n```'

    const content16 = '```Las facciones deben ser registradas con este formato (Copy-Paste) :\n\n**N. :** Nombre de la facción\n**L. :** @Líder\n**M. :** Miembros aceptados (opcional)\n\n[Público/Acondicionado/Privado]\n*Imagen de la bandera (opcional)*```'

    const content10 = '```md\n——————————————————————————— Información de Bases ———————————————————————————\n============================================================================\n\n<Articulo 13 = Bases>\n\nSe le denomina "Base" a la construcción o espacio donde un usuario se aloja y tiene sus posesiones. Las bases son esenciales para la supervivencia ya que sin una es extremadamente difícil alamcenar tus recursos y tienes un riesgo mucho mayor de muerte por criaturas hostiles. En este servidor, las bases necesitan reglas para mantener el balance.\n\nLas reglas son :\n\n> Tu terreno no mide más de 500x500 bloques\n> Puedes reclamar todas las estructuras que estén tocando tu terreno\n> No puedes contruir tu base si hay otra base en un rango de 300 bloques\n> No puedes tener varias bases\n\nLas bases no necesitan ser registradas en el servidor, sin embargo, necesitas tener un mínimo un cartel que diga tu nombre de usuario o un alias para notifcar a los visitantes que todo es tuyo. En caso de un robo o destrucción de bienes, puedes reportarlo en #〘👮〙crimenes para comenzar una investigación.\n\n<Articulo 14 = BasesﾠMasivas>\n\nLas bases masivas son una opción para los jugadores que le dedican tiempo y esfuerzo al servidor. Son básicamente un terreno más grande para un proyecto enorme. A diferencia de las bases normales, estas bases si necesitan ser registradas en #〘🌎〙bases-masivas y hay requerimientos para tener una.\nTe otorga un terreno extra de 1000x1000 a 300 bloques de tu base actual.\n\nLos requerimientos son :\n\n> Debes tener el rol Miembro Activo\n> Debes estar en el servidor por mínimo 30 días\n> No puedes tener ningún strike\n> Debes tener elytras\n\nLas bases masivas deben ser registradas con este formato (Copy-Paste) :\n\n**P. :** @Propietario\n**C. :** Coordenadas del centro de la base masiva\n**B. :** Coordenadas de tu base\n```'

    const content11 = '```md\n—————————————————————— Información de Nivel (Parte 1) ——————————————————————\n============================================================================\n\n<Articulo 12 = XP>\n\nNuestro servidor usa un sistema de nivel para recompensar a los miembros que contribuyen al servidor o simplemente son activos. Este sistema se basa en puntos virtuales llamados "XP", los cuales cuentan tu actividad en el servidor.\n\nLas acciones que te dan XP son :\n\n> Enviar Mensajes (10 XP)\n> Enviar feed (50 XP)\n> Invitar Miembros (150 XP)\n> Hablar en canales de voz (20 XP / Minuto)\n\nOtras acciones como reportar crimenes o registrar sitios comunales pueden dar grandes cantidades de XP también, pero requieren la verificación de un moderador.\n\nLas acciones para conseguir nivel también tienen restricciones :\n\n> No puedes ganar XP en canales de voz estando solo\n> No puedes ganar XP en canales de voz estando ensordecido\n> Los miembros que invites deben verificarse para ganar XP\n> Para ganar XP por feed, tu mensaje tiene que tener un archivo\n\n<Articulo 13 = RangosﾠyﾠNivel>\n\nNuestro servidor tiene ciertos roles que se encuentran en la categoría "Detalles del Usuario" que recompensan la actividad en el servidor. Estos roles se ganan subiendo de nivel, y traen privilegios especiales con cada rango.\n\nLos rangos son :\n\n> Miembro [Hierro]\n> Miembro [Cobre]\n> Miembro [Oro]\n> Miembro [Diamante]\n> Miembro [Netherite]\n\nExisten rangos que no se pueden conseguir con nivel, tales como "Miembro Originario" que solo se puede conseguir si estuviste en los inicios de este servidor. Estos rangos no tienen privilegios especiales en el servidor.```'
    const content12 = '```md\n—————————————————————— Información de Nivel (Parte 2) ——————————————————————\n============================================================================\n\n<Articulo 14 = Invitaciones>\n\nComo se indica en el Articulo 12, invitar a un nuevo miembro al servidor es recompensado con 150 XP. Para reclamar tu XP, el miembro que hayas invitado debe correr el comando /inviter (@Miembro), se le dará la XP de invitación al miembro que mencione su comando. Para evitar multicuentas, este comando require el rol "Miembro" que requiere de verificación.\n\n\n\n<Articulo 15 = Privilegios>\n\nIncluso si los rangos de nivel no tienen privilegios especiales en el servidor, el nivel en si los tiene. Tener más nivel puede :\n\n> Ayudarte en los juicios\n> Darte más espacio de base\n> Darte acceso a eventos exclusivos\n> Darte materiales exclusivos adentro del Realm\n> Darte más posibilidades en las elecciones de moderador\n> Quitarte warns\n\nAunque los befeficios parezcan grandes, las cosas exclusivsas serán cósmeticas o darán ventajas pequeñas. Todo lo demás solo les ayudará a ahorrar tiempo, y los que no tengan nivel podrán conseguir de otras maneras.\n\n> Nota Extra : Cuando tu nivel es modificado, tus privilegios se actualizan```'
    
    const content13 = '```md\n—————————————————————————— Información de Pranks ——————————————————————————\n===========================================================================\n\n<Articulo 15 = Pranks>\n\nEn el servidor, tenemos procedimientos para lo que se conoce como "Pranks" ("Bromas" en inglés), lo que consiste en una broma de un usuario a otro. La broma está normalmente relacionada a la base del usuario y hecha mientras la víctima no está conectada.\n\nTodas las pranks están permitidas, siempre y cuando cumplan las siguentes condiciones :\n\n> El usuario que hizo la prank debe firmarla de alguna manera\n> La prank debe ser hecha exclusivamente con los recursos del usuario que la hizo\n> La víctima tiene derecho a que el usuario le ayude a arreglar 50% de la prank\n> La víctima tiene derecho a reclamarle al usuario cualquier recurso que haya perdido a causa de la prank\n\nSin embargo, si la prank no cumple cualquiera de estos requisitos, la víctima tiene derecho a llevar al usuario (o sospechoso) a un juicio de impacto medio. \n\n<Articulo 16 = Pranksﾠsinﾠfirma>\n\nEn caso de que una prank no tenga firma, la víctima tiene derecho a hacer una lista de sospechosos que piensa que hicieron la prank y no la firmaron. La víctima puede llevar a cualquiera de los sospechosos a un juicio de impacto medio.\n\nLos sospechosos deben cumplir las siguentes condiciones :\n\n> Conocer la ubicación del lugar donde se hizo la prank\n> Tener los recursos suficientes para hacer la prank\n> Estar actualmente en el servidor\n\nLa víctima no tiene derecho a llevar a juicio a alguien más de una vez por prank, en caso de que lleve a alguien a juicio varias veces, el caso será cerrado y se le retirará 150 de XP a su cuenta.```'

    const content14 = '```md\n————————————————————— Información de Reglas (Parte 1) —————————————————————\n===========================================================================\n\n<Articulo 17 = Reglas>\n\nEn el servidor, podrás encontrar las reglas esenciales en el canal #〘📜〙reglas-server y #〘📜〙reglas-realm, sin embargo, no es una documentación completa de las reglas del servidor. Podrás encontrar el resto de las reglas en este canal en sus respectivos artículos.\n\nPara la lista completa de las reglas, copia el link :\n[Pronto Añadido] \nen tu explorador y lee el archivo que se descargará.\n\n<Articulo 18 = Crimenes>\n\nPara reportar reglas rotas del servidor o realm, el servidor usa el canal de #〘👮〙crimenes para que la comunidad reporte las reglas rotas y castigar al infractor.\n\nLos mensajes en ese canal deben usar el siguiente formato para ser tomados en cuenta (Copy-Paste) :\n\n**A. :** @Acusado\n**C. :** Crimen\n**I. :** Información adicional\n**P. :** Pérdidas\n*Imagen/video/link de evidencia*\n\nEn caso de que el crimen sea aceptado y el infractor sea castigado, podrás ganar XP por reportar un crimen. Si este es el caso, un moderador te contactará por DM.```'

    const content15 = '```md\n————————————————————— Información de Reglas (Parte 2) —————————————————————\n===========================================================================\n\n<Articulo 19 = Sospechosos>\n\nEn la mayoría de los casos, no se sabrá con exactitud quien rompió la regla. En ese caso, la víctima elejirá un sospechoso para llevarlo a un juicio y decidir si el usuario es inocente o culpable.\n\nPara balancear el derecho de llevar a un sospechoso, la victima solo puede llevar a un sospechoso por crimen. \n\nSi el sospechoso es declarado culpable, se aplicará el mismo procedimiento de un juicio y crimen normal. Si es daclarado inocente, el crimen quedara cerrado y no se reembolsará nada.\n\n<Articulo 20 = Juicios>\n\nCuando se comete un crimen, la víctima podrá reservar un lugar para un juicio y llevar a un sospechoso para declarar si es inocente o culpable. Los juicios se basarán en las pruebas y argumentos que use tanto la víctima o acusado.\n\nPara pedir un juicio, la víctima debe cumplir las siguientes condiciones :\n\n> Tener el rol "Miembro Activo" o "Miembro [ Cobre ]"\n> Tener imagenes de antes y después del crimen\n> Tener al menos una razón o prueba para sospechar del acusado\n> Tener la cantidad mínima de XP para pedir un juicio\n\nLos juicios requieren un nivel mínimo de XP que se les descontará de su cuenta al inicio del juicio. Si la víctima gana el juicio, se le rembolsará completamente la XP que perdió en el juicio de la cuenta del acusado. La cantidad de XP requerida depende del nivel de juicio que sea pedido por la víctima.\n\nLos niveles de impacto de juicios son :\n\n1. Impacto Bajo   : 1000 XP\n2. Impacto Medio  : 3000 XP\n3. Impacto Alto   : 5000 XP\n4. Impacto Máximo : 10000 XP\n\nLos juicios se deben pedir en el canal #〘👮〙juicios\n\nLos mensajes en ese canal deben usar el siguiente formato para ser tomados en cuenta (Copy-Paste) :\n\n**A. :** @Acusado\n**C. :** Crimen\n**I. :** Información adicional\n**N. :** Nivel de impacto\n*Imagen/video/link de evidencia*```'

    const channel = msg.channel

    channel.send(content1)
    channel.send(content2)
    channel.send(content3)
    channel.send(content4)
    channel.send(content5)
    channel.send(content6)
    channel.send(content7)
    channel.send(content8)
    channel.send(content9)
    channel.send(content16)
    channel.send(content10)
    channel.send(content11)
    channel.send(content12)
    channel.send(content13)
    channel.send(content14)
    channel.send(content15)
    
  } else if (msg.content == 'emitter' && msg.author.id == '700777107869139035' && status2) {
    const SuggestionEmbed = new MessageEmbed()
      .setColor(0xff8000)
      .setTitle('Sistema de sugerencias/quejas')
      .setDescription('¿Tienes una idea para mejorar el servidor?\nLa mejor forma y la más segura de que llegue a los administradores es el sistema de sugerencias.\n\nPresiona el botón verde para una sugerencia y el botón rojo para una queja. Al presionar un botón, el bot te mandará un mensaje y esperará tu respuesta por 5 minutos.')
      .setFooter('El uso inadecuado de un ticket podría resultar en un warn')

    const Buttons = new MessageActionRow()
                    .addComponents(
                     new MessageButton()
                     .setCustomId('Suggestion')
                     .setLabel('Sugerencia')
                     .setStyle('SUCCESS'),
                     new MessageButton()
                     .setCustomId('Complaint')
                     .setLabel('Queja')
                     .setStyle('DANGER')
                    )

    const channel = msg.guild.channels.cache.find(c => c.id == '867936796766511104')

    channel.send({embeds : [SuggestionEmbed], components : [Buttons]})
  }
})

// Login

client.on('debug', console.log)
  
client.login(token)
}