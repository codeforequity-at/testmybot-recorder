import Vue from 'vue';
import Vuex from 'vuex';
import { initialState, actions, mutations } from './mutations';
import getters from './getters';
import plugins from './plugins';

Vue.use(Vuex);

export default new Vuex.Store({
  state: initialState,
  mutations,
  actions,
  getters,
  plugins,
});
