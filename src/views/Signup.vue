<template>
	<div class="Signup-Wrap">
		<div class="Signup">
			<div class="content-box">
				<SignupAgree v-if="page=='agree'" />
				<SignupRegister v-if="page=='register'" />
				<SignupConfirm v-if="page=='confirm'" />
				<SignupIdPhone v-if="page=='idphone'" />
				<SignupIdResult v-if="page=='idresult'" />
				<SignupIdEmail v-if="page=='idemail'" />
				<SignupPwdPhone v-if="page=='pwdphone'" />
				<SignupResetPwd v-if="page=='resetpwd'" />
			</div>
		</div>
		<FOOT :theme="'white'" />
	</div>
</template>

<script>
import SignupAgree from '@/views/Signup.Agree.vue'
import SignupRegister from '@/views/Signup.Register.vue'
import SignupConfirm from '@/views/Signup.Confirm.vue'
import SignupIdPhone from '@/views/Signup.IdPhone.vue'
import SignupIdResult from '@/views/Signup.IdResult.vue'
import SignupIdEmail from '@/views/Signup.IdEmail.vue'
import SignupPwdPhone from '@/views/Signup.PwdPhone.vue'
import SignupResetPwd from '@/views/Signup.ResetPwd.vue'

import FOOT from '@/components/FOOT.vue'

export default {
	name: "Signup",
	components: {
		SignupAgree,
		SignupRegister,
		SignupConfirm,
		SignupIdPhone,
		SignupIdResult,
		SignupIdEmail,
		SignupPwdPhone,
		SignupResetPwd,
		FOOT,
	},
	props: {
		page: {
			type: String, // agree, register, confirm
			default: 'agree',
		},
	},
	beforeMount () {
		console.log("[Signup.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[Signup.vue] mounted(), route : ", this.$route)
	},
	beforeUpdate () {
		console.log("[Signup.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[Signup.vue] updated(), route : ", this.$route)
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
		myLog (idx) {
			console.log('onclick', idx)
		},
	}
}

</script>

<style lang="scss" scoped>
.Signup-Wrap {
	width: 100%;
	height: auto;
	background-color: white;
}
.Signup {
	@include FLEXV(flex-start, center);
	width: 100%;
	height: auto;
	padding-top: gREm(164);
	background-color: white;
	min-height: calc(100vh - 176px); // Foot 176px

	.content-box {
		@include FLEXV(flex-start, center);
		width: gREm(948);
		height: auto;
		padding-top: gREm(90);
	}

}
</style>
