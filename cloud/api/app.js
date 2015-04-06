require('cloud/api/voting.js');
require('cloud/api/flagging.js');
require('cloud/api/suggestions.js');
require('cloud/api/post-querying.js')

// Test if API is working
// Parse.Cloud.define("hello", function(request, response) {
//   response.success("Hello world!");
// });

// curl -X POST \
//   -H "X-Parse-Application-Id: Q18jrhbRAM2DElR8yiRXyEbPGHM9RTEWA0zu2Gyq" \
//   -H "X-Parse-REST-API-Key: 4Nq3vepmYNmki59CMPQ5SgKegmPek6wLMQ17tSi6" \
//   -H "Content-Type: application/json" \
//   -d '{}' \
//   https://api.parse.com/1/functions/hello



Parse.Cloud.define("deletePost", function(request, response) {
  Parse.Cloud.useMasterKey();
  var postId=request.params.postId;
  var Post = Parse.Object.extend("Post");
  var query = new Parse.Query(Post);

  query.get(postId, {
    success: function(postObject) {
      postObject.set("status", 2);
      postObject.save();
      response.success("post deleted");
    },
    error: function(object, error) {
      response.error("post not deleted");
    }
  });
});

Parse.Cloud.define("deactivatePost", function(request, response) {
  Parse.Cloud.useMasterKey();
  var postId=request.params.postId;
  var Post = Parse.Object.extend("Post");
  var query = new Parse.Query(Post);

  query.get(postId, {
    success: function(postObject) {
      postObject.set("status", 1);
      postObject.save();
      response.success("post deleted");
    },
    error: function(object, error) {
      response.error("post not deleted");
    }
  });

});


Parse.Cloud.define("clearPost", function(request, response) {
  Parse.Cloud.useMasterKey();
  var postId=request.params.postId;
  var Post = Parse.Object.extend("Post");
  var query = new Parse.Query(Post);
  query.get(postId, {
    success: function(postObject) {
      postObject.set("counter_0", 0);
      postObject.set("counter_1", 0);
      postObject.save();
      response.success("post cleared");
    },
    error: function(object, error) {
      response.error("post not cleared");
    }
  });

});


Parse.Cloud.define("updateGroupNotifications", function(request, response) {
  Parse.Cloud.useMasterKey();

  var groupId=request.params.groupId;
  var push_ids=request.params.push_ids;

  var Group = Parse.Object.extend("Group");
  var query = new Parse.Query(Group);

  query.get(groupId, {
    success: function(groupObject) {
      groupObject.set("push_ids", push_ids);
      groupObject.save();
      response.success("group update");
    },
    error: function(object, error) {
      response.error("group not updated");
    }
  });

});


Parse.Cloud.define("leaveGroup", function(request, response) {
  Parse.Cloud.useMasterKey();

  var groupId=request.params.groupId;
  var push_ids=request.params.push_ids;
  var member_ids=request.params.member_ids;

  var Group = Parse.Object.extend("Group");
  var query = new Parse.Query(Group);

  query.get(groupId, {
    success: function(groupObject) {
      groupObject.set("push_ids", push_ids);
      groupObject.set("member_ids", member_ids);
      groupObject.save();
      response.success("group update");
    },
    error: function(object, error) {
      response.error("group not updated");
    }
  });

});


Parse.Cloud.job("voteFix", function(request, status) {
  // Set up to modify user data
  Parse.Cloud.useMasterKey();
  var counter = 0;
  // Query for all users
  var Posts = Parse.Object.extend("Post");
  var query = new Parse.Query(Posts);
  query.each(function(newPost) {
   newPost.set("counter_0", 0);
   newPost.set("counter_1", 0);
   newPost.save();


   if (counter % 100 === 0) {
        // Set the  job's progress status
        status.message(counter + " posts processed.");
      }
      counter += 1;
      return newPost.save();
    }).then(function() {
    // Set the job's success status
    status.success("Migration completed successfully.");
  }, function(error) {
    // Set the job's error status
    status.error("Uh oh, something went wrong.");
  });
  });




