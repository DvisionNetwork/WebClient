<template>
	<div class="IdResult">
		<div class="title-box">
			<div class="title">{{$t("signup.idphone.title")}}</div>
		</div>
		<div class="h-bar"></div>

		<div class="req-box">

            <label class="text">
                {{'"'}}{{$t("signup.idresult.result-id")}} <span class="id">{{'&nbsp;'+account}}</span>{{'"'}}
            </label>

            <div class="button-box">
                <div class="btn login"  @click="login">{{$t("signup.btn.login")}}</div>
            </div>

		</div>
	</div>
</template>

<script>

export default {
	name: "IdPhone",
	components: {
	},
	props: {
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
		}
	},
	computed: {
		account() {
			return this.$route.params.account;
		}
	},
	methods : {
        login() {
			this.$store.dispatch('showLoginPopup',true);
			console.log('show Auth')
		},
    }
}
</script>

<style lang="scss" scoped>
.IdResult{
	@include FLEXV(center, center);
	width: 100%;
	height: 100%;
	& * {
		color: black;
	}
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
        @include FLEXV(center,center);
        height: 100%;
        margin-bottom: gREm(312);
		.text{
			width:auto;
			height: gREm(22);
			margin-top:gREm(60);
			@include Set-Font($AppFont, gREm(18), gREm(22), #17141a);
            .id{
                width:auto;
                height: auto;
                @include Set-Font($AppFont, gREm(18), gREm(22), #f63e3e);
            }
		}
		.button-box{
			margin-top: gREm(80);
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

				&.login {
					width: gREm(200);
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
