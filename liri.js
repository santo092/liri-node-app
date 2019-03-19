require("dotenv").config();
//require moment
const moment = require('moment')

var axios = require("axios");
var fs = require("fs");

var command = process.argv[2];
var thirdElementToTheEnd = process.argv.slice(3);
//console.log(thirdElementToTheEnd);

//join them together in a string with pluses between them
var plusesBetween = thirdElementToTheEnd.join("+");
//console.log(plusesBetween);

//`concert-this`
//`node liri.js concert-this <artist/band name here>`npm
var log = command + " " + plusesBetween + '\r\n'
fs.appendFile("log.txt", log, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Content Added!");
    }
})

switch (command) {
    case "concert-this":
        concert();
        break;

    case "spotify-this-song":
        spotify();
        break;

    case "movie-this":
        omdb();
        break;

    case "do-what-it-says":
        dwis();
        break;
}

function concert() {
    // make a variable that gives any artist
    var artist = plusesBetween;
    //make a queryUrl
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    //connect to the API
    axios.get(queryUrl).then(
        function (response) {
            //console.log(response.data);

            var eachData = response.data;

            for (var i in eachData) {

                console.log("");
                //log name of venue
                console.log("Venue: " + eachData[i].venue.name);
                //log venue location
                console.log("Venue location: " + eachData[i].venue.city + ", " + eachData[i].venue.country);
                //log date of event in MM/DD/YYYY format
                const date = moment(eachData[i].datetime);
                console.log("Date of event: " + date.format('MM DD YYYY'));
                //break
                console.log("")


            }
        })
    //check if request is successful
    //log something for response
}

function spotify() {

    var Spotify = require('node-spotify-api');
    var keys = require("./keys.js");
    var spotify = new Spotify(keys.spotify);
    var track = plusesBetween;

    if (track == "") {
        spotify
            .request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc')
            .then(function (response) {
                console.log("");
                //log artist
                console.log("Artist: " + response.album.artists[0].name);
                //song name
                console.log("Song name: " + response.name);
                //spotify link
                console.log("Spotify link: " + response.album.artists[0].external_urls.spotify);
                //album name
                console.log("Album name: " + response.album.name);

                console.log("");
            })


    }
    else {
        spotify
            .search({ type: 'track', query: track, limit: 5 })
            .then(function (response) {
                //console.log(JSON.stringify(data));

                var eachData = response.tracks.items;
                for (var i in eachData) {

                    console.log("");
                    //log artists
                    console.log("Artist: " + eachData[i].album.artists[0].name)

                    //log song's name
                    console.log("Song name: " + eachData[i].name)

                    //link of the song in Spotify
                    console.log("Spotify link: " + eachData[i].album.artists[0].external_urls.spotify)
                    //album its from
                    console.log("Album: " + eachData[i].album.name)

                    console.log("")
                }

            })

            .catch(function (err) {
                //console.error('Error occurred: ' + err);
            });

    }
}

function omdb() {

    var movie = plusesBetween;

    // var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    if (movie == "") {
        var queryUrl = "http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=trilogy";

        axios.get(queryUrl).then(
            function (response) {
                console.log("");
                // * Title of the movie.
                console.log("Title: " + response.data.Title);
                // * Year the movie came out.
                console.log("Release Year: " + response.data.Year);
                // * IMDB Rating of the movie.
                console.log("IMDB Rating: " + response.data.imdbRating);
                // * Rotten Tomatoes Rating of the movie.
                console.log(response.data.Ratings[1].Source + " Rating: " + response.data.Ratings[1].Value);
                // * Country where the movie was produced.
                console.log("Country: " + response.data.Country);
                // * Language of the movie.
                console.log("Language: " + response.data.Language);
                // * Plot of the movie.
                console.log("Plot: " + response.data.Plot);
                // * Actors in the movie.
                console.log("Actors: " + response.data.Actors);
                console.log("");
                //console.log(JSON.stringify,response,null, 2);

            }
        );
    }
    else {
        var elseUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
        axios.get(elseUrl).then(
            function (response) {
                console.log("");
                // * Title of the movie.
                console.log("Title: " + response.data.Title);
                // * Year the movie came out.
                console.log("Release Year: " + response.data.Year);
                // * IMDB Rating of the movie.
                console.log("IMDB Rating: " + response.data.imdbRating);
                // * Rotten Tomatoes Rating of the movie.
                console.log(response.data.Ratings[1].Source + " Rating: " + response.data.Ratings[1].Value);
                // * Country where the movie was produced.
                console.log("Country: " + response.data.Country);
                // * Language of the movie.
                console.log("Language: " + response.data.Language);
                // * Plot of the movie.
                console.log("Plot: " + response.data.Plot);
                // * Actors in the movie.
                console.log("Actors: " + response.data.Actors);
                console.log("");
            })

    }
}

function dwis() {

    fs.readFile("random.txt", "utf8", function (error, data) {

        data = data.split(',');

        var command;
        var parameter;

        if (data.length == 2) {
            command = data[0];
            parameter = JSON.parse(data[1]);


            switch (command) {
                case "concert-this":
                    plusesBetween = parameter;
                    concert();
                    break;

                case "spotify-this-song":
                    plusesBetween = parameter;
                    spotify();
                    break;

                case "movie-this":
                    plusesBetween = parameter;
                    omdb();
                    break;

                case "do-what-it-says":
                    plusesBetween = parameter;
                    dwis();
                    break;
            }

        }
    })
}