Parse.Cloud.define("push_badge_notifications", function(request, response) {
 var query = new Parse.Query(Parse.Installation);
  // Send a push to all installations matching any of these emails.
  query.containedIn("publicId", request.params.userIDS);

  Parse.Push.send({
   where: query,
   data: {
    title: "NewVo Group Update",
    alert: request.params.msg,
    badge: "Increment",
    action: "Groups"
  }
}, {
 success: function() {
  response.success("Done.");
},
error: function(message) {
 response.error(message);
}
});
  
  //response.success("Done.");
});



Parse.Cloud.define("push_tagged_notifications", function(request, response) {
 var query = new Parse.Query(Parse.Installation);
  // Send a push to all installations matching any of these emails.
  query.containedIn("publicId", request.params.userIDS);

  Parse.Push.send({
   where: query,
   data: {
    title: "NewVo Post Update",
    alert: request.params.msg,
    badge: "Increment",
    action: "Posts",
    searchObjectPost:request.params.searchObjectPost
  }
}, {
 success: function() {
  response.success("is Done.");
},
error: function(message) {
 response.error(message);
}
});
  
  //response.success("is Done.");
});



Parse.Cloud.define("push_comment_notifications", function(request, response) {
 var query = new Parse.Query(Parse.Installation);
  // Send a push to all installations matching any of these emails.
  query.containedIn("publicId", request.params.userIDS);

  Parse.Push.send({
   where: query,
   data: {
    title: "NewVo Comment Update",
    alert: request.params.msg,
    badge: "Increment",
    action: "Comments",
    searchObjectPost:request.params.searchObjectPost
  }
}, {
 success: function() {
  response.success("is Done.");
},
error: function(message) {
 response.error(message);
}
});
  
  //response.success("is Done.");
});




Parse.Cloud.define("clearBadges", function(request, response) {
  Parse.Cloud.useMasterKey();
  var userID=  request.params.userID;
  var query = new Parse.Query("Installation");
  query.equalTo("publicId", userID);
  query.find({
    success: function(results) {

    // Do something with the returned Parse.Object values
    for (var i = 0; i < results.length; i++) { 
      var object = results[i];
      object.set("badge", 0);
      object.save(null, {
        success: function(object) {

        },
        error: function(object, error) {
          console.error("Got an error " + error.code + " : " + error.description);
        }
      });
    }
    response.success("cleared"); 
  },
  error: function(error) {
    response.error("not cleared");
  }
});

});

