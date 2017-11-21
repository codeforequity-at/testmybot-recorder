var target = null;

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
    }
  });
});
  
$(document).ready(function() {
  console.log('testmybot content_script loading ...');
  
  target = $('div[role="main"]').get(0);
  
  if (target) {
    // Configuration of the observer
    var config = { attributes: false, childList:true, subtree: true };

    // Pass in the target node, as well as the observer options
    observer.observe(target, config);
  }
});

function cleanString(str) {
  str = $.trim(str);
  str = str.replace(/[^\x00-\x7F]/g, '');
  str = str.split(/\s/).join(' ');
  return str;
}

function _x(STR_XPATH) {
    var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }

    return xnodes;
}

function onMessage(request, sender, sendResponse) {
  console.log('testmybot content script: onMessage ' + JSON.stringify(request));
  if (request.action === 'ping') {
    if (target) {
      sendResponse({ action: 'pong'});
    } else {
      sendResponse({ action: 'pong', err: 'facebook messenger root document not bound' });
    }
  } else if (request.action === 'sendtext') {
    
    var el1 = $(_x("//*[@class='_1mf _1mj']//following :: div[11]")).get(0);
    var el2 = $(_x("//div[@class='_5rpb']/descendant::div[@class='_5rpu' and @role='combobox']")).get(0);
    
    $(el1).trigger({
      type: 'click'
    });
    
    $(el2).trigger ({
        type: 'keypress', keyCode: 'A'.charCodeAt(0), which: 'A', charCode: 'A'
    });
    $(el2).trigger ({
        type: 'keypress', keyCode: 13, which: 13, charCode: 13
    });
    /*
    //var inputElement = $('div[role="main"] div[role="combobox"]').get(0);
    var inputElement = $('div._1mf._1mj ').get(0);
    
    if (inputElement) {

      $(inputElement).trigger({
          type: 'click'
      });
    
      $(document).trigger ({
          type: 'keypress', keyCode: 'A'.charCodeAt(0), which: 'A', charCode: 'A'
      });
      $(document).trigger ({
          type: 'keypress', keyCode: 13, which: 13, charCode: 13
      });
      sendResponse({action: 'sendtextResponse', err: null });
      
    } else {
      sendResponse({action: 'sendtextResponse', err: 'input element not found' });
    }
    */
    sendResponse({action: 'sendtextResponse', err: null });
  }
}
chrome.runtime.onMessage.addListener(onMessage);