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

	const userTeam = "userTeam/" + sender.id + ".txt";
        const userInventory = "userInventory/" + sender.id + ".txt";
        const user = "user/" + sender.id + ".txt";

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

	var helpMessage = new Discord.RichEmbed()
                .setColor(lBlue)
                .setAuthor(pokeBot.username, pokeBot.avatarURL)
                .setTitle("Pokemon Bot Commands")
                .setDescription("")
                .addField("The Pokemon Stuff",
			"/reset -> Resets a players user\n" +
			"/starter [Fire/Water/Grass] -> Selects your starter\n" +
			"/chart -> Returns the pokemon move chart\n" +
			"/route [201-230] -> Moves you to the selected route\n" +
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
		case "reset":	
			reset(userTeam, userInventory, user);
			channel.send(sender.username + " has been reset!");
			console.log("User Reset: " + sender.username);

			break;
		case "route":
			if (!args[0]) {
                                invFormat.setTitle("Route Error");
                                invFormat.setDescription("Please pick a valid route\n" +
                                                         "Usage /route [201-230]");
                                channel.send(invFormat);
                                console.log("Route Command - No Route Given");
                                return;
                        }

			fs.exists("Routes/" + args[0] + ".txt", function(exists) {
				if (exists) {
					fs.exists(user, function (exists2) {
						if (exists) {
							fs.writeFile(user, args[0], function (err, data) {
								channel.send("Your route has changed to " + args[0]);
							});
						} else {
							invFormat.setTitle("Route Error");
			                                invFormat.setDescription("Please pick a starter: Fire (Chimchar), Grass (Turtwig), Water (Piplup)\n" +
                        			                                 "Usage /starter [Fire/Water/Grass]");
			                                channel.send(invFormat);
                        			        console.log("Route Command - No Starter Selected");
						}
					});
				} else {
					channel.send("Invalid Route");
				}
			});
			break;
		case "starter":
			 if (!args[0]) {
                                invFormat.setTitle("Starter Error");
                                invFormat.setDescription("Please pick a starter: Fire (Chimchar), Grass (Turtwig), Water (Piplup)\n" +
                                                         "Usage /starter [Fire/Water/Grass]");
                                channel.send(invFormat);
                                console.log("Starter Command - No Starter Selected");
                                return;
                        }

			selection = args[0].toLowerCase();
			var result = "";

			fs.exists(userTeam, function (exists) {
				if (!exists) { 
					switch (selection) {
						case "fire":
							fs.writeFile(userTeam, "Chimchar" + os.EOL, function (err, data) {
								caught.setDescription(sender.username + " chose Chimchar!");
			                                        gif = "http://play.pokemonshowdown.com/sprites/xyani/chimchar.gif";
								caught.setImage(gif);
								channel.send(caught);
								console.log("Starter Command - Success" + " - User: " + sender.username);
			                		        console.log(" - Pokemon: Chimchar");
							});	
							break;
						case "grass":
							fs.writeFile(userTeam, "Turtwig" + os.EOL, function (err, data) {
								caught.setDescription(sender.username + " chose Turtwig!");
                        			                gif = "http://play.pokemonshowdown.com/sprites/xyani/turtwig.gif";
								caught.setImage(gif);
								channel.send(caught);
								console.log("Starter Command - Success" + " - User: " + sender.username);
                                                                console.log(" - Pokemon: Turtwig");
                        			       	});
							break;
						case "water":
  		                		        fs.writeFile(userTeam, "Piplup" + os.EOL, function (err, data) {
								caught.setDescription(sender.username + " chose Piplup!");
			                                        gif = "http://play.pokemonshowdown.com/sprites/xyani/piplup.gif";
								caught.setImage(gif);
								channel.send(caught);
								console.log("Starter Command - Success" + " - User: " + sender.username);
                                                                console.log(" - Pokemon: Piplup");
							});
							break;
						default:

							console.log("Starter Command - No Starter Selected" + " - User: " + sender.username);
							invFormat.setTitle("Starter Error");
	        	               	                invFormat.setDescription("Please pick a starter: Fire (Chimchar), Grass (Turtwig), Water (Piplup)\n" +
			                                                         "Usage /starter [Fire/Water/Grass]");
                        		                channel.send(invFormat);
							return;
							break;
					}
		
		                        console.log(sender.username + " Inventory File Created\n" +
                               	   	            " - File Name: " + userTeam);

                		        fs.writeFile(userInventory, "", function (err, data) {
		                                console.log(sender.username + " Inventory File Created\n" +
                                		                   " - File Name: " + userInventory);
                		        });
		
		                        fs.writeFile(user, "201", function (err, data) {
                                		console.log(sender.username + " File Created\n" +
                		                            " - File Name: " + user);
		                        });
				} else {
					console.log("Starter Command - Starter Already Claimed" + " - User: " + sender.username);
					invFormat.setTitle("Starter Error");
                	                invFormat.setDescription("You have already claimed your starter");
        	                        channel.send(invFormat);
	                                console.log("Starter Command - No Starter Selected");
					return;
				}
			});
			break;
		case "chart":
			// chart -> Returns the pokemon move chart

			// PRE:
			// POST: Returns the pokemon move chart
			channel.send({files: ["./pokemon/Types.png"]});
			console.log("Chart Command - Success" + " - User: " + sender.username);
			break;
		case "catch":
			// catch -> Catches a random pokemon

			// PRE: User has a text file
			// POST: Caught pokemon added to file
			
			//Route pokemon total = number

			fs.exists(user, function (exists) {
				if(exists){
					fs.readFile(user, 'utf8', function(err, data) {
						if (err) throw errl
                	        		fs.readFile("Routes/" + data + ".txt", 'utf8', function(err2, data2) {
							if (err2) throw err2;

							var pokemon = data2.split("\r\n");

							number = pokemon.length;
	                	                        pokemonNum = Math.floor(Math.random() * (number));

        	        	                        gif = "http://play.pokemonshowdown.com/sprites/xyani/" + pokemon[pokemonNum].toLowerCase() + ".gif";

	                        	                caught.setImage(gif);
                                	        	caught.setDescription(sender.username + " caught a " + pokemon[pokemonNum] + "!");

                                        		channel.send(caught);
							
							fs.readFile(userTeam, 'utf8', function(err3, data3) {
								if (err3) throw err3;

								var team = data3.split("\r\n");
								var loc = userTeam
								if (team.length > 6) {
									loc = userInventory;
								}

								fs.appendFile(loc, pokemon[pokemonNum] + os.EOL, function (err) {
        	        		                                if (err) throw err;
                			                                console.log("Catch Command - Pokemon Added" + " - User: " + sender.username);
        		                	                        console.log(" - Pokemon: " + pokemon[pokemonNum]);
		                                	        });
							});
						});
		                        });
					return;
				} else {
					channel.send("You dont have your starter yet!");
					console.log("Catch Command - No Starter" + " - User: " + sender.username);
					return;
				}
			});
			break;
		case "team":
			// team [show/add/remove] -> Coommands relating to a player's team
			channel.send("Command not yet implemented");
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
			channel.send("Command not yet implemented");
			// PRE: A user is given
			// 	Both users have at least 1 pokemon in team
			// POST: A battle is initiated
			// 	 Winner gets wins added
			break;
	}		
});


