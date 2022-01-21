<template>

	<div>MarketStaking</div>

</template>

<script>

import AppConfig from '@/App.Config.js'
import SimpleSideMenu from '@/components/SimpleSideMenu.vue'
import MapLand from '@/components/MapLand.vue'
import MapItem from '@/components/MapItem.vue'

var gConfig = AppConfig();


export default {
	name: "staking",
	components: {
		SimpleSideMenu,
		MapLand,
		MapItem,
	},
	props: {
		tab_page: {
			type: String,
			default: 'staking',
		},
	},

	

	beforeMount () {
		console.log("[Market.Land.vue] beforeMount(), route : ", this.$route, this.tab_page);
		
	},
	mounted () {
		
	},
	beforeUpdate () {
		
	},
	updated() {

	},
	data () {
		return {

			pages: [1],
			currentPage: 1,
			

		}
	},
	computed: {


	},
	watch: {
		
	},
	methods : {
		
	}
}
</script>

<style lang="scss" scoped>



@include media-max($media_large) { // 1200
.contents  {
}}

@include media-max($media_medium) { // 1024
.contents  {
}}

</style>