Parse.Cloud.afterSave("Vote", function(request) {
  Parse.Cloud.useMasterKey();
  query = new Parse.Query("Post");
  query.get(request.object.get("post_id").id, {
    success: function(post) {
      var number =request.object.get("vote");
      var user = request.object.get("user_id").id;
      var allVotes = post.get("voted_on_array");
      var superUser = post.get("user_id");
      if (number==0){
        post.increment("votes_0");
        post.increment("counter_0");
        post.addUnique("voted_on_array", user);
        if(allVotes){
          if(allVotes.length > 1999){
            post.set("status", 1);
          }
                 //start
                 if(allVotes.length == 2){
                  var query = new Parse.Query(Parse.Installation);
                  query.equalTo("publicId", superUser.id);
                  Parse.Push.send({
                    where: query,
                    data: {
                      title: "You got 3 votes new votes!",
                      alert: "You got 3 votes on your post on NewVo",
                      badge: "Increment",
                      action: "NewVotes",
                      searchObjectPost:post.id
                    }
                  }, {
                   success: function() {
                    response.success("is Done.");
                  },
                  error: function(message) {
                   response.error(message);
                 }
               });

                }
  //end



         //start
         if(allVotes.length == 9){
          var query = new Parse.Query(Parse.Installation);

          query.equalTo("publicId", superUser.id);
          Parse.Push.send({
            where: query,
            data: {
              title: "You got 10 votes new votes!",
              alert: "You got 10 votes on your post on NewVo",
              badge: "Increment",
              action: "NewVotes",
              searchObjectPost:post.id
            }
          }, {
           success: function() {
            response.success("is Done.");
          },
          error: function(message) {
           response.error(message);
         }
       });

        }
  //end
  
  
     //start
     if(allVotes.length == 49){
      var query = new Parse.Query(Parse.Installation);
      query.equalTo("publicId", superUser.id);
      Parse.Push.send({
        where: query,
        data: {
          title: "You got 50 votes new votes!",
          alert: "You got 50 votes on your post on NewVo",
          badge: "Increment",
          action: "NewVotes",
          searchObjectPost:post.id
        }
      }, {
       success: function() {
        response.success("is Done.");
      },
      error: function(message) {
       response.error(message);
     }
   });

    }
  //end
  
  
     //start
     if(allVotes.length == 99){
      var query = new Parse.Query(Parse.Installation);
      query.equalTo("publicId", superUser.id);
      Parse.Push.send({
        where: query,
        data: {
          title: "You got 100 votes new votes!",
          alert: "You got 100 votes on your post on NewVo",
          badge: "Increment",
          action: "NewVotes",
          searchObjectPost:post.id
        }
      }, {
       success: function() {
        response.success("is Done.");
      },
      error: function(message) {
       response.error(message);
     }
   });

    }
  //end
 
  
  
}
post.save();
}else{
  post.increment("votes_1");
  post.increment("counter_1");
  post.addUnique("voted_on_array", user);
  if(allVotes){
    if(allVotes.length > 1999){
      post.set("status", 1);
    }


           //start
           if(allVotes.length == 2){
            var query = new Parse.Query(Parse.Installation);
            query.equalTo("publicId", superUser.id);
            Parse.Push.send({
              where: query,
              data: {
                title: "You got 3 votes new votes!",
                alert: "You got 3 votes on your post on NewVo",
                badge: "Increment",
                action: "NewVotes",
                searchObjectPost:post.id
              }
            }, {
             success: function() {
              response.success("is Done.");
            },
            error: function(message) {
             response.error(message);
           }
         });

          }
  //end


       //start
       if(allVotes.length == 9){
        var query = new Parse.Query(Parse.Installation);
        query.equalTo("publicId", superUser.id);
        Parse.Push.send({
          where: query,
          data: {
            title: "You got 10 votes new votes!",
            alert: "You got 10 votes on your post on NewVo",
            badge: "Increment",
            action: "NewVotes",
            searchObjectPost:post.id
          }
        }, {
         success: function() {
          response.success("is Done.");
        },
        error: function(message) {
         response.error(message);
       }
     });

      }
  //end
  
       //start
       if(allVotes.length == 49){
        var query = new Parse.Query(Parse.Installation);
        query.equalTo("publicId", superUser.id);
        Parse.Push.send({
          where: query,
          data: {
            title: "You got 50 votes new votes!",
            alert: "You got 50 votes on your post on NewVo",
            badge: "Increment",
            action: "NewVotes",
            searchObjectPost:post.id
          }
        }, {
         success: function() {
          response.success("is Done.");
        },
        error: function(message) {
         response.error(message);
       }
     });

      }
  //end
  
  
     //start
     if(allVotes.length == 99){
      var query = new Parse.Query(Parse.Installation);
      query.equalTo("publicId", superUser.id);
      Parse.Push.send({
        where: query,
        data: {
          title: "You got 100 votes new votes!",
          alert: "You got 100 votes on your post on NewVo",
          badge: "Increment",
          action: "NewVotes",
          searchObjectPost:post.id
        }
      }, {
       success: function() {
        response.success("is Done.");
      },
      error: function(message) {
       response.error(message);
     }
   });

    }
  //end
  

  
}
post.save();
}

},
error: function(error) {
  console.error("Got an error " + error.code + " : " + error.message);
}
});
});
