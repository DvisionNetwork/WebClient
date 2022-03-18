<template>
	<div class="Register">

		<div class="title-box">
			<div class="title">{{$t("signup.register.title")}}</div>
		</div>
		<div class="h-bar"></div>

		<div class="register-box">
			<form
				class="frm_signup"
				@submit.prevent="signup"
			>
				<div class="id-info field-set-box">
					<div class="title">{{$t("signup.register.id-info-title")}}</div>
					<PopupInput
						:popupStyle="'signup-register'"
						v-for="field in fieldset.idInfo"
						:key="field.name"
						:field="field"
						:maxlength="field.maxlength ? field.maxlength : 120"
						:minlength="field.minlength ? field.minlength : 1"
						v-model="field.value"
						@btn-click="onBtnClick"
					/>
				</div>

				<div class="user-info field-set-box">
					<div class="title">{{$t("signup.register.user-info-title")}}</div>
					<PopupInput
						:popupStyle="'signup-register'"
						v-for="field in fieldset.userInfo"
						:key="field.name"
						:field="field"
						:maxlength="field.maxlength ? field.maxlength : 120"
						:minlength="field.minlength ? field.minlength : 1"
						v-model="field.value"
					/>
				</div>

				<div class="wallet-info field-set-box">
					<div class="title">{{$t("signup.register.wallet-info-title")}}</div>
					<div class="title-desc" v-html="$t('signup.register.wallet-info-desc')"></div>
					<div class="title-desc">Click <a href="https://metamask.io/">here</a> to install metamask</div>
					<PopupInput
						:popupStyle="'signup-register'"
						v-for="field in fieldset.walletInfo"
						:key="field.name"
						:field="field"
						v-model="field.value"
						@btn-click="onBtnClick"
					/>
				</div>

			</form>
		</div>
		<div class="button-box">
			<div class="btn cancel" @click="onCancel()">{{$t("signup.btn.cancel")}}</div>
			<div class="btn next" @click="onSubmit()">{{$t("signup.btn.submit")}}</div>
		</div>

	</div>
</template>

<script>
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'
import AppConfig from '@/App.Config.js'
var gConfig = AppConfig()

import PopupInput from '@/components/PopupInput.vue'
import WalletAPI from '@/features/WalletAPI.js'

import sha256 from 'crypto-js/sha256'

var wAPI = new WalletAPI()
import CountryCodes from '@/features/CountryCodes.js'
var CCodes = new CountryCodes()

import {
	checkProviderWallet,
	METAMASK,
	COINBASE
} from '@/features/Common.js'
import { coinbaseProvider, fortmaticProvider, walletConnectProvider, bitski } from '@/features/Connectors.js'
import Web3 from 'web3'

