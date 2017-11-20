import * as types from './mutation-types';

export const initialState = {
  testcases: JSON.parse(window.localStorage.getItem(types.STORAGE_KEY) || '[]'),
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
};

export const mutations = {
  [types.INSERT_TESTCASE](state, testcase) {
    state.testcases.push(testcase);
  },
};
