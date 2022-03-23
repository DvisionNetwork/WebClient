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

							<div class="title">{{$t('popup.edit-profile.title')}}</div>

							<div class="field-set-box edit-profile-info">
								<PopupInput
									v-for="field in updateInfo"
									:popupStyle="'popup-edit-profile'"
									:fieldsetParentCss="'.modal-mask .edit-profile-info'"
									:key="field.name"
									:field="field"
									v-model="field.value"
									@btn-click="onBtnClick"
								/>
							</div>

							<BaseButton type="button" class="submit-btn g-btn" @click="onSubmit">
								{{$t('popup.edit-profile.btn-name')}}
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

import sha256 from 'crypto-js/sha256';
import PopupInput from '@/components/PopupInput.vue'

export default {
	components: {
		PopupInput,
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
			updateInfo: {
				id: {
					name: 'id',
					disabled: true,
					checked:true,
					label: this.$t('signup.register.label-id'),
					placeholder: this.$t('signup.register.place-holder-id'),
					type: 'id',
					value: this.mxGetUserInfo().account,
					maxlength: 20,
					minlength: 5,
				},
				password1: {
					name: 'password',
					checked:false,
					buttonClick: true,
					buttonName: this.$t('signup.register.change-pwd-button-name'),
					label: this.$t('signup.register.label-pwd'),
					// labelInfo: this.$t('signup.register.icon-pwd-popup'),
					placeholder: this.$t('popup.edit-profile.place-holder-pwd'),
					type: 'password',
					value: '',
					maxlength: 26,
					minlength: 6,
				},
				name: {
					name: 'name',
					checked:true,
					label: this.$t('signup.register.label-name'),
					placeholder: this.$t('signup.register.place-holder-name'),
					type: 'text',
					value: this.mxGetUserInfo().name,
					maxlength: 30,
					minlength: 1,
				},
				email: {
					name: 'email',
					checked:true,
					label: this.$t('signup.register.label-email'),
					placeholder: this.$t('signup.register.place-holder-email'),
					type: 'email',
					value: this.mxGetUserInfo().email,
					maxlength: 120,
					minlength: 8,
				},
				mobile: {
					name: 'mobile',
					checked:true,
					label: this.$t('signup.register.label-mobile'),
					placeholder: this.$t('signup.register.place-holder-mobile'),
					type: 'number',
					value: this.mxGetUserInfo().phone_number,
					maxlength: 11,
					minlength: 10,
				},
			},
			submitData: null,
		}
	},
	props: {
	},
	methods: {

		closePopup() {
			console.log('close')
			this.mxCloseEditProfile();
			// this.$emit('close-auth')
		},

		onBtnClick(fieldName, val) {
			console.log("==== Popup.EditProfile field name =", fieldName, val);
			switch(fieldName) {

				case 'email':
					this.callEmail(val);
					break;
				case 'password':
					this.mxShowChangePasswordPopup(val);
					break;
			}

		},

		callEmail(val) {

			var data = {
				'to' : val,
				'country': this.mxGetCountryCodeNo(),
			};

			_U.callEmail(data,(resp)=>{

				if(_U.getIfDefined(resp,'data')=='success') {
					this.mxShowToast(this.$t('signup.register.email-message-sent'));
					this.updateInfo.email.checked=true;
					this.updateInfo.email.errorMsg='';
				}
				console.log("[Popup.EditProfile] callEmail()-> resp ", resp);
			})


		},

		onSubmit () {

			var chFS = this.checkFieldSet();
			if(chFS.result==false) {
				this.mxShowToast(this.$t('signup.register.error-form-join')+chFS.message);
				return;
			}

			var data = this.getSubmitValues();
			this.submitData = data;

			console.log('[Signup.Register] onSubmit() data:', data);
			
			_U.callPost({
				url:gConfig.member_update,
				data: data,
				callback: (resp) =>{
					console.log("[Signup.EditProfile] onSubmit()-> resp ", resp);
					if(_U.getIfDefined(resp,'data')=='success') {
						this.updateUserInfo();
						this.mxShowToast(this.$t('popup.edit-profile.result-ok'));
						this.closePopup();
					}else{
						this.mxShowToast(this.$t('popup.edit-profile.error-api-update')+'<br>('+_U.getIfDefined(resp,'data')+')');
					}
				}
			});
		},
		updateUserInfo() {
			var data = this.submitData;
			data.password='';
			data['phone_number'] = data.phone;
			data['admin_category'] = _U.getIfDefined(this.userInfo,'admin_category');
			data['intro'] = _U.getIfDefined(this.userInfo,'intro');
			data['nickname'] = _U.getIfDefined(this.userInfo,'nickname');
			this.mxSetUserInfo(
				data
			);
		},
		getSubmitValues() {
			var rv = {
				country : this.mxGetCountryCodeNo(),
				phone : this.updateInfo.mobile.value,
				email : this.updateInfo.email.value,
				account: this.updateInfo.id.value,
				password: sha256(this.updateInfo.password1.value).toString(),
				name: this.updateInfo.name.value,
				gender: '',
				birth: '',
				affiliation: '',
				department: '',
				position: ''
			}
			return rv;
		},
		checkFieldSet() {

			var rv = {
				result: true,
				message: ''
			};

			for(var itemName in this.updateInfo) {
				var item = this.updateInfo[itemName];
				console.log("=== === item: ", item)
				if(item.checked==false) {
					rv.result = false;
					rv.message = '<br>('+item.placeholder+')';
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
			width: gREm(814);
			height: gREm(665);
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
		// margin-bottom: gREm(10);
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
		right: 0;
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
		margin-top: gREm(50);
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
