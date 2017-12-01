import Chrome from './chrome';

const mock = {
  getMatchingTabs() {
    return new Promise((resolve) => {
      resolve([
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
    });
  },
  prepareTab() {
    return new Promise((resolve) => {
      resolve();
    });
  },
  startRecording(tab, cb) {
    cb({ action: 'record', from: 'me', text: 'hugo hugo hugo' });
    return () => { };
  },
  getAutomationBySite() {
    return new Promise().resolve(
      {
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
    return new Promise((resolve) => {
      resolve();
    });
  },
};

const exp = Object.assign({}, mock);
if (Chrome.isAvailable()) {
  Object.assign(exp, Chrome);
}

export default exp;