export default {
	name: "Register",
	components: {
		PopupInput,
	},
	props: {
		param1: {
			type: String,
			default: '',
		},
	},
	beforeMount () {
		console.log("[Register.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[Register.vue] mounted(), route : ", this.$route)
	},
	beforeUpdate () {
		console.log("[Register.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[Register.vue] updated(), route : ", this.$route)
	},
	data () {
		return {
			submitData: null,
			walletAddr: null,
			fieldset: {
				idInfo: {
					id: {
						name: 'id',
						buttonName: this.$t('signup.register.id-button-name'),
						buttonDimmed: true,
						checked:false,
						label: this.$t('signup.register.label-id'),
						labelInfo: this.$t('signup.register.icon-id-popup'),
						placeholder: this.$t('signup.register.place-holder-id'),
						type: 'id',
						value: '',
						maxlength: 30,
						minlength: 5,
					},
					password1: {
						name: 'password1',
						checked:false,
						label: this.$t('signup.register.label-pwd'),
						labelInfo: this.$t('signup.register.icon-pwd-popup'),
						placeholder: this.$t('signup.register.place-holder-pwd'),
						type: 'password',
						value: '',
						maxlength: 26,
						minlength: 6,
					},
					password2: {
						name: 'password2',
						checked:false,
						label: this.$t('signup.register.label-pwd-confirm'),
						placeholder: this.$t('signup.register.place-holder-pwd-confirm'),
						type: 'password',
						value: '',
						maxlength: 26,
						minlength: 6,
					},
					referral: {
						name: 'referral',
						checked:false,
						label: this.$t('signup.register.label-referral'),
						placeholder: this.$t('signup.register.place-holder-referral'),
						type: 'text',
						value: '',
						maxlength: 8,
						minlength: 5,
					}
				},
				userInfo: {
					name: {
						name: 'name',
						checked:false,
						label: this.$t('signup.register.label-name'),
						placeholder: this.$t('signup.register.place-holder-name'),
						type: 'text',
						value: '',
						maxlength: 30,
						minlength: 1,
					},
					email: {
						name: 'email',
						checked:false,
						label: this.$t('signup.register.label-email'),
						placeholder: this.$t('signup.register.place-holder-email'),
						type: 'email',
						value: '',
						maxlength: 120,
						minlength: 8,
					}
				},
				walletInfo: {
					walletAddress: {
						name: 'wallet-address',
						disabled: true,
						checked: false,
						buttonName: this.$t('signup.register.wallet-url-button-name'),
						desc: this.$t('signup.register.label-wallet-desc'),
						label: this.$t('signup.register.label-wallet-url'),
						placeholder: this.$t('signup.register.place-holder-wallet-url'),
						type: 'text',
						value: '',
					},
				},
			},
			ccodes: CCodes.codes,
			title: "",
            name: "",
            value: "",
            values: [],    // option value
            options: [],   // option name
            isActive: false,

			selectedWallet: -1, 
		}
	},
	computed: {
	},
	methods : {
		onCancel() {
			this.$router.go(-1);
		},
		onSubmit() {
			var chFS = this.checkFieldSet();
			if(chFS.result==false) {
				this.mxShowToast(this.$t('signup.register.error-form-join')+chFS.message);
				return;
			}

			this.submitData = this.getSubmitValues();
			var data = this.submitData;

			_U.callPost({
				url:gConfig.join_url,
				data: data,
				callback: (resp) =>{
					console.log("[Signup.Register] onSubmit()-> resp ", resp);
					if(_U.getIfDefined(resp,'data')=='success') {
						// console.log("[Signup.Register] call 1 callAddWalletAddress()-> resp ", this.walletAddr);
						if(this.walletAddr) {
							// console.log("[Signup.Register] call 2 callAddWalletAddress()-> resp ", this.walletAddr);
							// this.callAddWalletAddress();
							this.$router.push({name:"Signup-Page", params:{page: 'confirm'}});
						}
					}else{
						this.mxShowToast(this.$t('signup.register.error-api-join')+'<br>('+_U.getIfDefined(resp,'data')+')');
					}
				}
			});
		},
		getSubmitValues() {
			var rv = {
				country : this.mxGetCountryCodeNo(),
				phone : '',
				email : this.fieldset.userInfo.email.value,
				account: this.fieldset.idInfo.id.value,
				password: sha256(this.fieldset.idInfo.password1.value).toString(),
				name: this.fieldset.userInfo.name.value,
				gender: '',
				birth: '',
				affiliation: '',
				department: '',
				position: '',
				recommendedreferrer: this.fieldset.idInfo.referral.value,
				wallet_addr: this.walletAddr,
				wallet: this.selectedWallet,
			}
			return rv;
		},

		checkFieldSet() {
			var rv = {
				result: true,
				message: '',
			}

			for (var infoName in this.fieldset) {
				console.log('=== info: ', infoName)
				for (var itemName in this.fieldset[infoName]) {
					var item = this.fieldset[infoName][itemName]
					console.log('=== === item: ', item)
					if (itemName == 'referral') {
						// optional field
						item.checked = true;
					}
					if (item.checked == false) {
						rv.result = false;
						rv.message = '<br>(' + item.placeholder + ')'
						break
					}
				}
			}
			return rv;
		},
		async sinUpWithCoinbase() {
			checkProviderWallet(COINBASE);
			coinbaseProvider.enable().then((accounts) => {
  		if(!accounts){
				window.open('https://www.coinbase.com/signin?return_to=%2Fdashboard', '_blank')
			}
			else {
				this.walletAddr = accounts[0]
				this.fieldset.walletInfo.walletAddress.value = accounts[0]
				this.fieldset.walletInfo.walletAddress.checked = true;
				this.selectedWallet = '2';
			}
			})
		},
		async sinUpWithFortmatic() {
			let web3 = new Web3(fortmaticProvider.getProvider())
			fortmaticProvider.user.login().then(() => {
  		web3.eth.getAccounts().then((accounts) => {
				if(accounts) {
					this.walletAddr = accounts[0]
					this.fieldset.walletInfo.walletAddress.value = accounts[0]
					this.fieldset.walletInfo.walletAddress.checked = true
					this.selectedWallet = '4';
					}
				});
			});
		},
		async sinUpWithBitski() { 
			const res =	await bitski.signIn()
			if(res) {
				this.walletAddr = res.accounts[0]
				this.fieldset.walletInfo.walletAddress.value = res.accounts[0]
				this.fieldset.walletInfo.walletAddress.checked = true
				this.selectedWallet = '5';
			}
		},
		async sinUpWithwalletConnect() {
			await walletConnectProvider.enable()
			const web3 = new Web3(walletConnectProvider)
			const accounts = await web3.eth.getAccounts();
			if (accounts) {
					this.walletAddr = accounts[0]
					this.fieldset.walletInfo.walletAddress.value = accounts[0]
					this.fieldset.walletInfo.walletAddress.checked = true
					this.selectedWallet = '3';
					return
				} else {
					this.mxShowAlert({
						msg:
							this.$t('signup.register.error-on-wallet-url') +
							'\n' +
							this.$t('popup.metamask-request-error') +
							'\n'
					})
				}
			// const bridge = BRIDGE_WALLETCONNECT
			// const connector = new WalletConnect({
			// 	bridge,
			// 	qrcodeModal: QRCodeModal,
			// })
			// if (!connector.connected) {
			// 	// create new session
			// 	await connector.createSession()
			// } else {
			// 	this.walletAddr = connector._accounts[0]
			// 	this.fieldset.walletInfo.walletAddress.value = connector._accounts[0]
			// 	this.fieldset.walletInfo.walletAddress.checked = true
			// 	// connector.killSession()
			// }

			// connector.on('connect', (error, payload) => {
			// 	console.log(payload, error)
			// 	const { accounts } = JSON.parse(
			// 		JSON.stringify(payload.params[0])
			// 	)
			// 	if (accounts) {
			// 		this.walletAddr = accounts
			// 		this.fieldset.walletInfo.walletAddress.value = accounts
			// 		this.fieldset.walletInfo.walletAddress.checked = true
			// 		this.selectedWallet = '3';
			// 		return
			// 	} else if (error) {
			// 		this.mxShowAlert({
			// 			msg:
			// 				this.$t('signup.register.error-on-wallet-url') +
			// 				'\n' +
			// 				this.$t('popup.metamask-request-error') +
			// 				'\n'
			// 		})
			// 		throw error
			// 	}
			// })
		},

		sinUpWithMetamask() {
			checkProviderWallet(METAMASK);
			wAPI.checkMetamask().then((rv) => {
				if (rv != 'NONE') {
					wAPI.Request_Account((resp) => {
						console.log(
							'[Signup.Register] onBtnClick() -> Request_Account : resp',
							resp
						)
						if (resp.res_code == 200) {
							var account = _U.getIfDefined(resp, [
								'data',
								'account',
							])
							if (account) {
								this.walletAddr = account
								this.fieldset.walletInfo.walletAddress.value = account
								this.fieldset.walletInfo.walletAddress.checked = true
								this.selectedWallet = '1';
								return
							}
						}
						console.log('Error on get wallet url', resp)
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
			})
		},

		sinUpWith(value) {
			this.mxCloseSelectWalletModal()
			switch (value) {
				case 'sinUpWith-Metamask':
					this.sinUpWithMetamask()
					break
				case 'sinUpWith-walletConnect':
					this.sinUpWithwalletConnect()
					break
				case 'sinUpWith-coinbase' :
					this.sinUpWithCoinbase()
					break
				case 'sinUpWith-fortmatic' :
					this.sinUpWithFortmatic()
					break
				case 'sinUpWith-bitski' :
					this.sinUpWithBitski()
					break
			}
			console.log(value)
		},

		onBtnClick(fieldName, val) {
			console.log('==== field name =====', fieldName, val)
			const objSelectWalletPopup = {
				isShow: true,
				sinUpWith: (value) => this.sinUpWith(value),
			}
			switch (fieldName) {
				case 'id':
					this.callCheckId(val)
					break

				case 'email':
					this.callEmail(val)
					break

				case 'wallet-address':
					console.log('==== wAPI ====', wAPI)

					this.$store.dispatch(
						'showSelectWalletPopup',
						objSelectWalletPopup
					)
					break
			}
		},
		// callAddWalletAddress() {
		// 	var data = {
		// 		'account' : this.submitData.account,
		// 		'wallet_addr': this.walletAddr
		// 	};
		// 	// console.log("[Signup.Register] callAddWalletAddress()-> req ", data);

		// 	_U.callPost({
		// 		url:gConfig.member_wallet_create,
		// 		data: data,
		// 		callback: (resp) =>{
		// 			// console.log('[Signup.Register] callAddWalletAddress() -> resp', resp);
		// 			// console.log('[Signup.Register] callAddWalletAddress()', _U.getIfDefined(resp,'data'))
		// 			if(_U.getIfDefined(resp,['data','result'])=='success') {
		// 				this.$router.push({name:"Signup-Page", params:{page: 'confirm'}});
		// 			}else{
		// 				this.mxShowToast("Register of wallet address is failed.<br>" + this.$t(_U.getIfDefined(resp,['data','result'])));
		// 			}
		// 		}
		// 	});
		// },|
		callCheckId(val) {
			var data = { account: val }
			console.log('[Signup.Register] callCheckId()-> req ', data)

			_U.callPost({
				url: gConfig.check_account,
				data: data,
				callback: (resp) => {
					if (_U.getIfDefined(resp, 'data') == false) {
						this.mxShowToast(this.$t('signup.register.id-usable'))
						this.fieldset.idInfo.id.checked = true
						this.fieldset.idInfo.id.errorMsg = ''
					} else{
						this.mxShowToast(
							this.$t('signup.register.id-duplicated')
						)
					}
				}
			});

		},
		callTest() {
			// var a = sha256('my message').toString()
			var data = {
				page: 0,
				count: 10,
				sort: 0,
				network: '0x02',
				category_1: 0,
				category_2: 0,
				filter: '',
			};

			_U.callPost({
				url: gConfig.market_url,
				data: data,
				callback: (resp) => {
					console.log('[Signup.Register] Test()-> resp ', resp)
				},
			})
		},

		toggleOptionList() {
			this.isActive = !this.isActive
		},

		setValue(code) {
			this.isActive = false // close
			this.value = code.value
			this.title = code.name+' ('+code.mcode+')'
			console.log('select-click:', code)
		},
	},
}
</script>

<style lang="scss" scoped>
.Register {
	@include FLEXV(center, center);
	width: 100%;
	height: auto;
	& * {
		color: black;
	}
	padding-bottom: gREm(132);

	.title-box {
		@include FLEX(center, flex-start);
		width: 100%;
		height: gREm(40 + 40);
		.title {
			@include FLEX(center, center);
			width: auto;
			height: gRMe(40);
			@include Set-Font($AppFont, gREm(32), gREm(41), #17141a, 600);
		}
	}
	.h-bar {
		width: 100%;
		height: 1px;
		background-color: #dedede;
	}

	.register-box {
		@include FLEXV(flex-start, center);
		width:100%;
		height: auto;
		.frm_signup {
			@include FLEXV(flex-start, center);
			width:100%;
			height: auto;

			.field-set-box {
				@include FLEXV(space-between, flex-start);
				margin-top: gREm(60);
				margin-bottom: gREm(10);
				width: 100%;
				height: auto; //gREm(28px + 24px + 30 + 123 + 2);
				.title {
					width:100%;
					height: gREm(28);
					margin-bottom: gREm(24);
					@include Set-Font($AppFont, gREm(22), gREm(28), #201360, 600);
				}
				.title-desc {
					width:100%;
					height: auto;
					margin-bottom: gREm(24);
					@include Set-Font($AppFont, gREm(15), gREm(26), #a0a0a0);
					a {text-decoration: underline;}
					a:link { color: blue; }
					a:visited { color: green; }
					a:hover { color: red; }
				}
			}
		}
	}


	.button-box {
		@include FLEX(center, center);
		margin-top: gREm(80 - 20);
		.btn {
			@include FLEX(center, center);
			width: gREm(200);
			height: gREm(60);
			border-radius: gREm(6);
			background-color: #ffffff;
			background-image: none;
			@include OnOverTransition();
			cursor: pointer;
			@include Set-Font($AppFont, gREm(18), gREm(22), #ffff);
			&.next {
				background-color: transparent;
				background-image: linear-gradient(256deg, #3504ff, #9f52ff);
				color: #ffffff;
			}
			&.cancel {
				border: solid 1px #8382a7;
				margin-right: gREm(28);
				color: #8382a7;
			}
		}
	}

}

@include media-max($media_small) { // 768
	.Register {
		.title-box {
			height: 100%;
			margin-bottom: gREm(32);
		}
		.register-box {
			.frm_signup {
				.field-set {
					flex-direction: column;
				}

				.wallet-info {
					margin-top: 0;

					.title,
					.title-desc {
						white-space: pre-wrap;
					}

					.title-desc {
						font-size: gREm(16);
						line-height: gREm(24);

						span {
							color: red;
						}
					}
				}
			}
		}

		.button-box {
			width: 100%;
			margin-top: gREm(16);
		}
	}
}
</style>
