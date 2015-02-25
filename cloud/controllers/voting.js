var badPost, createPostFlag, getPost, getPostCreator, getUser, miscategorizedPost;

Parse.Cloud.define("flagPost", function(request, response) {
  Parse.Cloud.useMasterKey();
  Parse.Cloud.run()
  // Fix callback promises
  getPost(request);
});
getPost = function(request) {
  var postQuery;
  postQuery = new Parse.Query("Post");
  postQuery.get(request.params.postId, {
    success: function(post) {
      fetchPostCreator(request, post);
    },
    error: function(error) {
      response.error("Could not find post by postId");
    }
  });
};
fetchPostCreator = function(request, post) {
  var postCreatorPointer;
  postCreatorPointer = post.get("user_id");
  postCreatorPointer.fetch({
    success: function(postCreator) {
      getUser(request, postCreator, post);
    },
    error: function(error) {
      response.error("Could not find poster by post pointer");
    }
  });
};
getUser = function(request, postCreator, post) {
  var userQuery;
  userQuery = new Parse.Query("User");
  userQuery.get("DETWDbslAU", {
    success: function(user) {
      createPostFlag(request, user, postCreator, post);
    },
    error: function(error) {
      response.error("Could not find current user/flagger");
    }
  });
};
createPostFlag = function(request, user, postCreator, post) {
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
      if (postFlag.reason === 0 || 2) {
        badPost(post, user);
      } else {
        miscategorizedPost(post, postFlag);
      }
    },
    error: function(error) {
      response.error("PostFlag did not save");
    }
  });
};
badPost = function(post, user) {
  post.increment("flags");
  post.addUnique("voted_on_array", user.id);
  if (post.get("flags") > 3) {
    post.set("status", 3);
  }
  post.save();
  response.success("Flagged bad post.");
};
miscategorizedPost = function(post, postFlag) {
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
  response.success("Flagged miscategorized post.");
};