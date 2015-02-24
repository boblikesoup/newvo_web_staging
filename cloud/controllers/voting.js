// should be an afterSave?
Parse.Cloud.define("flagPost", function(request, response) {
  Parse.Cloud.useMasterKey();
  query = new Parse.Query("Post");
  query.get(request.params.postId, {
    success: function(post) {
      var User = Parse.Object.extend({className: "User"});
      var flaggedUser = new User();
      flaggedUser.id = post.user_id;
      request.user = new User();
      request.user.id = "DETWDbslAU"
      var PostFlag = Parse.Object.extend({className: "PostFlag"});
      var postFlag = new PostFlag();
      postFlag.set("flagger", request.user);
      postFlag.set("post", post);
      postFlag.set("flagged", flaggedUser);
      postFlag.set("reason", request.params.reason);
      return postFlag.save(null, {
        success: function(postFlag) {
          if (postFlag.reason === 0 || 2) {
            return badPost(post, postFlag);
          } else {
            return miscategorizedPost(post, postFlag);
          }
        },
        error: function(error) {
          return response.error("PostFlag did not save");
        }
      });
    },
    error: function(error) {
      return response.error("Could not find post by ID");
    }
  });
});
var badPost = function(post, postFlag) {
  post.increment("flags");
  post.addUnique("voted_on_array", request.user.id);
  if (post.get("flags") > 3) {
    post.set("status", 3);
  }
  post.save();
  return response.success("Flagged bad post.");
};
var miscategorizedPost = function(post, postFlag) {
  if (postFlag.reason === 3) {
    post.increment("styleFlags");
    post.category = 0;
  } else if (postFlag.reason === 4) {
    post.increment("randomFlags");
    post.category = 1;
  } else if (postFlag.reason === 5) {
    post.increment("selfieFlags");
    post.category = 2;
  }
  post.save();
  return response.success("Flagged miscategorized post.");
};