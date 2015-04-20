Create Vote
curl -X POST \
-H "X-Parse-Application-Id: Q18jrhbRAM2DElR8yiRXyEbPGHM9RTEWA0zu2Gyq" \
-H "X-Parse-REST-API-Key: 4Nq3vepmYNmki59CMPQ5SgKegmPek6wLMQ17tSi6" \
-H "Content-Type: application/json" \
-d '{"user_id": {"__type": "Pointer", "className": "_User", "objectId": "sHUBJBqtXN"},
  "post_id":{"__type": "Pointer", "className": "Post", "objectId": "nP8NWmi0ul"}, 
    "vote": 1}' \
https://api.parse.com/1/classes/Vote

Post Pointer
"post_id": {"__type": "Pointer", "className": "Post", "objectId": "nP8NWmi0ul"}

User Pointer
"user_id": {"__type": "Pointer", "className": "_User", "objectId": "sHUBJBqtXN"}

User
"user": {"createdAt":"2015-02-18T01:56:57.093Z","facebook_id":"442341309249616","gender":"female","objectId":"sHUBJBqtXN","profile_pic":{"__type":"File","name":"tfss-d57d6d9d-2511-47c3-9147-6a56f666f2d7-Image.jpg","url":"http://files.parsetfss.com/bee4838b-b51e-4fd7-b3d2-47d9e83691b2/tfss-d57d6d9d-2511-47c3-9147-6a56f666f2d7-Image.jpg"},"public_name":"Malea Sayles","updatedAt":"2015-02-18T01:56:59.707Z","username":"ofuHP9oESTFt51NUWXHNk7Le9"}


Get User
curl -X GET \
-H "X-Parse-Application-Id: Q18jrhbRAM2DElR8yiRXyEbPGHM9RTEWA0zu2Gyq" \
-H "X-Parse-REST-API-Key: 4Nq3vepmYNmki59CMPQ5SgKegmPek6wLMQ17tSi6" \
https://api.parse.com/1/users/sHUBJBqtXN


Parse.Cloud.afterSave "Vote", (request) ->
  Parse.Cloud.useMasterKey()
  postQuery = new Parse.Query("Post")
  postQuery.get request.object.get("post_id").id,
    success: (post) ->
      number = request.object.get("vote")
      user = request.object.get("user_id").id
      superUser = post.get("user_id")
      if number is 0
        post.increment "votes_0"
        post.increment "counter_0"
      else
        post.increment "votes_1"
        post.increment "counter_1"
      post.addUnique "voted_on_array", user
      allVotes = post.get("voted_on_array")
      if allVotes
        votes = allVotes.length
        if votes is 2 or votes is 9 or votes is 49 or votes is 99 or votes is 199
          #   Only send push if user has notification setting != False
          voteNewsPush votes, superUser, post
          createUpdateVoteNews votes, user, post
        else post.set "status", 1  if votes > 1999
      # tally all votes as afterSave so don't need to increment?
      post.save
          

    error: (error) ->
      console.error "Got an error " + error.code + " : " + error.message


voteNewsPush = (votes, superUser, post) ->
  votes++
  if votes < 200
    titleCaption = "You got " + votes + " new votes!"
    alertCaption = "You got " + votes + " votes on your post on NewVo"
  else
    titleCaption = "Wow, you got " + votes + " new votes!"
    alertCaption = "Wow, you got " + votes + " votes on your post on NewVo"
  installationQuery = new Parse.Query(Parse.Installation)
  installationQuery.equalTo "publicId", superUser.id
  Parse.Push.send
    where: installationQuery
    data:
      title: pushTitle
      alert: alertTitle
      badge: "Increment"
      action: "NewVotes"
      searchObjectPost: post.id

createUpdateVoteNews = (votes, user, post) ->
  Parse.Cloud.useMasterKey()
  VoteNews = Parse.Object.extend("VoteNews");
  voteNews = new VoteNews();
   
  voteNews.set("votes", votes);
  voteNews.set("viewed", false);
  voteNews.save()



  # voteNewsQuery = new Parse.Query("VoteNews")
  # voteNewsQuery.equalTo("user_id", user)
  # voteNewsQuery.equalTo("post_id", post)
  # # user and post
  # voteNewsQuery.first().find()
  #   success: (voteNews) ->
  #     # If exists set "viewed" to False
  #   # Else create VoteNews



