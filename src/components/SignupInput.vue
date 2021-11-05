<template>
	<div class="field-set">
		<label v-if="field.label" :for="uuid" class="label">
			{{ field.label }}
		</label>
		<div class="field-box-wrap">
			<div class="field-box">
				<select v-if="field.type === 'select'"
					class="field"
					v-bind="{
						...$attrs
					}"
					@input="onUpdate"
					@blur="checkField"
					:type="field.type"
					:disabled="field.disabled"
					:id="uuid"
					:name="field.name"
					:value="modelValue"
					:placeholder="field.placeholder ? field.placeholder : field.label"
					@focusin="inputfocus = true;"
					@focusout="inputfocus = false;"
				>
					<option v-for="code in ccodes"
						class="field-option"
						:value="code.value"
						:key="code.ccode"
						:selected="code.ccode == modelValue"
					>
						{{code.name+' ('+code.mcode+')'}}
					</option>
				</select>
				<input v-if="field.type !== 'select'"  class="field"
					v-bind="{
						...$attrs
					}"
					@input="onUpdate"
					@blur="checkField"
					:type="field.type"
					:disabled="field.disabled"
					:id="uuid"
					:name="field.name"
					:value="modelValue"
					:placeholder="field.placeholder ? field.placeholder : field.label"
					@focusin="inputfocus = true;"
					@focusout="inputfocus = false;"
				/>
				<div class="field-right">
					<div v-if="field.errorMsg" class="field-error">{{field.errorMsg}}</div>
					<div v-if="field.buttonName"
						class="field-button"
						:dimmed="(field.buttonDimmed ? 'on' : 'off')"
						@click="onBtnClick()"
					>
						{{field.buttonName}}
					</div>
				</div>
			</div>
			<div class="h-bar" :active="(inputfocus ? 'on' :'off')"></div>
		</div>
	</div>

</template>

<script>
// import SetupFormComponent from '@/features/SetupFormComponent'

import CountryCodes from '@/features/CountryCodes.js'
var CCodes = new CountryCodes();


export default {
	props: {
		field: {
			type: Object,
			default: {},
		},
		modelValue: {
			type: [String, Number],
			default: '',
		}
	},
	components: {
	},
	mounted () {
		console.log("[SignupInput.vue] mounted(), route : ", this.$route, this.field)
		if(this.field.type=='select') {
			console.log("[SignupInput.vue] mounted(), CountryCodes: ==================== ", this.ccodes)
		}
	},
	data() {
		return {
			ccodes: CCodes.codes,
			reg : {
				id: /^[0-9a-z]{5,20}$/,
				password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,30}$/,
				email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
				mobile: /^[0-9]{10,12}$/,
			},
			inputfocus:false
		}
	},
	setup(props, context) {
		// const { updateValue } = SetupFormComponent(props, context)
		const uuid = _U.getUUID()

		return {
			// updateValue,
			uuid,
		}
	},
	methods: {
		onUpdate (e) {
			var v = e.target.value;
			if(v && v.toString().length > 0) v = e.target.value.trim();

			this.field.value = v;
			if(typeof v==='undefined' || v.toString().length < 1) {
				this.field.errorMsg = '';
				this.field.checked = false;
				if(this.field.name == 'id') {
					this.field.buttonDimmed = true;
				}
				return;
			}
			if(v.toString().length > 0) {
				if(this.checkField()) {
					this.field.errorMsg = '';
					if(this.field.name == 'id') {
						this.field.buttonDimmed = false;
						this.field.checked = false; // 중복확인, 인증코드 확인후 true로 됨
						this.field.errorMsg = this.getErrorMsg(this.field.name+'-check');
					}else{
						this.field.checked = true;
					}
				}else{
					if(this.field.name == 'id') {
						this.field.buttonDimmed = true;
					}
					this.field.errorMsg = this.getErrorMsg(this.field.name);
					this.field.checked = false;
				}
			}else{
				this.field.checked = false;
			}

			console.log("onUpdate -====== ", this.field.value );

		},
		getErrorMsg(fieldName) {
			var rv ='';
			switch(fieldName) {
				case 'id' :
					rv = this.$t('signup.register.error-msg-id');
					break;
				case 'id-check' :
					rv = this.$t('signup.register.error-msg-id-check');
					break;
				case 'password1' :
					rv = this.$t('signup.register.error-msg-pwd');
					break;
				case 'password2' :
					rv = this.$t('signup.register.error-msg-pwd2');
					break;
				case 'email' :
					rv = this.$t('signup.register.error-msg-email');
					break;
				case 'mobile' :
					rv = this.$t('signup.register.error-msg-mobile');
					break;
				case 'mobile-check' :
					rv = this.$t('signup.register.error-msg-mobile-check');
					break;
			}
			return rv;
		},
		checkField() {
			var val = this.field.value;
			var rv = false;
			switch(this.field.name) {
				case 'id':
					if(this.reg.id.test(val)) {
						rv = true;
					}
					break;
				case 'password1':
				case 'password2':
					if(this.reg.password.test(val)) {
						if(this.field.name=='password2') {
							var o = _U.Q('.Signup .Register .register-box .field-set .field[name="password1"');
							if(o && o.value == this.field.value) {
								rv = true;
							}else{
								rv = false;
							}
						}else{
							rv = true;
						}
					}
					break;
				case 'email':
					if(this.reg.email.test(val)) {
						rv = true;
					}
					break;
				case 'mobile':
					if(this.reg.mobile.test(val)) {
						rv = true;
					}
					break;

				default:
					if(val && val.toString().length > 0) {
						rv = true;
					}
					break;

			}
			console.log("checkField val:", val, rv);

			return rv ;
		},
		onBtnClick() {
			var val = this.field.value;
			var check = false;
			switch(this.field.name) {
				case 'id':
					if(_U.getIfDefined(this.field,'buttonDimmed')==true) {
						break;
					}
					if(this.reg.id.test(val)) {
						console.log('=== onBtnClick===', val);
						check=true;
					}
					break;

				case 'wallet-address':
					check=true;
					console.log('=== onBtnClick===', val);
					break;
			}

			if(check==true) {
				this.$emit('btn-click',this.field.name, val);
			}
		}
	}
}
</script>

