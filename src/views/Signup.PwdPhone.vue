<template>
	<div class="PwdPhone">
		<div class="title-box">
				<div class="title">{{$t("signup.reset-password.resetpwd-title")}}</div>
		</div>
		<div class="h-bar"></div>

		<div class="req-box">
			<form
			class="frm_signup"
			@submit.prevent="signup"
			>

				<div class="user-info field-set-box">

					<PopupInput
						:popupStyle="'signup-register'"
						v-for="field in fieldset.userInfo"
						:key="field.name"
						:field="field"
						:maxlength="field.maxlength ? field.maxlength : 120"
						:minlength="field.minlength ? field.minlength : 1"
						v-model="field.value"
						@btn-click="onBtnClick"
					/>

				</div>
				<div class="button-box">
					<div class="btn next" @click="onSubmit()">{{$t("signup.btn.submit")}}</div>
				</div>

			</form>
		</div>
	</div>
</template>

<script>

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();

import PopupInput from '@/components/PopupInput.vue'

export default {
	name: "PwdPhone",
	components: {
		PopupInput
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
			fieldset: {
				userInfo: {
					id: {
						name: 'id-input',
						checked:true,
						label: this.$t('signup.register.label-id'),
						labelInfo: this.$t('signup.register.icon-id-popup'),
						placeholder: this.$t('signup.register.place-holder-id'),
						type: 'text',
						value: '',
						maxlength: 30,
						minlength: 5,
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
			},
		}
	},
	computed: {
		computedvar() {
			return 1;
		}
	},
	methods : {
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

				_U.callPost({
					url:gConfig.reset_password,
					data: data,
					callback: (resp) =>{
						console.log("[Signup.PwdPhone] onSubmit()-> resp ", resp);
						var resData = _U.getIfDefined(resp,'data');
						if(resData=='success') {
							this.mxShowToast(this.$t('signup.reset-password.sent-your-new-password'));
							this.$store.dispatch('showLoginPopup',true);
							// this.$router.push({name:"Signup-Page", params:{page: 'resetpwd', account: data.account}});
						}else{
							this.mxShowToast(this.$t('signup.reset-password.error-on-reset-password')+'<br>('+resData+')');
						}
					}
				});
		},
		getSubmitValues() {
			var rv = {
				country : this.mxGetCountryCodeNo(),
				account: this.fieldset.userInfo.id.value,
				email : this.fieldset.userInfo.email.value,
			}
			return rv;
		},
		checkFieldSet() {

			var rv = {
				result: true,
				message: ''
			};

			for(var infoName in this.fieldset) {
				console.log("=== info: ", infoName)
				for(var itemName in this.fieldset[infoName]) {
					var item = this.fieldset[infoName][itemName]
					console.log("=== === item: ", item)
					if(item.checked==false) {
						rv.result = false;
						if(item.name=='email') {
							rv.message = '<br>('+this.$t('signup.register.error-msg-email')+')';
						}else{
							rv.message = '<br>('+item.placeholder+')';
						}
						break;
					}
				}
			}
			return rv;
		},

		onBtnClick(fieldName, val) {
			console.log("==== field name =", fieldName, val);
			switch(fieldName) {
				case 'email':
					this.callEmail(val);
					// this.callTest();
					// this.callTest2();
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
					this.fieldset.userInfo.email.checked=true;
					this.fieldset.userInfo.email.errorMsg='';
				}
				console.log("[Signup.Register] callEmail()-> resp ", resp);
			})

		},
	}
}
</script>


<style lang="scss" scoped>
.PwdPhone{
	@include FLEXV(center, center);
	width: 100%;
	height: auto;
	& * {
		color: black;
	}
	padding-bottom: gREm(132);
	.title-box{
		@include FLEX(center, flex-start);
		width: 100%;
		height: gREm(40 + 40);
		.title{
			@include FLEX(center, center);
			width: auto;
			height: gRMe(40);
			@include Set-Font($AppFont, gREm(32), gREm(41), #17141a, 600);

		}
	}
	.h-bar{
		width: 100%;
		height: 1px;
		background-color: #dedede;
	}
	.req-box{
		@include FLEXV(flex-start, center);
		width:100%;
		height: auto;
		.frm_signup{
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
				}
			}
		}
		.button-box{
			@include FLEX(center, center);
			margin-top: gREm(80 - 20);
			.btn {
				@include FLEX(center, center);
				width: gREm(200);
				height: gREm(60);
				border-radius: gREm(6);
				background-image: none;
				@include OnOverTransition();
				cursor: pointer;
				// &:hover {
				// 	background-color: transparent;
				// 	background-image: linear-gradient(256deg, #3504ff, #9f52ff);
				// 	color: #ffffff;
				// }
				&.next {
					background-color: transparent;
					background-image: linear-gradient(256deg, #3504ff, #9f52ff);
					@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
					border: none;
				}
			}
		}
	}
}
</style>
