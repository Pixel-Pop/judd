const Discord = require("discord.js");
const https = require("https");

exports.run = (client, message, args) => {
  var stageData;
  var url = "https://splatoon2.ink/data/schedules.json";
  https.get(url, (res) => {
    let body = "";
    res.on("data", (chunk) => {
      body += chunk;
    });
    res.on("end", () => {
      stageData = JSON.parse(body);
      asdf(message, args, stageData);
    });
  }).on("error", function(e){
    console.log("Got an error: ", e);
  });
}

function asdf(message, args, data) {
  const a = {
    "turf": [data.regular, "#8ec902", "#19D719", "battle-regular.01b5ef.png"],
    "ranked": [data.gachi, "#f36c01", "#f54910", "battle-ranked.78832c.png"],
    "league": [data.league, "#F02D7D", "#B02C5B", "battle-league.95f523.png"]
  }
  let mode = a[args[1]];
  if (mode) {
    sendModeStageEmbed(message, args, data, mode)
  } else {
    sendStagesEmbed(message, data);
  }
}

function sendStagesEmbed(message, data) {
  // TODO
}

function sendModeStageEmbed(message, args, data, mode) {
  let color1 = mode[1];
  let color2 = mode[2];
  let modeImgUrl = mode[3];
  mode = mode[0];
  // Create and set up embed.
  let stageStyle = new Discord.RichEmbed();
  stageImgUrl = mode[0].stage_a.image.substring(14);
  stageStyle.setColor(color1);
  stageStyle.setAuthor(mode[0].game_mode.name+ " Stages - " + mode[0].rule.name, "https://splatoon2.ink/assets/img/" + modeImgUrl);
//  stageStyle.setTitle("League Battle Stages - " + data.league[0].rule.name);
  //stageStyle.setThumbnail("https://splatoon2.ink/assets/img/battle-league.95f523.png");
  stageStyle.setDescription(mode[0].stage_a.name);
  stageStyle.setImage("https://splatoon2.ink/assets/img/splatnet/"+stageImgUrl);
  message.channel.send(stageStyle);
  // Create and send second embed.
  stageImgUrl = mode[0].stage_b.image.substring(14);
  stageStyle.setColor(color2);
  stageStyle.setAuthor(mode[0].game_mode.name+ " Stages - " + mode[0].rule.name, "https://splatoon2.ink/assets/img/" + modeImgUrl);
  //stageStyle.setTitle("League Battle Stages - " + data.league[0].rule.name);
  //stageStyle.setThumbnail("https://splatoon2.ink/assets/img/battle-league.95f523.png");
  stageStyle.setDescription(mode[0].stage_b.name);
  stageStyle.setImage("https://splatoon2.ink/assets/img/splatnet/"+stageImgUrl);
  message.channel.send(stageStyle);
}