<style lang="scss" scoped>

	.field-set {
		@include FLEX(space-between, flex-start);
		width:100%;
		height: 54px;
		.label {
			width: gREm(199+99);
			height: gREm(30);
			@include Set-Font($AppFont, gREm(15), gREm(30), #1d1f2a,500);
		}
		.field-box-wrap {
			@include FLEXV(space-between, flex-start);
			width: gREm(634);
			height: gREm(30 + 11 + 2);
			.field-box {
				@include FLEX(space-between, center);
				width: gREm(634);
				height: gREm(30);
				padding-left: gREm(20);
				.field {
					width: gREm(550);
					height: gREm(30);
					@include Set-Font($AppFont, gREm(15), gREm(30),#17141a,500);
				}
				.field-option {
					@include Set-Font($AppFont, gREm(15), gREm(30),#17141a,300);
				}
				.field::placeholder {
					color: #a0a0a0;
					font-weight: 300;
					font-size: gREm(14);

				}

				.field-right {
					@include FLEX(flex-end, center);
					width: auto;
					height: gREm(30);
					padding-left:gREm(16);
					.field-error {
						width: auto;
						height: gREm(14);
						@include Set-Font($AppFont, gREm(11), gREm(14), #f63e3e);
					}
					.field-button {
						width: auto;
						height: gREm(30);
						margin-left: gREm(15);
						padding-left:gREm(16);
						padding-right:gREm(16);
						border-radius: 100px;
						background-color: #a0a0a0;
						cursor: pointer;
						@include Set-Font($AppFont, gREm(12), gREm(30), #ffffff);
						text-align: center;
						// @include OnOverTransition();

						&[dimmed="off"]:hover {
							cursor: pointer;
							background-color: #18a7f8;
						}
						&[dimmed="on"] {
							opacity: 0.5;
						}
					}
				}
			}
			.h-bar {
				width:100%;
				height: 1px;
				background-color: #dedede;
				&[active='on']{
					background-color: #6c38ef;
					height: gREm(2);
				}
			}
		}

	}

</style>
