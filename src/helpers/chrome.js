
function isAvailable() {
  return (chrome && chrome.tabs && chrome.extension);
}

function getMatchingTabs(url) {
  return new Promise((resolve, reject) => {
    if (!chrome || !chrome.tabs) {
      reject('no chrome');
    } else {
      chrome.tabs.query({ url }, (tabs) => {
        if (tabs) {
          tabs.forEach(tab => (console.log(tab.url)));

          resolve(tabs.map(tab => (
            {
              id: tab.id,
              index: tab.index,
              url: tab.url,
              title: tab.title,
              favIconUrl: tab.favIconUrl,
              status: tab.status,
              ready: (tab.status === 'complete'),
            }
          )));
        } else {
          reject('no matching tabs');
        }
      });
    }
  });
}

function prepareTab(tab) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (response) => {
      if (response && response.action === 'pong') {
        console.log(`content script already present in tab ${tab.id}`);
        if (response.err) {
          reject(response.err);
        } else {
          resolve();
        }
      } else {
        console.log(`injecting content script in tab ${tab.id}`);
        chrome.tabs.executeScript(tab.id, { file: '/node_modules/jquery/dist/jquery.min.js' }, () => {
          chrome.tabs.executeScript(tab.id, { file: '/chrome/content_script.js' }, () => {
            chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (response1) => {
              if (response1 && response1.action === 'pong') {
                if (response1.err) {
                  reject(response1.err);
                } else {
                  resolve();
                }
              } else {
                reject('content script did not answer to ping');
              }
            });
          });
        });
      }
    });
  });
}

function startRecording(tab, cb) {
  const onMessage = (request, sender) => {
    console.log(`got chrome message: ${JSON.stringify(request)} from ${JSON.stringify(sender)}`);
    if (sender.tab && sender.tab.id === tab.id) {
      cb(request);
    }
  };

  chrome.runtime.onMessage.addListener(onMessage);

  return () => {
    chrome.runtime.onMessage.removeListener(onMessage);
  };
}

function sendMessage(tab, text) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, { action: 'sendtext', text }, (response) => {
      if (response && response.action === 'sendtextResponse') {
        if (response.err) {
          reject(response.err);
        } else {
          resolve();
        }
      } else {
        reject('content script did not answer to sendtext');
      }
    });
  });
}

export default {
  isAvailable,
  getMatchingTabs,
  prepareTab,
  startRecording,
  sendMessage,
};
