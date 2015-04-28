// // If tagged users, send push and create AskAdviceNews

// curl -X POST \
// -H "X-Parse-Application-Id: Q18jrhbRAM2DElR8yiRXyEbPGHM9RTEWA0zu2Gyq" \
// -H "X-Parse-REST-API-Key: 4Nq3vepmYNmki59CMPQ5SgKegmPek6wLMQ17tSi6" \
// -H "Content-Type: application/json" \
// -d '{"user_tags": ["dPYDIVvhHD"], "user_id":  {"__type":"Pointer", "className": "_User", "objectId":"dPYDIVvhHD"}}' \
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
  console.log(caption);
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