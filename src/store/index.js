import { createStore } from 'vuex'

export default createStore({
	state: {
		showAlert: {show: false, msg:'', btn:'', callback: null},
		showToast: {show: false, msg:''},
		showLoading: false,
		showGameStartLoading: false,
		showLoginPopup: false,
		showSelectWalletPopup: {},
		showEventPopup: false,
		showAddWallet: false,
		showChangePasswordPopup: false,
		showEditProfile: false,
		showStakingModal:{},
		showSuccessModal:{},
		showConfirmModal:{},
		showInfoModal: {},
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
			balance: 0,
			polygonBalance: 0,
		},
		network: '',
		homeNews: {}, // { total, page, cpp, list[]} // cpp = number of items (count) per page
		news: {},
		newsItem:{},
		marketItems: {}, // { total, page, cpp, list[]} // cpp = number of items (count) per page
		marketItem: {},
		marketQuery: {},
		myLands: {},
		myLandQuery: {},
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
		SHOW_SELECT_WALLET_POPUP(state, value) {
			state.showSelectWalletPopup = value;
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
		SHOW_STAKING_MODAL(state, value) {
			state.showStakingModal = value;
		},
		SHOW_SUCCESS_MODAL(state, value) {
			state.showSuccessModal = value;
		},
		SHOW_CONFIRM_MODAL(state, value) {
			state.showConfirmModal = value;
		},
		SHOW_INFO_MODAL(state, value) {
			console.log('state123123', state, value);
			state.showInfoModal = value;
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
			state.wallet.updated = false;
			state.wallet.balance = value;
		},
		SET_WALLET_POLYGON_BALANCE(state,value) {
			state.wallet.updated = false;
			state.wallet.polygonBalance = value;
		},
		SET_NETWORK(state,value) {
			state.network = value;
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
		SET_LAND_QUERY(state, value) {
			state.landQuery = value;
		},
		SET_LAND_INFO(state, value) {
			state.landInfo = value;
		},
		SET_LAND_MENU(state, value) {
			state.landMenu = value;
		},

		////// LAND /////////
		SET_LAND_ITEMS(state, value) {
			state.landItems = value;
		},
		SET_LAND_ITEM(state, value) {
			state.landtItem = value;
		},
		SET_LAND_ITEM_DETAIL(state, value) {
			state.landItemDetail = value;
		},


		////// My Lands ////
		SET_MY_LANDS(state, value) {
			state.myLands = value;
		},
		SET_MY_LAND_QUERY(state, value) {
			state.myLandQuery = value;
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
			// console.log("[STORE.actions] showAlert(), ", value);
			context.commit('SHOW_ALERT',value);
		},
		showToast(context, value) {
			// console.log("[STORE.actions] showToast(), ", value);
			context.commit('SHOW_TOAST',value);
		},
		showLoading(context, value) {
			// console.log("[STORE.actions] showLoading(), ", value);
			context.commit('SHOW_LOADING',value);
		},
		showGameStartLoading(context, value) {
			// console.log("[STORE.actions] showGameStartLoading(), ", value);
			context.commit('SHOW_GAME_START_LOADING',value);
		},
		showLoginPopup(context, value) {
			// console.log("[STORE.actions] showLoginPopup(), ", value);
			context.commit('SHOW_LOGIN_POPUP',value);
		},
		showSelectWalletPopup(context, value) {
			// console.log("[STORE.actions] showSelectWalletPopup(), ", value);
			context.commit('SHOW_SELECT_WALLET_POPUP', value)
		},
		showEventPopup(context, value) {
			// console.log("[STORE.actions] showEventPopup(), ", value);
			context.commit('SHOW_EVENT_POPUP',value);
		},

		showAddWallet(context, value) {
			// console.log("[STORE.actions] showAddWallet(), ", value);
			context.commit('SHOW_ADD_WALLET',value);
		},

		showChangePasswordPopup(context, value) {
			// console.log("[STORE.actions] showChangePasswordPopup(), ", value);
			context.commit('SHOW_CHANGE_PASSWORD_POPUP',value);
		},

		showEditProfile(context, value) {
			// console.log("[STORE.actions] showEditProfile(), ", value);
			context.commit('SHOW_EDIT_PROFILE',value);
		},
		showStakingModal(context, value) {
			// console.log("[STORE.actions] showStakingModal(), ", value);
			context.commit('SHOW_STAKING_MODAL',value);
		},
		showSuccessModal(context, value) {
			// console.log("[STORE.actions] showSuccessModal(), ", value);
			context.commit('SHOW_SUCCESS_MODAL',value);
		},
		showConfirmModal(context, value) {
			// console.log("[STORE.actions] showConfirmModal(), ", value);
			context.commit('SHOW_CONFIRM_MODAL',value);
		},
		showInforModal(context, value) {
			context.commit('SHOW_INFO_MODAL', value);
		},
		setUserInfo(context, value) {
			// console.log("[STORE.actions] setUserInfo(), ", value);
			context.commit('SET_USER_INFO',value);
		},
		setCountryCodeNo(context, value) {
			// console.log("[STORE.actions] setCountryCodeNo(), ", value);
			context.commit('SET_COUNTRY_CODE_NO',value);
		},
		setWallet(context, value) {
			// console.log("[STORE.actions] setWallet(), ", value);
			context.commit('SET_WALLET',value);
		},
		setWalletBalance(context, value) {
			// console.log("[STORE.actions] setWalletBalance(), ", value);
			context.commit('SET_WALLET_BALANCE',value);
		},
		setWalletPolygonBalance(context, value) {
			// console.log("[STORE.actions] setWalletBalance(), ", value);
			context.commit('SET_WALLET_POLYGON_BALANCE',value);
		},
		setNetwork(context, value) {
			context.commit('SET_NETWORK', value)
		},
		/// Home ////
		setHomeNews(context, value) {
			// console.log("[STORE.actions] setHomeNews(), ", value);
			context.commit('SET_HOME_NEWS',value);
		},
		/// Market ////
		setMarketItems(context, value) {
			// console.log("[STORE.actions] setMarketItems(), ", value);
			context.commit('SET_MARKET_ITEMS',value);
		},
		setMarketItem(context, value) {
			// console.log("[STORE.actions] setMarketItem(), ", value);
			context.commit('SET_MARKET_ITEM',value);
		},

		setMarketQuery(context, value) {
			// console.log("[STORE.actions] setMarketQuery(), ", value);
			context.commit('SET_MARKET_QUERY',value);
		},

		/// LAND ////
		setLandQuery(context, value) {
			// console.log("[STORE.actions] setLandQuery(), ", value);
			context.commit('SET_LAND_QUERY',value);
		},
		setLandInfo(context, value) {
			// console.log("[STORE.actions] setLandInfo(), ", value);
			context.commit('SET_LAND_INFO',value);
		},

		setLandMenu(context, value) {
			// console.log("[STORE.actions] setLandMenu(), ", value);
			context.commit('SET_LAND_MENU',value);
		},

		setLandItems(context, value) {
			// console.log("[STORE.actions] setLandItems(), ", value);
			context.commit('SET_LAND_ITEMS',value);
		},
		setLandItem(context, value) {
			// console.log("[STORE.actions] setLandItem(), ", value);
			context.commit('SET_LAND_ITEM',value);
		},
		setLandItemDetail(context, value) {
			// console.log("[STORE.actions] setLandItem(), ", value);
			context.commit('SET_LAND_ITEM_DETAIL',value);
		},

		/// My Land ////
		setMyLands(context, value) {
			// console.log("[STORE.actions] setMyItems(), ", value);
			context.commit('SET_MY_LANDS',value);
		},

		setMyLandQuery(context, value) {
			// console.log("[STORE.actions] setMyItemQuery(), ", value);
			context.commit('SET_MY_LAND_QUERY',value);
		},

		/// My Item ////
		setMyItems(context, value) {
			// console.log("[STORE.actions] setMyItems(), ", value);
			context.commit('SET_MY_ITEMS',value);
		},

		setMyItemQuery(context, value) {
			// console.log("[STORE.actions] setMyItemQuery(), ", value);
			context.commit('SET_MY_ITEM_QUERY',value);
		},

		/// News ////
		setNews(context, value) {
			// console.log("[STORE.actions] setNews(), ", value);
			context.commit('SET_NEWS',value);
		},
		setNewsItem(context, value) {
			// console.log("[STORE.actions] setNewsItem(), ", value);
			context.commit('SET_NEWS_ITEM',value);
		},
	},
	modules: {},
})
