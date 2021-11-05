<template>
	<div class="IdEmail">
		<div class="title-box">
			<div class="title">{{$t("signup.idemail.title")}}</div>
		</div>
		<div class="h-bar"></div>

		<div class="req-box">
			<form
			class="frm_signup"
			@submit.prevent="signup"
			>

				<div class="user-info field-set-box">

					<SignupInput
						v-for="field in fieldset.userInfo"
						:key="field.name"
						:field="field"
						v-model="field.value"
						@btn-click="onBtnClick"
					/>
				</div>
				<div class="button-box">
					<div class="btn next" @click="onNext()">{{$t("signup.btn.submit")}}</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import SignupInput from '@/components/SignupInput.vue'
export default {
	name: "IdEmail",
	components: {
		SignupInput
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
			userInfo: [
				{
					name: 'name',
					label: this.$t('signup.idphone.label-name'),
					placeholder: this.$t('signup.idphone.place-holder-name'),
					type: 'text',
					value: '',
				},

				{
					name: 'email',
					label: this.$t('signup.register.label-email'),
					placeholder: this.$t('signup.register.place-holder-email'),
					type: 'email',
					value: '',
				}
			],
			},
		}
	},
	computed: {
		computedvar() {
			return 1;
		}
	},
	methods : {

}
}
</script>

<style lang="scss" scoped>
.IdEmail{
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
			// border: solid 1px #8382a7;
			background-color: #ffffff;
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
			&.all {
				margin-top: gREm(80);
				background-color: transparent;
				background-image: linear-gradient(256deg, #3504ff, #9f52ff);
				@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
				border: none;
			}
		}
		}
		.h-bar2{
			width: 100%;
			height: 1px;
			background-color: #dedede;
			margin-top: gREm(80);
		}
		.text{
			width:auto;
			height: gREm(22);
			margin-top:gREm(82);
			@include Set-Font($AppFont, gREm(18), gREm(55), #17141a);
			.id{
				width:auto;
				height: auto;
				@include Set-Font($AppFont, gREm(18), gREm(55), #f63e3e);
			}
		}
	}
}
</style>
