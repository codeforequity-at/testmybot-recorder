import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/Dashboard';
import Record from '@/components/Record';
import Manage from '@/components/Manage';
import Run from '@/components/Run';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/Record',
      name: 'Record',
      component: Record,
    },
    {
      path: '/Manage',
      name: 'Manage',
      component: Manage,
    },
    {
      path: '/Run',
      name: 'Run',
      component: Run,
    },
  ],
});
