Parse.Cloud.define("unfavorite", function(request, response) {
  Parse.Cloud.useMasterKey();
  var suggestionId=request.params.favoriteId;
  var Favorite = Parse.Object.extend("Favorite");
  var favoriteQuery = new Parse.Query(Favorite);
  favoriteQuery.get(favoriteId, {
    success: function(suggestion) {
      favorite.set("status", 1);
      favorite.save();
    },
    error: function(object, error) {
      response.error("Error fnding favorite by Id.");
    }
  });
});

// Newfeed
// Fetch news 
// use the .include() parameter on Parse.Query to specify which pointers should be included as full objects in the query result set.



// "Your post has been flagged for being innapropriate/confusing" -Post photo
  // create FlagNews
  
// “X has joined NewVo.” -Their profile pic
  // create  FriendJoinNews

// “X has left a suggestion on your look” -Their profile pic + push notification
  // create SuggestionNews with friend
// "Your post has X new Votes"  -Post photos
// “X needs your advice.” - Friend profile pic
  // AdviceRequestNews