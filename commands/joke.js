const Discord = require('discord.js');
const { jokes } = require('../jokes.json');
const { prefix, token } = require('../config.json');

module.exports = {
    name: 'joke',
    description: 'Hjonkbot will tell you a joke!',
    execute(message, args) {
        theJoke = jokes[Math.floor(Math.random() * jokes.length)];
        return theJoke;
    }
}