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
// Fetch news (only new that certain installations haven't seen?)

// “Your post has reached 3/10/50/100 votes.” “WOW!  Your post has reached 200 votes!” - image of one/both posts in circle
// Vote afterSave
//   Create VoteNews if does not exist
//     Else update votes and reset viewed to False
//   Only send push if user has notification setting != False



// “Someone has a new suggestion for your look” (profile pic if was a friend you tagged, else letter)
  // create SuggestionNews ()
// “X has left a suggestion on your look” -Their profile pic
  // create SuggestionNews with friend
// “X needs your advice.” - Friend profile pic
  // AdviceRequestNews
// “X has joined NewVo.” -Their profile pic
  // create  FriendJoinNews
// "Your post has been flagged for being innapropriate/confusing"
  // create FlagNews
