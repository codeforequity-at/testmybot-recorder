

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
              url: tab.url,
              title: tab.title,
              favIconUrl: tab.favIconUrl,
              status: tab.status,
            }
          )));
        } else {
          reject('no matching tabs');
        }
      });
    }
  });
}

export default {
  getMatchingTabs,
};
