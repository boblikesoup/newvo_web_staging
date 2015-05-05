Parse.Cloud.define("deleteSuggestion", function(request, response) {
  Parse.Cloud.useMasterKey();
  var suggestionId=request.params.suggestionId;
  var Suggestion = Parse.Object.extend("Suggestion");
  var suggestionQuery = new Parse.Query(Suggestion);
  suggestionQuery.get(suggestionId, {
    success: function(suggestion) {
      suggestion.set("status", 1);
      suggestion.save();
      decrimentSuggestions(request, response, suggestion)
    },
    error: function(object, error) {
      response.error("Error fnding suggestion by Id.");
    }
  });
});
var decrimentSuggestions = function(request, response, suggestion) {
  var postPointer = suggestion.get("post_id")
  postPointer.fetch({
    success: function(post){
      // afterSave function will increment 1
      post.increment("suggestions", -2);
      post.save();
      response.success("Suggestion unpublished and post decrimented.");
    },
    error: function(error){
      response.error("Couldn't find post to decriment.");
    }
  });
};


Parse.Cloud.job("suggestionCounter", function(request, status) {
  Parse.Cloud.useMasterKey();
  var counter = 0;
  var Posts = Parse.Object.extend("Post");
  var postQuery = new Parse.Query(Posts);
  postQuery.each(function(post) {
    var Suggestions = Parse.Object.extend("Suggestion");
    var suggestionQuery = new Parse.Query(Suggestions);
    suggestionQuery.equalTo(("post_id"), post);
    suggestionQuery.count({
      success: function(count) {
        post.set("suggestions", count);
        post.save();
      },
      error: function(error) {

      }
    });
    counter++
    return post.save();
  }).then(function() {
    console.log(counter + " posts processed.");
    status.success("Migration completed successfully.");
  }, function(error) {
    status.error("Uh oh, something went wrong.");
  });
});