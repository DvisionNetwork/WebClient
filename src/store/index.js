import { createStore } from 'vuex'

export default createStore({
	state: {
		showAlert: {show: false, msg:'', btn:'', callback: null},
		showToast: {show: false, msg:''},
		showLoading: false,
		showGameStartLoading: false,
		showLoginPopup: false,
		showEventPopup: false,
		showAddWallet: false,
		showChangePasswordPopup: false,
		showEditProfile: false,
		countryCodeNo: '82',
		userInfo: {
			"id": "",
			"country": "",
			"account": "",
			"phone_number": "",
			"email": "",
			"name": "",
			"gender": "",
			"birth": "",
			"admin_category": "",
			"intro": "false",
			"affiliation": "",
			"department": "",
			"position": "",
			"nickname": ""
		},
		// // accounts = [{ account:userInfo.account, createtime: "2021-06-29 20:07:15". wallet_addr:"0x...." }, ...]
		wallet: {
			updated: false,
			currentAccountIdx: null,
			currentAccount:null,
			accounts:[],
			provider: null,
			signer: null,
			balance: 0
		},
		homeNews: {}, // { total, page, cpp, list[]} // cpp = number of items (count) per page
		news: {},
		newsItem:{},
		marketItems: {}, // { total, page, cpp, list[]} // cpp = number of items (count) per page
		marketItem: {},
		marketQuery: {},
		myItems: {}, // { total, page, cpp, list[]} // cpp = number of items (count) per page
		myItemQuery: {},
	},
	mutations: {
		SHOW_ALERT(state, value) {
			state.showAlert = value;
		},
		SHOW_TOAST(state, value) {
			state.showToast = value;
		},
		SHOW_LOADING(state, value) {
			state.showLoading = value;
		},
		SHOW_GAME_START_LOADING(state, value) {
			state.showGameStartLoading = value;
		},
		SHOW_LOGIN_POPUP(state, value) {
			state.showLoginPopup = value;
		},
		SHOW_EVENT_POPUP(state, value) {
			state.showEventPopup = value;
		},
		SHOW_ADD_WALLET(state, value) {
			state.showAddWallet = value;
		},
		SHOW_CHANGE_PASSWORD_POPUP(state, value) {
			state.showChangePasswordPopup = value;
		},
		SHOW_EDIT_PROFILE(state, value) {
			state.showEditProfile = value;
		},

		SET_USER_INFO(state, value) {
			state.userInfo = value;
		},

		SET_COUNTRY_CODE_NO(state, value) {
			state.countryCodeNo = value;
		},

		SET_WALLET(state, value) {
			state.wallet = value;
			state.wallet.updated= true;
		},
		SET_WALLET_BALANCE(state,value) {
			state.wallet.updated= false;
			state.wallet.balance = value;
		},
		/////// Home ////
		SET_HOME_NEWS(state, value) {
			state.homeNews = value;
		},
		////// Market ////
		SET_MARKET_ITEMS(state, value) {
			state.marketItems = value;
		},
		SET_MARKET_ITEM(state, value) {
			state.marketItem = value;
		},
		SET_MARKET_QUERY(state, value) {
			state.marketQuery = value;
		},

		////// My Items ////
		SET_MY_ITEMS(state, value) {
			state.myItems = value;
		},
		SET_My_ITEM(state, value) {
			state.myItem = value;
		},
		SET_MY_ITEM_QUERY(state, value) {
			state.myItemQuery = value;
		},

		////// News //////
		SET_NEWS(state, value) {
			state.news = value;
		},
		SET_NEWS_ITEM(state, value) {
			state.newsItem = value;
		},

	},
	actions: {
		showAlert(context, value) {
			console.log("[STORE.actions] showAlert(), ", value);
			context.commit('SHOW_ALERT',value);
		},
		showToast(context, value) {
			console.log("[STORE.actions] showToast(), ", value);
			context.commit('SHOW_TOAST',value);
		},
		showLoading(context, value) {
			console.log("[STORE.actions] showLoading(), ", value);
			context.commit('SHOW_LOADING',value);
		},
		showGameStartLoading(context, value) {
			console.log("[STORE.actions] showGameStartLoading(), ", value);
			context.commit('SHOW_GAME_START_LOADING',value);
		},
		showLoginPopup(context, value) {
			console.log("[STORE.actions] showLoginPopup(), ", value);
			context.commit('SHOW_LOGIN_POPUP',value);
		},
		showEventPopup(context, value) {
			console.log("[STORE.actions] showEventPopup(), ", value);
			context.commit('SHOW_EVENT_POPUP',value);
		},
		showAddWallet(context, value) {
			console.log("[STORE.actions] showAddWallet(), ", value);
			context.commit('SHOW_ADD_WALLET',value);
		},

		showChangePasswordPopup(context, value) {
			console.log("[STORE.actions] showChangePasswordPopup(), ", value);
			context.commit('SHOW_CHANGE_PASSWORD_POPUP',value);
		},

		showEditProfile(context, value) {
			console.log("[STORE.actions] showEditProfile(), ", value);
			context.commit('SHOW_EDIT_PROFILE',value);
		},

		setUserInfo(context, value) {
			console.log("[STORE.actions] setUserInfo(), ", value);
			context.commit('SET_USER_INFO',value);
		},
		setCountryCodeNo(context, value) {
			console.log("[STORE.actions] setCountryCodeNo(), ", value);
			context.commit('SET_COUNTRY_CODE_NO',value);
		},
		setWallet(context, value) {
			console.log("[STORE.actions] setWallet(), ", value);
			context.commit('SET_WALLET',value);
		},
		setWalletBalance(context, value) {
			console.log("[STORE.actions] setWalletBalance(), ", value);
			context.commit('SET_WALLET_BALANCE',value);
		},
		/// Home ////
		setHomeNews(context, value) {
			console.log("[STORE.actions] setHomeNews(), ", value);
			context.commit('SET_HOME_NEWS',value);
		},
		/// Market ////
		setMarketItems(context, value) {
			console.log("[STORE.actions] setMarketItems(), ", value);
			context.commit('SET_MARKET_ITEMS',value);
		},
		setMarketItem(context, value) {
			console.log("[STORE.actions] setMarketItem(), ", value);
			context.commit('SET_MARKET_ITEM',value);
		},

		setMarketQuery(context, value) {
			console.log("[STORE.actions] setMarketQuery(), ", value);
			context.commit('SET_MARKET_QUERY',value);
		},

		/// My Item ////
		setMyItems(context, value) {
			console.log("[STORE.actions] setMyItems(), ", value);
			context.commit('SET_MY_ITEMS',value);
		},

		setMyItemQuery(context, value) {
			console.log("[STORE.actions] setMyItemQuery(), ", value);
			context.commit('SET_MY_ITEM_QUERY',value);
		},

		/// News ////
		setNews(context, value) {
			console.log("[STORE.actions] setNews(), ", value);
			context.commit('SET_NEWS',value);
		},
		setNewsItem(context, value) {
			console.log("[STORE.actions] setNewsItem(), ", value);
			context.commit('SET_NEWS_ITEM',value);
		},
	},
	modules: {},
})
