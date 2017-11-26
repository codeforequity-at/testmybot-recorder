import { STORAGE_KEY_TESTCASES, STORAGE_KEY_LASTRUN, STORAGE_KEY_RESETCOMMAND } from './mutation-types';

const localStoragePlugin = (store) => {
  store.subscribe((mutation, { testcases, lastrun, resetcommand }) => {
    window.localStorage.setItem(STORAGE_KEY_TESTCASES, JSON.stringify(testcases));
    window.localStorage.setItem(STORAGE_KEY_LASTRUN, JSON.stringify(lastrun));
    window.localStorage.setItem(STORAGE_KEY_RESETCOMMAND, resetcommand);
  });
};

export default [localStoragePlugin];
