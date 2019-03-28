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
    var results = "Bands in Town Results\n"
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(function(response){
        var events = response.data;
        // console.log("==============================================Printing Bands in Town Results ==============================================")

        for(var i = 0; i < events.length; i++){
            
            results += artist + " will be performing at " + events[i].venue.name +" in " + events[i].venue.city + " on " + moment(events[i].venue.datetime).format("LLLL") + "\n"
        }
        results += "==========================="
        appendResults(results)    
    }).catch(function(e){
        results += "Sorry, this band does not exist in Bands in Town. Please try again.\n ==========================="
        appendResults(results)    
     
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

                var artistNames = ""
                for (var i = 0; i < track.artists.length; i++){
                    artistNames += track.artists[i].name + ", "
                }
                artistNames = artistNames.slice(0, -2)

                var results =  
                `
                Spotify Results
                Track Name:    ${track.name}
                Artists:  ${artistNames}
                Preview Link: ${track.href}
                Album Name: ${track.album.name}
                ===============================
                `
                // console.log(results)
                }
                
            else{
                // console.log("Sorry, cannot find track information for requested song in the Spotify API. Please try again.")
                var results =  
                `
                Spotify Results
                Sorry, cannot find track information for requested song in the Spotify API. Please try again.
                ==============================================================================================
                `
            }
            appendResults(results)
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
            var rottenTomatoRating = ""
            if(movieResult.Ratings[1]){
                rottenTomatoRating = movieResult.Ratings[1].Value;
            }else{
                rottenTomatoRating = "N/A";
            }


            var results = 
            `
            OMDB Results
            Title Name: ${movieResult.Title}
            Year:  ${movieResult.Year}
            IMDB Rating: ${movieResult.imdbRating}
            Rotten Tomato Rating: ${rottenTomatoRating }
            Country Produced: ${movieResult.Country}      
            Languages: ${movieResult.Languages}     
            Plot: ${movieResult.Plot}
            Actors: ${movieResult.Actors}
            ===============================           
             `
       }
       else{
        var results = 
        `
        OMDB Results
        Sorry, this movie does not exist in OMDB API. Please try again.
        ===============================================================
        `
       }
       appendResults(results)
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


function appendResults(r){

    console.log(r);

    fs.appendFile("log.txt", r+"\n", function(error){
        if(error) {console.log(error)}
        else{ console.log("Results has been added!")}
    })
}

function main(){

    fs.appendFile("log.txt", command+ " " + data +"\n", function(error){
        if(error) {console.log(error)}
        else{ console.log("Command has been added!")}
    })

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


