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
};

const exp = Object.assign({}, mock);
if (Chrome.isAvailable()) {
  Object.assign(exp, Chrome);
}

export default exp;
