// // If tagged users, send push and create AskAdviceNews
// Parse.Cloud.afterSave("Post", function(request) {
//   Parse.Cloud.useMasterKey();
  
//   var postQuery = new Parse.Query("Post");
//   postQuery.get(request.object.get("post_id").id, {
//     success: function(post) {
//       var allVotes, number, superUser, user, votes;
//       number = request.object.get("vote");
//       userId = request.object.get("user_id").id;
//       userIds = request.object.get("user_ids");
//       post.addUnique("user_tags", userId);
//       post.save();
//       superUser = post.get("user_id");
//       votes = post.get("voted_on_array").length;
//       if (userIds) {
//         // voteNewsPush(request, votes, superUser, post);
//         createUpdateVoteNews(votes, request.user_id, post);
//       };
//     },
//     error: function(error) {
//       console.error("Got an error " + error.code + " : " + error.message);
//     }
//   });
// });
// var askAdvicePush = function(request, superUser, post) {
//   var installationQuery = new Parse.Query(Parse.Installation);
//   // Send a push to all installations matching any of these emails.
//   query.containedIn("publicId", request.params.userIDS);
//   Parse.Push.send({
//    where: query,
//    data: {
//     title: "Your friend asked for your advice",
//     alert: "Your friend X asked for your advice",
//     badge: "Increment",
//     action: "Posts",
//     searchObjectPost:request.params.searchObjectPost
//   }
// };

// var createAskAdviceNews = function(votes, userPointer, post) {
//   var VoteNews = Parse.Object.extend("VoteNews");
//   var voteNews = new VoteNews();
//   console.log("post " + post)
//   console.log("user "+ userPointer)
//   //Need to create Parse user and post pointer objects
//   voteNews.set({
//     votes: votes, 
//     viewed: false,
//     user_id: userPointer,
//     post_id: post
//   });
//   voteNews.save();
// };



// Parse.Cloud.define("unfavorite", function(request, response) {
//   Parse.Cloud.useMasterKey();
//   var suggestionId=request.params.favoriteId;
//   var Favorite = Parse.Object.extend("Favorite");
//   var favoriteQuery = new Parse.Query(Favorite);
//   favoriteQuery.get(favoriteId, {
//     success: function(suggestion) {
//       favorite.set("status", 1);
//       favorite.save();
//     },
//     error: function(object, error) {
//       response.error("Error fnding favorite by Id.");
//     }
//   });
// });

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
