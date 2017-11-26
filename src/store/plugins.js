import { STORAGE_KEY_TESTCASES, STORAGE_KEY_LASTRUN } from './mutation-types';

const localStoragePlugin = (store) => {
  store.subscribe((mutation, { testcases, lastrun }) => {
    window.localStorage.setItem(STORAGE_KEY_TESTCASES, JSON.stringify(testcases));
    window.localStorage.setItem(STORAGE_KEY_LASTRUN, JSON.stringify(lastrun));
  });
};

export default [localStoragePlugin];
