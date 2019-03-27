require("dotenv").config();
var keys = require("./keys.js");


//Importing various packages
var Spotify = require('node-spotify-api');
var axios = require("axios")
var moment = require("moment")
var fs = require("fs");

//initating spotify package
var spotify = new Spotify(keys.spotify);

//Storing command and arguement that user inputs
var command = process.argv[2].toLowerCase();
var data = process.argv.slice(3).join(" ");

//Functions pulls concert API info from BandinTown for given artist
function concertThis(artist){
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(function(response){
        var events = response.data;
        console.log("==============================================Printing Bands in Town Results ==============================================")
        for(var i = 0; i < events.length; i++){
            
            console.log(artist + " will be performing at " + events[i].venue.name +" in " + events[i].venue.city + " on " + moment(events[i].venue.datetime).format("LLLL"))
        }
        console.log("==========================================================================================================================================")       
    }).catch(function(e){
 
        console.log("Sorry, this band does not exist in Bands in Town. Please try again.")

        console.log("==========================================================================================================================================")
    })
}



//Functions pulls Track API from Spotify based on track user inputs
function spotifyThisSong (song){
     spotify
     .search({ type: 'track', query: song, limit: 1})
     .then(function(response) {
            var results = response.tracks.items;
            var resultsFound = (results.length > 0)
            if(resultsFound){
                //Getting first result item 
                var track = results[0];
                console.log("==============================================Printing Spotify Results ==============================================")
                console.log("Track Name: " + track.name);
                var artistNames = ""
                for (var i = 0; i < track.artists.length; i++){
                    artistNames += track.artists[i].name + ", "
                }
                artistNames = artistNames.slice(0, -2)
                console.log("Artists: " + artistNames);
                console.log("Preview Link: " + track.href);
                console.log("Album Name: " + track.album.name);
                }
            else{
                console.log("Sorry, cannot find track information for requested song in the Spotify API. Please try again.")
            }
            console.log("==========================================================================================================================================")
        })
        .catch(function(err) {
            console.log(err);    
        });
            
}

//Function pulls API info from given movie
function movieThis(movie){
    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    axios.get(queryURL).then(function(response){
       var movieResult = response.data;
       if(movieResult.Title){
            console.log("==============================================Printing OMDB Results ==============================================")
            console.log("Title: " + movieResult.Title);
            console.log("Year: " + movieResult.Year);
            console.log("IMDB Rating: " + movieResult.imdbRating);

            if(movieResult.Ratings[1]){
                console.log("Rotten Tomatoes Rating: " + movieResult.Ratings[1].Value);
            }else{
                console.log("Rotten Tomatoes Rating: N/A" );
            }

            console.log("Country Produced: " + movieResult.Country);
            console.log("Lanauages: " + movieResult.Title);
            console.log("Plot: " + movieResult.Plot);
            console.log("Actors: " + movieResult.Actors);
       }
       else{
        console.log("Sorry, this movie does not exist in OMDB API. Please try again.")
       }
       console.log("==========================================================================================================================================")
    }).catch(function(e){
        console.log(e)
    })
}


//Function reads the random.txt where there will be random commands such as "concert-this", "spotify-this-song", and "movie-this" and a search parameter
function doWhatItSays(){
    fs.readFile("./random.txt", "utf8", function(err, data){
        if(err){console.log(err)}
        else{
            var content = data.split("\n")
            for(var i = 0; i < content.length; i++){
                var line = content[i].split(",");
                switch (line[0].trim()){
                case "concert-this":
                concertThis(line[1].trim())
                break;

                case "spotify-this-song":
                spotifyThisSong(line[1].trim())
                break;

                case "movie-this":
                movieThis(line[1].trim())
                break;

                default:
                break;
                }
            }

            }
    })
}

function main(){

    if (command === "concert-this"){;
        concertThis(data)
    } else if(command === "spotify-this-song"){
        if(!data){
            data = "The Way Ace of Base"
        }
         spotifyThisSong(data)
    }else if(command === "movie-this"){
        if(!data){
            data = "Mr. Nobody"
        }
        movieThis(data)
    }else if(command === "do-what-it-says"){
        doWhatItSays()
    }

}

//Running main program
main()


