var target = null;

// Create an observer instance
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    
    // console.log(mutation);
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
    }
  });
});
  
$(document).ready(function() {
  console.log('testmybot content_script loading ...');
  startMutationObserver();
});

function startMutationObserver() {
  target = $('div[role="main"]').get(0);
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
  str = str.replace(/[^\x00-\x7F]/g, '');
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
