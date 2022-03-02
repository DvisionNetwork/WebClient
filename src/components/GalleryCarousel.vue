<template>

	<div v-if="newsInfo && newsInfo.list && newsInfo.list.length > 0"
		class="gallery-carousel" :is-view-more="is1500 ? 'on' : 'off'"
	>

		<div class="title-box">
			<div class="news-title">{{$t('home.news-title')}}</div>
		</div>

		<div v-if="is1500==false" class="gc-wrap">
			<div class="arrow-left">
				<span class="icon" @click="clickA('prev')"></span>
			</div>

			<div class="slide-wrap">
				<div class="slide-box" :uuid="uuid" :slide-page-idx="slidePageIdx">
					<!-- order : hidden prev now next hidden -->
					<div class="slide" :uuid="uuid" v-for="(slide, sidx) in gcList "
						:is-last="isLast(sidx)"
						:is-first="isFirst(sidx)"
						:key="sidx"
						:order="getOrder(sidx)"
					>
						<div class="card-box"  v-for="(card, cidx) in slide"
							:key="cidx"
							:row="card.row"
							:visibility="isVisibleCard(card)"
						>
							<div class="img-box" :style="mxGetBgImageStyle(card.thumbnail)"></div>
							<ul class="desc-box">
								<li class="title">
									{{ card.title }}
								</li>
								<li class="description">
									{{ card.detail }}
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div class="arrow-right">
				<span class="icon" @click="clickA('next')"></span>
			</div>
		</div>

		<div v-if="is1500==true" class="gc-wrap-1500">

			<div class="slide-box" :uuid="uuid" >
				<div class="card-box"  v-for="(card, cidx) in newsInfo.list"
					:key="cidx"
					:card-id="card.id"
					@click="onClickCard(card.ext_link)"
				>
					<div class="img-box" :style="renderBgImage(card.thumbnail)"></div>
					<ul class="desc-box">
						<li class="title">
							{{ card.title }}
						</li>
						<li class="description" v-html="mxGetVHtml(card.detail)">
						</li>
					</ul>
				</div>
			</div>

			<div v-if="hasNextItem()" class="view-more-box" @click="getNextItem()">
				<span class="view-more-btn" @click="clickMore()">{{$t("home.view-more")}}</span>
			</div>

		</div>


	</div>
</template>

<script>

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();


