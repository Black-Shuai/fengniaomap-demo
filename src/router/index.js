import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import FMap from '@/components/FMap'
import Three from '@/components/Three'
import indoormap from '@/components/indoormap'
import InfoWindow from '@/components/InfoWindow'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'InfoWindow',
      component: InfoWindow
    },
    {
      path: '/indoormap',
      name: 'indoormap',
      component: indoormap
    },
    {
      path: '/FMap',
      name: 'FMap',
      component: FMap
    },
    {
      path: '/3d',
      name: 'three',
      component: Three
    }
  ]
})
