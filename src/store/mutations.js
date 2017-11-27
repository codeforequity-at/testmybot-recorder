import * as types from './mutation-types';

export const initialState = {
  testcases: JSON.parse(window.localStorage.getItem(types.STORAGE_KEY_TESTCASES) || '[]'),
  lastrun: JSON.parse(window.localStorage.getItem(types.STORAGE_KEY_LASTRUN) || '[]'),
  resetcommand: window.localStorage.getItem(types.STORAGE_KEY_RESETCOMMAND) || '',
};

export const actions = {
  addTestcase({ commit, state }, testcase) {
    return new Promise((resolve, reject) => {
      if (state.testcases && state.testcases.find(t => t.name === testcase.name)) {
        reject(`Test case "${testcase.name}" already registered, please select another name`);
      } else {
        commit(types.INSERT_TESTCASE, testcase);
        resolve();
      }
    });
  },
  setLastRun({ commit, state }, lastrun) {
    return new Promise((resolve) => {
      commit(types.SET_LASTRUN, lastrun);
      resolve();
    });
  },
  setResetCommand({ commit, state }, resetcommand) {
    return new Promise((resolve) => {
      commit(types.SET_RESETCOMMAND, resetcommand);
      resolve();
    });
  },
};

export const mutations = {
  [types.INSERT_TESTCASE](state, testcase) {
    state.testcases.push(testcase);
  },
  [types.SET_LASTRUN](state, lastrun) {
    state.lastrun = lastrun;
  },
  [types.SET_RESETCOMMAND](state, resetcommand) {
    state.resetcommand = resetcommand;
  },
};
