const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

let jokeDelay = 2; //In seconds
let commandList = [];

const PORT = process.env.PORT || 3000;

function GetRandomWord(message) {
    let theString = message.split(" ");
    theString[Math.floor(Math.random() * theString.length)] = "HJÖNK";
    return theString.join(" ");
}

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
    bot.commands.set(command.name, command);
    commandList.push([command.name, command.description]);
}

bot.on('ready', () => {
    console.log('Bot is online, use "!help" to get the commands');
    bot.user.setActivity("All of the hjönkin' games!");
});

bot.on('message', message => {
    if (message.author.bot) return;

    const args = message.content.substring(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'roll':
            return bot.commands.get('roll').execute(message, args);
        case 'ping':
            return bot.commands.get('ping').execute(message, args, bot.user.id);
        case 'help':
            return bot.commands.get('help').execute(message, args, commandList);
        case "joke":
            theJoke = bot.commands.get('joke').execute(message, args);
            return message.channel.send(theJoke[0]).then(msg => {
                setTimeout(function() {
                    message.channel.send(theJoke[1]);
                }, jokeDelay * 1000)
            })          
        default:
            regex = /[^\sA-Za-z]*[d][^A-Za-z\s]+/;
            if (regex.test(command)) {
                args.unshift(command);
                return bot.commands.get('roll').execute(message, args);
            }
            else break;
    }

    switch(Math.floor(Math.random() * 15)) {
        case 1:
            console.log('Hjonked in retaliation');
            return message.react('708649000454324274');
        case 2:
            console.log("Hjonkified text");
            return message.channel.send(GetRandomWord(message.content));
        default: break;
    }
})

bot.on('message', sentMessage => {
    if (sentMessage.content.toLowerCase().includes('hjonk')) {
        sentMessage.react('708649000454324274');
    }
});

bot.login(token);