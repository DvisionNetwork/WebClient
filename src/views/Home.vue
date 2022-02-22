<template>
	<div class="home">
		<div class="main-visual">
			<Player/>
			<div class="msg-box">
				<div v-if="checkMobile()" class="msg notice" v-html="mainVisual.noticeHtml"></div>
				<div class="msg title" v-html="mainVisual.titleHtml"></div>
				<div class="msg message" v-html="mainVisual.msgHtml"></div>
				<div v-if="!checkMobile()" class="button" :started="mainVisual.dvw_started">
					<div class="button-wrap" @click="startDVW">
						<div class="button-left"></div>
						<div class="button-right"></div>
					</div>
				</div>
			</div>
		</div>
		<WideCard
			appear
			v-for="(card, index) in cards"
			:key="index"
			:cardInfo="card"
			:evenOdd="(index%2==0 ? 'even': 'odd')"
		/>
		<GalleryCarousel
			appear
			:gcList="gslides" :uuid="getUUID()"
		/>
		<FOOT :theme="'blue'" />
		<!-- <div class="page-up-btn" @click="goPageTop"></div> -->
	</div>
</template>

<script>

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();

// @ is an alias to /src
import Player from '@/components/Player.vue'
import WideCard from '@/components/WideCard.vue'
import FOOT from '@/components/FOOT.vue'

import GalleryCarousel from '@/components/GalleryCarousel.vue'

