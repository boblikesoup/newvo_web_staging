// Posts where 
// 	User is in user_tags
// 	User hasnt voted on and isnt self
// 	(viewable_by) status = 0
// 	category matches
// 	Limit 6 most recent

// If posts.count < 6
// 	Posts where
// 		User hasnt voted on and isnt self
// 		status = 0
// 		category matches
// 		that match age range (ageRange: everybody = 0, myAge = 1) (function createAgeRange(user.age))
// 		Limit (6-posts.count) most recent


// If posts.count < 6
// 	Posts where
// 		User hasnt voted on and isnt self
// 		status = 0
// 		category maches
// 		post.age = undefined
// 		Limit (6-posts.count) most recent

// Select keys @"user_id", @"caption", @"photo_1", @"photo_2", @"votes_0", @"votes_1", @"suggestions", @"video_1", @"video_2"]


Parse.Cloud.define("fetchVotingPosts", function(request, response) {
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


var createAgeRange = function(age) {
	var ageRange = {};
	if (age<11){
		ageRange.lowerBound = 1;
		ageRange.upperBound = 12;
	} 
	else if (age <= 17){
		ageRange.lowerBound = age - 2;
		ageRange.upperBound = age + 2;
	}
	else if (age >= 18) {
		ageRange.lowerBound = Math.round(age/ 2 + 7);
		ageRange.upperBound = (age - 7) * 2;
	}
	else if (age === undefined) {
		ageRange.lowerBound = 1;
		ageRange.upperBound = 99;
	}

	return ageRange;
};

// Age selector defaults to 20