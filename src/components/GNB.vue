<template>
	<div class="GNB" :theme="theme ? theme: 'black'" :signed="signed" :class="isShowNavbar?'shadow':''">
		<img src="../assets/img/btn-menu-2.svg" v-if="!isShowNavbar" class="button-nav" @click="showNavbar" />
		<img src="../assets/img/btn-menu-close.svg" v-else class="button-nav" @click="showNavbar" />
		<div class="gnb-box-bg"></div>
		<div class="gnb-box" :class="isShowNavbar ? 'active' : ''">
			<div class="menu-box">
				<router-link class="logo" :to="{ params: {lang:'en'}, name:'Home'}"></router-link>
				<div class="menus">
					<router-link @click="isShowNavbar=false" class="menu" :active="(currentPage=='Market' || currentPage=='Market-Detail' || currentPage=='Market-Page' || currentPage=='Market-Detail-Index' ? 'on' : 'off')" :to="{ params: {lang:'en'}, name:'Market'}"> {{$t("gnb.market_place")}} </router-link>
					<router-link @click="isShowNavbar=false" class="menu" :active="(currentPage=='Studio' ? 'on' : 'off')" :to="{ params: {lang:'en'}, name:'Studio'}"> {{$t("gnb.studio")}} </router-link>
					<router-link @click="isShowNavbar=false" class="menu" :active="(currentPage=='Guide-Page' ? 'on' : 'off')" :to="{ params: {lang:'en'}, name:'Guide'}"> {{$t("gnb.guide")}} </router-link>
					<router-link @click="isShowNavbar=false" class="menu" :active="(currentPage=='News-Page' || currentPage=='News-Detail' ? 'on' : 'off')" :to="{ params: {lang:'en'}, name:'News'}"> {{$t("gnb.news")}} </router-link>
					<a @click="isShowNavbar=false" class="menu" href="https://dvision-bridge.multibaas.app/" target="_blank">{{$t("gnb.bridge")}}</a>
					<!-- <router-link class="menu" :active="(currentPage=='Help' ? 'on' : 'off')" :to="{ params: {lang:'en'}, name:'Help'}"> {{$t("gnb.help")}} </router-link> -->
					<div :class="isShowNavbar?'menu-btns-mobile':'hidden'">
						<div class="dvs-nav-item">
							<div class="dvg-coin">
								<img src="../assets/img/ic-dvi-market.svg" alt="">
								{{addComma(wallet.balance)}}
							</div>
						</div>
							<div class="dvs-nav-item" > 
							<div class="dvs-user" v-if="signed=='on'">
								<div class="uinfo-icon">
									<span class="cap-text">{{ getCapitalChar(userInfo.name) }}</span>
								</div>
								<div class="user-menu mypage" @click="goMyPage()">{{$t('gnb.mypage')}}</div>
							</div>
							<div v-else class="dvs-no-user">
								<span class="menu text" @click="login">{{ $t("gnb.login")}}</span>
								<router-link @click="isShowNavbar=false" class="menu text signup" :active="(currentPage=='Signup' || currentPage=='Signup-Page' ? 'on' : 'off')" :to="{ params: {lang:'en'}, name:'Signup'}"> {{$t("gnb.signup")}} </router-link>
							</div>
							<button class="btn g-btn" :class="{'no-login-btn': signed != 'on'}" @click="startNow">{{$t("gnb.start_now")}}</button>
						</div>
						<div class="dvs-nav-item">
							<div class="menu text" @click="isShowLangMenu=!isShowLangMenu">
								<span class="lang-text">{{ $t("gnb.language")}}</span>
								<transition appear name="fade">
									<div v-if="isShowLangMenu" class="user-menu-popup-wrap lang">
											<div class="list-lang">
												<div @click_xx="$emit('change-locale', { lang: 'en' })">{{$t('gnb.language-en')}}</div>
											</div>
									</div>
								</transition>
							</div>
							<div v-if="signed=='on'" class="user-menu logout" @click="logout()">{{$t('gnb.logout')}}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="menu-btns">
				<div class="menus">
					<div class="menu text" @mouseover="isShowLangMenu=true" @mouseleave="isShowLangMenu=false">
						<span class="lang-text">{{ $t("gnb.language")}}</span>
						<transition appear name="fade">
							<div v-if="isShowLangMenu" class="user-menu-popup-wrap lang">
								<div class="user-menu-popup">
									<div class="user-menu lang" @click_xx="$emit('change-locale', { lang: 'en' })">{{$t('gnb.language-en')}}</div>
								</div>
							</div>
						</transition>
					</div>

					<template v-if="signed=='on'">
						<span v-if="network=='POL'" class="menu pol-box">
							<span class="pol-icon"></span>
							<span class="pol-value">{{addComma(wallet.polygonBalance)}}</span>
						</span>
						<span class="menu dvi-box">
							<span class="dvi-icon"></span>
							<span class="dvi-value">{{addComma(wallet.balance)}}</span>
						</span>
						<div class="menu uinfo-icon" @mouseover="isShowAccountMenu=true" @mouseleave="isShowAccountMenu=false" >
							<span class="cap-text">{{ getCapitalChar(userInfo.name) }}</span>
							<transition appear name="fade">
								<div v-if="isShowAccountMenu" class="user-menu-popup-wrap dvi">
									<div class="user-menu-popup">
										<div class="user-menu mypage" @click="goMyPage()">{{$t('gnb.mypage')}}</div>
										<div class="user-menu logout" @click="logout()">{{$t('gnb.logout')}}</div>
									</div>
								</div>
							</transition>
						</div>
						<div class="info-network"
							@click="showNetwork = !showNetwork"
						>
							<div class="network-icon">
								<span>{{ checkedNetwork }}</span>
							</div>
							<transition appear name="fade">
								<div class="network-popup" v-if="showNetwork">
									<div
										class="network-wrapper"
										@click="onClickItem('ETH')"
									>
										<img
											class="icon"
											src="../assets/img/ethereum.png"
											alt="icon"
										/>
										<input
											type="checkbox"
											id="Ethereum"
											value="Ethereum"
											:checked="checkedNetwork === 'Ethereum'"
										/>
										<label for="etherium">Ethereum</label>
									</div>
									<div
										class="network-wrapper"
										@click="onClickItem('BSC')"
									>
										<img
											class="icon"
											src="../assets/img/bsc.svg"
											alt="icon"
										/>
										<input
											type="checkbox"
											id="BSC"
											value="BSC"
											:checked="checkedNetwork === 'BSC'"
										/>
										<label for="bsc">BSC</label>
									</div>
									<div
										class="network-wrapper"
										@click="onClickItem('POL')"
									>
										<img
											class="icon"
											src="../assets/img/polygon.png"
											alt="icon"
										/>
										<input
											type="checkbox"
											id="Polygon"
											value="Polygon"
											:checked="checkedNetwork === 'Polygon'"
										/>
										<label for="Polygon">Polygon</label>
									</div>
								</div>
							</transition>
						</div>
					</template>

					<template v-else>
						<span class="menu text" @click="login">{{ $t("gnb.login")}}</span>
						<router-link class="menu text" :active="(currentPage=='Signup' || currentPage=='Signup-Page' ? 'on' : 'off')" :to="{ params: {lang:'en'}, name:'Signup'}"> {{$t("gnb.signup")}} </router-link>
					</template>

					<button class="menu btn g-btn" @click="startNow">{{$t("gnb.start_now")}}</button>
				</div>
			</div>
		</div>
		<div v-if="supportMobileMenu" class="menus-mobile" @click="showMobileMenu">
			<div class="menu">
				<div class="bars">
					<span class="bar bar1"></span>
					<span class="bar bar2"></span>
					<span class="bar bar3"></span>
				</div>
			</div>
		</div>

	</div>
