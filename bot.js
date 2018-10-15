const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");
const config = require("./config.json");

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
		
	switch (command) {
		case "command1":
			// Code here
			break;
		case "command2":
			// Code here
			break;
	}		
});

client.login(auth.token);
