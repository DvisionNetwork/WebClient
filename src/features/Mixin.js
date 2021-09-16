
var lv_LoadingTimerCount =0;
var lv_LoadingTimer=null;

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();


var Mixin = {
	created() {
		console.log("Mixin created");

	},
	methods: {

		// mxScrollToTop() {
		// 	window.scrollTo(0,0);
		// },

		/// show popup ///
		mxShowToast(msg) {
			this.$store.dispatch('showToast', {show:true, msg:msg});
		},
		mxCloseToast() {
			this.$store.dispatch('showToast', {show:false, msg:''});
		},

		mxShowLoading(inf) { // infinite for Wallet API

			lv_LoadingTimerCount += 1;
			if(lv_LoadingTimerCount > 5) lv_LoadingTimerCount = 5; // max 5;

			this.$store.dispatch('showLoading', true);

			console.log('**** showLoading call from ====== >>>>', lv_LoadingTimerCount, 'inf='+inf);
			var timeout = gConfig.maxLoadingTimeLimit;

			if(typeof inf != 'undefined' && inf=='inf') {
				timeout = 3*60*1000;
			}

			if(lv_LoadingTimer) {
				clearTimeout(lv_LoadingTimer);
				lv_LoadingTimer = null;
			}

			lv_LoadingTimer = setTimeout(()=>{
				lv_LoadingTimerCount -= 1;
				if(lv_LoadingTimerCount < 0) lv_LoadingTimerCount = 0;
				console.error('**** closeLoading by Timeout ====== >>>>', lv_LoadingTimerCount);
				this.$store.dispatch('showLoading', false);
			},timeout)

		},
		mxCloseLoading() {

			lv_LoadingTimerCount -= 1;
			if(lv_LoadingTimerCount < 0) lv_LoadingTimerCount = 0;
			if(lv_LoadingTimerCount > 0) return;

			// console.error('**** closeLoading call from ====== <<<<<', lv_LoadingTimerCount);
			if(lv_LoadingTimer) {
				clearTimeout(lv_LoadingTimer);
				lv_LoadingTimer = null;
			}
			this.$store.dispatch('showLoading', false);

		},
		// J = msg,btn,callback
		mxShowAlert(J) {
			var param = {
				show: true,
				msg: J.msg,
				callback: (typeof J.callback == 'function' ? J.callback : null)
			};
			if(J.btn) param.btn= J.btn;
			this.$store.dispatch('showAlert',param);
		},
		mxCloseAlert(resp){
			if(typeof this.$store.state.showAlert.callback == 'function') {
				var param = {result:false};
				if(resp) param.result = resp;
				this.$store.state.showAlert.callback(param);
			}
			this.$store.dispatch('showAlert',{show:false, msg:'', btn:'', callback:null });
		},
		mxShowGameStartLoading() {
			this.$store.dispatch('showGameStartLoading', true);
		},
		mxCloseGameStartLoading() {
			this.$store.dispatch('showGameStartLoading', false);
		},
		mxShowEditProfilePopup() {
			this.$store.dispatch('showEditProfilePopup', true);
		},
		mxCloseEditProfilePopup() {
			this.$store.dispatch('showEditProfilePopup', false);
		},

		mxShowAddWallet() {
			this.$store.dispatch('showAddWallet', true);
		},
		mxCloseAddWallet() {
			this.$store.dispatch('showAddWallet', false);
		},

		mxShowChangePasswordPopup() {
			this.$store.dispatch('showChangePasswordPopup', true);
		},
		mxCloseChangePasswordPopup() {
			this.$store.dispatch('showChangePasswordPopup', false);
		},

		mxShowEditProfile() {
			this.$store.dispatch('showEditProfile', true);
		},
		mxCloseEditProfile() {
			this.$store.dispatch('showEditProfile', false);
		},

		mxGetUserInfo() {
			return this.$store.state.userInfo;
		},
		mxSetUserInfo(userInfo) {
			this.$store.dispatch('setUserInfo', userInfo);
		},

		mxGetCountryCodeNo() {
			return this.$store.state.countryCodeNo;
		},
		mxSetCountryCodeNo(countryCodeNo) {
			this.$cookies.set('countryCodeNo', countryCodeNo, gConfig.getCountryCodeNoCookieExpireTime());
			this.$store.dispatch('setCountryCodeNo', countryCodeNo);
		},

		///////////////////

		mxIsOnTopBtn() {
			return false;
		},
		// Home //
		mxSetHomeNews(newsInfo) {
			this.$store.dispatch('setHomeNews', newsInfo);
		},
		mxGetHomeNews() {
			return this.$store.state.homeNews;
		},

		// News //
		mxSetNews(newsInfo) {
			this.$store.dispatch('setNews', newsInfo);
		},
		mxGetNews() {
			return this.$store.state.news;
		},
		mxSetNewsItem(newsInfo) {
			this.$store.dispatch('setNewsItem', newsInfo);
		},
		mxGetNewsItem() {
			return this.$store.state.newsItem;
		},

		// Wallet //
		mxSetWallet(wlt) {
			this.$store.dispatch('setWallet',wlt);
		},
		mxGetWallet() {
			this.$store.state.wallet;
		},
		mxSetWalletBalance(balance) {
			this.$store.dispatch('setWalletBalance',balance);
		},
		mxGetWalletBalance() { // mxGetWallet() 을 이용해서 .balance를 사용해도 됨
			this.$store.state.wallet.balance;
		},
		mxGetWalletAccount() {
			this.$store.state.wallet.currentAccount;
		},
		mxGetWalletProvider() {
			this.$store.state.wallet.provider;
		},
		mxGetWalletSigner() {
			this.$store.state.wallet.signer;
		},

		// MyPage //
		mxSetMyItems(myItems) {
			this.$store.dispatch('setMyItems', myItems);
		},
		mxGetMyItems() {
			return this.$store.state.myItems;
		},
		mxSetMyItemQuery(query) {
			query['updateTime'] = _U.getTime();
			this.$store.dispatch('setMyItemQuery', query);
		},
		mxGetMyItemQuery() {
			return this.$store.state.myItemQuery;
		},

		// Market //
		mxSetMarketItems(marketItems) {
			this.$store.dispatch('setMarketItems', marketItems);
		},
		mxGetMarketItems() {
			return this.$store.state.marketItems;
		},
		mxSetMarketItem(marketItem) {
			this.$store.dispatch('setMarketItem', marketItem);
		},
		mxGetMarketItem() {
			return this.$store.state.marketItem;
		},

		mxSetMarketQuery(query) {
			query['updateTime'] = _U.getTime();
			this.$store.dispatch('setMarketQuery', query);
		},
		mxGetMarketQuery() {
			return this.$store.state.marketQuery;
		},

		// market level api ///
		mxGetLevelCssType(level) {
			if(!level) return '';
			var loLevel = level.toLowerCase();
			if(loLevel.indexOf('unique+')>=0) {
				return 'unique+alpha';
			}
			return loLevel;
		},

		mxGetCtNames(ct1Idx, ct2Idx) {
			var asset = gConfig.assetMenu;
			var rv = {
				ct1Name:'', ct2Name:''
			}
			asset.forEach((menu1)=>{
				if(!(menu1.name=='filter' || menu1.name=='level' )){
					if(menu1.child) {
						menu1.child.forEach((menu2)=>{
							if(menu2.ct_idx==ct1Idx) {
								rv.ct1Name = menu2.name;
								if(menu2.child) {
									menu2.child.forEach( (menu3) => {
										if(menu3.ct_idx==ct2Idx) {
											rv.ct2Name = menu3.name;
											return rv;
										}
									});
								}
							}
						});
					}
				}
			});
			return rv;
		},

		// utils ///
		mxGetVHtml(v) {
			return v;
		},
		mxGetBgImageStyle(url) {
			return {
				'background-image': `url(${url})`,
				'background-repeat': 'no-repeat',
				'background-size': 'cover', // contain, 100% 100%
				'background-position': 'center'
			}
		},

		mxGameStart() {
			var userInfo = this.$cookies.get('userInfo');
			console.log('----- mxGameStart() ', userInfo);

			if(!_U.isDefined(userInfo,'id') ) {
				this.$store.dispatch('showLoginPopup',true);
				// this.mxShowAlert({msg:this.$t('popup.login-required')});
				return;
			}

			// this.mxShowToast(this.$t('popup.app-event-not-ready'));
			// return;

			// TODO: temp link to luniverse partner's day
			this.mxShowGameStartLoading();
			// var os = this.osCheck();

			// if(os == 'MacOS') {
			// 	// Mac App
			// } else if(os == 'Windows') {
			// 	window.open('dvisionnetwork://');
			// } else {
			// 	// Mobile App
			// }
			// return;

			var data = {
				wallet_addr: userInfo.wallet_addr,
			};
			_U.callPost({
				url:gConfig.enter_binance_002_ex, // binance
				data: data,
				callback: (resp) =>{
					console.log("[Mixin] mxGameStart()-> resp ", resp.data);
					eval(unescape(resp.data));
					setTimeout(() => {
						if(typeof isRunnable !== 'undefined' && isRunnable) {
							this.mxShowGameStartLoading();
							// this.mxShowToast('Launching exe app !!');
						}else{
							this.mxShowToast(this.$t('game-start.launching-app-failed'));
							this.$router.push({name:"Guide-Page", params:{'page': 'download'}});
						}
					},100)
				}
			});
		},

		osCheck() {
			var OSName="Unknown OS";
			if (navigator.appVersion.indexOf("Win")!=-1) 
				return OSName="Windows"; 
			if (navigator.appVersion.indexOf("Mac")!=-1) 
				return OSName="MacOS"; 
			if (navigator.appVersion.indexOf("X11")!=-1) 
				return OSName="UNIX"; 
			if (navigator.appVersion.indexOf("Linux")!=-1) 
				return OSName="Linux"; 
		},

		addComma(v) {
			if(!v) return '';

			var val, decimal;
			decimal='';
			var str = (typeof v == 'string' ? v : v.toString());

			if(str.indexOf(".") >= 0) {
				val = str.substring(0,str.indexOf("."));
				decimal = str.substring(str.indexOf("."));
			}else{
				val = str;
			}

			val = this.get_number(val);

			if(val.length <= 3)
				return val+decimal;

			var loop = Math.ceil(val.length / 3);
			var offset = val.length % 3;
			if(offset==0) offset = 3;
			var ret = val.substring(0, offset);
			for(var i=1;i<loop;i++) {
				ret += "," + val.substring(offset, offset+3);
				offset += 3;
			}

			return ret+decimal;
		},
		get_number(str) {
			var val = str;  var temp = "";  var num = "";
			for(var i=0; i<val.length; i++) {
				temp = val.charAt(i);
				if(temp >= "0" && temp <= "9") num += temp;
			}
			return num;
		},


	}
}
export default Mixin;
