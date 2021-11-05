<template>
	<div class="DVI-box">
		<div class="div-wrap">
			<div class="content-box" v-for="(item, idx) in items " :key="idx">
				<div class="content" v-html="item.description"></div>
			</div>
		</div>
	</div>
</template>

<script>
import dvicontent from '@/data/Guide.DVI.js'
export default {
	name: "Guide-DVI",
	components: {
	},
	props: {
	},
	beforeMount () {
		console.log("[Guide.DVI.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[Guide.DVI.vue] mounted(), route : ", this.$route)
	},
	beforeUpdate () {
		console.log("[Guide.DVI.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[Guide.DVI.vue] updated(), route : ", this.$route)
	},
	data () {
		var currLang = this.$route.params.lang;
		if(!currLang) currLang = 'en';
		return {
			abc:1,
			items: dvicontent[currLang]
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
.DVI-box{
	margin-left:gREm(19);
	.div-wrap{
		width:gREm(600);
		height: gREm(595);
		@include FLEXV(center,center);
		.content-box{
			width:100%;
			height: auto;
			@include FLEXV(space-between,flex-start);
			.content{
				padding-top:gREm(40);
				padding-bottom:gREm(40);
				width: gREm(600);
				height: auto;
				@include Set-Font($AppFont, gREm(26), gREm(32), #201360);
			}
		}
	}
}

@include media-max($media_medium) { // 1024
.DVI-box{
	width: 80vw;
	margin-left: 10vw;
	.div-wrap{
		width: 100%;
	}
}}

@include media-max($media_small) {
.DVI-box{
	width: 80vw;
	margin-left: 10vw;
	.div-wrap{
		width: 100%;
		height: gREm(395);
		.content-box .content {
			width:100%;
			padding-top:gREm(10);
			padding-bottom:gREm(10);
			font-size: gREm(14);
			line-height: gREm(24);
			white-space: normal;
		}
	}
}}
</style>
