// Import needed resources.
const Discord = require("discord.js");
const Datastore = require('@google-cloud/datastore');
const config = require('../config.json');
// Global variables.
let authorProfile;
let authorKey;
let edited = false;

// Your Google Cloud Platform project ID
const projectId = config.googleCloudProjectID;
// Instantiates a client
const datastore = Datastore({
  projectId: projectId,
  keyFilename: config.googleCloudKeyFilename
});

exports.run = (client, message, args) => {
  // Get the author's profile.
  authorKey = datastore.key(["Profile", message.author.id])
  datastore.get(authorKey)
    .then((results) => {
      // Authors's profile retrieved.
      authorProfile = results[0];
      if (authorProfile == undefined) {
        // Creates an initial profile if the author doesn't have one.
        createProfile(client, message, args, authorKey);
      } else {
        main(client, message, args);
      }
  });
}

// Create initial profile; ran if author's profile doesn't exist.
function createProfile(client, message, args, key) {
  let defaultProfile = {
    key: key,
    data: {
      friendCode: ""
    }
  }
  datastore.insert(defaultProfile)
  .then(() => {
    // Created initial profile.
    authorProfile = defaultProfile;
    main(client, message, args);
  });
}

// Main function; gets run after receiving the author's information.
function main(client, message, args) {
  let updateProfile = {
    key: authorKey,
    data: {
      friendCode: authorProfile.friendCode
    }
  };
  if (args[1] == undefined) {
    // Show the author's profile if no arguments are given.
    showProfile(client, message, args, authorProfile);
  } else if (args[1] == "fc") {
  // User wants to input a friend code.
    edited = true;
    // Filter "bad" switch friend codes, and get a valid one.
    if (args[2] != undefined && args[2].match(/^SW(-[0-9]{4}){3}$/)) {
      // Form of SW-0123-4567-8910
      updateProfile.data.friendCode = args[2]
    } else if (args[2] != undefined && args[2].match(/^[0-9]{4}-[0-9]{4}-[0-9]{4}$/)) {
      // Form of 0123-4567-8910
      updateProfile.data.friendCode = "SW-" + args[2]
    } else if (args[2] != undefined && args[2].match(/^[0-9]{12}$/)) {
      // Form of 012345678910
      updateProfile.data.friendCode = "SW-" + args[2].substring(0,4) + "-" + args[2].substring(4,8) + "-" + args[2].substring(8,12);
    } else {
      message.channel.send("Please input a valid Switch friend code.")
      edited = false;
    }
  } else {  // User wants to get someone else's profile.
    let requestID;
    let requestProfile;
    // Check if it is a mention.
    if (args[1].match(/^<@!?[0-9]+>$/)) {
      requestID = args[1].replace(/[<@!>]/g, "");;
    // Check if it is the username followed by discriminator; the "tag".
    } else if (args[1].match(/^.*#[0-9]{4}$/)) {
      requestID = message.guild.members.find(GuildMember => GuildMember.user.tag === args[1]);
      if (requestID) {
        requestID = requestID.user.id;
      }
    }
    // Retrieve the person's profile if the person is found.
    if (requestID) {
      datastore.get(datastore.key(["Profile", requestID]))
        .then((results) => {
          // Task entities found.
          requestProfile = results[0];
          if (requestProfile == undefined) {
            message.channel.send('\"' + args[1] + '\" hasn\'t set up a profile yet.')
          } else {
            showProfile(client, message, args, requestProfile);
          }
      });
    } else {
      message.channel.send("Could not find user " + args[1]);
    }
  }
  // Only push changes if needed.
  if (edited) {
    // Push the change that has been made to the SQL server.
    datastore.upsert(updateProfile)
    .then(() => {
      // Profile updated successfully.
      message.channel.send("Saved your friend code as " + updateProfile.data.friendCode);
      edited = false;
    });
  }
}

function showProfile(client, message, args, profile) {
  message.channel.send(profile.friendCode);
}
