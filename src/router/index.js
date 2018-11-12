import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ProgramList from '@/components/ProgramList'
import FastView from '@/components/FastView'

Vue.use(Router)

export default new Router({

  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
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
    }
  ]
})
