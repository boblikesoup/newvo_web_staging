// curl -X POST \
// -H "X-Parse-Application-Id: Q18jrhbRAM2DElR8yiRXyEbPGHM9RTEWA0zu2Gyq" \
// -H "X-Parse-REST-API-Key: 4Nq3vepmYNmki59CMPQ5SgKegmPek6wLMQ17tSi6" \
// -H "Content-Type: application/json" \
// -d '{"user_id":  {"__type":"Pointer", "className": "_User", "objectId":"dPYDIVvhHD"}, "post_id": {"__type": "Pointer", "className": "Post", "objectId": "nP8NWmi0ul"}}' \
// https://api.parse.com/1/classes/Suggestion

// Need to check if FB friends

// Increment suggestion counter + push & news
Parse.Cloud.afterSave("Suggestion", function(request) {
  Parse.Cloud.useMasterKey();
  var suggestion = request.object;
  var postId = suggestion.get("post_id").id;
  var Post = Parse.Object.extend("Post");
  var postQuery = new Parse.Query(Post);
  postQuery.include("user_id");
  postQuery.get( postId, {
    success: function(post) {
      post.increment("suggestions");
      post.save();
      var postCreator = post.get("user_id");
      var suggester = suggestion.get("user_id");
      if (suggester.id != postCreator.id) {
        createSuggestionNews(postCreator, postId, suggestion);
      }
    }
  });
});
var createSuggestionNews = function(postCreator, postId, suggestion) {
  suggestionCreatorId = suggestion.get("user_id").id;
  var SuggestionCreator = Parse.Object.extend("User");
  var suggestionCreatorQuery = new Parse.Query(SuggestionCreator);
  suggestionCreatorQuery.get( suggestionCreatorId, {
    success: function(suggestionCreator) {
      
      // FB API request for friends of postCreator
      // Check if facebook_id of suggestionCreator is in array of friendIds
      // if (friends) {
      //   var caption = "Your friend " + suggestionCreator.get("public_name") + " left a comment on your post."
      // }
      // else {
      //   var caption = "Someone left a comment on your post."
      // }
      var caption = "Ima filler"
      var postPointer = {"__type": "Pointer", "className": "Post", "objectId": postId}
      var SuggestionNews = Parse.Object.extend("SuggestionNews");
      var suggestionNews = new SuggestionNews();
      suggestionNews.set({ 
        viewed: false,
        user_id: postCreator,
        post_id: postPointer,
        suggester_id: suggestionCreator,
        caption: caption
      });
      suggestionNews.save();
      var suggestionPushPermission = postCreator.get("push_suggestion_news");
      if (suggestionPushPermission != false) {
          suggestionPush(postCreator.id, postId, caption);
      };

    }
  });
};
var suggestionPush = function(postCreatorId, postId, caption) {
  var installationQuery = new Parse.Query(Parse.Installation);
  installationQuery.equalTo("publicId", postCreatorId);
  Parse.Push.send({
    where: installationQuery,
    data: {
      title: caption,
      alert: caption,
      badge: "Increment",
      action: "SuggestionNotification",
      postId:  postId
    }
  });
};


// curl -X POST \
// -H "X-Parse-Application-Id: Q18jrhbRAM2DElR8yiRXyEbPGHM9RTEWA0zu2Gyq" \
// -H "X-Parse-REST-API-Key: 4Nq3vepmYNmki59CMPQ5SgKegmPek6wLMQ17tSi6" \
// -H "Content-Type: application/json" \
// -d '{"user_tags": ["dPYDIVvhHD"], "user_id":  {"__type":"Pointer", "className": "_User", "objectId":"dPYDIVvhHD"}}' \
// https://api.parse.com/1/classes/Post

// If tagged users, send push and create AskAdviceNews
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
        var askAdvicePushPermission = user.get("push_ask_advice_news")
        var taggingUserName = user.get("public_name")
        if (askAdvicePushPermission != false) {
          askAdvicePush(taggingUserName, taggedUserIds, post.id);
        }
        createAskAdviceNews(taggedUserIds, user, taggingUserName, post);
      }
    });
  };
});
var askAdvicePush = function(taggingUserName, taggedUserIds, postId) {
  for (var i = 0; i < taggedUserIds.length; i++) {
    var installationQuery = new Parse.Query(Parse.Installation);
    installationQuery.equalTo("publicId", taggedUserIds[i]);
    Parse.Push.send({
      where: installationQuery,
      data: {
        title: taggingUserName + " asked for your advice.",
        alert: taggingUserName + " asked for your advice.",
        badge: "Increment",
        action: "AdviceRequest",
        postId:  postId,
      }
    });
  };
};
var createAskAdviceNews = function(taggedUsersIds, user, taggingUserName, post) {
  var caption = taggingUserName + " asked for your advice.";
  for (var i = 0; i < taggedUsersIds.length; i++) {
    var taggedUserPointer = { "__type":"Pointer", "className":"_User", "objectId":taggedUsersIds[i] };
    var AskAdviceNews = Parse.Object.extend("AskAdviceNews");
    var askAdviceNews = new AskAdviceNews();
    askAdviceNews.set({ 
      viewed: false,
      user_id: taggedUserPointer,
      post_id: post,
      tagger_id: user,
      caption: caption
    });
    askAdviceNews.save();
  };
};