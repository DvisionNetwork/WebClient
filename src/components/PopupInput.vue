<template>
	<div class="field-set" :popup-style="popupStyle" >
		<div class="label-box">
			<label v-if="field.label" :for="uuid" class="label">
				{{ field.label }}
			</label>

			<div class="icon" v-if="field.labelInfo"
				@mouseover="showiconPopup=true"
				@mouseleave="showiconPopup=false"
				:active="(showiconPopup ? 'on': 'off')"
			>
				<transition appear name="fade">
					<div v-if="showiconPopup" class="icon-popup-box">
						<div class="content-wrap">
							<div class="content" v-html="field.labelInfo"></div>
						</div>
					</div>
				</transition>

			</div>
		</div>
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

				<div v-if="field.name=='mobile'" class="cc-wrapper"
					@mouseover="showCCPopup=true"
					@mouseleave="showCCPopup=false"
				>
					<input type="hidden" :name="ccode" :value="ccode"/>
					<div class="cc-custom">
						<div class="cc-name" >{{ccName}}</div>
						<transition appear name="fade">
							<ul class="cc-list" v-show="showCCPopup">
								<div id="cc-list-content">
									<li  class="cc-item" v-for="code in ccodes"
										:value="code.value"
										:key="code.ccode"
										@click="setCCValue(code)">
										{{code.name+' ('+code.mcode+')'}}
									</li>
								</div>
							</ul>
						</transition>
					</div>
				</div>

				<input v-if="field.type !== 'select'"  class="field"
					v-bind="{
						...$attrs
					}"
					@input="onUpdate"
					@focusin="valuefocus = true;"
					@focusout="valuefocus = false;"
					@blur="checkField"
					:type="field.type"
					:maxlength="field.maxlength"
					:minlength="field.minlength"
					:disabled="field.disabled"
					:id="uuid"
					:name="field.name"
					:value="modelValue"
					:placeholder="field.placeholder ? field.placeholder : field.label"
				/>
				<div class="field-right">
					<div v-if="field.errorMsg" :name="field.name" class="field-error">{{field.errorMsg}}</div>
					<div v-if="field.buttonName"
						class="field-button"
						:dimmed="(field.buttonDimmed ? 'on' : 'off')"
						@click="onBtnClick()"
					>
						{{field.buttonName}}
					</div>
				</div>
			</div>
			<div v-if=" !( popupStyle == 'popup-edit-profile' && field.name == 'id') && field.name != 'mobile' "
				:active="(valuefocus ? 'on' :'off')" class="h-bar">
			</div>
			<div v-if=" field.name =='mobile' " class="h-bar-mobile">
				<div class="h-bar-cc"></div>
				<div class="h-bar-phone" :active="(valuefocus ? 'on' :'off')"></div>
			</div>
		</div>
	</div>

</template>

