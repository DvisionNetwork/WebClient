<template>
	<div class="myTemp">
	</div>
</template>

<script>
export default {
	name: "myTemp",
	components: {
	},
	props: {
		param1: {
			type: String,
			default: '',
		},
	},
	beforeMount () {
		console.log("[myTemp.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[myTemp.vue] mounted(), route : ", this.$route)
	},
	beforeUpdate () {
		console.log("[myTemp.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[myTemp.vue] updated(), route : ", this.$route)
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
.myTemp {

}
</style>
