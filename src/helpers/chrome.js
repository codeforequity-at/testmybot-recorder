import async from 'async';
import thenChrome from 'then-chrome';
import chromeFb from './chrome-fbmessenger';

function isAvailable() {
  return (chrome && chrome.tabs && chrome.extension);
}

function getMatchingTabs(url) {
  return new Promise((resolve, reject) => {
    if (!chrome || !chrome.tabs) {
      reject('no chrome');
    } else {
      thenChrome.tabs.query({ url }).then((tabs) => {
        if (tabs) {
          tabs.forEach(tab => (console.debug(tab.url)));

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
          resolve([]);
        }
      }).catch(reject);
    }
  });
}

function getAutomationTabs() {
  return new Promise((resolve, reject) => {
    const promises = [
      getMatchingTabs('*://www.messenger.com/*'),
      getMatchingTabs('*://www.drei.at/*'),
    ];
    Promise.all(promises).then((alltabs) => {
      resolve(alltabs.reduce((acc, val) => acc.concat(val), []));
    }).catch(reject);
  });
}

function getAutomationBySite(url) {
  return new Promise((resolve, reject) => {
    if (url.match('messenger.com')) {
      resolve(chromeFb);
    } else {
      reject(`no chrome automation found for site ${url}`);
    }
  });
}

function getContentScriptBySite(url) {
  if (url.match('messenger.com')) {
    return '/chrome/content_script_fbmessenger.js';
  } else if (url.match('drei.at')) {
    return '/chrome/content_script_troy.js';
  }
  return null;
}

function prepareTab(tab) {
  const contentScript = getContentScriptBySite(tab.url);
  if (contentScript) {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (response) => {
        if (response && response.action === 'pong') {
          console.info(`content script already present in tab ${tab.id}  ${JSON.stringify(response)}`);
          if (response.err) {
            reject(response.err);
          } else {
            resolve();
          }
        } else {
          console.debug(`injecting content script in tab ${tab.id}`);
          chrome.tabs.executeScript(tab.id, { file: '/node_modules/jquery/dist/jquery.min.js' }, () => {
            chrome.tabs.executeScript(tab.id, { file: '/chrome/content_script.js' }, () => {
              async.retry({ times: 10, interval: 3000 }, (cb) => {
                chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (response1) => {
                  if (response1 && response1.action === 'pong') {
                    console.info(`content script answered to ping ${JSON.stringify(response1)}`);
                    if (response1.err) {
                      cb(response1.err);
                    } else {
                      cb();
                    }
                  } else {
                    cb('content script did not answer to ping');
                  }
                });
              }, (err) => {
                if (err) {
                  reject('content script did not answer to ping');
                } else {
                  resolve();
                }
              });
            });
          });
        }
      });
    });
  }
  return Promise.resolve();
}

function startRecording(tab, cb) {
  const onMessage = (request, sender) => {
    console.debug(`got chrome message: ${JSON.stringify(request)} from ${JSON.stringify(sender)}`);
    if (sender.tab && sender.tab.id === tab.id) {
      cb(request);
    }
  };

  chrome.runtime.onMessage.addListener(onMessage);

  return () => {
    chrome.runtime.onMessage.removeListener(onMessage);
  };
}

function saveTextFile(contents, filename) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([contents], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    thenChrome.downloads.download({ url, filename, saveAs: true })
      .then(() => resolve())
      .catch(err => reject(err));
  });
}

export default {
  isAvailable,
  getAutomationTabs,
  getMatchingTabs,
  prepareTab,
  startRecording,
  saveTextFile,
  getAutomationBySite,
};
