<template>

	<Login
		appear
		v-if="isShowLoginPopup"
	/>

	<Event
		appear
		v-if="isShowEventPopup"
	/>

	<PopupAddWallet
		appear
		v-if="isShowAddWallet"
	/>

	<PopupChangePassword
		appear
		v-if="isShowChangePasswordPopup"
	/>

	<PopupEditProfile
		appear
		v-if="isShowEditProfile"
	/>


	<transition	appear name="fade">
		<div v-if="isShowAlert" class="alert-box">
			<div class="message-box" >
				<div class="close-btn"
					@click="mxCloseAlert(false)"
				></div>
				<div class="message" v-html="$store.state.showAlert.msg"></div>
				<div class="btn g-btn"
					@click="mxCloseAlert(true)" >
					{{$store.state.showAlert.btn ? $store.state.showAlert.btn : $t('btn.ok') }}
				</div>
			</div>
		</div>
	</transition>

	<transition	appear name="fade">
		<div v-if="isShowToast" class="toast-box">
			<div class="message-box" v-html="$store.state.showToast.msg">
			</div>
		</div>
	</transition>

	<transition	appear name="fade">
		<div v-if="isShowLoading" class="loading-box" :active="isShowLoading ? 'on' : 'off'">
			<div class="loading-icon" ></div>
		</div>
	</transition>
	<transition	appear name="fade-game-start">
		<div v-if="isShowGameStartLoading" class="game-start-loading-box" >
			<div class="message-box-wrap">
				<div class="message-box" >
					<div class="close-btn"
						@click="mxCloseGameStartLoading()"
					></div>
					<div class="message-title" v-html="mxGetVHtml($t('game-start.title'))"></div>
					<div class="message-foot">
						{{$t('game-start.foot-first-line')}}<br>
						{{$t('game-start.foot-second-line')}}<span @click="onClickToGoDownload()">{{' '+$t('game-start.foot-second-line-link-text')}}</span>
					</div>
					<div class="bg-image"></div>
				</div>
			</div>
		</div>
	</transition>

	<transition	appear name="fade">
		<div v-if="mxIsOnTopBtn()" class="top-btn"></div>
	</transition>

		<div id="content">
			<GNB
				appear
				@change-locale="changeLocale"
				@click="showLogin"
				:theme="theme"
				:userInfo="userInfo"
				:wallet="wallet"
			/>
			<transition
				appear
				@before-enter="beforeEnter"
				@enter="enter"
				:css="false"
			>
				<router-view />
			</transition>
		</div>

</template>

<script>

import axios from 'axios'

import Velocity from 'velocity-animate'

// https://github.com/magisters-cc/vue-smooth-scrollbar/blob/master/src/index.js
// https://github.com/idiotWu/smooth-scrollbar/blob/900f2434f8b61237af52de3bf9f07c87c0638917/docs/api.md
import Scrollbar, { ScrollbarPlugin }   from 'smooth-scrollbar'

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();

import GNB from './components/GNB.vue'
import Login from './components/Login.vue'
import Event from './components/Event.vue'
import PopupAddWallet from './components/Popup.AddWallet.vue'
import PopupChangePassword from './components/Popup.ChangePassword.vue'
import PopupEditProfile from './components/Popup.EditProfile.vue'

import WalletAPI from '@/features/WalletAPI.js'
var wAPI = new WalletAPI();

import CountryCodes from '@/features/CountryCodes.js'
var CCodes = new CountryCodes();

// https://github.com/idiotWu/smooth-scrollbar/blob/900f2434f8b61237af52de3bf9f07c87c0638917/docs/plugin.md
class myPlugin extends ScrollbarPlugin {
	static pluginName = 'myPlugin';

	transformDelta(delta, fromEvent) {
		return {
			// x: delta.x * 0,
			x: 0,  // remove scroll x :: especially in case of mobile touch
			y: delta.y * 1,
		};
	}
}

