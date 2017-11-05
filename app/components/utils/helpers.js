// Include Axios to let us  make http requests from node.js & support Promise API.
var axios = require("axios");

// My personal API key for Article Search of the New York Times
var NYTAPI = "4a1e42cabc714400a1d2cadbab248ab4";

// Query functions to make API calls
var helpers = {
    runQuery: function(topic, startYear, endYear) {
        var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + NYTAPI + "&q=" + topic + "&begin_date=" + startYear + "0101&end_date=" + endYear + "0101";
        return axios.get(queryURL).then(function(response) {
            var newResults = [];
            var fullResults = response.data.response.docs;
            var counter = 0;

            //Get five articles that have title, date and URL.
            for (var i = 0; i < fullResults.length; i++) {

                if (counter > 4) {
                    return newResults;
                }
                if (fullResults[counter].headline.main && fullResults[counter].pub_date && fullResults[counter].web_url) {
                    newResults.push(fullResults[counter]);
                    counter++;
                }
            }
            return newResults;
        })
    },

    // Post saved articles to MongoDB.
    postArticle: function(title, date, url) {
        axios.post('/api/saved', { title: title, date: date, url: url })
            .then(function(results) {
                console.log("Posted to MongoDB");
                return (results);
            })
    }
};

module.exports = helpers;