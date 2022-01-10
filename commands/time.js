const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('../config.json');

let alarmTime = 2000;
let alarmGiven = "20:00";

module.exports = {
    name: 'time',
    description: "Give everyone in the discord a reminder at a certain time. Use '!time help' for more info!",
    execute(message, args, commandList) {
        if (args.length == 0) message.channel.send(this.description);
        else if (args.length > 1) message.channel.send("This command only takes one argument!");
        else {
            if (args[0].length < 5 || args[0].length < 1) {
                message.channel.send("Please specify a time... If you need help use '!time help'");
            }
            else {
                if(args[0].toLowerCase().includes("am") || args[0].toLowerCase().includes("pm")) {
                    alarmGiven = args[0];
                    if (alarmGiven.length < 7) alarmGiven = "0" + alarmGiven;

                    if (alarmGiven == "12:00am") alarmTime = 0000;
                    else if (alarmGiven == "12:00pm") alarmTime == 1200;

                    if (alarmGiven != "12:00am" && alarmGiven != "12:00pm") {
                        if (args[0].toLowerCase().includes("am")) alarmTime = parseInt(alarmGiven.substring(0, 2) + alarmGiven.substring(3, 5));
                        else if (args[0].toLowerCase().includes("pm")) alarmTime = parseInt(alarmGiven.substring(0, 2) + alarmGiven.substring(3, 5)) + 1200;
                    }
                    console.log(alarmGiven);
                    console.log(alarmTime);
                }
            }
        }

        const timeEmbed = new Discord.MessageEmbed()
                .setColor('#9900ff')
                .setTitle(`Set an alarm!`)
                .setAuthor(`${message.member.displayName}`, `${message.author.displayAvatarURL()}`)
                .setDescription(`An alarm has been set for ${alarmGiven}`)
        return message.channel.send(timeEmbed);
    }
}