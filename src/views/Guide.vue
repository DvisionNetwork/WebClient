<template>
	<div class="GUIDE">

		<div class="title-box">
			<div class="title" v-html="getTitleDesc"></div>
		</div>

		<div class="content-body-wrap">
			<div class="tabs">
				<div class="item-box"
					v-for="(item, idx) in guideList"
					:selected="page==item.name ? true : false"
				>
					<div class="item-wrap">
						<div class="item" @click="onTabClick(item.name)" >
							<div class="icon" :name="item.name"></div>
							<div class="name">{{ $t('guide.tab.'+item.name) }}</div>
						</div>
					</div>
					<div v-if="(idx != guideList.length -1)" class="v-bar"></div>
				</div>
			</div>
			<div class="content-box">
				<GuideGuide v-if="page=='guide'" />
				<GuideCreator v-if="page=='creator'" />
				<GuideWallet v-if="page=='wallet'" :wIdx="wIdx" />
				<GuideDownload v-if="page=='download'" />
				<GuideDVI v-if="page=='dvi'" />
			</div>
		</div>

	</div>
	<FOOT :theme="'white'" />

</template>

<script>
import GuideGuide from '@/views/Guide.Guide.vue'
import GuideCreator from '@/views/Guide.Creator.vue'
import GuideWallet from '@/views/Guide.Wallet.vue'
import GuideDownload from '@/views/Guide.Download.vue'
import GuideDVI from '@/views/Guide.DVI.vue'
import FOOT from '@/components/FOOT.vue'

export default {
	name: "Guide",
	components: {
		GuideGuide,
		GuideCreator,
		GuideWallet,
		GuideDownload,
		GuideDVI,
		FOOT,
	},
	props: {
		page: {
			type: String,
			default: 'guide',
		},
		wIdx: {
			type: Number,
			default: 0,
		},
	},
	beforeMount () {
		console.log("[Guide.vue] beforeMout(), route : ", this.$route.params.page, this.$route)
	},
	mounted () {
		console.log("[Guide.vue] mounted(), route : ", this.page, this.$route)
	},
	beforeUpdate () {
		console.log("[Guide.vue] beforeUpdate(), route : ", this.page, this.$route);
	},
	updated() {
		console.log("[Guide.vue] updated(), route : ", this.page, this.$route)
	},
	data () {
		return {
			guideList: [
				{name: "guide"}, {name: "creator"}, {name: "wallet"}, {name: "download"}, {name: "dvi"}
			]
		}
	},
	computed: {
		getTitleDesc() { return this.$t('guide.title'); },
	},
	methods : {
		onTabClick (itemName) {
			console.log('onclick', itemName);
			this.$router.push({name:"Guide-Page", params:{'page': itemName}});
		},
	}
}

</script>

<style lang="scss" scoped>
.GUIDE {
	@include FLEXV(flex-start, center);
	width: 100vw;
	overflow: hidden;
	height: auto;
	background-color: white;

	min-height: calc(100vh - 176px); // Foot 176px

	.title-box {
		@include FLEXV(flex-start, center);
		width: 100%;
		height: gREm(370);
		background-image: linear-gradient(to bottom, #6c38ef, #6c38ef);
		.title {
			height: auto;
			width: auto;
			margin-top: gREm(213);
			@include Set-Font($AppFont, gREm(34), gREm(55), #ffffff, 600);
			text-align: center;
		}
	}

	.content-body-wrap {
		@include FLEXV(flex-start, center);
		width: gREm(240 * 5 + 1 * 4);
		.tabs {
			width: 100%;
			height: gREm(100);
			margin-top: gREm(80);
			@include FLEX(space-between, flex-start);
			.item-box {
				height: 100%;
				width: gREm(240);
				@include FLEX(space-between, flex-start);
				.item-wrap {
					height: 100%;
					width: gREm(240);
					@include FLEXV(center, center);
					.item {
						height: 100%;
						width: auto;
						min-width: gREm(100);
						@include FLEXV(flex-start, center);
						cursor: pointer;
						@include OnOverTransition();

						.icon {
							width: gREm(38);
							height: gREm(38);
							object-fit: contain;
							@include SetBgImage(url('../assets/img/guide/ic-guide.svg'));
							&[name="guide"] {
								@include SetBgImage(url('../assets/img/guide/ic-guide.svg'));
							}
							&[name="creator"] {
								@include SetBgImage(url('../assets/img/guide/ic-creator.svg'));
							}
							&[name="wallet"] {
								@include SetBgImage(url('../assets/img/guide/ic-wallet.svg'));
							}
							&[name="download"] {
								@include SetBgImage(url('../assets/img/guide/ic-download.svg'));
							}
							&[name="dvi"] {
								@include SetBgImage(url('../assets/img/guide/ic-dvi.svg'));
							}
						}

						.name {
							width: auto;
							height: gREm(19);
							margin-top: gREm(14);
							@include Transition( .25s ease-in-out);
							@include Set-Font($AppFont, gREm(16), gREm(19), #17141a, 300);

							&:after {
								@include Transition( .25s ease-in-out);
								@include H-Center;
								@include SetBgImage(url('../assets/img/guide/ic-arrow-page-r.svg'));
								position: relative;
								opacity: 0;
								bottom: gREm(-9 - 3);
								content: "";
								display: block;
								width: 0px;
								height: 0px;
							}
						}
					}
				}
				&[selected='true'] .item-wrap .item .name {
					color: #738be5;
					&:after {
						opacity: 1;
						width: gREm(12);
						height: gREm(6);
					}
				}
				.v-bar {
					height: 100%;
					width: 1px;
					background-color: #dedede;
				}
			}

		}
		.content-box {
			width: auto;
			height: auto;

			// @include FLEX(flex-start, center);

		}

	}
}


@include media-max($media_medium) { // 1024
.GUIDE {
	.title-box {
		.title {
			height: auto;
			width: auto;
			margin-top: auto;
			margin-bottom: gREm(60);
			@include Set-Font($AppFont, gREm(28), gREm(45), #ffffff, 600);
			text-align: center;
			white-space: pre-wrap;
		}
	}

	.content-body-wrap {
		@include FLEXV(flex-start, center);
		width: 100vw;
		.tabs {
			width: auto;
			.item-box {
				width: auto;
				.item-wrap {
					width: 18vw;
					.item .name {
						font-size: gREm(14);
					}
				}
			}
		}
		.content-box {
			width: 100vw;
		}
	}
}}

@include media-max($media_small) { // 1024
.GUIDE {
	.title-box {
		.title {
			font-size: gREm(24);
			line-height: gREm(38);
		}
	}

	.content-body-wrap {
		@include FLEXV(flex-start, center);
		width: 100vw;
		.tabs {
			width: auto;
			.item-box {
				width: auto;
				.item-wrap {
					width: 18vw;
					.item .name {
						font-size: gREm(12);
					}
				}
				.v-bar {
					visibility: hidden;
				}
			}
		}

	}
}}

</style>