</template>

<script>

import AppConfig from '@/App.Config.js'
import WalletConnect from '@walletconnect/client'
import { BRIDGE_WALLETCONNECT, ETH_RPC_ENDPOINT,
 	BSC_RPC_ENDPOINT, MATIC_RPC_ENDPOINT, FORTMATIC,
	WALLETCONNECT, checkProviderWallet,
	COINBASE, METAMASK, BITSKI } from '@/features/Common.js'
import { fortmaticProvider, bitski, walletConnectProvider } from '@/features/Connectors.js'

var gConfig = AppConfig();

export default {
	props: {
		theme: {
			type: String,
		},
		userInfo: {
			type: Object,
		},
		wallet: {
			type: Object,
		}

	},
	data() {
		return {
			isShowAccountMenu: false,
			isShowLangMenu: false,
			supportMobileMenu: false,
			isShowNavbar: false,
			showNetwork: false,
			checkedNetwork: 'Ethereum',
			chainId : 0
		}
	},
	computed: {
		signed() {
			this.checkCurrentNetwork()
			const loginBy = window.localStorage.getItem('loginBy')
			if(loginBy === WALLETCONNECT) {
				setInterval(() => {
					this.getInterval()
				}, 3000);
			}
			return this.userInfo.id ? 'on' : 'off';
		},
		network() {
			return this.$store.state.network;
		},
		currentPage() {
			return this.$route.name;
		}
	},
	mounted () {
		// console.log("======== route params", this.$route, this.$route.params);
		this.currentPage = this.$route.params.id
	},
	methods: {
		onClickItem(network) {
			const loginBy = window.localStorage.getItem('loginBy')
			if (loginBy === COINBASE) {
				this.mxShowToast('Please change network on extension or mobile app, thank you.')
				return;
			}
			switch (network) {
				case 'ETH':
					this.switchNetwork('0x4', 'Ethereum', ETH_RPC_ENDPOINT)
					break
				case 'BSC':
					this.switchNetwork('0x61', 'BSC', BSC_RPC_ENDPOINT)
					break
				case 'POL':
					this.switchNetwork('0x13881', 'Polygon', MATIC_RPC_ENDPOINT)
					break
			}
		},
		async switchNetwork(chainId, name, rpc) {
			const loginBy = window.localStorage.getItem('loginBy')
			try {
				if(loginBy === FORTMATIC || loginBy === BITSKI) {
					window.localStorage.setItem('networkRPC', rpc)
					window.localStorage.setItem('fortmaticNetwork', chainId)
					window.localStorage.setItem('currentNetwork', chainId)
					window.location.reload()
				} else if(loginBy === METAMASK || loginBy === COINBASE) {
					const provider = checkProviderWallet(loginBy);
					console.log('provider',provider)
					await window.ethereum.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: chainId }],
					})
					this.checkedNetwork = name
				}

			} catch (e) {
				console.log('e',e)
				this.mxShowToast(e.message)
			}
		},
		async checkCurrentNetwork() {
			let currentNetwork = window.localStorage.getItem('currentNetwork')
			const loginBy = window.localStorage.getItem('loginBy')
			if(loginBy === FORTMATIC) {
				currentNetwork = window.localStorage.getItem('fortmaticNetwork')
			}
			if(loginBy === WALLETCONNECT) {
				const walletConnect = window.localStorage.getItem('walletconnect')
				this.chainId = JSON.parse(walletConnect).chainId
				currentNetwork = this.chainId.toString()
			}
			try {
				switch (currentNetwork) {
					case '0x4':
					case '4':
						this.checkedNetwork = 'Ethereum'
						break
					case '0x61':
					case '97':
						this.checkedNetwork = 'BSC'
						break
					case '0x13881':
					case '80001':
						this.checkedNetwork = 'Polygon'
						break
				}
			} catch (err) {
				console.log('err', err)
			}
		},
		getInterval() {
			const walletConnect = window.localStorage.getItem('walletconnect')
			const chainId = JSON.parse(walletConnect).chainId
			if(chainId !== this.chainId) {
				switch (chainId.toString()) {
					case '0x4':
					case '4':
						this.checkedNetwork = 'Ethereum'
						break
					case '0x61':
					case '97':
						this.checkedNetwork = 'BSC'
						break
					case '0x13881':
					case '80001':
						this.checkedNetwork = 'Polygon'
						break
				}
				window.location.reload()
			}
		},
		checkStyleOverflow() {
			const content = document.getElementById('content');
			content.style.overflowY = this.isShowNavbar ? 'hidden' : 'auto';
		},
		showNavbar() {
			this.isShowNavbar = !this.isShowNavbar;
		},
		showLanguage() {
			this.isShowNavbar = false
			console.log('show Language')
		},
		login() {
			this.isShowNavbar = false
			this.$store.dispatch('showLoginPopup',true);
			console.log('show Auth')
		},
		startNow() {
			//this.mxShowToast(this.$t('popup.app-construction-alert'));
			this.mxGameStart();
			this.isShowNavbar = false
		},
		showMobileMenu() {
			console.log('showMobileMenu()');
		},
		getCapitalChar(str) {
			return _U.getCapitalChar(str);
		},
		goMyPage() {
			this.isShowAccountMenu = false;
			this.$router.push({name:"MyPage"});
			this.isShowNavbar = false
		},
		
		// eslint-disable-next-line no-dupe-keys
		logout() {
			this.clearWallet()
			window.localStorage.clear();
			this.mxSetWallet({});
			this.$router.push({name:"Home"});
			var userInfo = {}
			this.isShowNavbar = false
			this.isShowAccountMenu = false;
			this.$store.dispatch('setUserInfo',userInfo);
			this.$cookies.set('userInfo', userInfo, gConfig.getUserInfoCookieExpireTime());
			this.$store.dispatch('logout')
		
			setTimeout(() => {
				window.location.reload()
			}, 1000);
		},
		clearWallet() {
			const loginBy = window.localStorage.getItem('loginBy');
			switch(loginBy) {
				case FORTMATIC :
					fortmaticProvider.user.logout()
					break
				case WALLETCONNECT :
					walletConnectProvider.on("disconnect", (code, reason) => {});
					// const bridge = BRIDGE_WALLETCONNECT
					// const connector = new WalletConnect({
					// 	bridge
					// })
					// connector.killSession()
					break
				case BITSKI :
					bitski.signOut()
			}
		}
	},
	watch: {
		isShowNavbar: function () {
			this.checkStyleOverflow();
		},
	},
}
</script>

