const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");
const config = require("./config.json");
const poke = require("./pokemon.json");
const fs = require("fs");
const os = require("os");

client.on('ready', () => {
        console.log("Bot Activated");
        console.log("\nServers:");
        client.guilds.forEach((guild) => {
                console.log(" - " + guild.name)
        });
        console.log("\nBot Log:");
});

client.on("message", async (message) => {

	// Exit and stop if the prefix is not there or if user is a bot
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;
	
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        // Message Colours

        const red = '#FF0000';
        const green = '#00FF00';
        const lBlue = '#FFFFF';

        // Variables

        const count = parseInt(args[0], 10);
        const reason = args.slice(1).join(' ');
        const pokeBot = client.user;
        const channel = message.channel;
        const target = message.mentions.users.first();
        const member = message.guild.member(target);
        const sender = message.author;

	// Reply Messages
	
	var invChannel = new Discord.RichEmbed()
                .setColor(red)
                .setAuthor(sender.username, sender.avatarURL)
                .setTimestamp();

	var invUser = new Discord.RichEmbed()
                .setColor(red)
                .setAuthor(sender.username, sender.avatarURL)
                .setTimestamp();

	var invFormat = new Discord.RichEmbed()
                .setColor(red)
                .setAuthor(sender.username, sender.avatarURL)
                .setTimestamp();

	var caught = new Discord.RichEmbed()
                .setColor(green)
                .setAuthor(sender.username, sender.avatarURL)
                .setTimestamp();

	var helpMessage = new Discord.RichEmbed()
                .setColor(lBlue)
                .setAuthor(pokeBot.username, pokeBot.avatarURL)
                .setTitle("Pokemon Bot Commands")
                .setDescription("")
                .addField("The Pokemon Stuff",
                        "/catch -> Trys to catch the pokemon you are in battle with\n" +
			"/team show -> Shows the user's team\n" + 
			"/team add [Pokemon] -> Adds the given pokemon to the user's team\n" +
			"/team remove [Pokemon] -> Removes the given pokemon fromt he user's team\n" +
			"/battle [@User] -> Challenges the target user to a battle")
                .setTimestamp();

	switch (command) {
		case "help":
			// Help -> Returns all commands

                        // PRE:
                        // POST: Displays every command to the channel in which the command was used
			try {
				channel.send(helpMessage);
				console.log("Help Command - Success" + " - User: " + sender.username);
			} catch (error) {
				console.log("Help Command - Error: " + error);
			}
			break;
		case "catch":
			// catch -> Catches a random pokemon

			// PRE: User has a text file
			// POST: Caught pokemon added to file

			number = 3;
			pokemonNum = Math.floor(Math.random() * (number));
			var pokemon = poke.mon[pokemonNum]

			caught.setTitle("Pokemon Caught!");
			caught.setDescription(sender.username + " caught a " + pokemon[0] + "!");

			fileName = "pokemon/" + sender.id + ".txt";

			fs.exists(fileName, function (exists) {
				if(exists){
					return;
				} else {
					fs.writeFile(fileName, "", function (err, data) {
						console.log("Pokemon Catch Command - File Created" + " - User: " + sender.username);
						console.log(" - File Name: " + fileName);
					})
				}
			});

			channel.send(caught);
			fs.appendFile(fileName, pokemon[0] + os.EOL, function (err) {
				if (err) throw err;
				console.log("Pokemon Catch Command - Pokemon Added" + " - User: " + sender.username);
				console.log(" - File Name: " + fileName);
				console.log(" - Pokemon: " + pokemon[0]);
			});

			break;
		case "team":
			// team [show/add/remove] -> Coommands relating to a player's team
	
			switch (args[0]) {
				case "show":
					// team show -> Returns the user's team
					break;
				case "add":
					// team add [Pokemon] -> Adds the pokemon to the user's team

					// PRE: Pokemon is in the user's inventory
					// POST: Pokemon added to the user's team
					// 	 Pokemon removed to the user's inventory
					break;
				case "remove":
					// team remove [Pokemon] -> Removes the pokemon from the user's team

					// PRE: Pokemon is in the user's team
					// POST: Pokemon removed from the user's team
					// 	 Pokemon added to inventory
					break;
			}
			break;
		case "battle":
			// battle [@User] -> Challenges a user to a battle

			// PRE: A user is given
			// 	Both users have at least 1 pokemon in team
			// POST: A battle is initiated
			// 	 Winner gets wins added
			break;
	}		
});

client.login(auth.token);
