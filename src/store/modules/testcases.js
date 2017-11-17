import * as types from '../mutation-types';

const initialState = {
  testcases: JSON.parse(window.localStorage.getItem(types.STORAGE_KEY) || '[]'),
};

// getters
const getters = {
  allTestcases: state => state.testcases.sort((a, b) => {
    if (a.name < b.name) return -1;
    else if (a.name > b.name) return 1;
    return 0;
  }),
};

// actions
const actions = {
  addTestcase({ commit }, testcase) {
    commit(types.INSERT_TESTCASE, testcase);
  },
};

// mutations
const mutations = {
  [types.INSERT_TESTCASE](state, testcase) {
    state.testcases.push(testcase);
  },
};

export default {
  state: initialState,
  getters,
  actions,
  mutations,
};
