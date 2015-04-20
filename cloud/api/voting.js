// Sends push notifications when posts receive 3,10,50,100,200 votes
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
        voteNewsPush(votes, userPointer.id, post);
        createUpdateVoteNews(votes, userPointer, post);
      };
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });
});
var voteNewsPush = function(votes, userId, post) {
  var alertCaption, installationQuery, titleCaption;
  if (votes < 200) {
    titleCaption = "You got " + votes + " new votes!";
    alertCaption = "You got " + votes + " votes on your post on NewVo";
  } else {
    titleCaption = "Wow, you got " + votes + " new votes!";
    alertCaption = "Wow, you got " + votes + " votes on your post on NewVo";
  }
  installationQuery = new Parse.Query(Parse.Installation);
  installationQuery.equalTo("publicId", userId);
  Parse.Push.send({
    where: installationQuery,
    data: {
      title: titleCaption,
      alert: alertCaption,
      badge: "Increment",
      action: "NewVotes",
      searchObjectPost: post.id
    }
  });
};
var createUpdateVoteNews = function(votes, userPointer, post) {
  var VoteNews = Parse.Object.extend("VoteNews");
  var voteNews = new VoteNews();
  voteNews.set({
    votes: votes, 
    viewed: false,
    user_id: userPointer,
    post_id: post
  });
  voteNews.save();
};

// Old code.  Missing 200 vote notification
// Parse.Cloud.afterSave("Vote", function(request) {
//   Parse.Cloud.useMasterKey();
//   query = new Parse.Query("Post");
//   query.get(request.object.get("post_id").id, {
//     success: function(post) {
//       var number = request.object.get("vote");
//       var user = request.object.get("user_id").id;
//       var allVotes = post.get("voted_on_array");
//       var superUser = post.get("user_id");
//       if (number==0){
//         post.increment("votes_0");
//         post.increment("counter_0");
//         post.addUnique("voted_on_array", user);
//         if(allVotes){
//           if(allVotes.length > 1999){
//             post.set("status", 1);
//           }
//                  //start
//                  if(allVotes.length == 2){
//                   var query = new Parse.Query(Parse.Installation);
//                   query.equalTo("publicId", superUser.id);
//                   Parse.Push.send({
//                     where: query,
//                     data: {
//                       title: "You got 3 votes new votes!",
//                       alert: "You got 3 votes on your post on NewVo",
//                       badge: "Increment",
//                       action: "NewVotes",
//                       searchObjectPost:post.id
//                     }
//                   }, {
//                    success: function() {
//                     response.success("is Done.");
//                   },
//                   error: function(message) {
//                    response.error(message);
//                  }
//                });

//                 }
//   //end



//          //start
//          if(allVotes.length == 9){
//           var query = new Parse.Query(Parse.Installation);

//           query.equalTo("publicId", superUser.id);
//           Parse.Push.send({
//             where: query,
//             data: {
//               title: "You got 10 votes new votes!",
//               alert: "You got 10 votes on your post on NewVo",
//               badge: "Increment",
//               action: "NewVotes",
//               searchObjectPost:post.id
//             }
//           }, {
//            success: function() {
//             response.success("is Done.");
//           },
//           error: function(message) {
//            response.error(message);
//          }
//        });

//         }
//   //end
  
  
//      //start
//      if(allVotes.length == 49){
//       var query = new Parse.Query(Parse.Installation);
//       query.equalTo("publicId", superUser.id);
//       Parse.Push.send({
//         where: query,
//         data: {
//           title: "You got 50 votes new votes!",
//           alert: "You got 50 votes on your post on NewVo",
//           badge: "Increment",
//           action: "NewVotes",
//           searchObjectPost:post.id
//         }
//       }, {
//        success: function() {
//         response.success("is Done.");
//       },
//       error: function(message) {
//        response.error(message);
//      }
//    });

//     }
//   //end
  
  
//      //start
//      if(allVotes.length == 99){
//       var query = new Parse.Query(Parse.Installation);
//       query.equalTo("publicId", superUser.id);
//       Parse.Push.send({
//         where: query,
//         data: {
//           title: "You got 100 votes new votes!",
//           alert: "You got 100 votes on your post on NewVo",
//           badge: "Increment",
//           action: "NewVotes",
//           searchObjectPost:post.id
//         }
//       }, {
//        success: function() {
//         response.success("is Done.");
//       },
//       error: function(message) {
//        response.error(message);
//      }
//    });

//     }
//   //end
 
  
  
// }
// post.save();
// }else{
//   post.increment("votes_1");
//   post.increment("counter_1");
//   post.addUnique("voted_on_array", user);
//   if(allVotes){
//     if(allVotes.length > 1999){
//       post.set("status", 1);
//     }


//            //start
//            if(allVotes.length == 2){
//             var query = new Parse.Query(Parse.Installation);
//             query.equalTo("publicId", superUser.id);
//             Parse.Push.send({
//               where: query,
//               data: {
//                 title: "You got 3 votes new votes!",
//                 alert: "You got 3 votes on your post on NewVo",
//                 badge: "Increment",
//                 action: "NewVotes",
//                 searchObjectPost:post.id
//               }
//             }, {
//              success: function() {
//               response.success("is Done.");
//             },
//             error: function(message) {
//              response.error(message);
//            }
//          });

//           }
//   //end


//        //start
//        if(allVotes.length == 9){
//         var query = new Parse.Query(Parse.Installation);
//         query.equalTo("publicId", superUser.id);
//         Parse.Push.send({
//           where: query,
//           data: {
//             title: "You got 10 votes new votes!",
//             alert: "You got 10 votes on your post on NewVo",
//             badge: "Increment",
//             action: "NewVotes",
//             searchObjectPost:post.id
//           }
//         }, {
//          success: function() {
//           response.success("is Done.");
//         },
//         error: function(message) {
//          response.error(message);
//        }
//      });

//       }
//   //end
  
//        //start
//        if(allVotes.length == 49){
//         var query = new Parse.Query(Parse.Installation);
//         query.equalTo("publicId", superUser.id);
//         Parse.Push.send({
//           where: query,
//           data: {
//             title: "You got 50 votes new votes!",
//             alert: "You got 50 votes on your post on NewVo",
//             badge: "Increment",
//             action: "NewVotes",
//             searchObjectPost:post.id
//           }
//         }, {
//          success: function() {
//           response.success("is Done.");
//         },
//         error: function(message) {
//          response.error(message);
//        }
//      });

//       }
//   //end
  
  
//      //start
//      if(allVotes.length == 99){
//       var query = new Parse.Query(Parse.Installation);
//       query.equalTo("publicId", superUser.id);
//       Parse.Push.send({
//         where: query,
//         data: {
//           title: "You got 100 votes new votes!",
//           alert: "You got 100 votes on your post on NewVo",
//           badge: "Increment",
//           action: "NewVotes",
//           searchObjectPost:post.id
//         }
//       }, {
//        success: function() {
//         response.success("is Done.");
//       },
//       error: function(message) {
//        response.error(message);
//      }
//    });

//     }
//   //end 
// }
// post.save();
// }

// },
// error: function(error) {
//   console.error("Got an error " + error.code + " : " + error.message);
// }
// });
// });