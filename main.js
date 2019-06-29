"USE STRICT";
// SET THESE FIRST
var config = require('./config.json');

var username = config.username;
var CLIENT_ID = config.CLIENT_ID; // Change this if you want custom avatars
var url = config.url;
var endpoint = config.endpoint;
var timer = 5000; // To deal with ratelimits

// Full Channel URL
var full = url + endpoint + username;

const rpc = require("discord-rich-presence")(CLIENT_ID);
const axios = require("axios");
const fs = require("fs");

console.log("API URL: " + full);

// Discord Rich Presence calling API functions from Mixer.

var myInt = setInterval(function() {
  axios
    .get(full)
    .then(function(res) {
      const username = res.data.token;
      const online = res.data.online;
      const profile = res.data.user.avatarUrl;
      var viewers = res.data.viewersCurrent;
      const game = res.data.type.name;
      const bio = res.data.user.bio;
      const channelid = res.data.id;
      const title = res.data.name;
      const followers = new Intl.NumberFormat().format(res.data.numFollowers);
      const partner = res.data.partnered;
      const gameUrl = res.data.type.coverUrl;

      var offline = "Offline";

      if (viewers < 0) {
        viewers = "No viewers";
      } else if (viewers === 1) {
        viewers = "1 viewer";
      } else {
        viewers = viewers + " viewers";
      }

      seconds = timer / 1000;

      console.log(
        "(Updates every "+seconds+"s) :: "+ username + " | " + title + " | " + game + " | " + viewers
      );

      if (online === true) {
        rpc.updatePresence({
          state: game,
          details: title,
          largeImageKey: "profile",
          smallImageKey: "online",
          largeImageText: "mixer.com/" +username,
          smallImageText: viewers,
          instance: true
        });
      } else {
        rpc.updatePresence({
          state: followers + " followers",
          largeImageKey: "mixer",
          details:"Last seen playing " + game,
          largeImageText: "mixer.com/" +username,
          smallImageKey: "offline",
          smallImageText: username + " is "+ offline,
          instance: true
        });
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}, timer);
