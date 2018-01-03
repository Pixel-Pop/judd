// Import needed resources.
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');

// Set responseObject.
let responseObject = {
  "weapon": "./commands/weapon.js",
  "stages": "./commands/stages.js",
  "profile": "./commands/profile.js"
};
// Login with secret token.
client.login(config.token);
// Alert when bot is running.
client.on('ready', () => {
  console.log('I am ready!');
});

client.on("message", (message) => {
  // Exit and stop if prefix is not there.
  if (!message.content.startsWith(config.prefix)) return;
  // Exit if the message was written by another bot.
  if (message.author.bot) return;
  // Take away the prefix.
  let args = message.content.substring(config.prefix.length);
  // Get arguments in command.
  args = args.split(/ +/g);
  // Get corresponding file to run from responseObject.
  let command = responseObject[args[0]];
  // If the command corresponds with a file, run the file.
  if(command) {
    let commandFile = require(command);
    commandFile.run(client, message, args);
  }
});
