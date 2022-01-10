const Discord = require('discord.js');
const { prefix, token } = require('../config.json');

let numOfConfirmed = 0;

let isPlaying = ['No One'];
let isNotPlaying = ['No One'];
let isMaybePlaying = ['No One'];

const reactions = {
    YES: '🇾',
    NO: '🇳',
    MAYBE: '⏱️'
}

let votedUser;

module.exports = {
    name: 'ping',
    description: "Ping everyone who can see the channel, giving reactions to select options in the post",
    execute(message, args, botID) {
        isPlaying = ['No One'];
        isNotPlaying = ['No One'];
        isMaybePlaying = ['No One'];
        numOfConfirmed = 0;

        //if any arguments are given, don't run the command
        if (args.length > 0) {
            message.channel.send('Arguments are not used when pinging.');
        }

        else {
            //Create emoji filters, and tell what user voted.
            const yesFilter = (reaction, user) => {
                if (reaction.emoji.name === '🇾' && user.id !== botID) {
                    votedUser = user;
                    return true;
                }
                else return false;
            }
            const noFilter = (reaction, user) => {
                if (reaction.emoji.name === '🇳' && user.id !== botID) {
                    votedUser = user;
                    return true;
                }
                else return false;
            }
            const maybeFilter = (reaction, user) => {
                if (reaction.emoji.name === '⏱️' && user.id !== botID) {
                    votedUser = user;
                    return true;
                }
                else return false;
            }

            
            message.guild.members.fetch().then(fetchedMembers => {
                const numOfMembers = fetchedMembers.filter(member => !member.user.bot)
                //Default embed
                const pingEmbed = new Discord.MessageEmbed()
                .setColor('#00ff99')
                .setTitle(`Who's playing D&D?`)
                .setAuthor(`${message.member.displayName}`, `${message.author.displayAvatarURL()}`)
                .setDescription(`React to the post to say you're in for tonight!
                Replied: ${numOfConfirmed}/${numOfMembers.size}

                Yes: ${reactions.YES}
                Maybe/Late: ${reactions.MAYBE}
                No ${reactions.NO}`)
                .addFields(
                    { name: 'Playing:', value: `${isPlaying.join('\n')}`, inline: true },
                    { name: 'Maybe/Late:', value: `${isMaybePlaying.join('\n')}`, inline: true },
                    { name: 'Not Playing:', value: `${isNotPlaying.join('\n')}`, inline: true },
                )

                return message.channel.send("@everyone", pingEmbed)
                    .then(msg => msg.react(reactions.YES))
                    .then(mReaction => mReaction.message.react(reactions.MAYBE))
                    .then(mReaction => mReaction.message.react(reactions.NO))
                    .then(mReaction => {
                        const yesCollector = mReaction.message.createReactionCollector(yesFilter);
                        const noCollector = mReaction.message.createReactionCollector(noFilter);
                        const maybeCollector = mReaction.message.createReactionCollector(maybeFilter);

                        //When the yes emoji is clicked by a user other than the bot
                        yesCollector.on('collect', r => {
                            if (!isPlaying.includes(votedUser) && !isNotPlaying.includes(votedUser) && !isMaybePlaying.includes(votedUser)) numOfConfirmed++;

                            //If the user has already selected the "maybe" option, then replace it with the "playing" option
                            if (isMaybePlaying.includes(votedUser)) {
                                //If removing the user from the list will make it empty, replace it with "No One"
                                if(isMaybePlaying.length == 1) isMaybePlaying[isMaybePlaying.indexOf(votedUser)] = 'No One';
                                else isMaybePlaying.splice(isMaybePlaying.indexOf(votedUser)); 

                                //Else, if the target option is empty except for "no One", replace it with the user's name
                                if (isPlaying.includes('No One')) isPlaying[0] = votedUser;
                                else isPlaying.push(votedUser);
                            }
                            //Same as above, but for the "No" option
                            else if (isNotPlaying.includes(votedUser)) {
                                if(isNotPlaying.length == 1) isNotPlaying[isNotPlaying.indexOf(votedUser)] = 'No One';
                                else isNotPlaying.splice(isNotPlaying.indexOf(votedUser));
                                
                                if (isPlaying.includes('No One')) isPlaying[0] = votedUser;
                                else isPlaying.push(votedUser);
                            }
                            //If the user hasn't voted for either of the other options
                            else if (!isPlaying.includes(votedUser)) {
                                if (isPlaying.includes('No One')) isPlaying[0] = votedUser;
                                else isPlaying.push(votedUser);
                            }

                            //Update the embed based on the information given.
                            const newPingEmbed = new Discord.MessageEmbed({
                                title: pingEmbed.title,
                                color: pingEmbed.color,
                                author: pingEmbed.author,
                                description: `React to the post to say you're in for tonight!
                                Replied: ${numOfConfirmed}/${numOfMembers.size}
                                
                                Yes: ${reactions.YES}
                                Maybe/Late: ${reactions.MAYBE}
                                No ${reactions.NO}`,
                                fields: [
                                    {
                                        name: 'Playing:',
                                        value: `${isPlaying.join('\n')}`,
                                        inline: true
                                    },
                                    {
                                        name: 'Maybe/Late:',
                                        value: `${isMaybePlaying.join('\n')}`,
                                        inline: true
                                    },
                                    {
                                        name: 'Not Playing:',
                                        value: `${isNotPlaying.join('\n')}`,
                                        inline: true
                                    }
                                ]
                            });
                            
                            r.users.remove(votedUser);
                            r.message.edit(newPingEmbed)
                            .then(newMsg => console.log(`${votedUser} voted!`))
                                .catch(console.log)
                        });

                        maybeCollector.on('collect', r => {

                            if (!isPlaying.includes(votedUser) && !isNotPlaying.includes(votedUser) && !isMaybePlaying.includes(votedUser)) numOfConfirmed++;

                            if (isPlaying.includes(votedUser)) {
                                if(isPlaying.length == 1) isPlaying[isPlaying.indexOf(votedUser)] = 'No One';
                                else isPlaying.splice(isPlaying.indexOf(votedUser));

                                if (isMaybePlaying.includes('No One')) isMaybePlaying[0] = votedUser;
                                else isMaybePlaying.push(votedUser);
                            }
                            else if (isNotPlaying.includes(votedUser)) {
                                if(isNotPlaying.length == 1) isNotPlaying[isNotPlaying.indexOf(votedUser)] = 'No One';
                                else isNotPlaying.splice(isNotPlaying.indexOf(votedUser));
                                
                                if (isMaybePlaying.includes('No One')) isMaybePlaying[0] = votedUser;
                                else isMaybePlaying.push(votedUser);
                            }
                            else if (!isMaybePlaying.includes(votedUser)) {
                                if (isMaybePlaying.includes('No One')) isMaybePlaying[0] = votedUser;
                                else isMaybePlaying.push(votedUser);
                            }

                            const newPingEmbed = new Discord.MessageEmbed({
                                title: pingEmbed.title,
                                color: pingEmbed.color,
                                author: pingEmbed.author,
                                description: `React to the post to say you're in for tonight!
                                Replied: ${numOfConfirmed}/${numOfMembers.size}
                
                                Yes: ${reactions.YES}
                                Maybe/Late: ${reactions.MAYBE}
                                No ${reactions.NO}`,
                                fields: [
                                    {
                                        name: 'Playing:',
                                        value: `${isPlaying.join('\n')}`,
                                        inline: true
                                    },
                                    {
                                        name: 'Maybe/Late:',
                                        value: `${isMaybePlaying.join('\n')}`,
                                        inline: true
                                    },
                                    {
                                        name: 'Not Playing:',
                                        value: `${isNotPlaying.join('\n')}`,
                                        inline: true
                                    }
                                ]
                            });

                            r.users.remove(votedUser);
                            r.message.edit(newPingEmbed)
                                .then(newMsg => console.log(`${votedUser} voted!`))
                                .catch(console.log)
                        });

                        noCollector.on('collect', r => {

                            if (!isPlaying.includes(votedUser) && !isNotPlaying.includes(votedUser) && !isMaybePlaying.includes(votedUser)) numOfConfirmed++;

                            if (isPlaying.includes(votedUser)) {
                                if(isPlaying.length == 1) isPlaying[isPlaying.indexOf(votedUser)] = 'No One';
                                else isPlaying.splice(isPlaying.indexOf(votedUser));

                                if (isNotPlaying.includes('No One')) isNotPlaying[0] = votedUser;
                                else isNotPlaying.push(votedUser);
                            }
                            else if (isMaybePlaying.includes(votedUser)) {
                                if(isMaybePlaying.length == 1) isMaybePlaying[isMaybePlaying.indexOf(votedUser)] = 'No One';
                                else isMaybePlaying.splice(isMaybePlaying.indexOf(votedUser));
                                
                                if (isNotPlaying.includes('No One')) isNotPlaying[0] = votedUser;
                                else isNotPlaying.push(votedUser);
                            }
                            else if (!isNotPlaying.includes(votedUser)) {
                                if (isNotPlaying.includes('No One')) isNotPlaying[0] = votedUser;
                                else isNotPlaying.push(votedUser);
                            }

                            const newPingEmbed = new Discord.MessageEmbed({
                                title: pingEmbed.title,
                                color: pingEmbed.color,
                                author: pingEmbed.author,
                                description: `React to the post to say you're in for tonight!
                                Replied: ${numOfConfirmed}/${numOfMembers.size}
                
                                Yes: ${reactions.YES}
                                Maybe/Late: ${reactions.MAYBE}
                                No ${reactions.NO}`,
                                fields: [
                                    {
                                        name: 'Playing:',
                                        value: `${isPlaying.join('\n')}`,
                                        inline: true
                                    },
                                    {
                                        name: 'Maybe/Late:',
                                        value: `${isMaybePlaying.join('\n')}`,
                                        inline: true
                                    },
                                    {
                                        name: 'Not Playing:',
                                        value: `${isNotPlaying.join('\n')}`,
                                        inline: true
                                    }
                                ]
                            });

                            r.users.remove(votedUser);
                            r.message.edit(newPingEmbed)
                                .then(newMsg => console.log(`${votedUser} voted!`))
                                .catch(console.log)
                        });
                        
                        
                    });
            });
        }
    }
}