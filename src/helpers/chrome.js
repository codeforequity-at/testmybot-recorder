import async from 'async';
import thenChrome from 'then-chrome';
import { Key } from 'selenium-webdriver/lib/input';
import keycodes from './keycodes';

const PROTOCOL_VERSION = '1.2';

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

function openTestRunnerTab(url) {
  return new Promise((resolve, reject) => {
    thenChrome.tabs.create({ url, active: false }).then((tab) => {
      prepareTab(tab).then(() => {
        thenChrome.debugger.attach({ tabId: tab.id }, PROTOCOL_VERSION).then(() => {
          console.info(`tab ${url} created ${tab.id}, content-script loaded, debugger attached, ready for test runner.`);
          resolve(tab);
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      console.error(err);
      reject(err);
    });
  });
}

function closeTestRunnerTab(tab) {
  return new Promise((resolve, reject) => {
    thenChrome.debugger.detach({ tabId: tab.id }).then(() => {
      thenChrome.tabs.remove(tab.id).then(() => {
        console.log(`tab removed ${tab.id}.`);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

function sendSingleChar(tab, char) {
  const indexOfChar = keycodes.indexOf(char.toLocaleUpperCase());
  const keyCode = indexOfChar >= 0 ? indexOfChar : 0;
  let charCode = char;

  if (char === Key.ENTER) {
    charCode = '\r';
  }

  return new Promise((resolve, reject) => {
    async.series([
      (cb) => {
        thenChrome.debugger.sendCommand({ tabId: tab.id }, 'Input.dispatchKeyEvent', {
          modifiers: 0,
          nativeVirtualKeyCode: keyCode,
          text: '',
          type: 'rawKeyDown',
          unmodifiedText: '',
          windowsVirtualKeyCode: keyCode,
        }).then(() => cb()).catch(cb);
      },
      (cb) => {
        thenChrome.debugger.sendCommand({ tabId: tab.id }, 'Input.dispatchKeyEvent', {
          modifiers: 0,
          nativeVirtualKeyCode: 0,
          text: charCode,
          type: 'char',
          unmodifiedText: charCode,
          windowsVirtualKeyCode: 0,
        }).then(() => cb()).catch(cb);
      },
      (cb) => {
        thenChrome.debugger.sendCommand({ tabId: tab.id }, 'Input.dispatchKeyEvent', {
          modifiers: 0,
          nativeVirtualKeyCode: keyCode,
          text: '',
          type: 'keyUp',
          unmodifiedText: '',
          windowsVirtualKeyCode: keyCode,
        }).then(() => cb()).catch(cb);
      },
    ], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function sendMessage(tab, text) {
  const arr = [...text, Key.ENTER];
  return arr.reduce((res, char) => res.then(() => sendSingleChar(tab, char)), Promise.resolve());
}

export default {
  isAvailable,
  getMatchingTabs,
  prepareTab,
  startRecording,
  openTestRunnerTab,
  sendMessage,
  closeTestRunnerTab,
};
