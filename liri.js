require("dotenv").config();

var keys = require("./keys.js");

// console.log(keys)

var Spotify = require('node-spotify-api');
var axios = require("axios")
var moment = require("moment")
var spotify = new Spotify(keys.spotify);

// console.log("got spotify")

var command = process.argv[2];
var data = process.argv.slice(3).join(" ");
// var bandName = process.argv.slice(3).join("+");


function concertThis(artist){
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(function(response){
        var events = response.data;
        // console.log(response.data[0])
        for(var i = 0; i < events.length; i++){
            console.log(artist + " will be performing at " + events[i].venue.name +" in " + events[i].venue.city + " on " + moment(events[i].venue.datetime).format("LLLL"))
        }       
    }).catch(function(e){
        console.log("Sorry, this band does not exist.")
    })
}

function spotifyThisSong (song){

    spotify
    .search({ type: 'track', query: song, limit: 1})
    .then(function(response) {
      console.log(response.tracks.items[0].artists[0].name)
      var track = response.tracks.items[0];
      console.log("Track Name: " + track.name);
    
      var artistNames = ""
      for (var i = 0; track.artists.length; i++){
          console.log(track.artists[i])
        // artistNames += track.artists[i] + ", "
      }
      artistNames = artistNames.slice(0, -2)

      console.log("Artists: " + artistNames);
      console.log("Preview Link: " + track.href);
      console.log("Album Name: " + track.album.name);
      
    })
    .catch(function(err) {
        console.log(err)
        // spotify.search({ type: 'track', query: 'The Sign', limit: 1 }, function(err, data) {
        //     if (err) {
        //       return console.log('Error occurred: ' + err);
        //     }
           
        //     var track = data.tracks;
        //     console.log("Searched song: " + track.name);
        //     console.log("Artists: " + track.artists);
        //     console.log("Preview link: " + track.href);
        //     console.log("Album name: " + track.album.name);
        //   });
    });




}

if (command === "concert-this"){
    var band = process.argv.slice(3).join(" ");
    // console.log(band)
    concertThis(data)
} else if(command === "spotify-this-song"){
    spotifyThisSong(data)

}


