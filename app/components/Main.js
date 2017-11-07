// Include Axios to let us  make http requests from node.js & support Promise API.
var axios = require("axios");

// Include the main React dependencies.
var React = require("react");

// Include nested React components to which data is passed.
var Form = require('./children/Form');
var Results = require('./children/Results');
var Saved = require('./children/Saved');

// Include "helper" functions for API access, AJAX queries, posting results, etc.
var helpers = require('./utils/helpers');

// Create Main react component.
var Main = React.createClass({

 	//Initialize the state (required when using React.createClass)
	getInitialState: function() {
    return {
	      topic: "",
	      startYear: "",
	      endYear: "",
	      results: [],
	      savedArticles: []
	    }
  },

  getInitialState: function(){
    return {
      topic: "",
      startYear: "",
      endYear: "",
      results: [],
      savedArticles: []
    }
  },  

  // Allow children to update the parent with searchTerms.
  setTerm: function(tpc, stYr, endYr){
    this.setState({
      topic: tpc,
      startYear: stYr,
      endYear: endYr
    })
  },

  saveArticle: function(title, date, url){
    helpers.postArticle(title, date, url);
    this.getArticle();
  },

  deleteArticle: function(article){
    console.log(article);
    axios.delete('/api/saved/' + article._id)
      .then(function(response){
        this.setState({
          savedArticles: response.data
        });
        return response;
      }.bind(this));

    this.getArticle();
  },

  getArticle: function(){
    axios.get('/api/saved')
      .then(function(response){
        this.setState({
          savedArticles: response.data
        });
      }.bind(this));
  },

  // Update components 
  componentDidUpdate: function(prevProps, prevState){

    if(prevState.topic != this.state.topic){
      console.log("UPDATED");

      helpers.runQuery(this.state.topic, this.state.startYear, this.state.endYear)
        .then(function(data){
          console.log(data);
          if (data != this.state.results)
          {
            this.setState({
              results: data
            })
          }
        }.bind(this))
    }
  },

  componentDidMount: function(){
    axios.get('/api/saved')
      .then(function(response){
        this.setState({
          savedArticles: response.data
        });
      }.bind(this));
  },

  // Render the function
  render: function(){
    return(

      <div className="container">

        <div className="row">

          <div className="jumbotron" style={{'backgroundImage': 'url(../images/nyt-headline.png)', 'backgroundRepeat': 'no-repeat', 'backgroundPosition': 'center', 'backgroundSize': '50% 50%', 'backgroundAttachment': 'fixed'}}>
            <h2 className="text-center" style={{'color': 'black', 'textShadow': '3px 3px 10px gray', 'fontSize': '48px'}}>New York Times Article Search and Save</h2>
            <p className="text-center" style={{'color': 'white', 'textShadow': '3px 3px 10px black', 'fontSize': '24px'}}>Search for and save articles of interest!</p>
          </div>
        </div>
        <div className="row">

          <Form setTerm={this.setTerm}/>

        </div>

        <div className="row">
      
          <Results results={this.state.results} saveArticle={this.saveArticle}/>

        </div>

        <div className="row">
        
          <Saved savedArticles={this.state.savedArticles} deleteArticle={this.deleteArticle} />

        </div>
      </div>
    )
  }
});

module.exports = Main;
