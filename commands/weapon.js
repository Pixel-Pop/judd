// Import weapon data.
const Discord = require("discord.js");
const weaponData = require("../splatoon2-data/main.json");
let color = 0;

exports.run = (client, message, args) => {

  // Create RichEmbed and set values.
  var weapon;
  // This is pretty bad. Please suggest any changes!
  if (weaponData[args[1] + "_" + args[2] + "_" + args[3]]) {
    weapon = args[1] + "_" + args[2] + "_" + args[3];
    sendWeaponEmbed(message, weapon);
  } else if (weaponData[args[3] + "_" + args[1] + "_" + args[2]]) {
    weapon = args[3] + "_" + args[1] + "_" + args[2];
    sendWeaponEmbed(message, weapon);
  } else if (weaponData[args[1] + "_" + args[2]]) {
    weapon = args[1] + "_" + args[2];
    sendWeaponEmbed(message, weapon);
  } else if (weaponData[args[2] + "_" + args[1]]) {
    weapon = args[2] + "_" + args[1];
    sendWeaponEmbed(message, weapon);
  } else if (weaponData[args[1]]) {
    weapon = args[1];
    sendWeaponEmbed(message, weapon);
  } else {
    message.channel.send("that is not a weapon my dude");
  }
}
// For alternating colors.
function colorPicker() {
  if (color == 0) {
    color = 1;
    return "#19D719";
  } else {
    color = 0;
    return "#F02D7D";
  }
}

function sendWeaponEmbed(message, weapon) {
  // Create and set up embed.
  let weaponStyle = new Discord.RichEmbed();
  weaponStyle.setColor(colorPicker());
  weaponStyle.setTitle(weapon);
  weaponStyle.setDescription("sub weapon: " + weaponData[weapon].sub_key);
  // Upload Embed.
  message.channel.send(weaponStyle);
}
