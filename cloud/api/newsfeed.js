// // If tagged users, send push and create AskAdviceNews

// curl -X POST \
// -H "X-Parse-Application-Id: Q18jrhbRAM2DElR8yiRXyEbPGHM9RTEWA0zu2Gyq" \
// -H "X-Parse-REST-API-Key: 4Nq3vepmYNmki59CMPQ5SgKegmPek6wLMQ17tSi6" \
// -H "Content-Type: application/json" \
// -d '{"user_tags": ["6DGlPpWlJr"], "user_id":  {"__type":"Pointer", "className": "_User", "objectId":"6DGlPpWlJr"}}' \
// https://api.parse.com/1/classes/Post

Parse.Cloud.afterSave("Post", function(request) {
  Parse.Cloud.useMasterKey();
  var post = request.object
  var taggedUserIds = post.get("user_tags");
  if (taggedUserIds) {
    var userId = post.get("user_id").id;
    var User = Parse.Object.extend("User");
    var userQuery = new Parse.Query(User);
    userQuery.get( userId, {
      success: function(user) {
        console.log("got user " + JSON.stringify(user));
        // createAskAdviceNews(taggedUsers, userPointer, post.id);
        // askAdvicePush(taggedUserIds, post);
      }
    });
  };
});
// var askAdvicePush = function(taggedUserIds, postId) {
//   for (var i = 0; i++; taggedUserIds) {
//     var installationQuery = new Parse.Query(Parse.Installation);
//     // Send a push to all installations matching any of these emails.
//     installationQuery.containedIn("publicId", taggedUserIds[i]);
//     Parse.Push.send({
//      where: installationQuery,
//      data: {
//       title: ""  + "asked for your advice.",
//       alert: ""  + "asked for your advice.",
//       badge: "Increment",
//       action: "AdviceRequest",
//       postId:  postId,
//       friendName:request.params.searchObjectPost
//     }
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