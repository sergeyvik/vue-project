import Vue from 'vue';
import Router from 'vue-router';
import ProgramList from '@/components/ProgramList';
import FastView from '@/components/FastView';
import ProgramsView from '@/components/ProgramsView';
import OneProgram from '@/components/OneProgram';
import Settings from '@/components/Settings';

Vue.use(Router);

export default new Router({

  routes: [
    {
      path: '/',
      name: 'start',
      component: FastView
    },
    {
      path: '/list',
      name: 'list',
      component: ProgramList
    },
    {
      path: '/fast',
      name: 'fast',
      component: FastView
    },
    {
      path: '/programs',
      name: 'programs',
      component: ProgramsView,
      props: true
    },
    {
      path: '/channel',
      name: 'channel',
      component: OneProgram
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
});
