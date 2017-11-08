// Dependencies
// =============================================================
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var logger = require("morgan");
// =============================================================

//Create an instance of Express amd set the initial port
var app = express();
var port = process.env.PORT || 3000;

//Require the Article model.
var Article = require("./models/Article.js");

// Use morgan and body-parser for logging.
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("./public"));

// -------------------------------------------------

// Database configuration with Mongoose.
//mongoose.connect("mongodb://localhost/nytreact"); //Modify for heroku.
mongoose.connect("mongodb://heroku_np72c8dg:3asc3dl79p30m16c7fcul6lqiv@ds249575.mlab.com:49575/heroku_np72c8dg")

var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

//After logging into the db through mongoose, log a success message.
db.once("open", function() {                          
  console.log("Mongoose connection successful.");
});

// --------------------------------------------------
// Routes

// Configure Main "/" route to redirect  user to the rendered React application.
app.get("/", function(req, res) {
      res.sendFile("../public/index.html");
});

// Configure routes to retrieve the most recent search result data after page is rendered.
app.get("/api/saved", function(req, res) {

  // We will find all the records, sort it in descending order, then limit the records to 5.
  //The exec() method executes a search for a match in a specified string. Returns a result array, or null.
  Article.find({}).exec(function(err, doc) {

      if(err){
        console.log(error);
      }
      else {
        res.send(doc);
      }
    });
});

// This is the route we will send POST requests to save each search.
app.post("/api/saved", function(req, res) {

  var newArticle = new Article({
    title: req.body.title,
    date: req.body.date,
    url: req.body.url
  });

  newArticle.save(function(err, doc){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.json(doc);
    }
  });
});

app.delete('/api/saved/:id', function(req, res){

  Article.find({'_id': req.params.id}).remove()
    .exec(function(err, doc) {
      res.send(doc);
  });

});


// Start the server on port specified above.
// ==============================================
app.listen(port, function() {
  console.log("App is listening on port " + port);
});