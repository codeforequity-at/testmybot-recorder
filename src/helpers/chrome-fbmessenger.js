import async from 'async';
import thenChrome from 'then-chrome';
import { Key } from 'selenium-webdriver/lib/input';
import bs from './browsersupport';
import keycodes from './keycodes';

const PROTOCOL_VERSION = '1.2';

function openTestRunnerTab(url) {
  return new Promise((resolve, reject) => {
    thenChrome.tabs.create({ url, active: false }).then((tab) => {
      bs.prepareTab(tab).then(() => {
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
  openTestRunnerTab,
  sendMessage,
  closeTestRunnerTab,
};
