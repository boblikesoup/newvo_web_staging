Parse.Cloud.define("deleteSuggestion", function(request, response) {
  Parse.Cloud.useMasterKey();
  var suggestionId=request.params.suggestionId;
  var Suggestion = Parse.Object.extend("Suggestion");
  var suggestionQuery = new Parse.Query(Suggestion);
  suggestionQuery.get(suggestionId, {
    success: function(suggestion) {
      suggestion.set("status", 1);
      suggestion.save();
      response.success("Suggestion unpublished.");
    },
    error: function(object, error) {
      response.error("Error fnding suggestion by Id.");
    }
  });
});