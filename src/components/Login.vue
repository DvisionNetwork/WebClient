<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div>
						<form
							class="frm_auth frm_signin form"
						>
							<BaseButton
								type="button"
								class="closebtn"
								@click="closePopup"
							>
							</BaseButton>

							<div class="welcome">{{$t('login.popup.welcome-msg')}}</div>
							<div class="popup-title">{{$t('login.popup.title')}}</div>

							<BaseButton type="button" class="connectbtn g-btn" @click="connect">
								{{$t('login.popup.btn-connect')}}
							</BaseButton>

							<BaseButton type="button" class="connectbtn g-btn" @click="connectWalletConnect">
								Connect WalletConnect
							</BaseButton>

							<!-- TODO: Make selection UI for ID/PW login -->
							<!-- <div class="id">
								<div class="title">{{$t('login.popup.label-id')}}</div>
								<div class="input-box">
									<input class="field-input"
										id="login-input-field"
										@focusin="idFocus = true;"
										@blur="onBlur('id');"
										@input="onInputId"
										aria-invalid="false"
										v-model="fields_signin.id"
										maxlength= "30"
										minlength= "5"
									>
									<div class="icon" @click="clearInput" :active="(idFocus && idLength ? 'on' :'off' )"></div>
								</div>
								<div class="line" :active="(idFocus ? 'on' :'off')"></div>
							</div>

							<div class="password">
								<div class="title">{{$t('login.popup.label-pwd')}}</div>
								<div class="input-box">
									<input class="field-input"
										type='password'
										id="2"
										@focusin="passwordFocus = true;"
										@blur="onBlur('password');"
										@input="onInputPassword"
										aria-invalid="false"
										v-model="fields_signin.password"
										maxlength= "26"
										minlength= "6"
									>
									<div class="icon" @click="clearPWDInput" :active="( passwordFocus && passwordLength ? 'on' :'off')"></div>
								</div>
								<div class="line" :active="(passwordFocus ? 'on' :'off')"></div>
							</div> -->

							<div class="remember-me">
								<!-- <div class="check-box" @click="onClickRememberMe()" :active="(checkedRememberMe ? 'on' :'off')">
									<div class="checks"></div>
									<div class="remember">{{$t('login.popup.remember-me')}}</div>
								</div> -->
								<div class="forgot-msg" >
									<span class="text forgot-id" @click="goFindId">{{$t('login.popup.forgot') +' '+ $t('login.popup.label-id')}}</span>
									<span class="text forgot-slash">{{' / '}}</span>
									<span class="text forgot-pwd" @click="goFindPwd">{{$t('login.popup.label-pwd') +'?'}}</span>
								</div>
							</div>

							<!-- <BaseButton type="button" class="loginbtn g-btn" @click="signin">
								{{$t('login.popup.btn-login')}}
							</BaseButton> -->

							<div class="signup-box">
								<div class="signup-box-wrap">
									<div class="notamember" >{{$t('login.popup.not-a-member')}}</div>
									<div
										class="signup-msg"
										@click="goSignUpAgreement"
									>
										{{$t('login.popup.sign-up')}}
									</div>
								</div>
							</div>

						</form>
					</div>

				</div>
			</div>
		</div>
	</transition>
</template>

<script>

import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'
import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();

import sha256 from 'crypto-js/sha256';

import WalletAPI from '@/features/WalletAPI.js'
var wAPI = new WalletAPI();

import { BRIDGE_WALLETCONNECT } from '@/features/Common.js'

