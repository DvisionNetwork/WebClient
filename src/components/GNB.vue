<template>
	<div class="GNB" :theme="theme ? theme: 'black'" :signed="signed">
		<div class="gnb-box-bg"></div>
		<div class="gnb-box">
			<div class="menu-box">
				<router-link class="logo" :to="{ params: {lang:'en'}, name:'Home'}"></router-link>
				<div class="menus">
					<router-link class="menu" :active="(currentPage=='Market' || currentPage=='Market-Detail' || currentPage=='Market-Page' || currentPage=='Market-Detail-Index' ? 'on' : 'off')" :to="{ params: {lang:'en'}, name:'Market'}"> {{$t("gnb.market_place")}} </router-link>
					<router-link class="menu" :active="(currentPage=='Studio' ? 'on' : 'off')" :to="{ params: {lang:'en'}, name:'Studio'}"> {{$t("gnb.studio")}} </router-link>
					<router-link class="menu" :active="(currentPage=='Guide-Page' ? 'on' : 'off')" :to="{ params: {lang:'en'}, name:'Guide'}"> {{$t("gnb.guide")}} </router-link>
					<router-link class="menu" :active="(currentPage=='News-Page' || currentPage=='News-Detail' ? 'on' : 'off')" :to="{ params: {lang:'en'}, name:'News'}"> {{$t("gnb.news")}} </router-link>
					<a class="menu" href="https://dvision-bridge.multibaas.app/" target="_blank">{{$t("gnb.bridge")}}</a>
					<!-- <router-link class="menu" :active="(currentPage=='Help' ? 'on' : 'off')" :to="{ params: {lang:'en'}, name:'Help'}"> {{$t("gnb.help")}} </router-link> -->
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
		}
	},
	computed: {
		signed() {
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
		logout() {
			this.$store.dispatch('logout')
		},
		showLanguage() {
			console.log('show Language')
		},
		login() {
			this.$store.dispatch('showLoginPopup',true);
			console.log('show Auth')
		},
		startNow() {
			//this.mxShowToast(this.$t('popup.app-construction-alert'));
			this.mxGameStart();
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
		},
		logout() {
			var userInfo = {};
			this.isShowAccountMenu = false;
			this.$store.dispatch('setUserInfo',userInfo);
			this.$cookies.set('userInfo', userInfo, gConfig.getUserInfoCookieExpireTime());
			this.$router.push({name:"Home"});
		}

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
		.gnb-box {
			margin-bottom: gREm(39);
			margin-left: gREm(20);
			margin-right: gREm(20);
			.menu-box {
				.logo {
					width: gREm(126);
					height: gREm(46);
				}
			}
			.menu-box .menus {
				opacity: 0;
				z-index: -1;
				display: none;
			}
			.menu-btns {
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
