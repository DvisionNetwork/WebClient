<template>
	<div class="Profile">
		<div class="content-box-wrap">
			<div class="content-box" >
				<div class="profile-image-box">
					<div class="image">
						<div class="component">{{getCapitalChar(userInfo.name)}}</div>
					</div>
					<div class="edit-profile-btn remove-highlight" @click="onClickEditProfile()">Edit Profile</div>
				</div>
				<div class="info-box">

					<div class="user-box">
						<div class="user-id">Nickname</div>
						<div class="id"> {{userInfo.name}}</div>
						<div class="user-email">Email</div>
						<div class="email">{{userInfo.email}}</div>
						<div class="user-referral">Referral ID</div>
						<div class="referral-box">
							<div id="referral" class="referral">{{userInfo.myreferrer}}</div>
							<div class="copy-referral-btn remove-highlight"
								@click="onClickCopyReferral"
							>
								Copy
							</div>
						</div>
					</div>

					<div class="DVI-box">
						<div class="user-DVI">Your DVI</div>
						<div class="div-content">
							<div class="icon"></div>
							<div class="content">{{addComma(wallet.balance)}}</div>
						</div>
					</div>

					<div class="wallet-box-wrap">
						<div class="title-box">
							<div class="title">Your Wallet</div>
							<div class="edit-box">
								<div class="edit-ok-btn wallet-btns"
									v-if="isEditMode"
									@click="isEditMode=false"
								>
									OK
								</div>
							</div>
						</div>

						<div class="wallet-code-box">
							<div class="code-bg">
								<div class="code-box">
									<div class="code">{{walletAddr}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

// import WalletAPI from '@/features/WalletAPI.js'
// var wAPI = new WalletAPI();

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();

export default {
	name: "Profile",
	components: {
	},
	props: {
	},
	beforeMount () {
		console.log("[Profile.vue] beforeMout(), route : ", this.$route);
	},
	mounted () {
		console.log("[Profile.vue] mounted(), route : ", this.$route);
		// testing
		// this.mxSetWallet({
		// 	updated: false,
		// 	currentAccountIdx: 0,
		// 	currentAccount: '0xd0a3203a47b0bfd436be4e3b34844f72bcebe088',
		// 	accounts:[
		// 		'0xd0a3203a47b0bfd436be4e3b34844f72bcebe088',
		// 		'0xxxx-203a47b0bfd436be4e3b34844f72bcebexxx',
		// 	],
		// 	provider: null,
		// 	signer: null,
		// 	balance: 49720
		// });
	},
	beforeUpdate () {
		console.log("[Profile.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[Profile.vue] updated(), route : ", this.$route)
	},
	data () {
	   var currLang = this.$route.params.lang;
		if(!currLang) currLang = 'en';
		return {
			isEditMode: false,
		}
	},
	computed: {
		userInfo() {
			return this.$store.state.userInfo;
		},
		wallet() {
			return this.$store.state.wallet;
		},
		walletAddr() {
			if(this.$store.state.userInfo) {
				return this.$store.state.userInfo.wallet_addr;
			} else {
				return '';
			}
		},
	},
	// watch: {
	// 	wallet(newVal, oldVal) {
	// 		console.log("===================[MyPage.Profile] wallet:", newVal, oldVal);

	// 		if( _U.isDefined(newVal,'accounts') && newVal.accounts.length > 0
	// 			&& _U.getIfDefined(newVal, 'updated') == true
	// 		) {
	// 			console.log("[App.vue] watch wallet() , wallet ", this.newVal);
	// 			this.getDviBalance();
	// 		}
	// 	}
	// },
	methods : {

		onClickEditProfile() {
			this.mxShowEditProfile();
		},

		onClickCopyReferral() {
			var range = document.createRange();
			range.selectNode(document.getElementById("referral"));
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
			document.execCommand("copy");
			window.getSelection().removeAllRanges();
			this.mxShowToast(this.$t('popup.copy-clipboard-complete'));
		},

		onClickAddWallet() {
			this.mxShowAddWallet();
		},

		// getDviBalance() {

		// 	var account = _U.getIfDefined(this.$store.state,['wallet','currentAccount']);

		// 	console.log('=============getDviBalance==============', account);

		// 	if(!account) {
		// 		console.log("[MyPage.Profile.vue] getDviBalance(), no account in wallet !!");
		// 		return;
		// 	}
		// 	wAPI.getDviBalance(account, (resp) => {
		// 		console.log('[MyPage.Profile.vue] getDviBalance() -> getDviBalance : resp', resp);

		// 		if(resp.res_code == 200) {
		// 			var balance = _U.getIfDefined(resp,['data','balance']);
		// 			if(balance != null) {
		// 				this.mxSetWalletBalance(balance);
		// 				return;
		// 			}
		// 		}
		// 		this.mxShowToast(_U.getIfDefined(resp,['data','message']));
		// 		this.mxSetWalletBalance(0);
		// 		console.log("Error on get balance url", resp)
		// 	});

		// },

		getCapitalChar(str) {
			return _U.getCapitalChar(str);
		}
	}
}

</script>

<style lang="scss" scoped>
.Profile{
	width:100%;
	height: auto;
	@include FLEXV(center,flex-start);
	.content-box-wrap{
		width: 100%;
		height: auto;
		@include FLEX(center,flex-start);
		// margin-left:gREm(311);
		.content-box{
			@include FLEX(center,flex-start);
			margin-top: gREm(80);
			.profile-image-box{
				@include FLEXV(flex-start,center);
				.image{
					width: gREm(150);
					height: gREm(150);
					background-color: #ffffff;
					border-radius: 50%;
					@include FLEX(center,center);
					.component{
						width:gREm(42);
						height: auto;
						 @include FLEX(center,center);
						@include Set-Font($AppFont, gREm(60), gREm(24), #6c38ef,600);
					}
				}
				.edit-profile-btn{
					@include FLEX(center,center);
					margin-top:gREm(19);
					width: gREm(96);
					height: gREm(33);
					border-radius: 100px;
					border: solid 1px #c7c7c7;
					cursor: pointer;
					@include Set-Font($AppFont, gREm(12), gREm(15), #c7c7c7);
					@include Transition(0.5s ease);
					&:hover {
						@include FLEX(center,center);
						margin-top:gREm(19);
						width: gREm(96);
						height: gREm(33);
						border-radius: 100px;
						background-color: #ffffff;
						@include Set-Font($AppFont, gREm(12), gREm(15), #181721);
					}
				}
			}
			.info-box{
				margin-left:gREm(40);
				width:auto;
				height: auto;
				.user-box{
					.user-id{
						width: gREm(17);
						height: gREm(19);
						@include Set-Font($AppFont, gREm(16), gREm(27), #959699,300);
					}
					.id{
						margin-top:gREm(10);
						width: auto;
						height: gREm(22);
						@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
						overflow-x: auto;
					}
					.user-email{
						width: gREm(45);
						height: gREm(19);
						margin-top: gREm(30);
						@include Set-Font($AppFont, gREm(16), gREm(27), #959699,300);
					}
					.email{
						margin-top:gREm(10);
						width: auto;
						height: gREm(22);
						@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
					}
					.user-referral{
						width: gREm(45);
						height: gREm(19);
						margin-top: gREm(30);
						@include Set-Font($AppFont, gREm(16), gREm(27), #959699,300);
					}
					.referral-box{
						width: auto;
						@include FLEX(flex-start,center);
						margin-top:gREm(10);

						.referral{
							width: auto;
							height: gREm(22);
							@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
						}
						.copy-referral-btn {
							@include FLEX(center,center);
							cursor: pointer;
							margin-left:gREm(10);
							width :gREm(56);
							height: gREm(24);
							border-radius: 100px;
							background-color: #3a384a;
							@include Set-Font($AppFont, gREm(13), gREm(16), #ffffff,300);
							@include Transition(0.5s ease);
							&:hover {
								background-color: #6c38ef;
							}
						}
					}
				}
				.DVI-box{
					margin-top: gREm(80);
					.user-DVI{
						width: gREm(78);
						height: gREm(22);
						@include Set-Font($AppFont, gREm(18), gREm(27), #ffffff);
					}
					.div-content{
						margin-top:gREm(17);
						@include FLEX(flex-start,center);
						.icon{
							width: gREm(23);
							height: gREm(26);
						   	@include SetBgImage(url('../assets/img/ic-dvi-market.svg'));
						}
						.content{
							margin-left:gREm(8);
							width: auto;
							height: gREm(29);
							@include Set-Font($AppFont, gREm(24), gREm(29), #febf37);
						}
					}
				}
				.wallet-box-wrap{
					margin-top:gREm(51);
				   	.title-box{
						width: 100%;
						@include FLEX(space-between,center);
						.title{
							width:gREm(103);
							height: gREm(22);
							@include Set-Font($AppFont, gREm(18), gREm(27), #ffffff);
						}
						.edit-box{
							width: auto;
							@include FLEX(flex-start,center);
							.wallet-btns {
								@include FLEX(center,center);
								cursor: pointer;
								margin-left:gREm(0);
								width :gREm(56);
								height: gREm(24);
								border-radius: 100px;
								background-color: #3a384a;
								@include Set-Font($AppFont, gREm(13), gREm(16), #ffffff,300);
								@include Transition(0.5s ease);
								&:hover {
									background-color: #6c38ef;
								}

							}
							.edit-ok-btn {
								margin-left:gREm(10);
							}
						}
				   	}
					.wallet-code-box{
						margin-top:gREm(5);
						.code-bg{
							height: auto;
							.code-box {
								@include FLEX(flex-start, center);
								.radio-btn{
									width:gREm(14);
									height: gREm(14);
									margin-right: gREm(16);
									margin-top: gREm(14);
									cursor: pointer;
								}
								.code {
									margin-top: gREm(15);
									background-color: rgba( 24, 23, 33, 0.02);
									@include Set-Font($AppFont, gREm(15), gREm(42), rgba(255,255,255,0.4),300);
									width:gREm(427);
									height: gREm(42);
									border-radius: gREm(6);
									background-color:rgba(255,255,255,0.07);
									text-align: center;
								}
								&[active="on"] {
									.code{
										border: solid 1px #4ef3a3;
										background-color: #181721;
										color: #ffffff;
									}
								}
								&[edit-mode="on"] {
									cursor: pointer;
								}
								&[edit-mode="on"]:hover {
									.code {
										@include Transition(0.5s ease);
										color: #ffffff;
									}
								}

							}
						}
					}
				}
			}
		}
	}
}

@include media-max($media_small) {
	.Profile {
		.content-box-wrap {
			.content-box {
				margin-top: gREm(40);
				flex-direction: column;
				align-items: center;
				width: 100%;

				.info-box {
					margin-left: 0;
					padding: 0 gREm(20);
					width: 100%;

					.user-box {
						.user-email,
						.user-referral {
							margin-top: gREm(24);
						}
					}

					.DVI-box {
						margin-top: gREm(60);
					}

					.wallet-box-wrap {
						.wallet-code-box {
							.code-bg {
								.code-box {
									.code {
										width: 100%;
										max-width: 100%;
										overflow-x: auto;
										padding: gREm(16) gREm(30);
										@include Set-Font(
											$AppFont,
											gREm(16),
											gREm(24),
											rgba(255, 255, 255, 0.4),
											200
										);
										height: 100%;
									}
								}
							}
						}
					}
				}

				.profile-image-box {
					.edit-profile-btn {
						@include Set-Font(
							$AppFont,
							gREm(14),
							gREm(22),
							#ffffff,
							200
						);
						width: 100%;
						padding: gREm(20) 0;
						opacity: 0.7;
					}
				}
			}
		}
	}
}
</style>
