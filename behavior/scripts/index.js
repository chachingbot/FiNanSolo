'use strict'

exports.handle = (client) => {
  // Create steps
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('welcome')
      client.addResponse('provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      client.addResponse('provide/instructions')

      client.updateConversationState({
        helloSent: true
      })

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
      return false
    },
    prompt(){
      if(client.getConversationState().subject == "budgeting"){
        client.addResponse('definition/budgeting')
      }
      else if(client.getConversationState().subject == "bto"){
        client.addResponse('definition/bto')
      }
      else if(client.getConversationState().subject == "collateral"){
        client.addResponse('definition/collateral')
      }
      else if(client.getConversationState().subject == "compound_interest"){
        client.addResponse('definition/compound_interest')
      }
      else if(client.getConversationState().subject == "cpf"){
        client.addResponse('definition/cpf')
      }
      else if(client.getConversationState().subject == "credit_score"){
        client.addResponse('definition/credit_score')
      }
      else if(client.getConversationState().subject == "home_loan"){
        client.addResponse('definition/home_loan')
      }
      else if(client.getConversationState().subject == "inflation"){
        client.addResponse('definition/inflation')
      }
      else if(client.getConversationState().subject == "medisave"){
        client.addResponse('definition/medisave')
      }
      else if(client.getConversationState().subject == "mortgage"){
        client.addResponse('definition/mortgage')
      }
      else{
        client.addTextResponse('Sorry, I will need to read up more on this')
      }
      client.done()
    }
  })

  client.runFlow({
    classifications: {
      // map inbound message classifications to names of streams
      greeting: 'greeting',
      goodbye: 'goodbye',
      define: 'define'
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      greeting: handleGreeting,
      goodbye: handleGoodbye,
      define: handleDefine,
      main: 'onboarding',
      onboarding: [sayHello],
      end: [untrained],
    },
  })
}
