const Discord = require('discord.js');

module.exports = {
    name: 'bully',
    description: 'Bully another player, use "!bully help" for more info',
    execute(message, args) {
        if (args.length == 1) {
            switch(args[0]) {
                case 'true':
                case 'on':
                    message.channel.send("Let the Hjönkening begin!");
                    return true;
                case 'false':
                case 'off':
                    message.channel.send("The Hjönkening has ended!");
                    return false;
                case "help":
                    const bullyHelpEmbed = new Discord.MessageEmbed()
                        .setColor('#9900ff')
                        .setTitle(`How to use the !bully command`)
                        .setAuthor(`${message.member.displayName}`, `${message.author.displayAvatarURL()}`)
                        .setDescription(`Use !bully **on/off** to switch bully mode on or off...
                        Use !bully **@{playerName}** to change the target of the bullying to another player
                        Use !bully **"Text to say"** (Without the quotes) to change what Hjonkbot says when bullying`)
                        message.channel.send(bullyHelpEmbed)
                    return;
                default:
                    if (message.mentions.users.first()) {
                        message.channel.send("The Hjönkening has been shifted!");
                        return message.mentions.users.first().id;
                    }
                    else return args[0];
            }
        }
        else if (args.length > 1) {
            return args.join(" ");
        }
    }
}