export default {
	name: 'Home',
	props: {

	},
	mounted () {
		console.log("[Home.vue] mounted(), route : ", this.$route);


		this.callNews();

	},
	data() {
		return {
			showAuth: false,
			authInfo: {
				type: 'signin',
			},
			mainVisual: {
				titleHtml: this.$t('home.main-visual.title'),
				noticeHtml: this.$t('home.main-visual.notice'),
				msgHtml: this.$t(
					this.checkMobile()
						? 'home.main-visual.desc-mobile'
						: 'home.main-visual.desc'
				),
				dvw_started: false,
			},
			cards: [
				{
					title: this.$t('home.meta-space.title'),
					description: this.$t('home.meta-space.desc'),
					imgType: 'meta-space'
				},
				{
					title: this.$t('home.meta-city.title'),
					description: this.$t('home.meta-city.desc'),
					imgType: 'meta-city'
				},
				{
					title: this.$t('home.nft-market.title'),
					description: this.$t('home.nft-market.desc'),
					imgType: 'nft-market'
				},
			],
			gslides:[
				[
					{
						row: 1,
						title: 'slide 1-1',
						description: 'Content',
						image: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
					},
					{
						row: 1,
						title: 'slide 1-2',
						description: 'Content 2',
						image: 'https://homepages.cae.wisc.edu/~ece533/images/fruits.png',
					},
					{
						row: 1,
						title: 'slide 1-1',
						description: 'Content',
						image: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
					},
					{
						row: 2,
						title: 'slide 1-2',
						description: 'Content 2',
						image: 'https://homepages.cae.wisc.edu/~ece533/images/fruits.png',
					},
					{
						row: 2,
						title: 'slide 1-1',
						description: 'Content',
						image: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
					},
					{
						row: 2,
						title: 'slide 1-2',
						description: 'Content 2',
						image: 'https://homepages.cae.wisc.edu/~ece533/images/fruits.png',
					}
				],
				[
					{
						row:1,
						title: 'slide 1-1',
						description: 'Content',
						image: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
					},
					{
						row:1,
						title: 'slide 1-2',
						description: 'Content 2',
						image: 'https://homepages.cae.wisc.edu/~ece533/images/fruits.png',
					},
					{
						row:1,
						title: 'slide 1-1',
						description: 'Content',
						image: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
					},
					{
						row:2,
						title: 'slide 1-2',
						description: 'Content 2',
						image: 'https://homepages.cae.wisc.edu/~ece533/images/fruits.png',
					},
					{
						row:2,
						title: 'slide 1-1',
						description: 'Content',
						image: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
					},
					{
						row:2,
						title: 'slide 1-2',
						description: 'Content 2',
						image: 'https://homepages.cae.wisc.edu/~ece533/images/fruits.png',
					}
				],
				[
					{
						row: 1,
						title: 'slide 2-1',
						description: 'Content 1',
						image: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
					},
					{
						row: 1,
						title: 'slide 2-2',
						description: 'Content 2',
						image: 'https://homepages.cae.wisc.edu/~ece533/images/fruits.png',
					},
					{
						row: 1,
						empty: true,
						title: '',
						description: '',
						image: '',
					},
					{
						row: 2,
						empty: true,
						title: '',
						description: '',
						image: '',
					},
					{
						row: 2,
						empty: true,
						title: '',
						description: '',
						image: '',
					},
					{
						row: 2,
						empty: true,
						title: '',
						description: '',
						image: '',
					},
				],
			],
		}
	},
	components: {
		Player,
		WideCard,
		GalleryCarousel,
		FOOT,
	},
	methods: {
		startDVW() {
			console.log("==== startDVW ===");
			// this.mxShowToast(this.$t('popup.app-construction-alert'));
			this.mainVisual.dvw_started  = !this.mainVisual.dvw_started
			this.mxGameStart();
		},
		checkMobile() {
			if (navigator.appVersion.indexOf("Win")!=-1)
				return false;
			if (navigator.appVersion.indexOf("Mac")!=-1 && navigator.appVersion.indexOf("iPhone")==-1)
				return false;
			return true;
		},
		getUUID() {
			return _U.getUUID();
		},
		// goPageTop() {
		// }
		callNews() {
			var data = {
				type : 1, // footer : main 화면 아래
				page: 1,
				count: gConfig.homeNews_count_per_page
			};

			_U.callPost({
				url:gConfig.news_get_list,
				data: data,
				callback: (resp) =>{
					console.log("[Home] callNews()-> resp ", resp);
					var rows = _U.getIfDefined(resp,['data','rows']);
					var total = _U.getIfDefined(resp,['data','total']);
					if(!rows && rows.length > 0) {
						console.log("[Home] callNews()-> resp mxSetHome ================ ", rows);
						this.mxSetHomeNews({total:0, page:0, cpp: 0, list:[]});	 // 빈 뉴스
						return;
					}
					this.mxSetHomeNews({total:total,  page:data.page, cpp: data.count,  list:rows});
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>

.home {

	position: absolute;
	@include FLEXV(space-between,center);
	top:0px;
	width: 100%;
	height: auto;
	background-color: #201360;

	max-width:100vw;
	overflow-x:hidden;

	min-height: calc(100vh - 176px); // Foot 176px

	.main-visual {

		@include FLEX(center, center);
		width: 100%;
		height: gREm(1080);
		background-image: linear-gradient(to bottom, #000000 72%, #201360 92%);

		@include Transition(height .5s ease-in-out);

		.msg-box {
			position: relative;
			display: block;

			.msg {
				@include FLEX(center, center);
			}
			.notice {
				text-align: center;
				@include Set-Font($AppFont, gREm(30), 1.22, #ee4705, 600);
			}
			.title {
				text-align: center;
				@include Set-Font($AppFont, gREm(70), 1.23, #ffffff, 600);
			}
			.message {
				margin-top: gREm(20);
				text-align: center;
				@include Set-Font($AppFont, gREm(30), 1.23, #f6f4ff);
			}

			.button {
				position: relative;
				margin-top: gREm(70);
				@include FLEX(center, center);
				height: gREm(80);
				.button-wrap {
					cursor:pointer;
					width: gREm(208 + 58);
					height: gREm(80);
					.button-left {
						position: absolute;
						top:0px; left:0px;
						width: gREm(208);
						height: gREm(80);
						@include SetBgImage(url('../assets/img/btn-start-h-right.svg'));
					}
					.button-right {
						position: absolute;
						@include Transition(transform 0.1s ease-in-out);
						top:0px;
						left:gREm(208);
						width: gEm(58);
						height: gREm(80);
						@include SetBgImage(url('../assets/img/btn-start-h-left.svg'));
					}
					&:hover {
						.button-right {
							@include Transition(transform 0.5s ease-in-out);
							@include Transform(rotate( 30deg ),bottom left);
						}
					}
				}

			}
		}
	}

}

@include media-max($media_large) { // 1200
.home .main-visual {

	height: gREm(800);

	.msg-box {
		
		.notice {
			@include Set-Font($AppFont, gREm(27), 1.22, #ee4705, 600);
			margin-bottom: gREm(10);
		}
		.title {
			@include Set-Font($AppFont, gREm(60), 1.22, #ffffff, 600);
		}
		.message {
			margin-top: gREm(18);
			@include Set-Font($AppFont, gREm(27), 1.22, #f6f4ff);
		}

		.button {
			margin-top: gREm(60);
			@include FLEX(center, center);
			height: gREm(70);
			.button-wrap {
				width: gREm(175 + 58);
				height: gREm(70);
				.button-left {
					width: gREm(175);
					height: gREm(70);
					@include SetBgImage(url('../assets/img/btn-start-h-left-1200.svg'));
				}
				.button-right {
					top:0px;
					left:gREm(175);
					width: gEm(58);
					height: gREm(70);
					@include SetBgImage(url('../assets/img/btn-start-h-right-1200.svg'));
				}
			}
		}
	}
}}

@include media-max($media_medium) { // 1024
.home .main-visual {

	height: gREm(768);

	.msg-box {
		.notice {
			@include Set-Font($AppFont, gREm(24), 1.22, #ee4705, 600);
		}
		.title {
			@include Set-Font($AppFont, gREm(50), 1.22, #ffffff, 600);
		}
		.message {
			margin-top: gREm(22);
			@include Set-Font($AppFont, gREm(24), 1.21, #f6f4ff);
		}

		.button {
			margin-top: gREm(50);
			@include FLEX(center, center);
			height: gREm(70);
			.button-wrap {
				width: gREm(149 + 51);
				height: gREm(60);
				.button-left {
					width: gREm(149);
					height: gREm(60);
					@include SetBgImage(url('../assets/img/btn-start-h-left-1024.svg'));
				}
				.button-right {
					top:0px;
					left:gREm(149);
					width: gEm(51);
					height: gREm(60);
					@include SetBgImage(url('../assets/img/btn-start-h-right-1024.svg'));
				}
			}
		}
	}
}}

@include media-max($media_small) { // 768
.home .main-visual {

	height: gREm(720);

	.msg-box {
		padding: 0 gREm(20);
		width: 100%;

		.notice {
			@include Set-Font($AppFont, gREm(14), 1.375, #777682, 200);
			white-space: pre-line;
			margin-bottom: gREm(20);
		}
		.title {
			width: 100%;
			@include Set-Font($AppFont, gREm(32), 1.31, #ffffff, 600);
		}
		.message {
			@include Set-Font($AppFont, gREm(16), 1.39, #f6f4ff);
			margin-top: gREm(16);
			white-space: pre-line;
		}

		.button {
			display: none;
			// margin-top: gREm(40);
			// @include FLEX(center, center);
			// height: gREm(60);
			// .button-wrap {
			// 	width: gREm(141 + 59);
			// 	height: gREm(60);
			// 	.button-left {
			// 		width: gREm(141);
			// 		height: gREm(60);
			// 		@include SetBgImage(url('../assets/img/btn-start-h-left-750.svg'));
			// 	}
			// 	.button-right {
			// 		top:0px;
			// 		left:gREm(141);
			// 		width: gEm(59);
			// 		height: gREm(60);
			// 		@include SetBgImage(url('../assets/img/btn-start-h-right-750.svg'));
			// 	}
			// }
		}
	}
}}

#app[mobile="on"] .home .main-visual {
	.msg-box {
		.button {
			display: none;
		}
	}
}


</style>
