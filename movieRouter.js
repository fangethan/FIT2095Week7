var Actor = require('./actorSchema');
var Movie = require('./movieSchema');

const mongoose = require('mongoose');

module.exports = {
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            console.log('created new movie');
            res.json(movie);
        });
    },

    // Delete a movie by its ID
    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            console.log('delete movie by id completed')
            res.json();
        });
    },

    // Remove an actor from the list of actors in a movie
        // Example: http://localhost:8080/movies/567/2234
        // where 567 is the movie ID
        // and 2234 is the actor ID
    deleteActor: function (req, res) {
        Movie.findOne({ _id: req.params.movieid }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.params.actor}, function (err, doc) {
                if (err) return res.status(400).json(err);
                if (!doc) return res.status(404).json();

                console.log(movie);
                movie.actors.remove(doc._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    },

// Retrieve (GET) all the movies produced between year1 and year2, where year1>year2.
    getAllYearRange: function (req, res) {
        var filterList = [];
        if (req.params.year1 > req.params.year2) {
            Movie.find({}, function (err, docs) {
                for (let i = 0; i < docs.length; i++) {
                    if (docs[i].year <= req.params.year1 && docs[i].year >= req.params.year2) {
                        console.log(docs[i]);
                        filterList.push(docs[i])
                    }
                }
                res.json(filterList);
            });
        } else {
            return res.status(400);
        }
    },

// Like point (7), reimplement getAll movies such that it
// retrieves the details of all actors for each individual movie
    getAllActors: function (req, res) {
        Movie.find({})
            .populate('actors')
            .exec(function (err, actor) {
                if (err) return res.json(err);
                if (!actor) return res.json();
                res.json(actor);
            });
    },

// Delete all the movies that are produced between two years. The two years (year1 & year2)
// must be sent to the backend server through the request's body in JSON format.
    deleteAll: function (req, res) {
        if (req.params.year1 > req.params.year2) {
            Movie.deleteMany({year: {$lte: req.params.year1, $gte: req.params.year2}},
                function (err, doc) {
                    console.log(doc);
                    res.json(doc);
            });
        } else {
            return res.status(400);
        }
    },

    // Add an existing actor to the list of actors in a movie
    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.movieid }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.params.actorid }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();

                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    },

}

