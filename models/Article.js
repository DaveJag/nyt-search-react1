//Use Mongoose to create an Article schema and model.

// Dependency
	var mongoose = require("mongoose");

// Create the Schema class
	var Schema = mongoose.Schema;

// Instantiate a userSchema object with the Schema class we just made
	var ArticleSchema = new Schema({
  
	// title is a string containing the title of the stored article from NYTimes.com. 
	// Trim any trailing whitespace and make all data objects required.
		title: {
	    	type: String,
	    	trim: true,
	    	required: true,
  		},
  	
  	// date is the publish date and time of the article.
  		date:  {
	  		type: Date,
	  		default: Date.now,
	  		required: true,
  		},	
  	
  	//url is the URL of the article on NYTimes.com.
  		url: {
  			type: String,
			trim: true,
	    	required: true,
  		}
  	});

// Create the "Article" model with our ArticleSchema schema
var Article = mongoose.model("Article", ArticleSchema);

// Export the User model, so it can be used in server.js with a require
module.exports = Article;
