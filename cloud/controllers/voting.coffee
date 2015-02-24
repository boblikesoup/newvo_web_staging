require "cloud/controllers/voting.js"

# Eventually scale to judge flags based on number of votes
Parse.Cloud.define "flagPost", (request, response) ->
  Parse.Cloud.useMasterKey()
  query = new Parse.Query("Post")
  query.get request.params.postId,
    success: (post) ->
      User = Parse.Object.extend(className: "User")
      user = new User()
      user.id = request.params.flaggedID
      PostFlag = Parse.Object.extend(className: "PostFlag")
      postFlag = new PostFlag()
      postFlag.set "flagger", request.user
      postFlag.set "post", post
      postFlag.set "flagged", user
      postFlag.set "reason", request.params.reason
      postFlag.save null,
        success: (postFlag) ->
          if postFlag.reason is 0 or 2
            badPost(post, postFlag)
          else
            miscategorizedPost(post, postFlag)
        error: (error) ->
          response.error "PostFlag did not save"
    error: (error) ->
      response.error "Could not find post by ID"

badPost = (post, postFlag) ->
    post.increment "flags"
    post.addUnique "voted_on_array", request.user.id
    numbOfFlags = post.get("flags")
    if numbOfFlags > 3
      post.set "status", 3
    post.save()
    response.success "Flagged bad post."  

miscategorizedPost = (post, postFlag) ->
  if postFlag.reason is 3
    post.increment "styleFlags"
    post.category = 0
  else if postFlag.reason is 4
    post.increment "randomFlags"
    post.category = 1
  else if postFlag.reason is 5
    post.increment "selfieFlags"
    post.category = 2
  post.save()
  response.success "Flagged miscategorized post."



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
        post.addUnique "voted_on_array", user
        if allVotes
          post.set "status", 1  if allVotes.length > 1999
          
          #start
          if allVotes.length is 2
            query = new Parse.Query(Parse.Installation)
            query.equalTo "publicId", superUser.id
            Parse.Push.send
              where: query
              data:
                title: "You got 3 votes new votes!"
                alert: "You got 3 votes on your post on NewVo"
                badge: "Increment"
                action: "NewVotes"
                searchObjectPost: post.id
            ,
              success: ->
                response.success "is Done."

              error: (message) ->
                response.error message

          
          #end
          
          #start
          if allVotes.length is 9
            query = new Parse.Query(Parse.Installation)
            query.equalTo "publicId", superUser.id
            Parse.Push.send
              where: query
              data:
                title: "You got 10 votes new votes!"
                alert: "You got 10 votes on your post on NewVo"
                badge: "Increment"
                action: "NewVotes"
                searchObjectPost: post.id
            ,
              success: ->
                response.success "is Done."

              error: (message) ->
                response.error message

          
          #end
          
          #start
          if allVotes.length is 49
            query = new Parse.Query(Parse.Installation)
            query.equalTo "publicId", superUser.id
            Parse.Push.send
              where: query
              data:
                title: "You got 50 votes new votes!"
                alert: "You got 50 votes on your post on NewVo"
                badge: "Increment"
                action: "NewVotes"
                searchObjectPost: post.id
            ,
              success: ->
                response.success "is Done."

              error: (message) ->
                response.error message

          
          #end
          
          #start
          if allVotes.length is 99
            query = new Parse.Query(Parse.Installation)
            query.equalTo "publicId", superUser.id
            Parse.Push.send
              where: query
              data:
                title: "You got 100 votes new votes!"
                alert: "You got 100 votes on your post on NewVo"
                badge: "Increment"
                action: "NewVotes"
                searchObjectPost: post.id
            ,
              success: ->
                response.success "is Done."

              error: (message) ->
                response.error message

        
        #end
        post.save()
      else
        post.increment "votes_1"
        post.increment "counter_1"
        post.addUnique "voted_on_array", user
        if allVotes
          post.set "status", 1  if allVotes.length > 1999
          
          #start
          if allVotes.length is 2
            query = new Parse.Query(Parse.Installation)
            query.equalTo "publicId", superUser.id
            Parse.Push.send
              where: query
              data:
                title: "You got 3 votes new votes!"
                alert: "You got 3 votes on your post on NewVo"
                badge: "Increment"
                action: "NewVotes"
                searchObjectPost: post.id
            ,
              success: ->
                response.success "is Done."

              error: (message) ->
                response.error message

          
          #end
          
          #start
          if allVotes.length is 9
            query = new Parse.Query(Parse.Installation)
            query.equalTo "publicId", superUser.id
            Parse.Push.send
              where: query
              data:
                title: "You got 10 votes new votes!"
                alert: "You got 10 votes on your post on NewVo"
                badge: "Increment"
                action: "NewVotes"
                searchObjectPost: post.id
            ,
              success: ->
                response.success "is Done."

              error: (message) ->
                response.error message

          
          #end
          
          #start
          if allVotes.length is 49
            query = new Parse.Query(Parse.Installation)
            query.equalTo "publicId", superUser.id
            Parse.Push.send
              where: query
              data:
                title: "You got 50 votes new votes!"
                alert: "You got 50 votes on your post on NewVo"
                badge: "Increment"
                action: "NewVotes"
                searchObjectPost: post.id
            ,
              success: ->
                response.success "is Done."

              error: (message) ->
                response.error message

          
          #end
          
          #start
          if allVotes.length is 99
            query = new Parse.Query(Parse.Installation)
            query.equalTo "publicId", superUser.id
            Parse.Push.send
              where: query
              data:
                title: "You got 100 votes new votes!"
                alert: "You got 100 votes on your post on NewVo"
                badge: "Increment"
                action: "NewVotes"
                searchObjectPost: post.id
            ,
              success: ->
                response.success "is Done."

              error: (message) ->
                response.error message

        
        #end
        post.save()

    error: (error) ->
      console.error "Got an error " + error.code + " : " + error.message