<script>
import Scrollbar from 'smooth-scrollbar'

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
		},
		popupStyle: {
			type: String
		},
		fieldsetParentCss: {
			type: String
		}
	},
	components: {
		Scrollbar
	},
	mounted () {

		console.log("[PopupInput.vue] mounted(), route : ", this.$route, this.field)
		if(this.field.type=='select') {
			console.log("[PopupInput.vue] mounted(), CountryCodes: ==================== ", this.ccodes)
		}
		if(this.field.name=='mobile' ) {
			if(!Scrollbar.has(_U.Q('#cc-list-content'))) {
				this.scrollbar = Scrollbar.init(_U.Q('#cc-list-content'));
			}
			var code = null;
			for(var i=0; i<this.ccodes.length; i++) {
				var ccode = this.ccodes[i];
				if(ccode.value == this.coutryCodeNo) {
					code = ccode;
					break;
				}
			}
			if(code) {
				this.setCCValue(code);
			}
		}
	},
	beforeUnmount() {
		console.log("[PopupInput.vue] beforeUnmount() : ");
		if(Scrollbar.has(_U.Q('#cc-list-content'))) {
			Scrollbar.destroy(_U.Q('#cc-list-content'))
		}
	},
	computed: {
		coutryCodeNo() {
			return this.mxGetCountryCodeNo();
		}
	},

	data() {
		return {
			scrollbar: null,
			showiconPopup:false,
			showCCPopup: false,
			ccodes: CCodes.codes,
			ccName: '',
			reg : {
				id: /^[0-9a-z]{5,20}$/,
				password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,30}$/,
				email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
				mobile: /^[0-9]{10,12}$/,
			},
			valuefocus:false,
		}
	},
	setup(props, context) {
		const uuid = _U.getUUID()

		return {
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
		setCCValue(code) {
			this.ccName = code.name+' ('+code.mcode+')';
			this.ccode = code.value;
			this.showCCPopup=false;
			this.mxSetCountryCodeNo(code.value);
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

							var o = _U.Q(this.fieldsetParentCss+' .field-set .field[name="password1"]');
							if(this.popupStyle=='signup-register') {
								o = _U.Q('.Signup .Register .field-set .field[name="password1"]');
							// This page is for B2B
							}else if(this.popupStyle=='signup-register2') {
								o = _U.Q('.Signup .Register2 .field-set .field[name="password1"]');
							}else if(this.popupStyle=='popup-edit-profile') {
								o = _U.Q('.modal-mask .edit-profile-info .field-set .field[name="password1"]');
							}else if(this.popupStyle=='popup-changepwd') {
								o = _U.Q('.modal-mask .change-password-info .field-set .field[name="password1"]');
							}
							// console.log("================ this.fieldsetParentCss .field-set .field[name=password1]", this.popupStyle, this.fieldsetParentCss, o);

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

			if(this.field.buttonClick) {
				this.$emit('btn-click',this.field.name, val);
				return;
			}

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
		width:auto;
		height: gREm(54);
		.label-box{
			@include FLEX(flex-start, center);
			.label {
				width: auto;
				height: gREm(30);
				@include Set-Font($AppFont, gREm(15), gREm(30), #1d1f2a,500);
			}
			.icon{
				width: gREm(14);
				height: gREm(14);
				margin-left:gREm(6);
				@include FLEX(center, center);
				@include SetBgImage(url('../assets/img/ic-information.svg'));
				.icon-popup-box {
					position: absolute;
					z-index:-10;
					top: gREm(-14);
					display: none;
				}
				&[active='on']{
					@include SetBgImage(url('../assets/img/ic-information-h.svg'));
					@include FLEX(flex-start,flex-start);
					.icon-popup-box {
						position: absolute;
						display: block;
						z-index: $Z-INDEX-ICON-POPUP;
						top: gREm(-14);
						.content-wrap {
							margin-top:gREm(23 + 14);
							width: gREm(284);
							height: gREm(73);
							border-radius: 10px;
							box-shadow: 0 gREm(6) gREm(18) 0 rgba(0, 0, 0, 0.28);
							background-color: #ffffff;
							@include FLEX(center, center);
							.content{
								@include FLEX(center, center);
								text-align: center;
								@include Set-Font($AppFont, gREm(12), gREm(16), #6c38ef,300);
							}
						}
					}
				}
			}
		}
		.field-box-wrap {
			@include FLEXV(space-between, flex-start);
			width: gREm(654);
			height: gREm(30 + 11 + 2);
			.field-box {
				@include FLEX(space-between, center);
				width: gREm(654 - 20);
				height: gREm(30);
				padding-left: gREm(20);
				.field {
					width: gREm(550);
					height: gREm(30);
					@include Set-Font($AppFont, gREm(15), gREm(30),#17141a,300);
				}

				.field[name="mobile"] {
					margin-left: gREm(242 + 20 - 20); // gap: 20, padding-left: -20
					width: gREm(292);
					padding-left: gREm(10);
				}

				.field-option {
					@include Set-Font($AppFont, gREm(15), gREm(30),#17141a,300);
				}
				.field::placeholder {

					color: #a0a0a0;
					font-weight:300;
					font-size:gREm(14);
				}
				.field-right {
					@include FLEX(flex-end, center);
					position: absolute;
					right:0px;
					width: auto;
					height: gREm(30);
					padding-left:gREm(10);
					padding-right:gREm(10);
					background-color: white;

					.field-error {
						width: auto;
						height: gREm(14);
						@include Set-Font($AppFont, gREm(11), gREm(14), #f63e3e);
						&[name="mobile"], &[name="password1"] {
							width: gREm(150);
							height: gREm(28);
							white-space: normal;
						}
					}

					.field-button {
						width: auto;
						height: gREm(30);
						margin-left: gREm(15);
						padding-left:gREm(16);
						padding-right:gREm(16);
						border-radius: 100px;
						background-color: #a0a0a0;

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

				.cc-wrapper {
					position:absolute;
					display:inline-block;
					top: 0px;
					left: 0px;
					z-index:10;
					.cc-custom {
						.cc-name {
							@include FLEX(space-between, center);
							@include Set-Font($AppFont, gREm(14), gREm(30), #17141a);
							width:gREm(242);
							display:inline-block;
							height:gREm(35);
							padding-left: gREm(20);
							// border:1px solid #ddd;
							box-sizing:border-box;
							cursor:pointer;
							transition:all 0.2s ease;
							background-image:url('../assets/img/ic-arrow-signup.svg');
							background-repeat:no-repeat;
							background-size: gREm(10);
							background-position: 95% center;
							&:hover {
								border-color:#367cff;
							}
						}
						.cc-list {
							position: relative;
							padding: gREm(26) gREm(10);
							list-style:none;
							width:gREm(298);
							height: gREm(402);
							overflow:auto;
							border-radius: 10px;
							box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.24);
							border: solid 1px #dedede;
							background-color: #ffffff;
							overflow: hidden;
							#cc-list-content {
								width: 100%;
    							height: 100%;
							}
							.cc-item {
								@include FLEX(flex-start, center);
								height:gREm(37);
								line-height:30px;
								padding-left:gREm(30);
								cursor:pointer;
								font-size:14px;
								transition:all 0.1s ease;
								@include Set-Font($AppFont, gREm(14), gREm(30), #6a6a6a);

								&:hover {
									background-color: #f1f1f1;
									@include Set-Font($AppFont, gREm(14), gREm(30), #6c38ef);
								}
							}
						}
					}
				}
			}

			.h-bar {
				// position: absolute;
				width:100%;
				height: 1px;
				background-color: #dedede;
				// transition:all 0.2s ease;
				&[active='on']{
					// width:100%;
					height: gREm(2);
					background-color: #6c38ef;
				}
			}
			.h-bar-mobile {
				@include FLEX(space-between, center);
				height: 1px;
				width: 100%;
				.h-bar-cc {
					width:gREm(242);
					height: 1px;
					background-color: #dedede;
					// transition:all 0.2s ease;
					&[active='on']{
						// width:100%;
						height: gREm(2);
						background-color: #6c38ef;
					}
				}
				.h-bar-phone {
					width: gREm(392);
					height: 1px;
					background-color: #dedede;
					// transition:all 0.2s ease;
					&[active='on']{
						// width:100%;
						height: gREm(2);
						background-color: #6c38ef;
					}
				}
			}
		}

	}

	.field-set[popup-style="signup-register"] {
		width:100%;
		height: gREm(54);
		.label {
			// width: gREm(109+50);
			width: auto;
			height: gREm(30);
			@include Set-Font($AppFont, gREm(15), gREm(30), #1d1f2a,300);
		}
		.field-box-wrap {
			width: gREm(654);
			height: gREm(30 + 11 + 2);
			.field-box {
				@include FLEX(space-between, center);
				width: gREm(654);
				height: gREm(30);
				padding-left: gREm(20);
				.field {
					width: gREm(550);
				}
			}
		}
	}

	.field-set[popup-style="popup-wallet"] {
		width:100%;
		height: gREm(30 + 9 + 2);
		.label {
			width: gREm(162);
			@include Set-Font($AppFont, gREm(14), gREm(30), #1d1f2a,500);
		}
		.field-box-wrap {
			width: gREm(612);
			height: gREm(30 + 9 + 2);
			.field-box {
				@include FLEX(space-between, center);
				width: gREm(612);
				height: gREm(30);
				padding-left: gREm(20);
				.field {
					width: gREm(548-100);
				}
				.field-right {
					padding-right:gREm(32);
					.field-button {
						margin-left: gREm(0);
					}
				}
			}
		}
	}

	.field-set[popup-style="popup-normal"] {
		width:100%;
		height: gREm(30 + 9 + 2);
		.label {
			width: gREm(104+10);
			@include Set-Font($AppFont, gREm(14), gREm(30), #1d1f2a,500);
		}
		.field-box-wrap {
			width: gREm(345);
			height: gREm(30 + 9 + 2);
			.field-box {
				@include FLEX(space-between, center);
				width: gREm(345);
				height: gREm(30);
				padding-left: gREm(20);
				.field {
					width: gREm(420-100);
				}
			}
		}
	}

	.field-set[popup-style="popup-changepwd"] {
		width:100%;
		height: gREm(40 + 10 + 2);
		@include FLEX(space-between, center);
		.label {
			width: auto;
			height: auto;
			font-size: gREm(14);
		}
		.field-box-wrap {
			width: gREm(345);
			height: gREm(40 + 10 + 2);
			@include FLEXV(space-between, flex-start);
			.field-box {
				width: gREm(345);
				height: gREm(40 + 10);
				.field {
					@include FLEX(center, center);
					width: 100%;
					height: gREm(16);
				}
				.field::placeholder {
					font-size: gREm(13);
				}
				.field-right {
					height: gREm(30);
					.field-error {
						@include FLEX(center, center);
						width: gREm(150);
						height: gREm(28);
						white-space: normal;
						position:absolute;
						right: 0;
					}
				}
			}
		}
	}

	.field-set[popup-style="popup-edit-profile"] {
		width:100%;
		height: gREm(56);
		.label-box{
			width: gREm(240);
			.label {
				font-size: gREm(14);
			}
		}
		.field-box-wrap {
			padding-left: gREm(0);
			width: gREm(475);
			.field-box {
				@include FLEX(space-between, center);
				width: gREm(475);
				.field {
					width: gREm(475 - 100);
					font-size: gREm(14);
				}
				.field::placeholder {
					font-size:gREm(13);
				}
				.cc-wrapper {
					.cc-custom {
						.cc-list {
							margin-top: gREm(-400);
						}
					}
				}
				.field-right {
					.field-error {
						position: absolute;
						top: gREm(45);
						left: gREm(-150);
						width: gREm(252);
						text-align: center;
						white-space: nowrap;
					}
				}
			}
			.h-bar-mobile {
				.h-bar-cc {
					width:gREm(222);
				}
				.h-bar-phone {
					width: gREm(232);
				}
			}
		}
	}
	@include media-max($media_small) { // 768
	.field-set[popup-style="signup-register"] {
		width:100%;
		height: auto;
		.label {
			// width: gREm(109+50);
			width: auto;
			height: gREm(30);
			@include Set-Font($AppFont, gREm(15), gREm(30), #1d1f2a,300);
		}
		.field-box-wrap {
			width: gREm(300);
			height: gREm(30 + 11 + 2);
			.field-box {
				@include FLEX(space-between, center);
				width: gREm(300);
				height: gREm(30);
				padding-left: gREm(20);
				.field {
					width: gREm(550);
				}
				.field::placeholder {
					color: transparent;
				}
			}
		}
	}
	.field-set[popup-style="signup-register2"] {
		width:100%;
		height: auto;
		.label {
			// width: gREm(109+50);
			width: auto;
			height: gREm(30);
			@include Set-Font($AppFont, gREm(15), gREm(30), #1d1f2a,300);
		}
		.field-box-wrap {
			width: gREm(300);
			height: gREm(30 + 11 + 2);
			.field-box {
				@include FLEX(space-between, center);
				width: gREm(300);
				height: gREm(30);
				padding-left: gREm(20);
				.field {
					width: gREm(550);
				}
				.field::placeholder {
					color: transparent;
				}
			}
		}

		.field-right {

			.field-error {
				width: auto;
				height: gREm(14);
				@include Set-Font($AppFont, gREm(11), gREm(14), #f63e3e);
				&[name="id"] {
					width: gREm(80);
					height: gREm(28);
					white-space: normal;
				}
				&[name="mobile"], &[name="password1"] {
					width: gREm(150);
					height: gREm(28);
					white-space: normal;
				}
			}
		}
	}}

</style>
