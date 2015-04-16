Parse.Cloud.afterSave "Vote", (request) ->
  Parse.Cloud.useMasterKey()
  query = new Parse.Query("Post")
  query.get request.object.get("post_id").id,
    success: (post) ->
      number = request.object.get("vote")
      user = request.object.get("user_id").id
      allVotes = post.get("voted_on_array")
      superUser = post.get("user_id")
      if number is 0
        post.increment "votes_0"
        post.increment "counter_0"
      else
        post.increment "votes_1"
        post.increment "counter_1"

      post.addUnique "voted_on_array", user

      if allVotes
        if allVotes.length is 2
          voteNewsPush(allVotes.length, superUser, post);
        else if allVotes.length > 1999
          post.set "status", 1  

        post.save()

    error: (error) ->
      console.error "Got an error " + error.code + " : " + error.message

voteNewsPush = (votes, superUser, post) ->
  votes++
  if votes < 200
    titleCaption = "You got " + votes + " new votes!"
    alertCaption = "You got " + votes + " votes on your post on NewVo"
  else
    titleCaption = "Wow, you got " + votes++ + " new votes!"
    alertTitle = "Wow, you got " + votes++ + " votes on your post on NewVo"
  query = new Parse.Query(Parse.Installation)
  query.equalTo "publicId", superUser.id
  Parse.Push.send
    where: query
    data:
      title: pushTitle
      alert: alertTitle
      badge: "Increment"
      action: "NewVotes"
      searchObjectPost: post.id