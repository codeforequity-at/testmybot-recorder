$(document).ready(function() {
  console.log('testmybot content_script loading ...');
  
  var target = $('#js_1').get(0);

  // Create an observer instance
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      
      console.log(mutation);
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        var addedNode = mutation.addedNodes[0];
        
        if ($(addedNode).hasClass('_o46') && $(addedNode).hasClass('_3i_m')) {
          var meText = cleanString(addedNode.innerText);
          console.log(`found meNode: ${meText}`);
          chrome.extension.sendMessage({ from: 'me', text: meText });
          return;
        }
        if ($(addedNode).hasClass('_o46')) {
          var botText = cleanString(addedNode.innerText);
          console.log(`found botNode: ${botText}`);
          chrome.extension.sendMessage({ from: 'bot', text: botText });
          return;
        }
        
        var meNode = $('div._o46._3i_m', addedNode);
        if (meNode && meNode.length > 0 && meNode[0].innerText) {
          var meText = cleanString(meNode[0].innerText);
          console.log(`found meNode: ${meText}`);
          chrome.extension.sendMessage({ from: 'me', text: meText });
          return;
        }
        var botNode = $('div._o46', addedNode);
        if (botNode && botNode.length > 0 && botNode[0].innerText) {
          var botText = cleanString(botNode[0].innerText);
          console.log(`found botNode: ${botText}`);
          chrome.extension.sendMessage({ from: 'bot', text: botText });
          return;
        }
        /*
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
    });
  });

  // Configuration of the observer
  var config = { attributes: false, childList:true, subtree: true };

  // Pass in the target node, as well as the observer options
  observer.observe(target, config);

});

function cleanString(str) {
  str = $.trim(str);
  str = str.replace(/[^\x00-\x7F]/g, '');
  str = str.split(/\s/).join(' ');
  return str;
}

function onMessage(request, sender, sendResponse) {
  console.log('testmybot content script: onMessage ' + JSON.stringify(request));
  if (request.action === 'ping') {
    sendResponse({ action: 'pong'});      
  }
}
chrome.runtime.onMessage.addListener(onMessage);