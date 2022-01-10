const Discord = require('discord.js');
const { prefix, token } = require('../config.json');

function CountRolls(rolls) {
    x = 0;
    for (i = 0; i < rolls.length; i++) {
        x += rolls[i];
    }
    return x;
}

function GetNatural(rolls) {
    for (i = 0; i < rolls.length; i++) {
        if (rolls[i] == 1) rolls[i] = 'Nat 1';
        if (rolls[i] == 20) rolls[i] = 'Nat 20';
    }
    return rolls;
}

let advantage = false;
let disadvantage = false;
let seperate = false;

module.exports = {
    name: 'roll',
    description: `Use hjonkbot to roll dice! Use "${prefix}roll help" for more information!`,
    execute(message, args) {
        advantage = false;
        disadvantage = false;
        seperate = false;

        if (!args.length) {
            return message.channel.send(`use !roll help for help using this command.`);
        }

        else if (args[0].toLowerCase() == 'help') {
            const diceHelpEmbed = new Discord.MessageEmbed()
                .setColor('#9900ff')
                .setTitle(`How to use !roll`)
                .setAuthor(`${message.member.displayName}`, `${message.author.displayAvatarURL()}`)
                .setDescription(`To roll dice using this bot:
                !roll [Count]d[Type]

                add +/-[Number] to add/subtract from your total

                add "adv" or "dis" to roll with advantage/disadvantage
                **Note: This only works when rolling one dice!**

                add "s" to roll each dice seperately, adding the modifier to each roll

                Example: !roll d20 | !roll 2d8 +3 | !roll d20 adv +3

                Example 2: !roll 3d20 +3 s
                Rolls: 10, 5, 13
                Totals: 13, 8, 16`)
            return message.channel.send(diceHelpEmbed);
        }

        else if (args[0].toLowerCase().match(/^[0-9]*[d][0-9]+/g)) {
            console.log(args);
            let numOfDice = 1;
            let posOfDice = args[0].indexOf('d');
            if (posOfDice > 0) numOfDice = parseInt(args[0].substring(0, posOfDice));
            let numOfSides = parseInt(args[0].substring(posOfDice+1));
            let rolledNumbers = [];

            if (args.length > 1) {
                for (k = 0; k < args.length; k++) {
                    if (args[k] == 'adv' && numOfDice == 1) {
                        numOfDice *= 2;
                        advantage = true;
                        disadvantage = false;
                        seperate = false;
                    }
                    else if (args[k] == 'dis' && numOfDice == 1) {
                        numOfDice *= 2;
                        advantage = false;
                        disadvantage = true;
                        seperate = false;
                    }
                    else if (args[k] == 's' && numOfDice > 1) {
                        advantage = false;
                        disadvantage = false;
                        seperate = true;
                    }
                    else if ((args[k] == 'adv' || args[k] == 'dis') && numOfDice > 1) {
                        return message.channel.send("You cannot roll more than 1 dice with advantage/disadvantage!")
                    }
                }
            }

            for (i = 0; i < numOfDice; i++) {
                rolledNumbers.push(Math.floor(Math.random() * numOfSides) + 1);
            }

            let finalNumber;
            let finalNumbers = [];
            if (!advantage && !disadvantage) {
                if (!seperate) finalNumber = CountRolls(rolledNumbers);
                else if (seperate) {
                    for (i = 0; i < rolledNumbers.length; i++) {
                        finalNumbers.push(rolledNumbers[i])
                    }
                }
            }
            else if (advantage && !disadvantage) {
                finalNumber = Math.max(...rolledNumbers);
            }
            else if (!advantage && disadvantage) {
                finalNumber = Math.min(...rolledNumbers);
            }

            if (args.length > 1) {
                for (i = 0; i < args.length; i++) {
                    if (args[i].startsWith('+')) {
                        if (!seperate) finalNumber += parseInt(args[i].substring(1));
                        else if (seperate) {
                            for (k = 0; k < finalNumbers.length; k++) {
                                finalNumbers[k] += parseInt(args[i].substring(1));
                            }
                        }
                        //console.log('added number');
                    }
                    else if (args[i].startsWith('-')) {
                        if (!seperate) finalNumber -= parseInt(args[i].substring(1));
                        else if (seperate) {
                            for (j = 0; j < finalNumbers.length; j++) {
                                finalNumbers[j] -= parseInt(args[i].substring(1));
                            }
                        }
                        //console.log('subtracted number');
                    }
                }
            }

            let displayNumber;
            rolledNumbers = GetNatural(rolledNumbers);
            if (!seperate) displayNumber = finalNumber;
            else if (seperate) displayNumber = finalNumbers.join(", ");

            const diceEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Rolled a d${numOfSides}`)
                .setAuthor(`${message.member.displayName}`, `${message.author.displayAvatarURL()}`)
                .setDescription(`Rolled: **${rolledNumbers.join(", ")}**\nTotal: **${displayNumber}**`)
            if (numOfDice > 1) diceEmbed.title = `Rolled ${numOfDice} d${numOfSides}s`;
            return message.channel.send(diceEmbed);
        }
    }
}