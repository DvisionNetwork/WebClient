<template>
	<div class="Studio">

		<div class="title-box"></div>

		<div class="content-body">
			<div class="main-image"></div>
		</div>
	</div>

	<FOOT :theme="'black'" />

</template>

<script>

import FOOT from '@/components/FOOT.vue'

export default {
	name: "Studio",
	components: {
		FOOT,
	},
	props: {
	},
	beforeMount () {
		console.log("[Studio.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[Studio.vue] mounted(), route : ", this.$route)
	},
	beforeUpdate () {
		console.log("[Studio.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[Studio.vue] updated(), route : ", this.$route)
	},
	data () {

	},
	computed: {
		getTitleDesc() { return this.$t('studio.title'); },
	},
	methods : {
	}
}

</script>

<style lang="scss" scoped>
.Studio {
	@include FLEXV(flex-start, center);
	width: 100%;
	height: auto;
	background-color: #181721;

	min-height: calc(100vh - 176px); // Foot 176px

	& * {
		color: black;
	}

	.title-box {
		@include FLEXV(flex-start, center);
		width: 100%;
		height: gREm(310);
		// background-image: linear-gradient(to bottom, #6c38ef, #6c38ef);
		.title {
			height: auto;
			width: auto;
			margin-top: gREm(213);
			@include Set-Font($AppFont, gREm(34), gREm(55), #ffffff, 600);
			text-align: center;
		}
	}
	.content-body {
		@include FLEXV(space-between, center);
		width: gREm(1200);
		height: auto;
		height: gREm(590);
		.main-image{
			width:gREm(694);
			height: gREm(458);
			background-color: #181721;
			@include FLEXV(center, center);
			@include SetBgImage(url('../assets/img/studio/studio-img.svg'));
		}



			// .page-box {
			// 	@include FLEX(center, flex-start);
			// 	height: gREm(44);
			// 	width: 100%;
			// 	margin-top: gREm(100);
			// 	margin-bottom: gREm(132);
			// 	.page-wrap {
			// 		@include FLEX(space-between, center);
			// 		height: gREm(44);
			// 		width: gREm(40 + 40 * 5 + 40 );
			// 		.arrow-left, .arrow-right, .page {
			// 			@include FLEX(center, center);
			// 			width: gREm(40);
			// 			height: gREm(44);
			// 			.icon {
			// 				width: gREm(6);
			// 				height: gREm(12);
			// 			}
			// 		}
			// 		.page {
			// 			background-color: transparent;
			// 			border-radius: 50%;
			// 			@include Set-Font($AppFont, gREm(15), gREm(19), #b5b5b5);
			// 			&[active="on"] {
			// 				background-color: #f7f7f7;
			// 				color: #201360;
			// 			}
			// 			&[selected="true"] {
			// 				color: #000000;
			// 			}
			// 		}

			// 		.arrow-left .icon {
			// 			@include SetBgImage(url('../assets/img/ic-arrow-page-l.svg'));
			// 		};
			// 		.arrow-right .icon {
			// 			@include SetBgImage(url('../assets/img/ic-arrow-page-r.svg'));
			// 		};
			// 	}
			// }
	}
}

@include media-max($media_medium) { // 1024

.Studio {

	.content-body {
		@include FLEXV(space-between, center);
		width: gREm(1200);
		.main-image{
			width: 70vw;
			background-color: #181721;
			@include FLEXV(center, center);
			@include SetBgImage(url('../assets/img/studio/studio-img.svg'));
			background-size: contain;
		}
	}
}}

</style>
