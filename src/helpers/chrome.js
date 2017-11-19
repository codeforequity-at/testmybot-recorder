
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
  return new Promise((resolve) => {
    chrome.tabs.executeScript(tab.id, { file: '/node_modules/jquery/dist/jquery.min.js' }, () => {
      chrome.tabs.executeScript(tab.id, { file: '/chrome/content_script.js' }, () => {
        resolve();
      });
    });
  });
}

export default {
  isAvailable,
  getMatchingTabs,
  prepareTab,
};
