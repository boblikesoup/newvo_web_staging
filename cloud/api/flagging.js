 // curl -X POST \
//   -H "X-Parse-Application-Id: Q18jrhbRAM2DElR8yiRXyEbPGHM9RTEWA0zu2Gyq" \
//   -H "X-Parse-REST-API-Key: 4Nq3vepmYNmki59CMPQ5SgKegmPek6wLMQ17tSi6" \
//   -H "Content-Type: application/json" \
//   -d '{"postId": "nP8NWmi0ul", "reason": 3}' \
//   https://api.parse.com/1/functions/flagPost

// Adjust to accept user object instead of hardcoded.  Edit to be an afterSave
Parse.Cloud.define("flagPost", function(request, response) {
  Parse.Cloud.useMasterKey();
  getPost(request, response);
});
var getPost = function(request, response) {
  var postQuery = new Parse.Query("Post");
  postQuery.get(request.params.postId, {
    success: function(post) {
      fetchPostOwner(request, response, post);
    },
    error: function(error) {
      response.error("Could not find post by postId");
    }
  });
};
var fetchPostOwner = function(request, response, post) {
  var postOwnerPointer = post.get("user_id");
  postOwnerPointer.fetch({
    success: function(postOwner) {
      createPostFlag(request, response, postOwner, post);
    },
    error: function(error) {
      response.error("Could not find poster by post pointer");
    }
  });
};
var createPostFlag = function(request, response, postOwner, post) {
  var PostFlag = Parse.Object.extend("PostFlag");
  var postFlag = new PostFlag();
  postFlag.set({
    // Right way to get user?
    flagger: request.user,
    post: post,
    flagged: postOwner,
    reason: request.params.reason
  });
  postFlag.save(null, {
    success: function(postFlag) {
      var reason = postFlag.get("reason")
      if (reason === 0 || reason === 2) {
        badPost(request, response, post, user);
      } else {
        miscategorizedPost(response, post, postFlag, reason);
      }
    },
    error: function(error) {
      response.error("PostFlag did not save");
    }
  });
};
var badPost = function(request, response, post) {
  post.increment("flags");
  post.addUnique("voted_on_array", request.user.id);
  if (post.get("flags") > 3) {
    post.set("status", 3);
  }
  post.save();
  response.success("Flagged bad post.");
};
var miscategorizedPost = function(response, post, postFlag, reason) {
  if (reason === 3) {
    post.increment("styleFlags");
    post.category = 0;
  } else if (reason === 4) {
    post.increment("randomFlags");
    post.category = 1;
  } else if (reason === 5) {
    post.increment("selfieFlags");
    post.category = 2;
  } else {
    response.error("Invalid reason.  Did not increment flags or change post category.")
  };
  post.save();
  response.success("Flagged miscategorized post.");
};