Parse.Cloud.define "userFlaggedAndMovedOn", (request, response) ->
  Parse.Cloud.useMasterKey()
  postId = request.params.postId
  user = request.params.userId
  query = new Parse.Query("Post")
  query.get postId,
    success: (post) ->
      post.addUnique "voted_on_array", user
      post.save()
      response.success "Flagged recorded and moved on. "

    error: (error) ->
      console.error "Got an error " + error.code + " : " + error.message


Parse.Cloud.afterSave "Suggestion", (request) ->
  Parse.Cloud.useMasterKey()
  query = new Parse.Query("Post")
  query.get request.object.get("post_id").id,
    success: (post) ->
      post.increment "suggestions"
      post.save()

    error: (error) ->
      console.error "Got an error " + error.code + " : " + error.message


Parse.Cloud.define "deleteComment", (request, response) ->
  Parse.Cloud.useMasterKey()
  commentId = request.params.commentId
  Suggestion = Parse.Object.extend("Suggestion")
  query = new Parse.Query(Suggestion)
  query.get commentId,
    success: (postObject) ->
      postObject.set "status", 1
      postObject.save()
      response.success "comment deleted"

    error: (object, error) ->
      response.error "comment not deleted"


Parse.Cloud.define "deletePost", (request, response) ->
  Parse.Cloud.useMasterKey()
  postId = request.params.postId
  Post = Parse.Object.extend("Post")
  query = new Parse.Query(Post)
  query.get postId,
    success: (postObject) ->
      postObject.set "status", 2
      postObject.save()
      response.success "post deleted"

    error: (object, error) ->
      response.error "post not deleted"


Parse.Cloud.define "deactivatePost", (request, response) ->
  Parse.Cloud.useMasterKey()
  postId = request.params.postId
  Post = Parse.Object.extend("Post")
  query = new Parse.Query(Post)
  query.get postId,
    success: (postObject) ->
      postObject.set "status", 1
      postObject.save()
      response.success "post deleted"

    error: (object, error) ->
      response.error "post not deleted"


Parse.Cloud.define "decrimentComments", (request, response) ->
  Parse.Cloud.useMasterKey()
  postId = request.params.postId
  Post = Parse.Object.extend("Post")
  query = new Parse.Query(Post)
  query.get postId,
    success: (postObject) ->
      postObject.increment "suggestions", -2
      postObject.save()
      response.success "post decrimented"

    error: (object, error) ->
      response.error "post not decrimented"


Parse.Cloud.define "clearPost", (request, response) ->
  Parse.Cloud.useMasterKey()
  postId = request.params.postId
  Post = Parse.Object.extend("Post")
  query = new Parse.Query(Post)
  query.get postId,
    success: (postObject) ->
      postObject.set "counter_0", 0
      postObject.set "counter_1", 0
      postObject.save()
      response.success "post cleared"

    error: (object, error) ->
      response.error "post not cleared"


Parse.Cloud.define "updateGroupNotifications", (request, response) ->
  Parse.Cloud.useMasterKey()
  groupId = request.params.groupId
  push_ids = request.params.push_ids
  Group = Parse.Object.extend("Group")
  query = new Parse.Query(Group)
  query.get groupId,
    success: (groupObject) ->
      groupObject.set "push_ids", push_ids
      groupObject.save()
      response.success "group update"

    error: (object, error) ->
      response.error "group not updated"