<style lang="scss" scoped>

.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.hidden {
	display: none;
}
.GNB {
	position: absolute;
	top:0px; left:0px;
	$tsTime: .5s ease-in-out;
	@include FLEX(center,flex-end);
	@include Transition($tsTime);
	width: 100%;
	height: gREm(164);
	
	// @include M-Field('height',gREm(120)) ;
	z-index: $Z-INDEX-GNB;
	.button-nav{
		display: none;
	}
	.gnb-box-bg {
		position:absolute;
		width:100%;
		height:100%;
		opacity: 0.8;
  		background-image: linear-gradient(to bottom, #000000, rgba(0, 0, 0, 0));
	}
	.gnb-box {
		@include FLEX(space-between,flex-end);
		@include Transition($tsTime);
		width: 100%;
		height: gREm(64);
		margin-bottom: gREm(19 + 44);
		margin-left: gREm(260);
		margin-right: gREm(260);

		.menu-box {
			@include FLEX(flex-start,center);
			.logo {
				display:block;
				cursor: pointer;
				width: gREm(126);
				height: gREm(46);
				@include SetBgImage(url('../assets/img/NV-logo.svg'));
				// @include OnOverTransition();
				margin-right: gREm(50);
			}
			.menus {
				@include FLEX(flex-start,center);
				@include Transition($tsTime);
				.menu {
					@include FLEX(flex-start,center);
					@include Transition($tsTime);
					opacity: 0.5;
					cursor: pointer;
					width:auto;
					// height: gREm(19);
					height: gREm(46);
					margin-right: gREm(50);
					@include Set-Font($AppFont, gREm(15), gREm(19), #ffffff);

					// @include OnOverTransition();

					&:hover {
						opacity: 1;
					}
				}
			}
		}
		.menu-btns {
			@include FLEX(center, center);
			@include Transition($tsTime);
			height: gREm(46);
			// margin-left: gREm(50);
			.menus {
				@include FLEX(center, center);
				@include Transition($tsTime);
				height: 100%;
				margin-left: gREm(40);
				.menu {
					@include Transition($tsTime);
					cursor: pointer;
					margin-left: gREm(40);

					.user-menu-popup-wrap {
						position: absolute;
						@include FLEXV(flex-end,center);
						top: gREm(0); left: gREm(-190 + 34);
						width: gREm(190);
						height: gREm(106 + 34 + 12);
						padding-top: gREm(34 + 12);

						.user-menu-popup {
							@include FLEXV(flex-start,center);
							top: 0; left: 0; width: 100%; height: gREm(106);
							padding-top: gREm(16);
							padding-bottom: gREm(16);
							border-radius: gREm(10);
							border: solid gREm(1) #f1f1f1;
							background-color: #ffffff;
							.user-menu {
								@include FLEX(flex-start,center);
								width: 100%;
								padding-left: gREm(40);
								padding-right: gREm(40);
								height: gREm(37);
								@include Set-Font($AppFont, gREm(15), gREm(30), #6a6a6a);
								background-color: #ffffff;
								cursor: pointer;
								&:hover {
									color: #6c38ef;
									background-color: #f1f1f1;

								}
							}
						}

						&.lang {
							left: gREm(-190 + 78);
							height: gREm(69 + 34 + 12);
							.user-menu-popup {
								height: gREm(69);
							}
						}

					}
				}
				.menu.btn {
					height: gREm(40);
					width: gREm(134);
					margin-left: gREm(40);
					border-radius: gREm(6);
					@include Set-Font($AppFont, gREm(14), gREm(18), #ffffff);
					text-align: center;
					@include OnOverTransition();
				}
				.text {
					@include Set-Font($AppFont, gREm(15), gREm(40), #ffffff);
					opacity: 0.5;
					// @include OnOverTransition();
					&:hover {
						opacity: 1;
					}
				}
			}

			.info-network {
				margin-left: gREm(16);
				cursor: pointer;

				.network-icon {
					font-family: $AppFont;
				}
				.network-popup {
					display: flex;
					gap: gREm(30);
					border-radius: gREm(8);
					margin-top: gREm(16);
					position: absolute;
					background-color: #ffffff;
					padding: gREm(10) gREm(20);
					right: 0;
				}

				.network-wrapper {
					display: flex;
					flex-direction: column;
					align-items: center;

					.icon {
						width: gREm(30);
						height: gREm(30);
						margin-bottom: gREm(8);
					}

					label {
						color: #000000;
						font-size: gREm(14);
						line-height: gREm(22);
						font-family: $AppFont;
					}
				}
			}
		}
		.menu:after {
			@include Transition($tsTime);
			@include H-Center;
			opacity: 0;
			position: absolute;
			display: block;
			content:"";
			text-align: center;
			bottom: gREm(13 - 16 - 5); // 19 -> 46 ==> 27 / 2 => 13
			width: gREm(5);
			height: gREm(5);
			border-radius: 50%;
			background-color: #f6583e;
		}
		.menus .menu[active="on"] {
			opacity: 1;
		}
		.menus .menu[active="on"]:after {
			opacity: 1;
		}
	}
	.menus-mobile {
		position:absolute;
		@include FLEX(center,center);
		z-index: -1;
		opacity: 0;
		top: gREm(33);
		right: gREm(20);
		width: gREm(50);
		height: gREm(50);
		cursor: pointer;
		@include Transition($tsTime);
		.menu {
			@include FLEX(center,center);
			width: 100%;
			height: 100%;
			@include SetBgImage(url('../assets/img/btn-menu.svg'));

		}
	}
}

.GNB[signed="on"] {
	.gnb-box {
		.menu-btns {
			.menus {
				.dvi-box {
					width: auto;
					@include FLEX(space-between, center);
					.dvi-icon {
						width: gREm(16);
						height: gREm(19);
						margin-right:gREm(8);
						@include SetBgImage(url('../assets/img/ic-dvi-market.svg'));
					}
					.dvi-value {
						width: auto;
						@include Set-Font($AppFont, gREm(15), gREm(19), #febf37);
					}
				}
				.pol-box {
					width: auto;
					@include FLEX(space-between, center);
					.pol-icon {
						width: gREm(22);
						height: gREm(19);
						margin-right:gREm(8);
						@include SetBgImage(url('../assets/img/ic-polygon-market.svg'));
					}
					.pol-value {
						width: auto;
						@include Set-Font($AppFont, gREm(15), gREm(19), #7A4ADD);
					}
				}
				.uinfo-icon {
					@include FLEX(center, center);
					width: gREm(34);
					height: gREm(34);
					border-radius: 50%;
					background-color: #ffffff;

					.cap-text {
						@include Set-Font($AppFont, gREm(22), gREm(24), #6c38ef, 600);
					}
				}
			}
		}
	}

}

.GNB[theme="white"] {
	.gnb-box-bg {
		background-image: none;
	}
	.gnb-box .menu-btns .menus .btn{
		background-image: linear-gradient(to right, #62ffb3 11%, #01c9c1 99%);
		color:  #003b1e;
	}
}
.GNB[theme="blue"] {
	.gnb-box-bg {
		opacity: 1;
		background-image: linear-gradient(to bottom, #6c38ef, #6c38ef);
	}
	.gnb-box .menu-btns .menus .btn{
		background-image: linear-gradient(to right, #62ffb3 11%, #01c9c1 99%);
		color: #003b1e;
	}
}

// 1680 :: GNB 첫번째 체크 1600PX
@include media-max($media_big) {
	.GNB {
		// $r : 3/5;
		.gnb-box {
			margin-left: gRH(220 );
			margin-right: gRH(220 );
			.menu-box .menus .menu {
				margin-right: gRH(40);
			}
			.menu-btns {
				.menus {
					margin-left: gRH(30);
					.menu {
						margin-left: gRH(30);
					}
					.btn{
						margin-left: gRH(30);
					}
				}
			}
		}
	}
};

@include media-max($media_large) { // 1200
	.GNB {
		.gnb-box {
			margin-left: gREm(40);
			margin-right: gREm(40);
			margin-bottom: gREm(29);

			.menu-box {
				.logo {
					margin-right: gREm(40);
				}
				.menus {
					.menu {
						margin-right: gRH(30);
					}
				}
			}
			.menu-btns {
				.menus {
					margin-left: gRH(30);
					.menu {
						margin-left: gRH(30);
					}
					.btn{
						margin-left: gRH(30);
						height: gREm(40);
						width: gREm(134);
						border-radius: gREm(6);
						@include Set-Font($AppFont, gREm(14), gREm(40), #ffffff);
					}
					.text {
						@include Set-Font($AppFont, gREm(15), gREm(40), #ffffff);
					}
				}
			}
		}
	}
}


@include media-max($media_medium) { // 1024px
	.GNB {
		.gnb-box {
			margin-left: gRH(40);
			margin-right: gRH(40);
			margin-bottom: gREm(39);

			.menu-box {
				.logo {
					margin-right: gRH(30);
				}
				.menus {
					.menu {
						height: gREm(16);
						margin-right: gRH(26);
						@include Set-Font($AppFont, gREm(13), gREm(16), #ffffff);
					}
				}
			}
			.menu-btns {
				.menus {
					.menu {
						margin-left: gRH(26);
					}
					.menu {
						margin-left: gRH(26);
					}
					.btn{
						margin-left: gRH(30);
						height: gREm(36);
						width: gREm(124);
						border-radius: gREm(6);
						@include Set-Font($AppFont, gREm(13), gREm(36), #ffffff);
					}
					.text {
						@include Set-Font($AppFont, gREm(13), gREm(36), #ffffff);
					}
				}
			}
		}
	}
}


@include media-max($media_small) { // 768px
	.GNB {
		transition: none;
		&.shadow{
					background: #181721;
					z-index: 999;
				box-shadow: -0 5px 5px 0px rgba(64,57,57,0.96);
				-webkit-box-shadow: -1px 5px 5px 0px rgba(64,57,57,0.96);
				-moz-box-shadow: -1px 5px 5px 0px rgba(64,57,57,0.96);
	
		}
		height: gREm(124);
		position: relative;
		.button-nav{
			display: block;
			position: absolute;
			top: 50%;
			right: gREm(20);
			transform: translate(-50%, -50%);
			z-index: 99;
		}
		.gnb-box {
			margin-bottom: gREm(39);
			margin-left: gREm(20);
			margin-right: gREm(20);
			.menu-box {
				.logo {
					width: gREm(126);
					height: gREm(46);
				}
				.menus{
					display: none;
				}
			}
			&.active {
				.menu-box .menus {
					display: block;
					opacity: 1;
					z-index: 9;
					position: fixed;
					top: 124px;
					left: 0;
					bottom: 0;
					right: 0;
					width: 100vw;
					height: 100vh;
					background: #181721;
					padding: 40px 20px;
					& .menu {
						text-transform: uppercase;
						margin-bottom: gREm(32);
						width: 100%;
						position: relative;
						&::after{
							right: 0;
							top: 50%;
							left: unset;
							transform: translate(-50%, -50%);
						}
					}
					& .menu-btns-mobile{
						& .dvs-nav-item{
							position: relative;
							width: 100%;
							height: 100%;
							min-height: gREm(88);
							display: flex;
							align-items: center;
							justify-content: space-between;
							border-top: 1px solid #2E2C3E;
							& .dvg-coin{
								display: flex;
								align-items: center;
								justify-content: center;
								gap: 12px;
								color: #FFD041;
								font-family: Montserrat;
								font-weight: 400;
								font-size: gREm(16);
							}
							& .dvs-user{
								display: flex;
								align-items: center;
								justify-content: center;
								gap: 12px;
								& .uinfo-icon {
									@include FLEX(center, center);
									width: gREm(34);
									height: gREm(34);
									border-radius: 50%;
									background-color: #ffffff;
									.cap-text {
										@include Set-Font($AppFont, gREm(22), gREm(24), #6c38ef, 600);
									}
								}

								.mypage {
									font-family: $AppFont;
								}
							}
							& .dvs-no-user{
								display: flex;
								align-items: center;
								justify-content: center;
								gap: 12px;
								& .signup{
									color: #FFD041;
									opacity: 1;
								}
							}
							& .g-btn{
									width: gREm(159);
									height: gREm(48);
									border-radius: 0.375rem;
    							font-family: Montserrat, sans-serif;
    							font-size: 0.875rem;
    							font-weight: 500;
    							line-height: 1.125rem;
    							font-stretch: normal;
    							font-style: normal;
    							letter-spacing: normal;
    							white-space: nowrap;
    							color: #ffffff;
    							text-decoration: none;
    							text-align: center;
    							transition: transform 0.5s ease-in-out;
								}

								.no-login-btn {
									background: linear-gradient(
									94.76deg,
									#62ffb3 0%,
									#01c9c1 108.93%
								);
							}
								& .menu{
									text-transform: unset;
									margin-bottom: unset;
								}
								& .user-menu-popup-wrap{
									background: #ffffff;
									border-radius: 10px;
									opacity: 1;
									position: absolute;
    							display: flex;
    							justify-content: center;
    							flex-direction: column;
    							align-items: left;
    							top: 23px;
    							width: gREm(190);
									height: auto;
									padding: 0 10px;
									& .list-lang{
										text-align: left;
										padding: 5px;
										& div{
											color: #000000;
											padding: 5px 0;
										}

									}
								}

								.logout {
									font-family: $AppFont;
								}
						}
					}
				}
			}
		.menu-btns .menus {
				display: none;
				opacity: 0;
				z-index: -1;
			}
		}
		.menus-mobile {
			display: none;
			opacity: 1;
			z-index: $Z-INDEX-MOBILE-GNB-MENU;
		}

	}
}

#app[mobile="on"] {
	.GNB {
		.gnb-box {
			.menu-btns {
				.menus {
					.menu.btn { // START NOW
						display: none;
					}
				}
			}
		}
	}
}

</style>