export default {
	mounted() {
		// this.popType = authInfo.type;
		if(this.$cookies.isKey('remembered-id')) {
			var rid = this.$cookies.get('remembered-id');
			if(rid) {
				this.fields_signin.id = rid;
				this.checkedRememberMe = true;
			}
		}
	},
	data() {
		return {
			idFocus :false,
			idLength: false,
			passwordFocus :false,
			passwordLength: false,
			checkedRememberMe :false,
			categories: [
				'sustainability',
				'nature',
				'animal welfare',
				'housing',
				'education',
				'food',
				'community',
			],
			fields_signin : {
				id:'',
				password:''
			},

		}
	},
	props: {
	},
	methods: {
		closePopup() {
			this.$store.dispatch('showLoginPopup',false);
			// this.$emit('close-auth')
		},

		onBlur(v) {
			if(v == 'id') {
				setTimeout(()=>{
					this.idFocus=false;
				},500)
			}else if(v=='password') {
				setTimeout(()=>{
					this.passwordFocus=false;
				},500)
			}
		},

		onClickRememberMe() {
			this.checkedRememberMe = (this.checkedRememberMe ? false:true);
			console.log("==================== ", this.checkedRememberMe, this.fields_signin.id)
			if(this.checkedRememberMe) {
				this.$cookies.set('remembered-id',this.fields_signin.id,'365d');
			}else{
				if(this.$cookies.isKey('remembered-id')) {
					this.$cookies.remove('remembered-id');
				}
			}
		},

		clearInput() {
			this.fields_signin.id = '';
			this.idLength = false;

		},
		clearPWDInput() {
		 	this.fields_signin.password = '';
		},
		onInputId() {
			this.idLength = this.fields_signin.id && this.fields_signin.id.length > 0 ?  true : false ;
			if(this.checkedRememberMe==true && this.fields_signin.id) {
				this.$cookies.set('remembered-id',this.fields_signin.id,'365d');
			}else{
				if(this.$cookies.isKey('remembered-id')) {
					this.$cookies.remove('remembered-id');
				}
			}
		},

		onInputPassword(){
			this.passwordLength = this.fields_signin.password && this.fields_signin.password.length > 0 ?  true : false ;
		},

		goSignUpAgreement() {
			this.closePopup();
			// TODO: change terms agree page after terms of policy is ready
			this.$router.push({name:"Signup-Page", params:{page: 'register'}});
			// this.$router.push({name:"Signup-Page", params:{page: 'agree'}});
			// this.$emit('change-auth', { type: 'signup-agreement' })
		},

		goFindId() {
			this.closePopup();
			this.$router.push({name:"Signup-Page", params:{page: 'idphone'}});
		},
		goFindPwd() {
			this.closePopup();
			this.$router.push({name:"Signup-Page", params:{page: 'pwdphone'}});
		},

		connect() {
			console.log("[Login] connect metamask account");

			wAPI.checkMetamask().then((rv)=>{
				if(rv != 'NONE') {
					wAPI.Request_Account((resp) => {
						console.log('[Login] connect() -> Request_Account : resp', resp);
						if(resp.res_code == 200) {
							var account = _U.getIfDefined(resp,['data','account']);

							if(account) {
								wAPI.Sign_Account(account, this.reqLogin);
								this.mxSetNetwork(rv);

								return;
							}
						}
						console.log("Error on get wallet url", resp);
						this.mxShowAlert({msg:this.$t('signup.register.error-on-wallet-url') + '\n' + this.$t('popup.metamask-request-error') + '\n' + resp.res_code});
					});
				}else{
					this.mxShowAlert({msg:this.$t('signup.register.error-on-wallet-url') + '\n' + this.$t('popup.metamask-chain-not-matched')});
				}
			});

		},

		async connectWalletConnect() {
			const bridge = BRIDGE_WALLETCONNECT
			const connector = new WalletConnect({
				bridge,
				qrcodeModal: QRCodeModal,
			})
			if (!connector.connected) {
				// create new session
				await connector.createSession()
			} else {
				this.reqLogin({ wallet_addr: connector._accounts[0] })
				// connector.killSession()
				return
			}

			connector.on('connect', (error, payload) => {
				console.log(payload, error)
				const { accounts } = JSON.parse(
					JSON.stringify(payload.params[0])
				)
				if (accounts) {
					this.reqLogin({ wallet_addr: accounts })
				} else if (error) {
					this.mxShowAlert({ msg: 'error' })
				}
			})
		},

		// signin() {
		// 	console.log("[Login] ID/PW login");

		// 	var data = {
		// 		account: this.fields_signin.id,
		// 		password: sha256(this.fields_signin.password).toString()
		// 	}

		// 	this.reqLogin(data);
		// },

		reqLogin(data) {
			console.log("[Auth] login() ", data);

			_U.callPost({
				url:gConfig.login_url,
				data: data,
				callback: (resp) =>{
					console.log("[Signup.Register] onSubmit()-> resp ", resp);
					var rdata = resp.data;
					if(rdata && typeof rdata == 'string')  {
						this.mxShowToast(rdata);
					}else if(rdata && typeof rdata == 'object' && rdata.length > 0) {
						if(rdata[0]) {
							var userInfo = rdata[0];
							userInfo.oqs_no = '';
							userInfo.wallet_addr = data.wallet_addr;

							var wlt= {
								currentAccountIdx: 0,
								currentAccount: userInfo.wallet_addr,
								accounts: [userInfo.wallet_addr],
								balance: 0,
								updated: true,
							}
							this.mxSetWallet(wlt);

							this.$store.dispatch('setUserInfo',userInfo);
							this.$cookies.set('userInfo', userInfo, gConfig.getUserInfoCookieExpireTime());
							console.log('===== LOGIN OK, userInfo:', userInfo, this.$route.name);
							this.closePopup();
							if(this.$route.name == 'Signup-Page') {
								this.$router.push({name:"Home"});
							}
						}
					}
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.modal-mask {
	position: absolute;
	z-index: $Z-INDEX-LOGIN-POPUP;
	// margin-top: 224px;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: table;
	transition: opacity 0.5s ease;

	.modal-wrapper {
		display: table-cell;
		vertical-align: middle;

		.modal-container {
			width: 520px;
			height: 300px;
			margin: 0px auto;
			// padding: 20px 30px;
			background-color: #fff;
			border-radius: 20px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
			transition: all 0.3s ease;
			font-family: Helvetica, Arial, sans-serif;
		}
	}
}

.form {
	@include FLEXV(flex-start,center);
	width: 100%;
	height: gREm(300);
	.closebtn {
		@include SetBgImage(url('../assets/img/ic-closed-popup.svg'));
		width : gREm(40);
		height: gREm(40);
		margin-top:gREm(-51);
		margin-bottom:gREm(10);
		cursor: pointer;
		@include OnOverTransition();
	}
	.welcome {
		height: gREm(18);
		width:100%;
		margin-top: gREm(50);
		text-align: center;
		@include Set-Font($AppFont, gREm(14), gREm(24), #0d0c22);
   }
   .popup-title {
		height: gREm(29);
		width:100%;
		margin-top: gREm(8);
		text-align: center;
		@include Set-Font($AppFont, gREm(24), gREm(24), #0d0c22, 600);
   }
   .id, .password {
		height: gREm(40+18);
		width: gREm(420);
		margin-top: gREm(72);
		.title{
			height: gREm(18);
			width: 100%;
			@include Set-Font($AppFont, gREm(14), gREm(24), #6a6a6a);
			text-align: left;
		}
		.input-box{
			width: gREm(420);
			height: gREm(20);
			margin-top: gREm(15);
			@include FLEX(space-between,center);
			.field-input{
				height: 100%;
				width: gREm(420 - 20 - 10);
				@include Set-Font($AppFont, gREm(16), gREm(24), #0d0c22);
				text-align: left;

			}
			.icon{
				&[active='on']{
					width: gREm(20);
					height: gREm(20);
					cursor: pointer;
					@include SetBgImage(url('../assets/img/ic-closed-input-n.svg'));
					// @include OnOverTransition();
				}
				&[active='on']:hover{
					@include SetBgImage(url('../assets/img/ic-closed-input-h.svg'));
				}
			}
		}
		.line {
			width: 100%;
			height: gREm(1);
			margin-top:gREm(6);
			background-color: #ededed;
			@include Transition(0.5s ease-in-out);

			&[active='on']{
				background-color: #6c38ef;
				height: gREm(2);
			}
		}
		// .line:focus {
		// 	background-color: #6c38ef;

		// }
	}
	.password {
		margin-top: gREm(50);
		// margin-bottom:gREm(20);
		.input-box{
			@include FLEX(space-between,center);
			.field-input{
				width: gREm(420 - 20 - 10);
			}
			.icon{
				&[active='on']{
					width: gREm(20);
					height: gREm(20);
					cursor: pointer;
					@include SetBgImage(url('../assets/img/ic-closed-input-n.svg'));
					// @include OnOverTransition();
				}
				&[active='on']:hover{
					@include SetBgImage(url('../assets/img/ic-closed-input-h.svg'));
				}
			}

		}

	}

	.remember-me {
		margin-top: gREm(20);
		width: gREm(420);
		height: gREm(18);
		@include FLEX(space-between,center);
		.check-box{
			width: gREm(120);
			@include FLEX(flex-start,center);

			.checks{
				@include FLEX(center,center);
				width: gREm(19);
				height: gREm(19);
				cursor: pointer;
				@include SetBgImage(url('../assets/img/checkbox-n.svg'));
				// border-radius: 20px;
				// border:none;
				margin-right: gREm(8);
			}
			.remember{
				@include FLEX(flex-start,center);
				width:gREm(91);
				height: gREm(18);
				cursor: pointer;
				@include Set-Font($AppFont, gREm(14), gREm(24), #6a6a6a);

			}
			&[active='on']{
				@include FLEX(flex-start,center);
				.checks{
					@include SetBgImage(url('../assets/img/checkbox-s.svg'));
					margin-right: gREm(8);
				}
			}
		}
		.forgot-msg{
			margin-left: gREm(130);
			.text {
				@include Set-Font($AppFont, gREm(14), gREm(24), #6c38ef);
			}
			.forgot-id, .forgot-pwd {
				cursor: pointer;
				&:hover {
					text-decoration-line: underline;
				}
			}
			.forgot-slash {
				padding-left: gREm(5);
				padding-right: gREm(5);
			}

		}
	}

	.loginbtn {
		margin-top: gREm(70);
		width: gREm(200);
		height: gREm(60);
		border-radius: 6px;
		@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
		@include OnOverTransition();
	}

	.connectbtn {
		margin-top: gREm(30);
		width: gREm(300);
		height: gREm(60);
		border-radius: 6px;
		@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
		@include OnOverTransition();
	}

	.signup-box{
		margin-top: gREm(30);
		.signup-box-wrap{
			width: 100%;
			height:gREm(18);
			@include FLEX(flex-start,center);

			.notamember{
				width:auto;
				@include Set-Font($AppFont, gREm(14), gREm(24), #6a6a6a);
			}
			.signup-msg{
				width: auto;
				margin-left:gREm(7);
				cursor: pointer;
				@include Set-Font($AppFont, gREm(14), gREm(24), #18a7f8);
				&:hover {
					text-decoration-line: underline;
				}
			}

		}
	}

}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.5s ease;
}

// .modal-enter {
//   opacity: 0;
// }

.modal-leave-active {
	opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}
</style>
