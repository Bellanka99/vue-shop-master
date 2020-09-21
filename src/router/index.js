import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users/Users.vue'
import Rights from '../components/Power/Rights.vue'
import Roles from '../components/Power/Roles.vue'
import Category from '../components/Goods/Category.vue'
import Goods from '../components/Goods/Goods.vue'
import CateParams from '../components/Goods/CateParams.vue'


Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles },
            { path: '/categories', component: Category },
            { path: '/goods', component: Goods },
            { path: '/params', component: CateParams }

        ]
    }
]

const router = new VueRouter({
    routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to将要访问跳转的路径
    // from 代表从哪个路径跳转过来
    // next 是一个函数，表示放行

    if (to.path === '/login') return next()
        // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
        // 没有token，强制跳转到登录页
    if (!tokenStr) return next('/login')
    next()
})

export default router