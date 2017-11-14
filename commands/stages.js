// Import needed resources.
const Discord = require("discord.js");
const https = require("https");

exports.run = (client, message, args) => {
  var stageData;
  var url = "https://splatoon2.ink/data/schedules.json";
  https.get(url, (res) => {
    let body = "";
    // Each time a packet is received, add it to the data.
    res.on("data", (chunk) => {
      body += chunk;
    });
    // When all packets have been received, run the main program.
    res.on("end", () => {
      stageData = JSON.parse(body);
      main(message, args, stageData);
    });

  }).on("error", function(e){
    console.log("Got an error: ", e);
  });
};

function main(message, args, data) {
  // Get the needed styles for each stage embed.
  const stageStyles = {
    "turf": [data.regular, "#8EC902", "#19D719", "battle-regular.01b5ef.png"],
    "regular": [data.regular, "#8EC902", "#19D719", "battle-regular.01b5ef.png"],
    "ranked": [data.gachi, "#F36C01", "#F54910", "battle-ranked.78832c.png"],
    "league": [data.league, "#F02D7D", "#B02C5B", "battle-league.95f523.png"]
  };
  let modeStyle = stageStyles[args[1]];
  /* If the user requests a certain mode, send only that mode with greater
     detail. Else, send the more general stage list.*/
  if (modeStyle) {
    sendModeStageEmbed(message, args, data, modeStyle);
  } else {
    sendStagesEmbed(message, data);
  }
}

function sendStagesEmbed(message, data) {
}

function sendModeStageEmbed(message, args, data, mode) {
  // Set the properties of the embed.
  let color1 = mode[1];
  let color2 = mode[2];
  let modeImgUrl = mode[3];
  mode = mode[0];

  // Create and set up the properties of stage_a embed.
  let stageStyle = new Discord.RichEmbed();
  stageImgUrl = mode[0].stage_a.image.substring(14);
  stageStyle.setColor(color1);
  stageStyle.setAuthor(mode[0].game_mode.name+ " Stages - " + mode[0].rule.name, "https://splatoon2.ink/assets/img/" + modeImgUrl);
  stageStyle.setDescription(mode[0].stage_a.name);
  stageStyle.setImage("https://splatoon2.ink/assets/img/splatnet/"+stageImgUrl);
  message.channel.send(stageStyle);

  // Create and send up the properties of stage_b embed.
  stageImgUrl = mode[0].stage_b.image.substring(14);
  stageStyle.setColor(color2);
  stageStyle.setAuthor(mode[0].game_mode.name+ " Stages - " + mode[0].rule.name, "https://splatoon2.ink/assets/img/" + modeImgUrl);
  stageStyle.setDescription(mode[0].stage_b.name);
  stageStyle.setImage("https://splatoon2.ink/assets/img/splatnet/"+stageImgUrl);
  message.channel.send(stageStyle);
}
