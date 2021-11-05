<template>
	<div class="Confirm">
		<div class="title-box">
			<div class="title">{{$t("signup.confirm.title")}}</div>
		</div>
		<div class="h-bar"></div>
		<div class="message-box-wrap">
			<div class="message-box" v-html="$t('signup.confirm.message')"></div>
		</div>

		<div class="button-box">
			<div class="btn home" @click="onHome()">{{$t("signup.btn.home")}}</div>
		</div>

	</div>
</template>

<script>
export default {
	name: "Confirm",
	components: {
	},
	props: {
		param1: {
			type: String,
			default: '',
		},
	},
	beforeMount () {
		console.log("[Confirm.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[Confirm.vue] mounted(), route : ", this.$route)
	},
	beforeUpdate () {
		console.log("[Confirm.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[Confirm.vue] updated(), route : ", this.$route)
	},
	data () {
		return {
			abc:1
		}
	},
	computed: {
		computedvar() {
			return 1;
		}
	},
	methods : {
		onHome () {
			this.$router.push({name:"Home"});
		},
	}
}

</script>

<style lang="scss" scoped>
.Confirm {
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

	.message-box-wrap {
		width: 100%;
		height: 50vh;
		@include FLEX(center, center);
		.message-box {
			width: auto;
			height: gREm(120);
			text-align: center;
			@include Set-Font($AppFont, gREm(26), gREm(42), #201360, 600);
		}
	}


	.button-box {
		@include FLEX(center, center);
		.btn {
			@include FLEX(center, center);
			width: gREm(200);
			height: gREm(60);
			border-radius: gREm(6);
			border: solid 1px #8382a7;
			background-color: #ffffff;
			background-image: none;
			@include OnOverTransition();
			cursor: pointer;
			// &:hover {
			// 	background-color: transparent;
			// 	background-image: linear-gradient(256deg, #3504ff, #9f52ff);
			// 	color: #ffffff;
			// }
			&.home {
				background-color: transparent;
				background-image: linear-gradient(256deg, #3504ff, #9f52ff);
				color: #ffffff;
			}
		}
	}

}
</style>
