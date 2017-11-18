import Chrome from './chrome';

export default {
  getMatchingTabs(url) {
    if (Chrome.isAvailable()) {
      return Chrome.getMatchingTabs(url);
    }
    return new Promise((resolve) => {
      resolve([
        {
          id: 1,
          index: 1,
          url: 'http://www.messenger.com',
          title: 'Messenger',
          status: 'completed',
        },
        {
          id: 2,
          index: 3,
          url: 'http://www.messenger.com',
          title: 'Messenger',
          status: 'completed',
        },
      ]);
    });
  },
  prepareTab(tab) {
    if (Chrome.isAvailable()) {
      return Chrome.prepareTab(tab);
    }
    return new Promise((resolve) => {
      resolve();
    });
  },
};