export default {
	components: {
		Scrollbar,
		GNB,
		Login,
		Event,
		PopupAddWallet,
		PopupChangePassword,
		PopupEditProfile
	},
	created() {
		// window.addEventListener('keyup', this.historyBack);
	},
	mounted() {

		if(!Scrollbar.has(_U.Q('#content'))) {
			Scrollbar.use(myPlugin);
			this.scrollbar = Scrollbar.init(_U.Q('#content'));
			this.scrollbar.track.xAxis.element.remove();
			window['gMainScrollbar'] = this.scrollbar;
		}

		if (window.orientation !== undefined) {
			_U.setAttr(_U.Q('#app'),{mobile:"on"});
		}

		window.addEventListener('beforeunload', this.unLoadEvent);

		if(this.$cookies.isKey('userInfo')) {
			var userInfo = this.$cookies.get('userInfo');

			var wlt= {
				currentAccountIdx: 0,
				currentAccount: userInfo.wallet_addr,
				accounts: [userInfo.wallet_addr],
				balance: 0,
				updated: true,
			}

			this.mxSetWallet(wlt);
			this.$store.dispatch('setUserInfo',userInfo);
		}

		if(this.$cookies.isKey('countryCodeNo')) {
			var countryCodeNo = this.$cookies.get('countryCodeNo');
			this.mxSetCountryCodeNo(countryCodeNo);
		}else{
			axios({
				method:'get',
				url: gConfig.geojs_url, //  'https://get.geojs.io/v1/ip/country.json',
			})
			.then((resp) => {
				var cc = _U.getIfDefined(resp,['data','country']);
				// testing
				// cc = 'BM'; // 1441
				if(cc) {
					var code = null;
					for(var i=0; i< CCodes.codes.length; i++) {
						var c = CCodes.codes[i];
						if(c.ccode == cc) {
							code = c;
							break;
						}
					}
					if(code) {
						this.mxSetCountryCodeNo(code.value);
					}
				}
			});
		}

		this.setDownloadUrl('WINDOWS');
		this.setDownloadUrl('MAC');
		this.setEthereumEvent();

		// window.DVW['app']={
		// 	store:this.$store,
		// 	cookie:this.$cookie,
		// 	showToast: this.mxShowToast,
		// 	showAlert: this.mxShowAlert,
		// 	showLoading: this.mxShowLoading,
		// 	closeLoading: this.mxCloseLoading,
		// 	closeToast: this.mxCloseToast,
		// 	closeAlert: this.mxCloseAlert,
		// 	gameStart: this.mxGameStart,
		// 	showGameStartLoading:this.mxShowGameStartLoading,
		// 	closeGameStartLoading:this.mxCloseGameStartLoading,
		// };
	},
	beforeUnmount() {
		window.removeEventListener('beforeunload', this.unLoadEvent)
	},
	updated() {
		console.log("[App.vue] updated(), route : ", this.$route)
		this.scrollTop();
	},
	computed: {
		isShowAlert() {
			return this.$store.state.showAlert.show;
		},
		isShowToast() {
			return this.$store.state.showToast.show;
		},
		isShowLoading() {
			return this.$store.state.showLoading;
		},
		isShowGameStartLoading() {
			return this.$store.state.showGameStartLoading;
		},
		isShowLoginPopup() {
			return this.$store.state.showLoginPopup;
		},
		isShowEventPopup() {
			return this.$store.state.showEventPopup;
		},
		isShowAddWallet() {
			return this.$store.state.showAddWallet;
		},
		isShowChangePasswordPopup() {
			return this.$store.state.showChangePasswordPopup;
		},
		isShowEditProfile() {
			return this.$store.state.showEditProfile;
		},

		theme() {
			return (
				this.$route.name == 'Home' ||
				this.$route.name == 'Studio' ||
				this.$route.name == 'Market' ||
				this.$route.name == 'Market-Detail' ||
				this.$route.name == 'MyPage-Page')
				? 'black'
				: (this.$route.name == 'Signup' || this.$route.name == 'Signup-Page')
					? 'blue'
					: 'white';
		},
		userInfo() {
			return this.$store.state.userInfo;
		},
		wallet() {
			return this.$store.state.wallet;
		},
	},
	watch: {
		isShowToast(newVal, oldVal) {
			console.log("[App.vue] watch showAlert() newVal, oldVal:", newVal, oldVal);
			if(newVal == true) {
				if(this.showToastTimer) clearTimeout(this.showToastTimer);
				this.showToastTimer = setTimeout(() => {
					this.mxCloseToast();
				},1500);
			}
		},
		userInfo(newVal, oldVal) {
			console.log("[App.vue] watch userInfo() newVal, oldVal:", newVal, oldVal);
			if(	(_U.isDefined(newVal,'id') && !_U.isDefined(oldVal,'id')) ||
				(_U.isDefined(newVal,'id') && _U.isDefined(oldVal,'id') && newVal.id !== oldVal.id)
			) {
				console.log("[App.vue] watch userInfo() , userInfo ", this.userInfo);
				this.initWallet();
			}
		},
		wallet(newVal, oldVal) {
			console.log("=================== wallet:", newVal, oldVal);

			if( _U.isDefined(newVal,'accounts') && newVal.accounts.length > 0
				&& _U.getIfDefined(newVal, 'updated') == true
			) {
				console.log("[App.vue] watch wallet() , wallet ", newVal);
				this.getDviBalance();
			}
		}

	},
	data() {
		return {
			showToastTimer: null,
			scrollbar: null,
		}
	},

	methods: {

		historyBack(e) {
			// if(e.keyCode == 8) {
			// 	console.log("===================== history Back...", e.keyCode);
			// // 	// if(isShowAlert) {
			// // 	// 	this.mxCloseAlert();
			// // 	// }
			// // 	this.$router.go(-1);
			// }
		},

		scrollTop() {
			this.scrollbar.scrollTo(0,0);
		},

		setEthereumEvent() {

			if(_U.isDefined(window,'ethereum')) {
				window.ethereum.on('accountsChanged', function (accounts) {
					// account change event
					if(accounts && accounts.length > 0) {
						console.log("account changed : ", accounts[0]);
						// if(this.$store.state.userInfo) {
						// 	var user_addr = this.$store.state.userInfo.wallet_addr;
						// 	if(user_addr != accounts[0]) {
						// 		console.log("Wrong address selected");
						// 	}else{
						// 		console.log("Same address!!!");
						// 	}
						// }
					}else{
						console.log("account changed : account is not defined. ");
					}

					// var isAccountAvailable = wAPI.checkAccountAvailable(_accounts[0]);
					// if(isAccountAvailable) {
					// 	this.mxShowToast("Metamask account is available in Dvision World");
					// } else {
					// 	this.mxShowToast("Account is not registered to your ID");
					// }
				});
			}else{
				console.log("ethereum is not defined. USE Chrome Browser !!");
			}
		},
		initWallet() {
			this.mxShowLoading();
			wAPI.checkMetamask().then((rv)=>{
				if(rv != 'NONE') {
					wAPI.Request_Account((resp) => {
						// console.log('[App.vue] initWallet() -> Request_Account : resp', resp);
						if(resp.res_code == 200) {
							// console.log('[App.vue] initWallet() 2 -> Request_Account : resp', resp.data.account);
							var account = _U.getIfDefined(resp,['data','account']);
							// this.callWalletAddressList(account);
						}else{
							console.log("Error on get wallet url", resp);
							this.mxShowToast(_U.getIfDefined(resp,['data','message']));
						}
						this.mxCloseLoading();
					});
				}else{
					this.mxCloseLoading();
				}
			});
		},
		// callWalletAddressList(currWltAddr) { // current wallet address == account of wallet


		// 	var data = {
		// 		'account' : this.userInfo.account
		// 	};
		// 	console.log("[App] callWalletAddressList()-> req ", data);

		// 	_U.callPost({
		// 		url:gConfig.member_wallet_list,
		// 		data: data,
		// 		callback: (resp) =>{

		// 			console.log('[App] callWalletAddressList() -> resp', resp);
		// 			console.log('[App] this.wallet :', this.wallet);

		// 			// accounts = [{ account:userInfo.account, createtime: "2021-06-29 20:07:15". wallet_addr:"0x...." }, ...]
		// 			var accounts = _U.getIfDefined(resp,['data','rows']);
		// 			if(!accounts || accounts.length < 1) {
		// 				var wlt= {
		// 					currentAccountIdx: -1,
		// 					currentAccount: null,
		// 					accounts: [],
		// 					balance: 0,
		// 				}
		// 				this.mxSetWallet(wlt);
		// 				this.mxShowToast(this.$t('popup.wallet-list-not-found'));
		// 				return;
		// 			}
		// 			var cIdx = -1;
		// 			for(var i=0; i<accounts.length; i++) {
		// 				if(_U.getIfDefined(accounts[i],'wallet_addr') == currWltAddr) {
		// 					cIdx = i;
		// 					break;
		// 				}
		// 			}

		// 			var wlt= {
		// 				currentAccountIdx: cIdx,
		// 				currentAccount: currWltAddr,
		// 				accounts: accounts,
		// 				balance: 0,
		// 			}

		// 			if(cIdx < 0 ) {
		// 				this.mxShowToast(this.$t('popup.wallet-not-registered'));
		// 				wlt= {
		// 					currentAccountIdx: 0,
		// 					currentAccount: accounts[0].wallet_addr,
		// 					accounts: accounts,
		// 					balance: 0,
		// 				}
		// 			}

		// 			this.mxSetWallet(wlt);
		// 		}
		// 	});
		// },
		getDviBalance() {

			var account = _U.getIfDefined(this.$store.state,['userInfo','wallet_addr']);
			console.log("[App.vue] getDivBalance === account,", account);

			if(!account) {
				console.log("[App.vue] getDviBalance(), no account in wallet !!");
				return;
			}
			wAPI.getDviBalance(account, (resp) => {
				console.log('[App.vue] getDviBalance() -> getDviBalance : resp', resp);

				if(resp.res_code == 200) {
					var balance = _U.getIfDefined(resp,['data','balance']);
					if(balance != null) {
						this.mxSetWalletBalance(balance);
						return;
					}
				}
				this.mxShowToast(_U.getIfDefined(resp,['data','message']));
				this.mxSetWalletBalance(0);
				console.log("Error on get balance url", resp)
			});

		},

		setDownloadUrl(os) {

			var data = {platform: os};
			var urlName = '';

			if(os == 'WINDOWS') {
				urlName = 'gDVWorldWindowsAppDownloadUrl';
			} else {
				urlName = 'gDVWorldMacAppDownloadUrl';
			}
			_U.callPost({
				url:gConfig.get_download_url,
				data: data,
				callback: (resp) =>{
					// console.log("==================", resp);
					var url = _U.getIfDefined(resp,'data');
					if(url) {
						window[urlName] = url;
					}
				}
			});

		},
		changeLocale(locale) {
			// this.$i18n.locale=locale.lang;
			if(this.$i18n.locale=='en') {
				this.$i18n.locale = 'ko'
			}else{
				this.$i18n.locale = 'en'
			}

		},
		onClickToGoDownload() {
			this.$router.push({name:"Guide-Page", params:{page: 'download'}});
			this.mxCloseGameStartLoading();
		},
		startNow() {
			console.log("startNow()")
		},
		beforeEnter(el) {
			el.style.opacity = 0
			console.log("==== transition beforeEnter....")
		},
		enter(el, done) {
			console.log("==== transition enter....")
			Velocity(
				el,
				{ opacity: 1 },
				{ duration: 2000, easing: [70, 8], complete: done }
			)

		},
		unLoadEvent(e) {
			this.$cookies.set('userInfo', this.$store.state.userInfo, gConfig.getUserInfoCookieExpireTime());
		}
	},
}
</script>

