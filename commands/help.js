const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('../config.json');

module.exports = {
    name: 'help',
    description: "Give helpful information about the commands",
    execute(message, args, commandList) {
        const mainHelpEmbed = new Discord.MessageEmbed()
                .setColor('#9900ff')
                .setTitle(`How to use this bot!`)
                .setAuthor(`${message.member.displayName}`, `${message.author.displayAvatarURL()}`)
                .setDescription(`Use ${prefix} followed by a command to call it, some commands have their own help page`)
        for(i = 0; i < commandList.length; i++) {
            mainHelpEmbed.description += `\n**${prefix}${commandList[i][0]}**: ${commandList[i][1]}`
        }
        return message.channel.send(mainHelpEmbed);
    }
}