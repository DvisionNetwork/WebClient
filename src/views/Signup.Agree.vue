<template>
	<div class="Agree">

		<div class="title-box">
			<div class="title">{{$t("signup.agree.title")}}</div>
			<div class="title-desc">{{$t("signup.agree.title-desc")}}</div>
		</div>
		<div class="h-bar"></div>
		<div class="message-box">
			<div class="message required" v-html="agreementTxt.required">
			</div>
			<div class="message optional" v-html="agreementTxt.optional">
			</div>
		</div>
		<div class="button-box">
			<div class="btn cancel"
				@click="onCancel()"
				@mouseover="cancelfocus = true;"
				@mouseout="cancelfocus = false;"
				:active="(cancelfocus ? 'on' :'off')"
			>{{$t("signup.btn.cancel")}}</div>
			<div class="btn next"
				@click="onNext()"
				@mouseover="nextfocus = true;"
				@mouseout="nextfocus = false;"
				:active="(nextfocus ? 'on' :'off')"
			>{{$t("signup.btn.next")}}</div>
		</div>

	</div>
</template>

<script>

import AgreementTxt from '@/data/Signup.Agreement.js'

export default {
	name: "Agree",
	components: {
	},
	props: {
		param1: {
			type: String,
			default: '',
		},
	},
	beforeMount () {
		console.log("[Agree.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[Agree.vue] mounted(), route : ", this.$route)
	},
	beforeUpdate () {
		console.log("[Agree.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[Agree.vue] updated(), route : ", this.$route)
	},
	data () {
		var currLang = this.$route.params.lang;
		if(!currLang) currLang = 'en';
		return {
			agreementTxt: AgreementTxt[currLang],
			cancelfocus:false,
			nextfocus:false
		}
	},
	computed: {

	},
	methods : {
		onCancel () {
			this.$router.go(-1);
		},
		onNext () {
			this.$router.push({name:"Signup-Page", params:{page: 'register'}});
		},
	}
}

</script>

<style lang="scss">
.Signup {
	.message {
		& * {
			color: black;
		}
		.h3 {

		}
		.h4 {

		}
	}
}

</style>

<style lang="scss" scoped>
.Agree {
	@include FLEXV(center, center);
	width: 100%;
	height: auto;
	& * {
		color: black;
	}
	padding-bottom: gREm(132);

	.title-box {
		@include FLEXV(space-between, flex-start);
		width: 100%;
		height: auto;
		.title {
			@include FLEX(center, center);
			width: auto;
			height: gREm(39);
			@include Set-Font($AppFont, gREm(32), gREm(55), #17141a, 600);
		}
		.title-desc {
			@include FLEX(center, center);
			width: auto;
			height: gREm(22);
			margin-top: gREm(6);
			@include Set-Font($AppFont, gREm(18), gREm(30), #6a6a6a);
		}
	}
	.h-bar {
		width: 100%;
		height: 1px;
		background-color: #dedede;
		margin-top: gREm(30);
		margin-bottom: gREm(30);
	}
	.message-box {
		@include FLEXV(flex-start, center);
		width:100%;
		height: auto;

		.message {
			width: 100%;
			margin-top: gREm(30);
			padding: gREm(30) gREm(16);
			border: solid 1px #f1f1f1;
			overflow-y: scroll;
		}
		.required {
			height: gREm(430);
		}
		.optional {
			height: gREm(300);
		}
	}

	.button-box {
		@include FLEX(center, center);
		margin-top: gREm(80);
		.btn {
			@include FLEX(center, center);
			width: gREm(200);
			height: gREm(60);
			border-radius: gREm(6);
			border: solid 1px #8382a7;
			background-color: #ffffff;
			background-image: none;
			cursor: pointer;
			// &:hover {
			// 	background-color: transparent;
			// 	background-image: linear-gradient(256deg, #3504ff, #9f52ff);
			// 	color: #ffffff;
			// }
			&[active='on']{
				background-color: transparent;
				background-image: linear-gradient(256deg, #3504ff, #9f52ff);
				color: #ffffff;
				border-radius: none;
				border: none;
			}

			// &.next {
			// 	background-color: transparent;
			// 	background-image: linear-gradient(256deg, #3504ff, #9f52ff);
			// 	color: #ffffff;
			// }
			&.cancel {
				margin-right: gREm(28);
			}
		}
	}

}
</style>
