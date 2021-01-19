import Vue from 'vue'
import VueRouter from 'vue-router'



Vue.use(VueRouter)

const routes = [{
        path: '/login',
        name: 'Login',
        component: () =>
            import ('../components/login/login.vue')
    },
    {
        path: '/',
        component: () =>
            import ('../views/layout/layout.vue'),
        children: [{
            path: '/',
            name: 'Home',
            component: () =>
                import ('../views/home/home.vue')
        }, {
            path: '/article',
            name: 'Article',
            component: () =>
                import ('../views/article/article.vue')
        }]
    }
]

const router = new VueRouter({
    routes
})

// 路由导航守卫 作用是拦截页面用的
router.beforeEach((to, from, next) => {
    const user = JSON.parse(window.localStorage.getItem('user'))
        // 如果访问的页面不是login，则需要进行校验权限
    if (to.path !== '/login') {
        if (user) {
            next()
        } else {
            next('/login')
        }
    } else {
        next()
    }
})

export default router