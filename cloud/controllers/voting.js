var badPost, createPostFlag, getPost, getPostCreator, getUser, miscategorizedPost;

Parse.Cloud.define("flagPost", function(request, response) {
  Parse.Cloud.useMasterKey();
  getPost(request, response);
});
getPost = function(request, response) {
  var postQuery;
  postQuery = new Parse.Query("Post");
  postQuery.get(request.params.postId, {
    success: function(post) {
      fetchPostCreator(request, response, post);
    },
    error: function(error) {
      response.error("Could not find post by postId");
    }
  });
};
fetchPostCreator = function(request, response, post) {
  var postCreatorPointer;
  postCreatorPointer = post.get("user_id");
  postCreatorPointer.fetch({
    success: function(postCreator) {
      getUser(request, response, postCreator, post);
    },
    error: function(error) {
      response.error("Could not find poster by post pointer");
    }
  });
};
getUser = function(request, response, postCreator, post) {
  var userQuery;
  userQuery = new Parse.Query("User");
  userQuery.get("DETWDbslAU", {
    success: function(user) {
      createPostFlag(request, response, user, postCreator, post);
    },
    error: function(error) {
      response.error("Could not find current user/flagger");
    }
  });
};
createPostFlag = function(request, response, user, postCreator, post) {
  var PostFlag = Parse.Object.extend("PostFlag");
  var postFlag = new PostFlag();
  postFlag.set({
    flagger: user,
    post: post,
    flagged: postCreator,
    reason: request.params.reason
  });
  postFlag.save(null, {
    success: function(postFlag) {
      var reason = postFlag.get("reason")
      if (reason === 0 || reason === 2) {
        badPost(response, post, user);
      } else {
        miscategorizedPost(response, post, postFlag, reason);
      }
    },
    error: function(error) {
      response.error("PostFlag did not save");
    }
  });
};
badPost = function(response, post, user) {
  post.increment("flags");
  post.addUnique("voted_on_array", user.id);
  if (post.get("flags") > 3) {
    post.set("status", 3);
  }
  post.save();
  response.success("Flagged bad post.");
};
miscategorizedPost = function(response, post, postFlag, reason) {
  if (reason === 3) {
    post.increment("styleFlags");
    post.category = 0;
  } else if (reason === 4) {
    post.increment("randomFlags");
    post.category = 1;
  } else if (reason === 5) {
    post.increment("selfieFlags");
    post.category = 2;
  }
  post.save();
  response.success("Flagged miscategorized post.");
};