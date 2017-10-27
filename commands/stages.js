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
      sendStageEmbed(message, stageData);
    });
  }).on("error", function(e){
    console.log("Got an error: ", e);
  });
}

function sendStageEmbed(message, data) {
  // Create and set up embed.
  let stageStyle = new Discord.RichEmbed();
  imgURL = data.league[0].stage_a.image.substring(14);
  stageStyle.setColor("#F02D7D");
  stageStyle.setTitle("League Battle Stages - " + data.league[0].rule.name);
  stageStyle.setThumbnail("https://splatoon2.ink/assets/img/battle-league.95f523.png");
  stageStyle.setDescription(data.league[0].stage_a.name);
  stageStyle.setImage("https://splatoon2.ink/assets/img/splatnet/"+imgURL);
  message.channel.send(stageStyle);
  message.channel.send(data.league[0].stage_a.name+data.league[1].stage_b.name);
}
