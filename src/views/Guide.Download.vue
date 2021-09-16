<template>
	<div class="Download-box">
		<div class="content-box" v-for="(item, idx) in items ">
			<div class="title">{{item.title}}</div>
			<div class="desc" v-html="item.description"></div>
		</div>
		
		<div class="btn-box">
			<div class="Window" @click="onClickDownload('window')">Window Download</div>
			<div class="Mac" @click="onClickDownload('mac')">Mac OS Download</div>
		</div>
	</div>
</template>

<script>

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();


import downloadcontent from '@/data/Guide.Download.js'
export default {
	name: "Guide-Download",
	components: {
	},
	props: {
	},
	beforeMount () {
		console.log("[Guide.Download.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[Guide.Download.vue] mounted(), route : ", this.$route)
	},
	beforeUpdate () {
		console.log("[Guide.Download.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[Guide.Download.vue] updated(), route : ", this.$route)
	},
	data () {
		var currLang = this.$route.params.lang;
		if(!currLang) currLang = 'en';
		return {
			abc:1,
			items: downloadcontent[currLang]
		}

	},
	computed: {
		computedvar() {
			return 1;
		}
	},
	methods : {
		onClickDownload (type) {
			if(type == 'window') {
				console.log("window download ");
				window.open(window['gDVWorldWindowsAppDownloadUrl']);
			}else if(type == 'mac') {
				console.log("mac download ");
				window.open(window['gDVWorldMacAppDownloadUrl']);
				this.mxShowAlert({msg:this.$t('guide.download.mac-app-warn')});
			}
		},
	}
}

</script>

<style lang="scss" scoped>
.Download-box {
	width:100%;
	height: gREm(413);
	@include FLEXV(space-between, center);
	.content-box{
		width: gREm(400);
		@include FLEXV(center, center);
		.title{
			margin-top: gREm(137);
			width: gREm(134);
			height: gREm(32);
			@include Set-Font($AppFont, gREm(26), gREm(32), #201360);
		}
		.desc{
			width:gREm(398);
			height: gREm(19);
			margin-top: gREm(15);
			text-align: center;
			@include Set-Font($AppFont, gREm(16), gREm(28), #6a6a6a, 300);

		}
	}
	.btn-box{
		margin-bottom: gREm(130);
		@include FLEX(space-between, center);
		.Window{
			@include FLEX(center, center);
			width:gREm(184);
			height: gREm(40);
			border-radius: 100px;
 			background-color: #8b8b8b;
			@include Set-Font($AppFont, gREm(15), gREm(28), #ffffff);
			text-align: center;
			cursor:pointer;
			@include OnOverTransition();
			&:hover {
				background-color: #18a7f8;
			}
		}
		.Mac{
			@include FLEX(center, center);
			margin-left:gREm(24);
			width:gREm(184);
			height: gREm(40);
			border-radius: 100px;
 			background-color: #8b8b8b;
			@include Set-Font($AppFont, gREm(15), gREm(28), #ffffff);
			text-align: center;
			cursor:pointer;
			@include OnOverTransition();
			&:hover {
				background-color: #18a7f8;
			}
		}
	}
}

@include media-max($media_medium) { // 1024
.Download-box {
	.content-box{
		width: 80vw;
		.title{
			width: 100%;
			text-align: center;
		}
		.desc{
			width:100%;
		}
	}
	.btn-box{
		margin-bottom: gREm(130);
		@include FLEX(space-between, center);
		.Window{
			@include FLEX(center, center);
			width:gREm(184);
			height: gREm(40);
			border-radius: 100px;
 			background-color: #8b8b8b;
			@include Set-Font($AppFont, gREm(15), gREm(28), #ffffff);
			text-align: center;

			cursor:pointer;
			@include OnOverTransition();
			&:hover {
				background-color: #18a7f8;
			}
		}
		.Mac{
			@include FLEX(center, center);
			margin-left:gREm(24);
			width:gREm(184);
			height: gREm(40);
			border-radius: 100px;
 			background-color: #8b8b8b;
			@include Set-Font($AppFont, gREm(15), gREm(28), #ffffff);
			text-align: center;
			opacity: 0.4;
		}
	}
}}

@include media-max($media_small) {
.Download-box {
	.btn-box {
		@include FLEXV(space-between, center);
		.Window {
			margin-top: gREm(20);
		}
		.Mac {
			margin-top: gREm(20);
			margin-left:gREm(0);
		}
	}
}}
</style>
