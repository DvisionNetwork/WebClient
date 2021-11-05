import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueCookies from 'vue3-cookies'

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

// language file
import i18n from './i18n.js'

import Utils from '@/features/Utils.js'
import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();


import Mixin from '@/features/Mixin.js'


window['_U'] = Utils();
window['gAppInfo'] = {
	version: process.env.VUE_APP_VERSION,
	mode: process.env.VUE_APP_BUILD_MODE,
};

if(gConfig.isProd) {
	console.log=function() {};
}

// mobile event
import Vue3TouchEvents from 'vue3-touch-events'

// const requireComponent = require.context(
// 	'./components',
// 	false,
// 	/Base[A-Z]\w+\.(vue|js)$/
// )

const app = createApp(App)
// window.DVW = app

// requireComponent.keys().forEach((fileName) => {
// 	const componentConfig = requireComponent(fileName)
// 	const componentName = upperFirst(
// 		camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
// 	)
// 	app.component(componentName, componentConfig.default || componentConfig)
// })

// app.use(i18n).use(store).use(router).use(Vue3TouchEvents).mount('#app')
// cookie expireTime 10 minutes
app.mixin(Mixin).use(i18n).use(store).use(router).use(VueCookies).mount('#app')
// app.use(i18n).use(store).use(router).mount('#app')
