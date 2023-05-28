const express = require('express');
const app = express();
const mongoose = require('mongoose');

var actors = require('./actorRouter');
var movies = require('./movieRouter');

app.listen(8080);
console.log('Server running at http://localhost:8080/');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/lab7', function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');
});

app.post('/actors', actors.createOne);
app.post('/movies', movies.createOne);
app.post('/actors/:movieid/:actorid', actors.addMovie);

// Delete a movie by its ID
app.delete('/movies/:id', movies.deleteOne);

// Delete an actor and all its movies
app.delete('/actors/delete/:actorid', actors.deleteActorMovie);


// Remove a movie from the list of movies of an actor
    // Example: http://localhost:8080/actors/1234/987
    // where 1234 is the actor's ID
    // and 987 is the movie's ID
app.delete('/actors/delete/:actorid/:movieid', actors.deleteMovie);


// Remove an actor from the list of actors in a movie
    // Example: http://localhost:8080/movies/567/2234
    // where 567 is the movie ID
    // and 2234 is the actor ID
app.delete('/movies/delete/:movieid/:actor', movies.deleteActor);


// Add an existing actor to the list of actors in a movie
app.post('/movies/:movieid/:actorid', movies.addActor);


// Retrieve (GET) all the movies produced between year1 and year2, where year1>year2.
app.get('/movies/:year1/:year2', movies.getAllYearRange);

// The current implementation of getAll actors function retrieves the list of actors,
// where each actor has an array of IDs that represents his/her movies.
// Update the implementation such that the array of movies should contain the details of the movies instead of IDs.
app.get('/actors/getall', actors.getAllMovies);

// Like point (7), reimplement getAll movies such that it
// retrieves the details of all actors for each individual movie
app.get('/movies/getall', movies.getAllActors);

// Delete all the movies that are produced between two years. The two years (year1 & year2)
// must be sent to the backend server through the request's body in JSON format.
app.get('/movies/deleteall/:year1/:year2', movies.deleteAll);


// Deploy your app into a VM instance in your GCP account.

