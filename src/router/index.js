import Vue from 'vue'
import VueRouter from 'vue-router'



Vue.use(VueRouter)

const routes = [{
        path: '/login',
        component: () =>
            import ('../components/login/login.vue')
    },
    {
        path: '/',
        component: () =>
            import ('../views/home/home.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router