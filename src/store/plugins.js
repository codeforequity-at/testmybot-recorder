import { STORAGE_KEY } from './mutation-types';

const localStoragePlugin = (store) => {
  store.subscribe((mutation, { testcases }) => {
    console.log(`store.subscribe trigger ${testcases}`);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(testcases));
  });
};

export default [localStoragePlugin];
