$(document).ready(function() {
  console.log('content_script loading ...');
  
  // Select the target node (tweet modal)
  var target = $('#js_1').get(0);

  // Create an observer instance
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {

      // Get the Twitter modal window replies count
      //var loneTweetsCount = $('.PermalinkOverlay-body .ThreadedConversation--loneTweet .tweet').length
      //var threadedTweetsCount = $('.PermalinkOverlay-body .ThreadedConversation .tweet').length
      //var total = loneTweetsCount + threadedTweetsCount
      
      //console.log(mutation);
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        var mynode = mutation.addedNodes[0];
        if (mynode.innerText) {
          console.log('handling innerText: ' + mynode.innerText);
          chrome.extension.sendMessage({ text: mynode.innerText}, function(response) {
            console.log('answer from popup: ' + JSON.stringify(response));
          });          
          
        }
        /*
        var buttons = $(mynode).find('div[role="button"]');
        if (buttons) {
          console.log(buttons);
        }
        */
      }
      
      // Send message to background.js so we can set the badge text
      //chrome.extension.sendMessage({'count': total})

    });
  });

  // Configuration of the observer
  var config = { attributes: false, childList:true, subtree: true };

  // Pass in the target node, as well as the observer options
  observer.observe(target, config);

});