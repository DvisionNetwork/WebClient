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

							<BaseButton type="button" class="connectbtn metamask-btn" @click="connectMetamask">
								<img src="../assets/img/ic-metamask.svg" alt="" class="ic-image">
								Metamask
							</BaseButton>

							<BaseButton type="button" class="connectbtn walletconnect-btn" @click="connectWalletConnect">
								<img src="../assets/img/ic-walletconnect.svg" alt="" class="ic-image">
								WalletConnect
							</BaseButton>
							<BaseButton type="button" class="connectbtn coinbase-btn" @click="connectCoinbase">
								<img src="../assets/img/ic-coinbase.svg" alt="" class="ic-image">
								Coinbase
							</BaseButton>
							<BaseButton type="button" class="connectbtn fortmatic-btn" @click="connectFortmatic">
								<img src="../assets/img/ic-coinbase.svg" alt="" class="ic-image">
								Fortmatic
							</BaseButton>
							<div class="or">
								<span class="line"></span>
								<span class="text">or</span>
								<span class="line"></span>
							</div>
							<div class="login-input">
								<input v-model="idLogin" type="text" placeholder="Please enter ID..." />
							</div>
							<div class="login-pwd">
								<input v-model="passwordLogin" :type="passwordType" placeholder="***********" />
								<img class="img-eye" src="../assets/img/ic-eye.svg" alt="eye" @click="handleEyeClick()">
							</div>
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

							<BaseButton @click="loginWithEmail" type="button" class="login-btn"
								>Login</BaseButton
							>

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

