import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/',
		name: '',
		redirect: () => {
			return '/en'
		}
	},
	{
		path: '/:lang',
		component: {
			template: '<router-view />',
		},
		redirect: to => ({
			path: '/'+to.params.lang+'/home',
		}),
		children:[
			{
				path: '',
				name: 'Home',
				component: () =>
					import('@/views/Home.vue'),
			},
			{
				path: 'home',
				name: 'Home',
				component: () =>
					import('@/views/Home.vue'),
			},
			{
				path: 'market',
				component: {
					template: '<router-view />',
				},
				name: 'Market',
				redirect: to => ({
					path: '/'+to.params.lang+'/market/bsc',
				}),
			},
			{
				path: 'market/:tab_page',
				name: 'Market-Page',
				props: true,
				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				component: () =>
					import('@/views/Market.vue'),
				beforeEnter: (to, from, next) => {
					// console.log('[JNJT router/index.js] beforeEnter(),to, from,next : ',to, from,next);
					// var view = {name:to.name}
					if(_U.getIfDefined(from,['params','from','params','from'])) {
						from.params.from.params.from = null;
					}
					to.params.from = from;
					next()
				}
			},
			{
				path: 'market/:tab_page/:itemId',
				name: 'Market-Detail',
				props: true,
				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				component: () =>
					import('@/views/Market.vue'),
			},
			{
				path: 'market/:tab_page/:itemId/:index',
				name: 'Market-Detail-Index',
				props: true,
				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				component: () =>
					import('@/views/Market.vue'),
				beforeEnter: (to, from, next) => {
					// console.log('[JNJT router/index.js] beforeEnter(),to, from,next : ',to, from,next);
					// var view = {name:to.name}
					if(_U.getIfDefined(from,['params','from','params','from'])) {
						from.params.from.params.from = null;
					}
					to.params.from = from;
					next()
				}
			},
			{
				path: 'studio',
				name: 'Studio',
				component: () =>
					import('@/views/Studio.vue'),
			},
			{
				path: 'guide',
				component: {
					template: '<router-view />',
				},
				name: 'Guide',
				redirect: to => ({
					path: '/'+to.params.lang+'/guide/guide',
				}),
			},
			{
				path: 'guide/:page',
				name: 'Guide-Page',
				props: true,
				component: () =>
					import('@/views/Guide.vue'),
			},
			{
				path: 'guide/:page/:wIdx',
				name: 'Guide-SubPage',
				props: true,
				component: () =>
					import('@/views/Guide.vue'),
			},
			{
				path: 'news',
				component: {
					template: '<router-view />',
				},
				name: 'News',
				redirect: to => ({
					path: '/'+to.params.lang+'/news/0',
				}),
			},
			{
				path: 'news/:page',
				name: 'News-Page',
				props: true,
				component: () =>
					import('@/views/News.vue')
			},
			{
				path: 'news-detail/:itemId',
				name: 'News-Detail',
				props: true,
				component: () =>
					import('@/views/News.Detail.vue'),
			},
			{
				path: 'signup',
				name: 'Signup',
				component: {
					template: '<router-view />',
				},
				redirect: to => ({
					// path: '/'+to.params.lang+'/signup/agree', // agree, register, confirm,
					path: '/'+to.params.lang+'/signup/register', // agree, register, confirm,
				}),
			},
			{
				path: 'signup/:page',
				name: 'Signup-Page',
				props: true,
				component: () =>
					import('@/views/Signup.vue'),
			},
			{
				path: 'mypage',
				name: 'MyPage',
				component: {
					template: '<router-view />',
				},
				redirect: to => ({
					path: '/'+to.params.lang+'/mypage/profile', // profile inventory
				}),
			},
			{
				path: 'mypage/:page',
				name: 'MyPage-Page',
				props: true,
				component: () =>
					import('@/views/MyPage.vue'),
			},
			// {
			// 	path: 'mypage/:page/:wIdx',
			// 	name: 'mypage-SubPage',
			// 	props: true,
			// 	component: () =>
			// 		import('@/views/MyPage.vue'),
			// },
			// {
			// 	path: 'help',
			// 	name: 'Help',
			// 	component: () =>
			// 		import(/* webpackChunkName: "about" */ '@/views/Help.vue'),
			// },
		],
		// beforeEnter: (to, from, next) => {
		// 	console.log('[JNJT router/index.js] beforeEnter(),to, from,next : ',to, from,next);
		// 	// var view = {name:to.name}
		// 	if(_U.getIfDefined(from,['params','jfrom','jfrom'])) {
		// 		from.params.jfrom.jfrom = null;
		// 	}
		// 	to.params.jfrom = from;
		// 	next()
		// }
		// beforeEnter: (to, from, next) => {
		// 	console.log('[JNJT router/index.js] beforeEnter(),to, from,next : ',to, from,next)
		// 	// view = {name:to.name, path:to.path, params:param}
		// 	var view = {name:'Home', path:to.path, params:to.param}
		// 	// if(!Utils.isContains(Env.CONFIG.language.supported,to.params['lang'])){
		// 	// 	if(to.params['lang'] === 'auto'){
		// 	// 		let param = to.params
		// 	// 		param['lang'] = Utils.getLanguage()
		// 	// 		view = {name:to.name, path:to.path.split(to.params['lang'],param['lang']),params:param}
		// 	// 	}else{
		// 	// 		view = {name:Env.RESOURCE.ROUTER.URL.NOT_FOUND}
		// 	// 		// view = {name:to.name, path:to.path, params:param}
		// 	// 	}
		// 	// }
		// 	next(view)
		// }
	},
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
})

export default router