export default {
	name: 'GalleryCarousel',
	props: {
		gcList: Object,
		uuid: String,
	},
	mounted() {
		// window.addEventListener("resize", this.onWinResize);
		// this.onWinResize(); // 맨 처음 호출
	},
	unmounted() {
		window.removeEventListener("resize", this.onWinResize);
	},
	computed: {
		newsInfo() {
			return this.mxGetHomeNews();
		}
	},
	data() {
		return {
			is1500: true,
			slidePageIdx: 0,
		}
	},
	methods: {
		onWinResize(e) {
			var w = window.innerWidth;
			if(w <= 1500) {
				if(this.is1500 == true ) {  // already set
					return;
				}
				this.is1500 = true;
			}else {
				if(this.is1500 == false ) { // already set
					return;
				}
				this.is1500 = false;
			}
		},
		onClickCard(extLink) {
			window.open(extLink);
		},
		hasNextItem() {
			var rv = false;
			if(this.newsInfo.total > this.newsInfo.page * this.newsInfo.cpp) {
				rv = true;
			}
			return rv;
		},
		getNextItem() {

			var data = {
				type : 1, // footer : main 화면 아래
				page: (this.newsInfo.page + 1),
				count: this.newsInfo.cpp
			};

			this.mxShowLoading();

			_U.callPost({
				url:gConfig.news_get_list,
				data: data,
				callback: (resp) =>{
					console.log("[GalleryCarousel] getNextItem()-> resp ", resp);
					var rows = _U.getIfDefined(resp,['data','rows']);
					var total = _U.getIfDefined(resp,['data','total']);
					if(!rows && rows.length > 0) {
						console.log("[GalleryCarousel] getNextItem()-> resp mxSetHome ================ ", rows);
						// this.mxSetHomeNews({total:0, page:0, cpp: 0, list:[]});	 // 빈 뉴스
						return;
					}
					var list = this.newsInfo.list.concat(rows);
					this.mxSetHomeNews({total:total,  page:data.page, cpp: data.count,  list: list});
					this.mxCloseLoading();
				}
			});
		},
		isLast(sidx) {
			var rv = 'false';
			if(sidx == this.gcList.length-1) {
				rv = 'true';
			}
			return rv;
		},
		isFirst(sidx) {
			var rv = 'false';
			if(sidx == 0 ) {
				rv = 'true';
			}
			return rv;
		},
		getOrder(sidx) {
			var rv = '';
			if(sidx == this.slidePageIdx) {
				rv = 'now';
			}else if(sidx == this.slidePageIdx -1) {
				rv = 'prev';
			}else if(sidx == this.slidePageIdx +1) {
				rv = 'next';
			}else if(sidx < this.slidePageIdx -1) {
				rv = 'prev-hidden';
			}else if(sidx > this.slidePageIdx +1) {
				rv = 'next-hidden';
			}
			return rv;
		},
		isVisibleCard(card) {
			var rv = _U.getIfDefined(card,'empty');
			if(rv==true && _U.getIfDefined(card,'row') == 2) return 'none';
			if(rv==true) return 'hidden'
			return 'visible';
		},
		clickA(prevNext) {
			var tO = _U.Q('.slide-box[uuid="'+this.uuid+'"]');
			var d = 0;
			if(prevNext == 'prev') {
				d = -1;
			}else{ // next
				d = +1;
			}
			var o = _U.Q('.slide[order="'+prevNext+'"][uuid="'+this.uuid+'"]');
			if(tO && o) {
				tO.style.left = '-'+o.offsetLeft+'px';
				this.slidePageIdx +=d;
			}
		},
		clickMore() {
			console.log("[GalleryCarousel.vue] onclickMore() ");
		},
		renderBgImage(thumbnail) {
			const isMobile = window.matchMedia('(max-width: 768px)').matches;
			if (!isMobile) {
				return this.mxGetBgImageStyle(thumbnail)
			}
			return {
				'background-image': `url(${thumbnail})`,
				'background-repeat': 'no-repeat',
				'background-position': 'center'
			}
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.gallery-carousel {
	position: relative;
	@include FLEXV(flex-start, center);
	width: 100%;
	height: auto;

	&[is-view-more="on"]  {
		height: auto;
	}

	$slide-width: gREm(368 * 3 + 60 * 3);

	.title-box{
		height: 100%;
		width: gREm( 368 * 3 + 60 * 2);
		.news-title{
			width:gREm(223);
			height: gREm(52);
			margin-top:gREm(100);
			@include Set-Font($AppFont, gREm(42), gREm(55), #ffffff,600);
		}
	}
	.gc-wrap {

		height: 100%;
		width: gREm( 368 * 3 + 60 * 2 + (30 + 88) * 2 );
		margin-top:gREm(40);
		// margin-bottom:gREm(78);
		@include FLEX(space-between, center);



		.slide-wrap {
			@include FLEX(flex-start, center);
			width: $slide-width;
			height: gREm(210 + 466 + 46 + 10); // 10 => margin
			// overflow: hidden;
			overflow-x:auto;

			// -webkit-overflow-scrolling: touch; /* 끝에서 바운스 되도록*/
			scroll-snap-type: x mandatory;


			-ms-overflow-style: none; /* IE and Edge */
			scrollbar-width: none; /* Firefox */
			&::-webkit-scrollbar {
			display: none; /* Chrome, Safari, Opera*/
			}

			.slide-box {
				@include FLEX(flex-start, center);
				flex-wrap: nowrap;
				width: auto;
				height: 100%;

				position: absolute;
				left: 0px;
				top: 0px;
				@include Transition(left 0.5s ease-in-out);

				// scroll-snap-type: x mandatory;

				.slide {
					@include FLEX(space-between, center);
					flex-wrap: wrap;
					width: $slide-width;
					height: 100%;
					scroll-snap-align: start;
					// border: solid 1px red;
				}
			}
		}
		.arrow-left, .arrow-right {
			width: gREm(30 + 88);
			height: gREm(56);
			.icon {
				width: gREm(30);
				height: gREm(56);
				color: white;
				cursor: pointer;
				@include OnOverTransition();
			}
		}
		.arrow-left {
			@include FLEX(flex-start, center);
			.icon {
				@include SetBgImage(url('../assets/img/ic-arrow-left.svg'));
			}
		}
		.arrow-right {
			@include FLEX(flex-end, center);
			.icon {
				@include SetBgImage(url('../assets/img/ic-arrow-right.svg'));
			}

		}

	}

	.gc-wrap-1500 {

		height: auto;
		width: $slide-width;
		@include FLEXV(flex-start, center);

		.slide-box {
			@include FLEX(flex-start, flex-start);
			flex-wrap: wrap;
			width: $slide-width;
			// width: 100%;
			height: auto;
			margin-top: gREm(120);

			position: relative;
			@include Transition(left 0.5s ease-in-out);

			.slide {
				@include FLEX(space-between, center);
				flex-wrap: wrap;
				width: $slide-width;
				height: 100%;
			}
		}

		.view-more-box {
			@include FLEX(center, center);
			width: 100%;
			height: gREm(64);
			margin-top:gREm(80 - 42);
			margin-bottom:gREm(130);
			.view-more-btn {
				@include Transition(0.2s ease-in-out);
				@include FLEX(center, center);
				width: gREm(180);
				height: gREm(64);
				text-align: center;
				border-radius: 6px;
  				border: solid 1px #f1f1f1;
				@include Set-Font($AppFont, gREm(18), 1.22, #ffffff);
				cursor: pointer;
				&:hover {
					background-color: #ffffff;
					color: #201360;
				}
			}
		}
	}

}

.card-box {
	position: relative;
	@include FLEXV(flex-start, center);
	width: gREm(368);
	height: gREm(210 + 176);
	cursor: pointer;
	// border: solid 1px green;
	&[row="2"] {
		height: gREm(210 + 80 + 46);
	}
	// border: solid 1px green;
	visibility: visible;

	&[visibility="hidden"] {
		visibility: hidden;
	}

	.img-box {
		@include FLEX(center, center);
		width: 100%;
		height: gREm(210);
		@include Radius(gREm(12));
	}
	.desc-box {
		@include FLEXV(flex-start, flex-start);
		width: gREm(368 - 20);
		height: gREm(80 + 46);
		.title {
			margin-top: gREm(42);
			height: gREm(26);
			width: 100%;
			text-align: left;
			@include Set-Font($AppFont, gREm(20), 1.27, #ffffff, 500);
			@include Dotted-Text;
		}
		.description {
			width: 100%;
			height: gREm(46);
			margin-top:gREm(12);
			text-align: left;
			@include Set-Font($AppFont, gREm(17), 1.41, #cac6e0);
			@include Multiline-Dotted-Text(2);
		}
	}
}

.gc-wrap-1500 {
	.card-box {
		margin-left: gREm(30);
		margin-right: gREm(30);
		margin-bottom: gREm(42);

		&[visibility="none"] {
			display: none;
		}
	}
}



// @include media-max($media_large) { // 1200
@include media-max(1500px) { // 1200
.gallery-carousel {
	.gc-wrap-1500 {

		$slide-width-1200 : 294 * 3 + 39 * 2;

		width: gREm( $slide-width-1200 );

		.slide-wrap {
			width: gREm($slide-width-1200);
			.slide-box {
				.slide {
					width: gREm($slide-width-1200);
				}
			}
		}
	}
	.card-box {

		width: gREm(294);
		height: gREm(172 + 219);

		.img-box {
			height: gREm(172);
		}
		.desc-box {
			width: gREm(294 - 8 * 2);
			height: gREm(63 + 76);
			.title {
				margin-top: gREm(28);
				height: gREm(22);
				@include Set-Font($AppFont, gREm(18), 1.27, #ffffff, 500);
				@include Dotted-Text;
			}
			.description {
				width: 100%;
				height: gREm(76);
				margin-top:gREm(13);
				@include Set-Font($AppFont, gREm(15), 1.27, #cac6e0);
				@include Multiline-Dotted-Text(3);
			}
		}
	}
}}

// @include media-max($media_medium) { //  1024, 750
// .gallery-carousel {

// 	$slide-width-1024 : 670;

// 	.gc-wrap-1500 {

// 		width: gW_S( $slide-width-1024 );

// 		.slide-wrap {
// 			width: gW_S($slide-width-1024);
// 			margin-top: gREm(80);

// 			.slide-box {
// 				.slide {
// 					@include FLEXV(flex-start, center);
// 					flex-wrap: nowrap;
// 					width: gW_S($slide-width-1024);
// 					height: auto;
// 				}
// 			}
// 		}
// 	}
// 	.card-box {

// 		width: gW_S($slide-width-1024);
// 		height: gREm(164 + 157);

// 		&[visibility="hidden"] {
// 			display: none;
// 		}

// 		.img-box {
// 			height: gREm(164);
// 		}
// 		.desc-box {
// 			width: gW_S($slide-width-1024 - 10 * 2);
// 			height: gREm(157 - 20);
// 			.title {
// 				margin-top: gREm(22);
// 				height: gREm(22);
// 				@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff, 500);
// 				@include Dotted-Text;
// 			}
// 			.description {
// 				width: 100%;
// 				height: gREm(157 - 20 - 56);
// 				margin-top:gREm(12);
// 				@include Set-Font($AppFont, gREm(17), gREm(20), #cac6e0);
// 				@include Multiline-Dotted-Text(3);
// 			}
// 		}
// 	}
// }}

@include media-max($media_medium) { //  1024, 750
.gallery-carousel {

	$slide-width-1024 : 100vw;

	.title-box{
		width: 80vw;
	}

	.gc-wrap-1500 {

		width: 100vw;

		.slide-box {
			width: 100vw;
			@include FLEXV(flex-start, center);
			width: 100vw;
			height: auto;
		}

		.view-more-box {
			@include FLEX(center, center);
			width: 100vw;
		}

	}
	.card-box {

		width: 80vw;
		height: gREm(164 + 157);

		&[visibility="hidden"] {
			display: none;
		}

		.img-box {
			height: gREm(164);
		}
		.desc-box {
			width: 80vw;
			height: gREm(157 - 20);
			.title {
				margin-top: gREm(22);
				height: gREm(22);
				@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff, 500);
				@include Dotted-Text;
			}
			.description {
				width: 80vw;
				height: gREm(157 - 20 - 56);
				margin-top:gREm(12);
				@include Set-Font($AppFont, gREm(17), gREm(20), #cac6e0);
				@include Multiline-Dotted-Text(3);
			}
		}
	}
}}

@include media-max($media_small) {
	.gallery-carousel {
		.title-box {
			width: 100%;
			text-align: center;
			.news-title {
				font-size: gREm(36);
				width: 100%;
				margin-top: gREm(72);
			}
		}
		.gc-wrap-1500 {
			padding: 0 gREm(20);

			.slide-box {
				margin-top: gREm(56);
				width: 100%;

				.card-box {
					width: 100%;
					height: auto;
					margin: 0;
					margin-bottom: gREm(48);

					.img-box {
						background-size: cover;
						border-radius: gREm(8);
						object-fit: unset;
					}

					.desc-box {
						width: 100%;
						height: auto;

						.title {
							height: auto;
							line-height: gREm(26);
						}

						.description {
							height: auto;
							width: 100%;
							// overflow: visible;
							font-size: gREm(16);
							line-height: gREm(24);
							-webkit-line-clamp: 4;
							// display: block;
						}
					}
				}
			}
		}
	}
}
</style>
