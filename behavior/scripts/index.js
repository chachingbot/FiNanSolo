'use strict'

exports.handle = (client) => {
  // Create steps
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('onboarding/welcome')
      client.addResponse('onboarding/collect_info')
      client.updateConversationState({
        helloSent: true
      })
      return 'init.proceed';
    },

  })

  const collectEmployment = client.createStep({
    extractInfo() {
      let response = client.getMessagePart().classification.base_type
      // Get user id for current sender
      var userId = client.getMessagePart().sender.id;
      if(response){
        console.log('Response from user: ', response, userId);
        if(response.value == "affirmative"){
          // Update user metadata
          client.updateUser(userId, 'metadata', {employed: true})
        }else if(response.value == "decline"){
          // Update user metadata
          client.updateUser(userId, 'metadata', {employed: false})
        }
      }
    },

    satisfied() {
      var userId = client.getMessagePart().sender.id;
      if(client.getUsers()[userId].metadata){
        console.log("getUsers metadata", client.getUsers()[userId].metadata);
        console.log("getMessagePart metadata", client.getMessagePart().sender.metadata);
        console.log(client.getMessagePart().sender);
        return Boolean(client.getUsers()[userId].metadata.employed);
      }else{
        return false;
      }
    },

    prompt() {
      client.addResponse('onboarding/employment');
      client.expect(client.getStreamName(), ['affirmative', 'decline']);
      client.done()
    }
  })

  const collectAge = client.createStep({
    extractInfo() {
      let age = client.getFirstEntityWithRole(client.getMessagePart(), 'age')
      var user = client.getMessagePart().sender.id;
      if(age){
        client.updateUser(user, 'metadata', {age: age.value})
      }
    },

    satisfied() {
      var userId = client.getMessagePart().sender.id;
      if(client.getUsers()[userId].metadata){
        console.log("getUsers metadata", client.getUsers()[userId].metadata);
        return Boolean(client.getUsers()[userId].metadata.age);
      }else{
        return false;
      }
    },

    prompt() {
      client.addResponse('onboarding/age');
      client.expect(client.getStreamName(), ['value']);
      client.done()
    }
  })

  const collectSingaporean = client.createStep({
    extractInfo() {
      let response = client.getMessagePart().classification.base_type
      var user = client.getMessagePart().sender.id;
      if(response){
        if(response.value == "affirmative"){
          client.updateUser(user, 'metadata', {nationality: "singaporean"})
        }else{
          client.updateUser(user, 'metadata', {nationality: "others"})
        }
      }
    },

    satisfied() {
      var userId = client.getMessagePart().sender.id;
      if(client.getUsers()[userId].metadata){
        console.log("getUsers metadata", client.getUsers()[userId].metadata);
        return Boolean(client.getUsers()[userId].metadata.nationality);
      }else{
        return false;
      }
    },

    prompt() {
      client.addResponse('onboarding/singaporean');
      client.expect(client.getStreamName(), ['affirmative', 'decline']);
      client.done()
    }
  })

  const completeOnboarding = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('onboarding/complete')
      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('apology/untrained')
      client.done()
    }
  })

  const handleGreeting = client.createStep({
    satisfied(){
      return false
    },
    prompt(){
      var username = client.getMessagePart().sender.first_name || "buddy"
      client.addResponse('greeting',{
        name: username
      });
      client.done()
    }
  })

  const handleGoodbye = client.createStep({
    satisfied(){
      return false
    },
    prompt(){
      var username = client.getMessagePart().sender.first_name || "there" ;
      client.addResponse('goodbye',{
        name: username
      });
      client.done()
    }
  })

  const handleDefine = client.createStep({
    extractInfo(){
      let subject = client.getMessagePart().classification.sub_type.value
      if(subject){
        client.updateConversationState({
          topic: subject,
        })
      }
    },
    satisfied(){
      return false;
    },
    prompt(){
      if(client.getConversationState().topic == "budgeting"){
        client.addResponse('definition/budgeting');
      }
      else if(client.getConversationState().topic == "bto"){
        client.addResponse('definition/bto');
      }
      else if(client.getConversationState().topic == "collateral"){
        client.addResponse('definition/collateral');
      }
      else if(client.getConversationState().topic == "compound_interest"){
        client.addResponse('definition/compound_interest');
      }
      else if(client.getConversationState().topic == "cpf"){
        client.addResponse('definition/cpf');
      }
      else if(client.getConversationState().topic == "credit_score"){
        client.addResponse('definition/credit_score');
      }
      else if(client.getConversationState().topic == "home_loan"){
        client.addResponse('definition/home_loan');
      }
      else if(client.getConversationState().topic == "inflation"){
        client.addResponse('definition/inflation');
      }
      else if(client.getConversationState().topic == "medisave"){
        client.addResponse('definition/medisave');
      }
      else if(client.getConversationState().topic == "mortgage"){
        client.addResponse('definition/mortgage');
      }
      else{
        client.addTextResponse('Sorry, I will need to read up more on this');
      }
      client.done()
    }
  })

  const resetUser = client.createStep({
    satisfied(){
      return false
    },
    prompt(){
      var user = client.getMessagePart().sender.id;
      client.resetUser(user)
      client.updateConversationState({
        helloSent: false
      })
      client.addTextResponse('Goodbye, my friend. Thou booty shalt be moist');
      client.done()
    }
  })

  client.runFlow({
    classifications: {
      // map inbound message classifications to names of streams
      greeting: 'greeting',
      goodbye: 'goodbye',
      define: 'define',
      reset_user: 'reset_user',
      onboard: 'onboarding'
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      greeting: handleGreeting,
      goodbye: handleGoodbye,
      define: handleDefine,
      reset_user: resetUser,
      main: 'onboarding',
      onboarding: [sayHello, collectEmployment, collectAge, collectSingaporean, completeOnboarding],
      end: [untrained],
    },
  })
}
