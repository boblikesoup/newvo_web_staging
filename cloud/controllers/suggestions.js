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
      post.increment("suggestions", -1);
      post.save();
      response.success("Suggestion unpublished and post decrimented.");
    },
    error: function(error){
      response.error("Couldn't find post to decriment.");
    }
  });
};

// Increments post.suggestions
Parse.Cloud.afterSave("Suggestion", function(request) {
  Parse.Cloud.useMasterKey();
  postQuery = new Parse.Query("Post");
  postQuery.get(request.object.get("post_id").id, {
    success: function(post) {
      post.increment("suggestions");
      post.save();
    },
    error: function(error) {
      console.error("ERROR: " + error.code + " : " + error.message);
    }
  });
});
