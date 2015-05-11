// curl -X POST \
// -H "X-Parse-Application-Id: Q18jrhbRAM2DElR8yiRXyEbPGHM9RTEWA0zu2Gyq" \
// -H "X-Parse-REST-API-Key: 4Nq3vepmYNmki59CMPQ5SgKegmPek6wLMQ17tSi6" \
// -H "Content-Type: application/json" \
// -d '{"user_id": {"__type": "Pointer", "className": "_User", "objectId": "sHUBJBqtXN"},
//   "post_id":{"__type": "Pointer", "className": "Post", "objectId": "nP8NWmi0ul"}, 
//     "vote": 1}' \
// https://api.parse.com/1/classes/Vote

// Creates news and sends push notifications when posts receive 3,10,50,100,200 votes
Parse.Cloud.afterSave("Vote", function(request) {
  Parse.Cloud.useMasterKey();
  var postQuery = new Parse.Query("Post");
  postQuery.get(request.object.get("post_id").id, {
    success: function(post) {
      var allVotes, number, superUser, user, votes;
      number = request.object.get("vote");
      if (number === 0) {
        post.increment("votes_0");
        post.increment("counter_0");
      } else {
        post.increment("votes_1");
        post.increment("counter_1");
      }
      userPointer = request.object.get("user_id")
      post.addUnique("voted_on_array", userPointer.id);
      post.save();
      votes = post.get("voted_on_array").length;
      if (votes === 3 || votes === 10 || votes === 50 || votes === 100 || votes === 200) {
        var User = Parse.Object.extend("User");
        var userQuery = new Parse.Query(User);
        userQuery.get( userPointer.id, {
          success: function(user) {
            var voteNewsPushPermission = user.get("push_vote_news");
            if (voteNewsPushPermission != false) {
              voteNewsPush(votes, userPointer.id, JSON.stringify(post));
            };
          }
        });
        createUpdateVoteNews(votes, userPointer, post);
      };
    }
  });
});
var voteNewsPush = function(votes, userId, postId) {
  var alertCaption, installationQuery, titleCaption;
  if (votes < 200) {
    titleCaption = "Your post got " + votes + " votes.";
    alertCaption = "Your post got " + votes + "  on NewVo.";
  } else {
    titleCaption = "Wow, your post got " + votes + " votes!";
    alertCaption = "Wow, your post got " + votes + " votes on NewVo!";
  }
  var installationQuery = new Parse.Query(Parse.Installation);
  installationQuery.equalTo("publicId", userId);
  Parse.Push.send({
    where: installationQuery,
    data: {
      title: titleCaption,
      alert: alertCaption,
      badge: "Increment",
      action: "NewVotes",
      postId: postId
    }
  });
};
var createUpdateVoteNews = function(votes, userPointer, post) {
  var VoteNews = Parse.Object.extend("VoteNews");
  var voteNewsQuery = new Parse.Query(VoteNews);
  voteNewsQuery.equalTo("user_id", userPointer);
  voteNewsQuery.equalTo("post_id", post);
  voteNewsQuery.first({
    success: function(voteNews) {
      var caption = "Your post got " + votes + " votes."
      if (voteNews != undefined) {
        voteNews.set({
          votes: votes, 
          viewed: false,
          caption: caption
        });
      }
      else {
        var VoteNews = Parse.Object.extend("VoteNews");
        var voteNews = new VoteNews();
        voteNews.set({
          votes: votes, 
          viewed: false,
          user_id: userPointer,
          post_id: post,
          caption: caption
        });
      };
      voteNews.save();
    }
  });
};
