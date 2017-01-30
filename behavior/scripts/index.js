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
      client.done()
    }
  })

  const collectEmployment = client.createStep({
    extractInfo() {
      let response = client.getMessagePart().classification.base_type
      var user = client.getMessagePart().sender.id;
      if(response){
        if(response=="affirmative/generic"){
          client.updateUser(user, "employed", true);
        }else{
          client.updateUser(user, "employed", false);
        }
      }
    },

    satisfied() {
      return Boolean(client.getMessagePart().sender.employed)
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
        client.updateUser(user, "age", age.value);
      }
    },

    satisfied() {
      return Boolean(client.getMessagePart().sender.age)
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
        if(response=="affirmative"){
          client.updateUser(user, "nationality", "singaporean");
        }else{
          client.updateUser(user, "nationality", "others");
        }
      }
    },

    satisfied() {
      return Boolean(client.getMessagePart().sender.nationality)
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
      console.log("handling define stuff", subject)
      if(subject){
        client.updateConversationState({
          subject: subject,
        })
      }
    },
    satisfied(){
      return false;
    },
    prompt(){
      if(client.getConversationState().subject == "budgeting"){
        client.addResponse('definition/budgeting');
      }
      else if(client.getConversationState().subject == "bto"){
        client.addResponse('definition/bto');
      }
      else if(client.getConversationState().subject == "collateral"){
        client.addResponse('definition/collateral');
      }
      else if(client.getConversationState().subject == "compound_interest"){
        client.addResponse('definition/compound_interest');
      }
      else if(client.getConversationState().subject == "cpf"){
        client.addResponse('definition/cpf');
      }
      else if(client.getConversationState().subject == "credit_score"){
        client.addResponse('definition/credit_score');
      }
      else if(client.getConversationState().subject == "home_loan"){
        client.addResponse('definition/home_loan');
      }
      else if(client.getConversationState().subject == "inflation"){
        client.addResponse('definition/inflation');
      }
      else if(client.getConversationState().subject == "medisave"){
        client.addResponse('definition/medisave');
      }
      else if(client.getConversationState().subject == "mortgage"){
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
