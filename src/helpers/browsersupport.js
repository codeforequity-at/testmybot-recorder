import Chrome from './chrome';

const mock = {
  getAutomationTabs() {
    return Promise.resolve([
      {
        id: 1,
        index: 1,
        url: 'http://www.messenger.com',
        title: 'Messenger',
        status: 'completed',
        ready: true,
      },
      {
        id: 2,
        index: 3,
        url: 'http://www.messenger.com',
        title: 'Messenger',
        status: 'completed',
        ready: true,
      },
    ]);
  },
  getMatchingTabs() {
    return Promise.resolve([
      {
        id: 1,
        index: 1,
        url: 'http://www.messenger.com',
        title: 'Messenger',
        status: 'completed',
        ready: true,
      },
      {
        id: 2,
        index: 3,
        url: 'http://www.messenger.com',
        title: 'Messenger',
        status: 'completed',
        ready: true,
      },
    ]);
  },
  prepareTab() {
    return Promise.resolve();
  },
  startRecording(tab, cb) {
    cb({ action: 'record', from: 'me', text: 'hugo hugo hugo' });
    return () => { };
  },
  getAutomationBySite() {
    return Promise.resolve({
      openTestRunnerTab() {
        return new Promise((resolve) => {
          resolve();
        });
      },
      sendMessage() {
        return new Promise((resolve) => {
          resolve();
        });
      },
      closeTestRunnerTab() {
        return new Promise((resolve) => {
          resolve();
        });
      },
    });
  },
  saveTextFile() {
    return Promise.resolve();
  },
};

const exp = Object.assign({}, mock);
if (Chrome.isAvailable()) {
  Object.assign(exp, Chrome);
}

export default exp;