// Function to delete the data about a user
function reset(userTeam, userInventory, user) {
	fs.exists(userTeam, function (exists) {
		if (exists) {
			fs.unlink(userTeam, function (err) {});
		}
	});

	fs.exists(userInventory, function (exists) {
		if (exists) {
			fs.unlink(userInventory, function (err) {});
		}
	});

	fs.exists(user, function (exists) {
		if (exists) {
			fs.unlink(user, function (err) {});
		}
	});
}

// Function which returns which starter pokemon the user chose
function starter(selection, userTeam, userInventory, user, name) {
	result = "none"
	fs.exists(userTeam, function (exists) {
		if (!exists) { 
			console.log("MOO#");
			switch (selection) {
				case "fire":
					fs.writeFile(userTeam, "Chimchar", function (err, data) {
						result = "Chimchar";
					});	
					break;
				case "grass":
					fs.writeFile(userTeam, "Turtwig", function (err, data) {
						result = "Turtwig";
                        	       	});
					break;
				case "water":
  		                        fs.writeFile(userTeam, "Piplup", function (err, data) {
						result = "Piplup";
					});
					break;
				default:
					console.log("Starter Command - No Starter Selected");
					return "none";
					break;
			}
			
			console.log(name + " team file created");
	                console.log("Starter Command - Success" + " - User: " + name);
		        console.log(" - Pokemon: " + result);
			
			console.log(name + " Inventory File Created\n" + 
				    	   " - File Name: " + userTeam);
			
			fs.writeFile(userInventory, "", function (err, data) {
				console.log(name + " Inventory File Created\n" + 
					    	   " - File Name: " + userInventory);
			});

			fs.writeFile(user, "201", function (err, data) {
				console.log(name + " Inventory File Created\n" + 
						   " - File Name: " + user);
			});
		}
	});
	console.log(result + " MOOOOOOO");
	return result;
}

client.login(auth.token);
