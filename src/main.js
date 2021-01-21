import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'
import { ElementTiptapPlugin } from 'element-tiptap'
import 'element-tiptap/lib/index.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.use(ElementTiptapPlugin, {
        lang: "en",
        spellcheck: true,
    },

    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app'))