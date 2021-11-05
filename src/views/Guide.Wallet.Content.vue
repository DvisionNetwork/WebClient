<template>
	<div class="content-box">
		<div class="content" :active="(idx == wIdx ? 'on' : 'off')">
			<div class="title">{{item.title}}</div>
			<div class="desc" v-html="item.desc"></div>
			<div class="img-box" v-for="(img, idx) in item.imgList" :key="idx">
				<img class="img" srcxx="img.url" :name="img.name" />
				<div v-if="img.desc" class="img-desc" v-html="img.desc"></div>
			</div>
		</div>
	</div>
</template>

<script>
import walletcontent from '@/data/Guide.Wallet.Content.js'
export default {
	name: "Guide-Wallet-Content",
	components: {
	},
	props: {
		idx: {
			type: Number,
		},
		wIdx: {
			type: Number,
		},
		item: {
			type: Object,
		}
	},
	beforeMount () {
		console.log("[Guide.Wallet.Content.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[Guide.Wallet.Content.vue] mounted(), route : ", this.$route)
		console.log("[Guide.Wallet.Content.vue] mounted(), item : ", this.item)
	},
	beforeUpdate () {
		console.log("[Guide.Wallet.Content.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[Guide.Wallet.Content.vue] updated(), route : ", this.$route)
	},
	data () {
		var currLang = this.$route.params.lang;
		if(!currLang) currLang = 'en';
		return {
			items: walletcontent[currLang]
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
.content-box {
	display: inline-block;
	margin-top: gREm(130 - 50);
	margin-bottom: gREm(130);
	height: auto;
	width: gREm(908);

	& * {
		color: black;
	}

	.content {
		width: 100%;
		height: auto;
		&[active="off"] {
			opacity: 0;
			height: gREm(480 + 102 + 32);
			overflow: hidden;
		}
		@include FLEXV(flex-start, center);
		.title {
			width: auto;
			height: gREm(32);
			text-align: center;
			@include Set-Font($AppFont, gREm(26), gREm(32), #201360);
		}
		.desc {
			width: auto;
			margin-top: gREm(15);
			text-align: center;
			@include Set-Font($AppFont, gREm(16), gREm(28), #6a6a6a,300);
		}
		.img-box {
			@include FLEXV(flex-start, center);
			margin-top: gREm(40);
			.img {
				object-fit: contain;
  				border: solid 1px #f1f1f1;
				width: gREm(512);
				height: gREm(480);
			}

			.img-desc {
				margin-top: gREm(40);
			}
			.img[name="wallet-1"] {
				@include SetBgImage(url('../assets/img/guide/wallet-1.png'));
			}
			.img[name="wallet-2"] {
				@include SetBgImage(url('../assets/img/guide/wallet-2.png'));
			}
			.img[name="wallet-3"] {
				@include SetBgImage(url('../assets/img/guide/wallet-3.png'));
			}
			.img[name="wallet-4"] {
				@include SetBgImage(url('../assets/img/guide/wallet-4.png'));
			}
			.img[name="wallet-5"] {
				@include SetBgImage(url('../assets/img/guide/wallet-5.png'));
			}
			.img[name="wallet-6"] {
				@include SetBgImage(url('../assets/img/guide/wallet-6.png'));
			}
			.img[name="wallet-7"] {
				@include SetBgImage(url('../assets/img/guide/wallet-7.png'));
			}
			.img[name="wallet-8"] {
				@include SetBgImage(url('../assets/img/guide/wallet-8.png'));
			}
			.img[name="wallet-9"] {
				@include SetBgImage(url('../assets/img/guide/wallet-9.png'));
			}
			.img[name="wallet-10"] {
				@include SetBgImage(url('../assets/img/guide/wallet-10.png'));
			}
			.img[name="wallet-11"] {
				@include SetBgImage(url('../assets/img/guide/wallet-11.png'));
			}
			.img[name="wallet-12"] {
				@include SetBgImage(url('../assets/img/guide/wallet-12.png'));
			}
			.img[name="wallet-13"] {
				@include SetBgImage(url('../assets/img/guide/wallet-13.png'));
			}
			.img[name="wallet-14"] {
				width: gREm(630);
				height: gREm(310);
				@include SetBgImage(url('../assets/img/guide/wallet-14.png'));
			}
			.img[name="wallet-15"] {
				width: gREm(630);
				height: gREm(310);
				@include SetBgImage(url('../assets/img/guide/wallet-15.png'));
			}
			.img[name="wallet-16"] {
				width: gREm(630);
				height: gREm(310);
				@include SetBgImage(url('../assets/img/guide/wallet-16.png'));
			}
		}
	}

}

@include media-max($media_medium) { // 1024
.content-box {
	display: inline-block;
	width: 100vw;
}}

@include media-max($media_small) {
.content-box {

	width: 100vw;
	margin-top: gREm(0);

	.content {
		@include FLEXV(flex-start, center);
		.title {
			height: auto;
			font-size: gREm(24);
			line-height: gREm(28);
			white-space: normal;
			width: 75%;
		}
		.desc {
			height: auto;
			font-size: gREm(14);
			line-height: gREm(24);
			white-space: normal;
			width: 75%;
		}
		.img-box {
			@include FLEXV(flex-start, center);
			margin-top: gREm(40);
			.img {
				object-fit: contain;
  				border: solid 1px #f1f1f1;
				width: gREm(512 * 1/2);
				height: gREm(480 * 1/2);
			}
			.img[name="wallet-14"] {
				width: gREm(630 * 1/2);
				height: gREm(310 * 1/2);
				@include SetBgImage(url('../assets/img/guide/wallet-14.png'));
			}
			.img[name="wallet-15"] {
				width: gREm(630 * 1/2);
				height: gREm(310);
				@include SetBgImage(url('../assets/img/guide/wallet-15.png'));
			}
			.img[name="wallet-16"] {
				width: gREm(630 * 1/2);
				height: gREm(310 * 1/2);
				@include SetBgImage(url('../assets/img/guide/wallet-16.png'));
			}
		}
	}

}}

</style>