import {
	BRIDGE_WALLETCONNECT,
	DEFAULT_ETH_JSONRPC_URL,
	BSC_CHAIN_ID,
	FORTMATIC_API_KEY,
	BSC_RPC_ENDPOINT,
	VALUE_LOGIN,
	MATIC_RPC_ENDPOINT,
	MATIC_CHAIN_ID,
	METAMASK,
	COINBASE,
	ETH_CHAIN_ID,
	ETH_RPC_ENDPOINT,
	checkProviderWallet,
 FORTMATIC, WALLETCONNECT
} from '@/features/Common.js'
import { coinbaseProvider, fortmaticProvider } from '@/features/Connectors.js'
import Web3 from 'web3'
import {
	MSG_METAMASK_1,
} from '@/features/Messages.js'

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
			passwordType: 'password',
			idLogin: '',
			passwordLogin: '',
		}
	},
	props: {
		setProviderWalletCon: Function,
	},
	methods: {
		loginWithEmail() {
			const data = {
				account: this.idLogin,
				password: sha256(this.passwordLogin).toString(),
				key: "0",
				value: VALUE_LOGIN,
				usedomain: 'false',
			}
			this.reqLogin(data, true);
		},
		handleEyeClick() {
			this.passwordType =
				this.passwordType === 'password' ? 'text' : 'password';
		},
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
		async connectMetamask(data = null, loginWithEmail = false) {
			const provider = checkProviderWallet(METAMASK);
			console.log("[Login] connect metamask account");
			const rv = await wAPI.checkMetamask();
			if (rv !== 'NONE') {
				wAPI.Request_Account((resp) => {
					if (resp.res_code == 200) {
						const account = _U.getIfDefined(resp, ['data', 'account'])
						if (data && loginWithEmail) {
							if (account === data.wlt.currentAccount) {
								return this.handleLogicLoginWithId(data, METAMASK)
							}
							this.mxShowToast(MSG_METAMASK_1);
							return;
						}
						if (account) {
							wAPI.Sign_Account(account, this.reqLogin, provider)
							this.mxSetNetwork(rv)
							window.localStorage.setItem('loginBy', METAMASK);
							// window.localStorage.setItem('currentNetwork',chainId)
							return;
						}
					}
					this.mxShowAlert({
						msg:
							this.$t('signup.register.error-on-wallet-url') +
							'\n' +
							this.$t('popup.metamask-request-error') +
							'\n' +
							resp.res_code,
					})
				})
			} else {
				this.mxShowAlert({
					msg:
						this.$t('signup.register.error-on-wallet-url') +
						'\n' +
						this.$t('popup.metamask-chain-not-matched'),
				})
			}
		},
		async connectCoinbase(data = null, loginWithEmail = false) {
			
			const provider = checkProviderWallet(COINBASE);
			console.log("[Login] connect coinbase account");
			coinbaseProvider.enable().then(async (accounts) => {
				const rv = await wAPI.checkMetamask();
				if(rv !=='NONE') {
					if (data && loginWithEmail) {
						if (accounts[0] === data.wlt.currentAccount) {
							return this.handleLogicLoginWithId(data, COINBASE)
						}
						this.mxShowToast(MSG_METAMASK_1);
						return;
					}
					if (accounts) {
						wAPI.Sign_Account(accounts[0], this.reqLogin, provider)
						this.mxSetNetwork(rv)
						window.localStorage.setItem('loginBy', COINBASE)
					} else if (error) {
						this.mxShowAlert({ msg: 'error' })
					}
				} else {
					this.mxShowAlert({
					msg:
						this.$t('signup.register.error-on-wallet-url') +
						'\n' +
						this.$t('popup.coinbase-chain-not-matched'),
					})
				}
			})
		},
		async connectFortmatic(data, loginWithEmail = false) {
			try {
				let web3 = new Web3(fortmaticProvider.getProvider())
				var ref = this
				web3.eth.getAccounts((error, accounts) =>{
					if(error) throw error
					const from = accounts[0]
					const msgToShow = 'Welcome to Dvision World.';
					const msg = `0x${Buffer.from(msgToShow, 'utf8').toString('hex')}`
					const params = [msg, from]
					const method = 'personal_sign'
					web3.currentProvider.sendAsync({
						id: 1,
						method,
						params,
						from
					}, (error, result) => {
						if(error) throw error;
						const currentNetwork = window.localStorage.getItem('currentNetwork')
						if(currentNetwork && currentNetwork.length > 0) {
							window.localStorage.setItem('fortmaticNetwork', currentNetwork)
							switch (currentNetwork) {
								case '0x4':
								case '4':
									window.localStorage.setItem('networkRPC', ETH_RPC_ENDPOINT)
									break
								case '0x61':
								case '97':
									window.localStorage.setItem('networkRPC', BSC_RPC_ENDPOINT)
									break
								case '0x13881':
								case '80001':
								window.localStorage.setItem('networkRPC', MATIC_RPC_ENDPOINT)
									break
								default :
								window.localStorage.setItem('networkRPC', ETH_RPC_ENDPOINT)
								window.localStorage.setItem('fortmaticNetwork', ETH_CHAIN_ID)
							}
						}
						else {
							window.localStorage.setItem('networkRPC', ETH_RPC_ENDPOINT)
							window.localStorage.setItem('fortmaticNetwork', ETH_CHAIN_ID)
						}
							if (!loginWithEmail) {
							ref.reqLogin({ wallet_addr: from, wallet : 4 })
							window.localStorage.setItem('loginBy',FORTMATIC)
						} else {
							if (accounts[0] === data.wlt.currentAccount) {
								return this.handleLogicLoginWithId(data, FORTMATIC)
							}
							this.mxShowToast(MSG_METAMASK_1);
							return;
						}
					})
				})
			}
			catch(err){
				console.log('catch',err)
			}
		},
		async connectWalletConnect(data, loginWithEmail = false) {

			// this.setProviderWalletCon.on("accountsChanged", (accounts) => {
			// 	if (accounts) {
			// 		this.reqLogin({ wallet_addr: accounts[0] })
			// 		window.localStorage.setItem('loginBy','WalletConnect')
			// 	} else {
			// 		this.mxShowAlert({ msg: 'error' })
			// 	}
			// });

			// await this.setProviderWalletCon.enable()

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
				if (data && loginWithEmail) {
					if (accounts[0] === data.wlt.currentAccount) {
						return this.handleLogicLoginWithId(data, WALLETCONNECT)
					}
					this.mxShowToast(MSG_METAMASK_1);
					return;
				}
				if (accounts) {
					this.reqLogin({ wallet_addr: accounts[0] })
					window.localStorage.setItem('loginBy',WALLETCONNECT)
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

		reqLogin(data, loginWithEmail = false) {
			console.log("[Auth] login() ", data);

			_U.callPost({
				url: gConfig.login_url,
				data: data,
				callback: (resp) => {
					let rdata = resp.data;
					if (rdata && typeof rdata == 'string') {
						this.mxShowToast(rdata)
					} else if (
						rdata &&
						typeof rdata == 'object' &&
						rdata.length > 0
					) {
						if (rdata[0]) {
							const userInfo = { ...rdata[0] }
							userInfo.oqs_no = ''
							// userInfo.wallet_addr = data.wallet_addr ? data.wallet_addr
							const wlt = {
								currentAccountIdx: 0,
								currentAccount: userInfo.wallet_addr,
								accounts: [userInfo.wallet_addr],
								balance: 0,
								updated: true,
							}
							if (loginWithEmail) {
								const data = {
									wlt,
									userInfo,
								}
								switch (rdata[0].wallet) {
									case '1':
										this.connectMetamask(data, true);
										break;
									case '2':
										this.connectCoinbase(data, true);
										break;
									case '3':
										this.connectWalletConnect();
										break;
									case '4':
										this.connectFortmatic(data, true);
										break;
									default:
										this.mxShowToast('Invalid wallet');
										break;
								}
								return
							}
							this.mxSetWallet(wlt)
							this.$store.dispatch('setUserInfo', userInfo)
							this.$cookies.set(
								'userInfo',
								userInfo,
								gConfig.getUserInfoCookieExpireTime()
							)
							this.closePopup()

							if (this.$route.name == 'Signup-Page') {
								this.$router.push({ name: 'Home' })
							}
						}
					}
				}
			});
		},

		handleLogicLoginWithId(data, site) {
			this.mxSetWallet(data.wlt);
			this.$store.dispatch('setUserInfo', data.userInfo);
			this.$cookies.set('userInfo', data. userInfo, gConfig.getUserInfoCookieExpireTime());
			window.localStorage.setItem('loginBy', site)
			this.closePopup();
			if (this.$route.name == 'Signup-Page') {
				this.$router.push({name:"Home"});
			}
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
			width: 480px;
			height: auto;
			margin: 0px auto;
			// padding: 20px 30px;
			background-color: #fff;
			border-radius: 20px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
			transition: all 0.3s ease;
			font-family: Helvetica, Arial, sans-serif;
			& .or{
				display: flex;
				align-items: center;
				justify-content: center;
				gap: gREm(8);
				line-height: 22px;
				margin-top: gREm(37);
				margin-bottom: gREm(31);
				& .text{
					color: #A0A0A0;
					font-size: gREm(14);
					line-height: gREm(22);
				}
				& .line{
					width: gREm(147);
					height: 1px;
					background: #E2E2E2;
				}
			}
		}
	}
}

.form {
	@include FLEXV(flex-start,center);
	width: 100%;
	height: auto;
	.login-input{
		margin-bottom: gREm(14);
		& input{
			border: 1px solid rgba(24, 23, 33, 0.1);
			width: gREm(324);
			height: auto;
			padding: gREm(13) gREm(32);
			color: #181721;
			border-radius: 10px;
			font-size: gREm(14);
			line-height: gREm(22);
		}
	}
	.login-pwd{
		position: relative;
		& input{
			border: 1px solid #E2E2E2;
			width: gREm(324);
			height: auto;
			padding: gREm(13) gREm(75) gREm(13) gREm(32);
			color: #181721;
			border-radius: 10px;
			font-size: gREm(14);
			line-height: gREm(22);
		}
		& .img-eye {
			position: absolute;
			top: 50%;
			right: gREm(30);
			transform: translate(-50%, -50%);
			cursor: pointer;
		}
	}

	input::placeholder {
		color: #BABABA;
	}

	.login-btn {
		width: 100%;
		max-width: gREm(324);
		padding: gREm(17) 0;
		height: auto;
		background: linear-gradient(85.48deg, #9f52ff 0%, #3504ff 99.18%);
		border-radius: 10px;
		font-family: $AppFont;
		font-size: gREm(14);
		line-height: gREm(22);
		font-weight: 700;
		text-align: center;
		margin-top: gREm(24);
		cursor: pointer;
	}

	.closebtn {
		@include SetBgImage(url('../assets/img/close-popup.svg'));
		width: gREm(18);
		height: gREm(18);
		cursor: pointer;
		@include OnOverTransition();
		position: absolute;
		top: gREm(27);
		right: gREm(29);
	}
	.welcome {
		height: auto;
		width:100%;
		margin-top: gREm(50);
		text-align: center;
		@include Set-Font($AppFont, gREm(14), gREm(24), #0d0c22);
	}
	.popup-title {
		height: auto;
		width:100%;
		margin-top: gREm(8);
		margin-bottom: gREm(12);
		text-align: center;
		@include Set-Font($AppFont, gREm(28), gREm(38), #181721, 600);
		white-space: pre-wrap;
		padding: 0 gREm(20);
	}
	.id,
	.password {
		height: gREm(40+18);
		width: gREm(420);
		margin-top: gREm(72);
		.title {
			height: gREm(18);
			width: 100%;
			@include Set-Font($AppFont, gREm(14), gREm(24), #6a6a6a);
			text-align: left;
		}
		.input-box {
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
			.icon {
				&[active='on']{
					width: gREm(20);
					height: gREm(20);
					cursor: pointer;
					@include SetBgImage(url('../assets/img/ic-closed-input-n.svg'));
					// @include OnOverTransition();
				}
				&[active='on']:hover {
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
		margin-top: gREm(16);
		width: 100%;
		max-width: gREm(324);
		height: auto;
		@include FLEX(flex-end,center);
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
		padding-left: gREm(75);
		margin-top: gREm(10);
		width: gREm(324);
		height: gREm(64);
		border-radius: 6px;
		// @include Set-Font($AppFont, gREm(18), gREm(22), unset);
		@include OnOverTransition();
		& .ic-image{
			margin-right: gREm(15);
		}
		&:hover{
			transform: translateY(-2px);
		}
	}

	.signup-box{
		margin-top: gREm(16);
		margin-bottom: gREm(50);
		width: 100%;
		max-width: gREm(324);
		text-align: left;
		.signup-box-wrap{
			width: 100%;
			height: auto;
			@include FLEX(flex-start,center);

			.notamember{
				width:auto;
				@include Set-Font($AppFont, gREm(14), gREm(22), #6a6a6a);
			}
			.signup-msg{
				width: auto;
				margin-left:gREm(7);
				cursor: pointer;
				@include Set-Font($AppFont, gREm(14), gREm(22), #6C38EF, 500);
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

@include media-max($media_small) {
	.modal-mask {
		.modal-wrapper {
			.modal-container {
				width: 100%;
				max-width: 90vw;
			}
		}
	}
}
</style>
