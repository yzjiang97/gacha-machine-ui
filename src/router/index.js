import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const lostRouter = [
    {
        path: '/',
        name: 'Layout',
        component: () => import('../layout/main.vue')
    },
]

export default new Router({
    mode: 'hash',
    scrollBehavior: () => ({ y: 0 }),
    routes: lostRouter
})