Parse.Cloud.define "leaveGroup", (request, response) ->
  Parse.Cloud.useMasterKey()
  groupId = request.params.groupId
  push_ids = request.params.push_ids
  member_ids = request.params.member_ids
  Group = Parse.Object.extend("Group")
  query = new Parse.Query(Group)
  query.get groupId,
    success: (groupObject) ->
      groupObject.set "push_ids", push_ids
      groupObject.set "member_ids", member_ids
      groupObject.save()
      response.success "group update"

    error: (object, error) ->
      response.error "group not updated"


Parse.Cloud.job "suggestionCounter", (request, status) ->
  
  # Set up to modify user data
  Parse.Cloud.useMasterKey()
  counter = 0
  
  # Query for all users
  Posts = Parse.Object.extend("Post")
  query = new Parse.Query(Posts)
  
  # Update to plan value passed in
  
  # The count request succeeded. Show the count
  
  # The request failed
  
  # Set the  job's progress status
  query.each((newPost) ->
    Suggestions = Parse.Object.extend("Suggestion")
    query1 = new Parse.Query(Suggestions)
    query1.equalTo ("post_id"), newPost
    query1.count
      success: (count) ->
        newPost.set "suggestions", count
        newPost.save()

      error: (error) ->

    status.message counter + " posts processed."  if counter % query.count is 0
    counter += 1
    newPost.save()
  ).then (->
    
    # Set the job's success status
    console.log counter + " posts processed."
    status.success "Migration completed successfully."
  ), (error) ->
    
    # Set the job's error status
    status.error "Uh oh, something went wrong."


Parse.Cloud.job "voteFix", (request, status) ->
  
  # Set up to modify user data
  Parse.Cloud.useMasterKey()
  counter = 0
  
  # Query for all users
  Posts = Parse.Object.extend("Post")
  query = new Parse.Query(Posts)
  
  # Set the  job's progress status
  query.each((newPost) ->
    newPost.set "counter_0", 0
    newPost.set "counter_1", 0
    newPost.save()
    status.message counter + " posts processed."  if counter % 100 is 0
    counter += 1
    newPost.save()
  ).then (->
    
    # Set the job's success status
    status.success "Migration completed successfully."
  ), (error) ->
    
    # Set the job's error status
    status.error "Uh oh, something went wrong."


Parse.Cloud.define "push_badge_notifications", (request, response) ->
  query = new Parse.Query(Parse.Installation)
  
  # Send a push to all installations matching any of these emails.
  query.containedIn "publicId", request.params.userIDS
  Parse.Push.send
    where: query
    data:
      title: "NewVo Group Update"
      alert: request.params.msg
      badge: "Increment"
      action: "Groups"
  ,
    success: ->
      response.success "Done."

    error: (message) ->
      response.error message



#response.success("Done.");
Parse.Cloud.define "push_tagged_notifications", (request, response) ->
  query = new Parse.Query(Parse.Installation)
  
  # Send a push to all installations matching any of these emails.
  query.containedIn "publicId", request.params.userIDS
  Parse.Push.send
    where: query
    data:
      title: "NewVo Post Update"
      alert: request.params.msg
      badge: "Increment"
      action: "Posts"
      searchObjectPost: request.params.searchObjectPost
  ,
    success: ->
      response.success "is Done."

    error: (message) ->
      response.error message



#response.success("is Done.");
Parse.Cloud.define "push_comment_notifications", (request, response) ->
  query = new Parse.Query(Parse.Installation)
  
  # Send a push to all installations matching any of these emails.
  query.containedIn "publicId", request.params.userIDS
  Parse.Push.send
    where: query
    data:
      title: "NewVo Comment Update"
      alert: request.params.msg
      badge: "Increment"
      action: "Comments"
      searchObjectPost: request.params.searchObjectPost
  ,
    success: ->
      response.success "is Done."

    error: (message) ->
      response.error message



#response.success("is Done.");
Parse.Cloud.define "clearBadges", (request, response) ->
  Parse.Cloud.useMasterKey()
  userID = request.params.userID
  query = new Parse.Query("Installation")
  query.equalTo "publicId", userID
  query.find
    success: (results) ->
      
      # Do something with the returned Parse.Object values
      i = 0

      while i < results.length
        object = results[i]
        object.set "badge", 0
        object.save null,
          success: (object) ->

          error: (object, error) ->
            console.error "Got an error " + error.code + " : " + error.description

        i++
      response.success "cleared"

    error: (error) ->
      response.error "not cleared"

