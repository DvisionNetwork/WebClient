<template>
	<div appear class="card-box" :even-odd="evenOdd" isdisplayed="off" :ref="'cardBox'">
		<div class="img-box" :type="cardInfo.imgType"></div>
		<div class="cover"></div>
		<ul class="desc-box">
			<li class="title trans-up" data-delay-turn="1">
				{{ cardInfo.title }}
			</li>
			<li class="description trans-up" data-delay-turn="2" v-html="getDescription">
			</li>
			<li v-if="cardInfo.btn_name" class="btn g-btn trans-up" data-delay-turn="3" @click="onClick">
				{{ cardInfo.btn_name }}
			</li>
		</ul>
	</div>
</template>

<script>
import Velocity from 'velocity-animate'

export default {
	name: 'WideCard',
	props: {
		cardInfo: Object,
		evenOdd: String,
	},
	data() {
		return {
			observer: null,
		}

	},
	mounted() {
		this.observer = window._U.getObserver();
		this.observer.observe(this.$refs['cardBox'])
	},
	computed: {
		getDescription() {
			return this.cardInfo.description;
		},
		bgImageStyle() {
			return {
				// 'background-image': `url(${BACKDROP_BASE}/${this.movie.backdrop_path})`,
				'background-image': `url(${this.cardInfo.image})`,
				'background-repeat': 'no-repeat',
				'background-size': 'cover',
			}
		},
	},
	methods: {
		onClick() {
			console.log('onclick :: :');
		},
		beforeEnter(el) {
			el.style.opacity = 0
			console.log("==== transition beforeEnter....")
		},
		enter(el, done) {
			console.log("==== transition enter....")
			Velocity(
				el,
				{ opacity: 1 },
				{ duration: 2000, easing: [70, 8], complete: done }
			)

		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.card-box {
	position: relative;
	@include FLEX(flex-start, center);
	width: 100%;
	height: gREm(580);

	.img-box {
		position: absolute;
		@include Full-Size;
		&[type="meta-space"] {
			@include SetBgImage(url('../assets//img/home/meta-space-bg.png'));
		}
		&[type="meta-city"] {
			@include SetBgImage(url('../assets//img/home/meta-city-bg.png'));
		}
		&[type="nft-market"] {
			@include SetBgImage(url('../assets//img/home/nft-market-bg.png'));
		}
	}
	.cover {
		position: absolute;
		@include Full-Size;
		opacity: 0.6;
		background-color: #000000;
	}
	.desc-box {
		@include FLEXV(center, flex-start);
		margin-left: gW(260);
		margin-right: gW(260);
		width: 100%;
		height: auto;

		@include Transition(0.5s ease-in-out 0.5s );

		.title {
			height: gREm(110);
			width: 100%;
			text-align: left;
			@include Set-Font($AppFont, gREm(90), 1.22, #ffffff, 600);
		}
		.description {
			height: auto;
			width: 100%;
			margin-top:gREm(10);
			@include Set-Font($AppFont, gREm(28), 1.46, #f6f4ff);
			@include Multiline-Dotted-Text(8);
		}
		.btn {
			height: gREm(76);
			width: gREm(253.3);
			margin-top:gREm(50);
			border-radius: gREm(6);
			@include Set-Font($AppFont, gEm(26), 1.23, #ffffff);
			text-align: center;
			@include OnOverTransition();
		}
	}


	&[even-odd="odd"] .desc-box {
		margin-right: gW(260);
		.title, .description {
			text-align: right;
		}
	}

	// &[isdisplayed="on"][even-odd="even"] .desc-box {
	// 	// transform: perspective(10px) rotateY(180deg);
	// 	margin-left: gW(260);
	// }
	// &[isdisplayed="on"][even-odd="odd"] .desc-box {
	// 	margin-right: gW(800);
	// 	.title, .description {
	// 		width: gW(860);
	// 	}
	// }
}
.card-box[isdisplayed="off"] {
	.trans-up {opacity:0;}
}
.card-box[isdisplayed="on"] {

	.trans-up {
		animation:transUp 1s both;-webkit-animation:transUp 1s both;-ms-animation:transUp 1s both;
		transition:transform 1s cubic-bezier(.19,1,.22,1),opacity 1s cubic-bezier(.19,1,.22,1);
		-webkit-transition:transform 1s cubic-bezier(.19,1,.22,1),opacity 1s cubic-bezier(.19,1,.22,1);
		-ms-transition:transform 1s cubic-bezier(.19,1,.22,1),opacity 1s cubic-bezier(.19,1,.22,1);
	}
	.trans-up[data-delay-turn="1"] {animation-delay:.3s;}
	.trans-up[data-delay-turn="2"] {animation-delay:.5s;}
	.trans-up[data-delay-turn="3"] {animation-delay:.7s;}
	.trans-up[data-delay-turn="4"] {animation-delay:.9s;}
	.trans-up[data-delay-turn="5"] {animation-delay:1.1s;}
	.trans-up[data-delay-turn="6"] {animation-delay:1.3s;}
	.trans-up[data-delay-turn="7"] {animation-delay:1.5s;}
	.trans-up[data-delay-turn="8"] {animation-delay:1.7s;}
	.trans-up[data-delay-turn="9"] {animation-delay:1.9s;}
}

@keyframes transUp {
	0% {opacity:0;transform:translateY(50px);-webkit-transform:translateY(50px);-ms-transform:translateY(50px);}
	100% {opacity:1;transform:translateY(0);-webkit-transform:translateY(0);-ms-transform:translateY(0);}
}

@-webkit-keyframes transUp {
	0% {opacity:0;transform:translateY(50px);-webkit-transform:translateY(50px);-ms-transform:translateY(50px);}
	100% {opacity:1;transform:translateY(0);-webkit-transform:translateY(0);-ms-transform:translateY(0);}
}

@include media-max($media_large) { // 1200
.card-box {
	height: gREm(600);
	.desc-box {
		margin-left: gW_L(100);
		.title {
			height: gREm(78);
			width: gW_L(800);
			text-align: left;
			@include Set-Font($AppFont, gREm(64), 1.22, #ffffff, 600);
		}
		.description {
			height: auto;
			width: gW_L(800);
			margin-top:gREm(20);
			@include Set-Font($AppFont, gREm(22), 1.45, #f6f4ff);
			@include Multiline-Dotted-Text(3);
		}
		.btn {
			height: gREm(64);
			width: gREm(200);
			margin-top:gREm(50);
			border-radius: gREm(6);
			@include Set-Font($AppFont, gEm(20), 1.2, #ffffff);
			text-align: center;
			@include OnOverTransition();
		}
	}


	&[even-odd="odd"] .desc-box {
		margin-left: gW_L(100);
	}

	&[isdisplayed="on"][even-odd="even"] .desc-box {
		// transform: perspective(10px) rotateY(180deg);
		margin-left: gW_L(100);
	}
	&[isdisplayed="on"][even-odd="odd"] .desc-box {
		margin-left: gW_L(100);
		.title, .description {
			width: gW_L(800);
		}
	}
}}

@include media-max($media_medium) { // 1024
.card-box {
	height: gREm(630);
	.desc-box {
		.title {
			height: gREm(73);
			width: gW_M(700);
			text-align: left;
			@include Set-Font($AppFont, gREm(60), 1.22, #ffffff, 600);
		}
		.description {
			height: auto;
			width: gW_M(700);
			margin-top:gREm(20);
			@include Set-Font($AppFont, gREm(20), 1.5, #f6f4ff);
			@include Multiline-Dotted-Text(3);
		}
		.btn {
			height: gREm(64);
			width: gREm(200);
			margin-top:gREm(40);
			border-radius: gREm(6);
			@include Set-Font($AppFont, gEm(20), 1.2, #ffffff);
			text-align: center;
			@include OnOverTransition();
		}
	}

	&[even-odd="odd"] .desc-box {
		margin-left: gW_M(100);
	}

	&[isdisplayed="on"][even-odd="even"] .desc-box {
		// transform: perspective(10px) rotateY(180deg);
		margin-left: gW_M(100);
	}
	&[isdisplayed="on"][even-odd="odd"] .desc-box {
		margin-left: gW_M(100);
		.title, .description {
			width: gW_M(700);
		}
	}
}}

@include media-max($media_small) { // 768
.card-box {
	height: gREm(444);
	.desc-box {
		@include FLEXV(center, center);
		margin: 0;
		width: 100%;
		.title {
			height: gREm(37);
			width: 100%;
			text-align: left;
			@include Set-Font($AppFont, gREm(30), 1.23, #ffffff, 600);
		}
		.description {
			@include Set-Font($AppFont, gREm(14), 1.375, #ffffff);
			height: auto;
			width: 100%;
			margin-top:gREm(14);
			text-align: left;
			white-space: pre-line;
			display: list-item;
			// @include Multiline-Dotted-Text(3, left);
		}
		.btn {
			height: gREm(48);
			width: gREm(150);
			margin-top:gREm(40);
			border-radius: gREm(6);
			@include Set-Font($AppFont, gEm(14), 1.29, #ffffff);
			text-align: center;
			@include OnOverTransition();
		}
	}

	&[even-odd="odd"] .desc-box {
		margin-left: 0px;
	}

	&[isdisplayed="on"][even-odd="even"] .desc-box {
		// transform: perspective(10px) rotateY(180deg);
		margin-left: 0px;
		padding: 0 gREm(55) 0 gREm(22);
	}
	&[isdisplayed="on"][even-odd="odd"] .desc-box {
		margin: 0;
		padding: 0 gREm(22) 0 gREm(55);
		.title, .description {
			width: 100%;
		}
	}
}}
</style>
