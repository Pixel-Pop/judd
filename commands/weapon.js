// Import weapon data.
const Discord = require("discord.js");
const weaponData = require("../splatoon2-data-master/main.json");
let color = 0;

exports.run = (client, message, args) => {
  // Create RichEmbed and set values.
  var weapon = args[1]
  if (weaponData[weapon]) {
    // Create and set up embed.
    let weaponStyle = new Discord.RichEmbed();
    weaponStyle.setColor(colorPicker());
    weaponStyle.setTitle(weapon);
    weaponStyle.setDescription("sub weapon: " + weaponData[weapon].sub_key);
    // Upload Embed.
    message.channel.send(weaponStyle);
  } else {
    message.channel.send("that is not a weapon my dude");
  }
}

function colorPicker() {
  if (color == 0) {
    color = 1;
    return "#19D719";
  } else {
    color = 0;
    return "#F02D7D";
  }
}
