// // If tagged users, send push and create AskAdviceNews
Parse.Cloud.afterSave("Post", function(request) {
  Parse.Cloud.useMasterKey();
  var post = request.object
  var taggedUserIds = post.get("user_tags");
  console.log("tagged user ids " + taggedUserIds);
  if (taggedUserIds) {
    var userId = post.get("user_id").id
    userId.fetch({
      success: function(user) {
        // TEST QUERY BY POINTER TYPE
        // askAdvicePush(taggedUserIds, post);
        // createAskAdviceNews(taggedUsers, userPointer, post.id);
      };
    });
  };
});
var askAdvicePush = function(taggedUserIds, postId) {
  for (var i = 0; i++; taggedUserIds) {
    var installationQuery = new Parse.Query(Parse.Installation);
    // Send a push to all installations matching any of these emails.
    installationQuery.containedIn("publicId", taggedUserIds[i]);
    Parse.Push.send({
     where: installationQuery,
     data: {
      title: ""  + "asked for your advice.",
      alert: ""  + "asked for your advice.",
      badge: "Increment",
      action: "AdviceRequest",
      postId:  postId,
      friendName:request.params.searchObjectPost
    };
  };
};
var createAskAdviceNews = function(votes, userPointer, post) {
  var VoteNews = Parse.Object.extend("VoteNews");
  var voteNews = new VoteNews();
  console.log("post " + post)
  console.log("user "+ userPointer)
  //Need to create Parse user and post pointer objects
  voteNews.set({
    votes: votes, 
    viewed: false,
    user_id: userPointer,
    post_id: post
  });
  voteNews.save();
};



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
// use the .include() parameter on Parse.Query to specify which pointers should be included as full objects in the query result set.

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
