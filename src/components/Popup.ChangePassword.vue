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

							<div class="title">{{$t('popup.change-password.title')}}</div>

							<div class="field-set-box change-password-info">
								<PopupInput
									v-for="field in passwordInfo"
									:popupStyle="'popup-changepwd'"
									:key="field.name"
									:field="field"
									v-model="field.value"
								/>
							</div>

							<BaseButton type="button" class="submit-btn g-btn" @click="onSubmit">
								{{$t('popup.change-password.btn-name')}}
							</BaseButton>

						</form>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>

import PopupInput from '@/components/PopupInput.vue'
import sha256 from 'crypto-js/sha256';
import { gConfig } from '@/App.Config'

export default {
	components: {
		PopupInput
	},
	mounted() {
		// this.popType = authInfo.type;
	},
	computed: {
		userInfo() {
			return this.mxGetUserInfo();
		}
	},
	data() {
		return {
			passwordInfo: {
				passwordOld: {
					name: 'password-curr',
					checked:true,
					label: this.$t('popup.change-password.label-curr-pwd'),
					placeholder: this.$t('popup.change-password.place-holder-curr-pwd'),
					type: 'password',
					value: '',
					maxlength: 30,
					minlength: 8,
				},
				password1: {
					name: 'password1',
					checked:false,
					label: this.$t('popup.change-password.label-new-pwd'),
					labelInfo: this.$t('signup.register.icon-pwd-popup'),
					placeholder: this.$t('popup.change-password.place-holder-new-pwd'),
					type: 'password',
					value: '',
					maxlength: 30,
					minlength: 8,
				},
				password2: {
					name: 'password2',
					checked:false,
					label: this.$t('popup.change-password.label-new-pwd-confirm'),
					placeholder: this.$t('popup.change-password.place-holder-new-pwd-confirm'),
					type: 'password',
					value: '',
					maxlength: 30,
					minlength: 8,
				},
			},
		}
	},
	props: {
	},
	methods: {

		closePopup() {
			this.mxCloseChangePasswordPopup();
			// this.$emit('close-auth')
		},

		onSubmit () {

			// this.$router.push({name:"Signup-Page", params:{page: 'idresult', account: 'unclepooh'}});
			// return;

			var chFS = this.checkFieldSet();
			if(chFS.result==false) {
				this.mxShowToast(this.$t('signup.register.error-form-join')+chFS.message);
				return;
			}

			this.submitData = this.getSubmitValues();
			var data = this.submitData;

			window._U.callPost({
				url:gConfig.change_password,
				data: data,
				callback: (resp) =>{
					console.log("[Signup.ChangePassword] onSubmit()-> resp ", resp);
					var resData = window._U.getIfDefined(resp,'data');
					if(resData=='success') {
						this.mxShowToast(this.$t('popup.change-password.success-change-password'));
						this.mxCloseChangePasswordPopup();
					}else{
						this.mxShowToast(this.$t('popup.change-password.error-api-change-password')+'<br>('+window._U.getIfDefined(resp,'data')+')');
					}
				}
			});

		},
		getSubmitValues() {
			var rv = {
				phone : this.userInfo.phone_number,
				account: this.userInfo.account,
				prev_password: sha256(this.passwordInfo.passwordOld.value).toString(),
				password: sha256(this.passwordInfo.password1.value).toString(),
			}
			return rv;
		},
		checkFieldSet() {

			var rv = {
				result: true,
				message: ''
			};

			for(var itemName in this.passwordInfo) {
				var item = this.passwordInfo[itemName]
				console.log("=== === item: ", item)
				if(item.checked==false) {
					rv.result = false;
					if(item.name=='mobile') {
						rv.message = '<br>('+this.$t('signup.register.error-mobile-number')+')';
					}else{
						rv.message = '<br>('+item.placeholder+')';
					}
					break;
				}
			}
			return rv;
		},
	}
}
</script>

<style lang="scss" scoped>
.modal-mask {
	position: absolute;
	z-index: $Z-INDEX-CHECK-PASSWORD-POPUP;
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
			width: gREm(683);
			height: gREm(505);
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
	padding-left: gREm(50);
	padding-right: gREm(50);

	.field-set-box {
		@include FLEXV(space-between, flex-start);
		margin-top: gREm(70);
		width: 100%;
		height: auto; //gREm(28px + 24px + 30 + 123 + 2);
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
		z-index: 10;
	}

   .title {
		height: gREm(29);
		width:100%;
		margin-top: gREm(70);
		text-align: center;
		@include Set-Font($AppFont, gREm(24), gREm(29), #0d0c22, 600);
   }

	.submit-btn {
		margin-top: gREm(60);
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

@include media-max($media_small) {
	.modal-mask {
		.modal-wrapper {
			.modal-container {
				width: 90vw;
				height: auto;

				.form {
					padding: 0 gREm(32);

					.field-set-box {
						margin-top: gREm(26);
					}

					.title {
						text-align: left;
						font-size: gREm(22);
						margin-top: gREm(24);
					}

					.submit-btn {
						margin-bottom: gREm(40);
						margin-top: gREm(32);
					}
				}
			}
		}
	}

}
</style>