<style lang="scss">

.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.fade-game-start-enter-active, .fade-game-start-leave-active {
  transition: all 0.8s ease-in-out;
}
.fade-game-start-enter-from, .fade-game-start-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

body {
	background-color: black;
}
#app{
    position: absolute;
    top: 0px;
    left: 0px;
    display: block;
    width: 100vw;
    height: 100vh;
}

.alert-box {
	position: absolute;
	z-index: -1;
	top:0px;
	left:0px;
	width:0px;
	height:0px;
	@include FLEX(center, center);
	.close-btn {
		position: absolute;
		@include SetBgImage(url('./assets/img/ic-closed-popup.svg'));
		width : gREm(40);
		height: gREm(40);
		top:gREm(-51);
		cursor: pointer;
		@include OnOverTransition();
	}
	.message-box {
		@include FLEX(center, center);
		text-align: center;
		width:auto;
		height:auto;

	}
}

.toast-box, .alert-box, .loading-box {
	position: absolute;
	z-index: $Z-INDEX-TOAST;
	background-color: rgba(0, 0, 0, 0.5);
	top:0vh;
	left:0vw;
	width:100vw;
	height:100vh;
	@include FLEX(center, center);
	.message-box {
		@include FLEX(center, center);
		width:auto;
		height:auto;
		padding: gREm(28) gREm(67);
		border-radius: gREm(20);
  		box-shadow: 0 gREm(6) gREm(18) 0 rgba(0, 0, 0, 0.28);
  		background-color: #ffffff;
		@include Set-Font($AppFont, gREm(20), gREm(34), #0d0c22);
		text-align: center;
	}
}

.alert-box {
	z-index: $Z-INDEX-ALERT;
	.message-box {
		@include FLEXV(space-between, center);
		min-width: gREm(520);
		max-width: gREm(650);
		.message {
			width: auto;
			height: auto;
			@include Set-Font($AppFont, gREm(20), gREm(34), #0d0c22);
			text-align: center;
			padding-top: gREm(80 - 28);
			padding-bottom: gREm(80);
			word-wrap: break-word;
			white-space: pre-wrap;
		}
		.btn {
			width: gREm(200);
			height: gREm(60);
			border-radius: gREm(6);
			@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
			text-align: center;
			margin-bottom: gREm(60 - 28)
		}
	}
}

.game-start-loading-box {
	position: absolute;
	z-index: $Z-INDEX-GAME-START-LOADING;
	top:0vh;
	left:0vw;
	width:100vw;
	height:100vh;
	@include FLEX(center, center);
	.message-box-wrap {
		@include FLEX(center, center);
		width:gREm(732 + 50);
		height:gREm(475);
		padding-left: gREm(50);
		padding-top: gREm(23);
		.message-box {
			@include FLEXV(flex-start, center);
			width:gREm(732 + 50);
			height:gREm(475);
			.close-btn {
				position: absolute;
				@include SetBgImage(url('./assets/img/ic-game-start-loading-close-btn.svg'));
				width : gREm(40);
				height: gREm(40);
				top:gREm(-41);
				margin-right:gREm(20);
				cursor: pointer;
				@include OnOverTransition();
			}
			.bg-image {
				position: absolute;
				width: gREm(732);
				height: gREm(467); // gREm(475);
				margin-left:gREm(50);
				bottom: 0px;
				@include SetBgImage(url('./assets/img/game-start-loading-popup-bg.png'));
			}
			.message-title {
				z-index:1;
				margin-top: gREm(151);
				width: 100%;
				height: gREm(75);
				@include Set-Font($AppFont, gREm(30), gREm(38), #3F4A8C,600);
				text-shadow: 2px 2px 1px rgba(0,0,0,0.4);
				text-align: center;
			}
			.message-foot {
				z-index:1;
				margin-top: gREm(53);
				width: 100%;
				height: gREm(33);
				@include Set-Font($AppFont, gREm(13), gREm(17), #ffffff);
				text-align: center;
				text-shadow: 2px 2px 1px rgba(0,0,0,0.4);
				span {
					color: #14E5FF;
					cursor: pointer;
					&:hover {
						text-decoration-line: underline;
					}
				}

			}
		}
	}
}

@keyframes aniLoading {
	from { background-position: 0px 0px; }
	to { background-position: calc(150px * -20) 0px; }
}

.loading-box {
	z-index: $Z-INDEX-LOADING;
	background-color: rgba(0,0,0,0.4);
	.loading-icon {
		width:gREm(150);
		height:gREm(150);
  		background-color: transparent;

		background:url('./assets/img/loading-for-black.png') top left no-repeat;
		// background-position-x: 0px;
		// background-position-y: 0px;

	}
	&[active="on"] {
		.loading-icon {
			animation-duration: 1s;
			animation-iteration-count: infinite;
			animation-direction: normal;
			animation-name: aniLoading;
			animation-timing-function: steps(20,end);
		}
	}
	&[active="off"] {
		.loading-icon {
			animation-duration: 0.1s;
			animation-iteration-count: 1;
			animation-direction: normal;
			animation-name: aniLoading;
			animation-timing-function: steps(27,end);
		}
	}
}

#content {
	position: absolute;
    top: 0px;
    left: 0px;
    display: block;
    width: 100vw;
    height: 100vh;
}
.top-btn{
	position: fixed;
	width:gREm(50);
	height: gREm(50);
	right: gREm(130);
	bottom: gREm(40);
	// @include FLEX(flex-end,flex-end);
	@include SetBgImage(url('./assets/img/home/btn-page-up-n.svg'));
	z-index: $Z-INDEX-GO-TOP-BTN;
}
</style>
