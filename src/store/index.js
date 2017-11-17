import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import plugins from './plugins';
import testcases from './modules/testcases';

Vue.use(Vuex);

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    testcases,
  },
  plugins,
});
