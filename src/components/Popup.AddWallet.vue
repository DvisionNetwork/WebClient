<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div>
						<form
							class="frm_auth frm_wallet form"
						>
							<BaseButton
								type="button"
								class="closebtn"
								@click="closePopup"
							>
							</BaseButton>

							<div class="title">{{$t('popup.add-wallet.title')}}</div>

							<div class="wallet-info field-set-box">
								<PopupInput
									v-for="field in walletInfo"
									:popupStyle="'popup-wallet'"
									:key="field.name"
									:field="field"
									v-model="field.value"
									@btn-click="onBtnClick"
								/>
							</div>

							<BaseButton type="button" class="submit-btn g-btn" @click="onClickSubmit">
								{{$t('popup.add-wallet.btn-name')}}
							</BaseButton>

						</form>
					</div>

				</div>
			</div>
		</div>
	</transition>
</template>

<script>

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();

import WalletAPI from '@/features/WalletAPI.js'
var wAPI = new WalletAPI();

import PopupInput from '@/components/PopupInput.vue'

export default {
	components: {
		PopupInput,
	},
	mounted() {
		// this.popType = authInfo.type;
	},
	computed: {
		wallet() {
			return this.mxGetWallet();
		},
		userInfo() {
			return this.mxGetUserInfo();
		}
	},
	data() {
		return {
			walletAddr: null,
			walletInfo: {
				walletAddress: {
					name: 'wallet-address',
					disabled: true,
					checked:false,
					buttonName: this.$t('signup.register.wallet-url-button-name'),
					desc: this.$t('signup.register.label-wallet-desc'),
					label: this.$t('signup.register.label-wallet-url'),
					placeholder: this.$t('signup.register.place-holder-wallet-url'),
					type: 'text',
					value: '',
				},
			},
		}
	},
	props: {
	},
	methods: {
		closePopup() {
			this.mxCloseAddWallet();
			// this.$emit('close-auth')
		},

		onBtnClick(fieldName, val) {
			console.log("==== field name =", fieldName, val);
			switch(fieldName) {
				case 'wallet-address':
					console.log("==== wAPI==", wAPI);
					wAPI.checkMetamask().then((rv)=>{
						if(rv!='NONE') {
							wAPI.Request_Account((resp) => {
								console.log('[Popup.AddWallet] onBtnClick() -> Request_Account : resp', resp);
								if(resp.res_code == 200) {
									var account = _U.getIfDefined(resp,['data','account']);
									if(account) {
										this.walletAddr = account;
										this.walletInfo.walletAddress.value = account;
										this.walletInfo.walletAddress.checked=true;
										return;
									}
								}
								this.mxShowAlert({msg:this.$t('signup.register.error-on-wallet-url') + '\n' + this.$t('popup.metamask-request-error') + '\n' + resp.res_code});
							});
						}else{
							this.mxShowAlert({msg:this.$t('signup.register.error-on-wallet-url') + '\n' + this.$t('popup.metamask-chain-not-matched')});
						}
					});
					break;
			}
		},

		onClickSubmit() {

			if(!this.walletAddr) {
				this.mxShowToast(this.$t('signup.register.place-holder-wallet-url'));
				return;
			}

			var data = {
				'account' : this.userInfo.account,
				'wallet_addr': this.walletAddr
			};
			console.log("[Popup.addWallet] onClickSubmit()-> req ", data);

			this.mxShowLoading();
			_U.callPost({
				url:gConfig.member_wallet_create,
				data: data,
				callback: (resp) =>{
					this.mxCloseLoading();
					// console.log('[Signup.Register] callAddWalletAddress() -> resp', resp);
					// console.log('[Signup.Register] callAddWalletAddress()', _U.getIfDefined(resp,'data'))
					var msg = _U.getIfDefined(resp,['data','result']);
					if(msg=='success') {
						this.refreshWallet();
						this.closePopup();
					}else{
						this.closePopup();
						this.mxShowAlert({msg:msg});
					}
				}
			});

		},
		refreshWallet() {
			var data = {
				'account' : this.userInfo.account
			};
			console.log("[App] refreshWallet()-> req ", data);

			this.mxShowLoading();

			_U.callPost({
				url:gConfig.member_wallet_list,
				data: data,
				callback: (resp) =>{

					this.mxCloseLoading();

					console.log('[App] refreshWallet() -> resp', resp);
					// accounts = [{ account:userInfo.account, createtime: "2021-06-29 20:07:15". wallet_addr:"0x...." }, ...]
					var accounts = _U.getIfDefined(resp,['data','rows']);
					if(!accounts) {
						this.mxShowToast(this.$t('popup.wallet-list-not-found'));
						return;
					}
					var cIdx = -1;
					for(var i=0; i<accounts.length; i++) {
						if(_U.getIfDefined(accounts[i],'wallet_addr') == this.walletAddr) {
							cIdx = i;
							break;
						}
					}
					if(cIdx < 0 ) {
						this.mxShowToast(this.$t('popup.wallet-not-registered'));
						return;
					}
					var wlt= {
						currentAccountIdx: cIdx,
						currentAccount: this.walletAddr,
						accounts: accounts,
						balance: 0,
					}
					this.mxSetWallet(wlt);
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.modal-mask {
	position: absolute;
	z-index: $Z-INDEX-TOAST;
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
			width: gREm(864);
			height: gREm(385);
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
	height: 100%;
	padding-left: gREm(60);
	padding-right: gREm(60);

	.field-set-box {
		@include FLEXV(space-between, flex-start);
		margin-top: gREm(60);
		margin-bottom: gREm(10);
		width: 100%;
		height: auto; //gREm(28px + 24px + 30 + 123 + 2);
	}

	.closebtn {
		@include SetBgImage(url('../assets/img/ic-closed-popup.svg'));
		width : gREm(40);
		height: gREm(40);
		margin-top:gREm(-51);
		cursor: pointer;
		@include OnOverTransition();
	}

   .title {
		height: gREm(29);
		width:100%;
		margin-top: gREm(70);
		text-align: center;
		@include Set-Font($AppFont, gREm(24), gREm(29), #0d0c22, 600);
   }

	.submit-btn {
		margin-top: gREm(70);
		width: gREm(200);
		height: gREm(60);
		border-radius: 6px;
		@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
		@include OnOverTransition();
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
