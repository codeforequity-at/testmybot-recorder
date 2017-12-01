var target = null;

// Create an observer instance
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    
    console.log(mutation);
    
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      var addedNode = mutation.addedNodes[0];
      
      if ($(addedNode).hasClass('segments')) {
        var chatNode = $(addedNode).children().get(0);
        if (chatNode && $(chatNode).hasClass('from-user')) {
          var meText = cleanString(chatNode.innerText);
          console.log(`found meNode: ${meText}`);
          chrome.extension.sendMessage({ from: 'me', text: meText });
          return;
        }
        if (chatNode && $(chatNode).hasClass('from-watson')) {
          var textNode = $(chatNode).find('div.text').get(0);
          if (textNode) {
            var botText = cleanString(textNode.innerText);
            console.log(`found botNode: ${botText}`);
            chrome.extension.sendMessage({ from: 'bot', text: botText });
            return;
          }
        }
      }
    }
  });
});
  
$(document).ready(function() {
  console.log('testmybot content_script loading ...');
  startMutationObserver();
});

function startMutationObserver() {
  target = $('#scrollingChat').get(0);
  if (target) {
    console.log('testmybot content_script starting mutation observer ...');
    var config = { attributes: false, childList:true, subtree: true };
    observer.observe(target, config);
  } else {
    console.log('testmybot content_script target node for mutation observer not found.');
  }
}

function cleanString(str) {
  str = $.trim(str);
  str = str.split(/\s/).join(' ');
  return str;
}

function onMessage(request, sender, sendResponse) {
  console.log('testmybot content script: onMessage ' + JSON.stringify(request));
  if (request.action === 'ping') {
    if (!target) {
      startMutationObserver();
    }
    if (target) {
      sendResponse({ action: 'pong'});
    } else {
      sendResponse({ action: 'pong', err: 'troy root document not bound' });
    }
  }
}
chrome.runtime.onMessage.addListener(onMessage);
