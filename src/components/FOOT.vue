<template>
	<div class="FOOT" :theme="theme ? theme: 'black'">
		<div class="h-bar"></div>
		<div class="foot-box">
			<div class="left-box">
				<router-link class="logo" :to="{ name:'Home'}" :theme="theme ? theme: 'black'" ></router-link>
				<div class="icon-box">
					<a class='a-link' :class="icon.title"  v-for="(icon,idx) in icons" :key="idx" target='_blank' :href="icon.link">
						<span></span>
					</a>
				</div>
			</div>
			<div class="right-box">
				<div class="right-wrap">
					<div class="docs box">
						<div class="title" :theme="theme ? theme: 'black'">{{$t("foot.docs")}}</div>
						<div class="msg-box">
							<a class="msg" :theme="theme ? theme: 'black'" target='_blank' :href="docs[0].link">{{$t(docs[0].title)}}</a>
							<a class="msg" :theme="theme ? theme: 'black'" target='_blank' :href="docs[1].link">{{$t(docs[1].title)}}</a>
						</div>
					</div>
					<div class="contact box">
						<div class="title" :theme="theme ? theme: 'black'">{{$t("foot.contact")}}</div>
						<div class="msg-box">
							<a class="msg" :theme="theme ? theme: 'black'" :href="contact.link">{{contact.title}}</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		theme: {
			type: String,
		}
	},
	data() {
		return {
			icons: [
				{title:"in", link:"https://www.linkedin.com/company/dvision-network"},
				{title:"fb", link:"https://www.facebook.com/Dvision-Network-119255129870212"},
				{title:"tw", link:"https://twitter.com/dvision_network"},
				{title:"kk", link:"https://open.kakao.com/o/gBOQAQlc"},
				{title:"tg", link:"https://t.me/dvisionnetworkglobal"},
				{title:"em", link:"mailto:contact@dvision.network"},
				{title:"bg", link:"https://blog.naver.com/dvision_network"},
				{title:"md", link:"https://medium.com/dvisionnetwork"}
			],
			docs: [
				{title:"foot.whitepaper-kr", link:"https://dvision.network/paper/dvision_Whitepaper_ver.2.0_kr.pdf"},
				{title:"foot.whitepaper-en", link:"https://dvision.network/paper/dvision_Whitepaper_ver.2.0_eng.pdf"}
			],
			contact: {
				title: 'contact@dvision.network',
				link: 'mailto:contact@dvision.network'
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.FOOT {
	@include FLEXV(center, center);
	width: 100%;
	height: gREm(176);
	$tsTime: .5s ease-in-out;
	@include Transition($tsTime);
	.h-bar {
		position:absolute;
		left: 0px; top: 0px;
		width: 100%;
		height: 2px;
		background-color: #392889;
		z-index: 10;
	}
	.foot-box {
		@include FLEX(space-between, center);
		@include Transition($tsTime);
		height: 100%;
		width: gW(126 + 423 + 28 + 448 +  105 + 91 + 180);
		min-width: gREm(126 + 423 + 28 + 100 + 105 + 91 + 180);
		margin-left:gW(260);
		margin-right:gW(260);
		.left-box {
			@include FLEX(flex-start, center);
			@include Transition($tsTime);
			width: gREm(126 + 423 + 28);
			height: 100%;

			.logo {
				display:block;
				cursor: pointer;
				width: gREm(126);
				height: gREm(46);
				@include SetBgImage(url('../assets/img/NV-logo.svg'),no-repeat, contain);
				// @include OnOverTransition();
				margin-right: gREm(60);

				&[theme="white"]{
					display:block;
					cursor: pointer;
					width: gREm(126);
					height: gREm(46);
					@include SetBgImage(url('../assets/img/logo-black.svg'),no-repeat, contain);
					margin-right: gREm(60);
				}
			}


			.icon-box {
				@include FLEX(flex-start, center);
				width: auto;
				height: 100%;
				.a-link {
					@include FLEX(flex-start, center);
					height: gREm(20);
					margin-right: gREm(30);
					@include OnOverTransition();
					&.in { width: gREm(20); @include SetBgImage(url('../assets/img/foot/ic-linkedin.svg')); }
					&.fb { width: gREm(10); @include SetBgImage(url('../assets/img/foot/ic-facebook.svg')); }
					&.tw { width: gREm(25); @include SetBgImage(url('../assets/img/foot/ic-twitter.svg')); }
					&.kk { width: gREm(22); @include SetBgImage(url('../assets/img/foot/ic-kakao-talk.svg')); }
					&.tg { width: gREm(23); @include SetBgImage(url('../assets/img/foot/ic-telegram.svg')); }
					&.em { width: gREm(26); height: gREm(18); margin-right: gREm(27); @include SetBgImage(url('../assets/img/foot/ic-email.svg')); }
					&.bg { width: gREm(34); height: gREm(32); margin-top:gREm(5); margin-right: gREm(26); @include SetBgImage(url('../assets/img/foot/ic-blog.svg')); }
					&.md { width: gREm(28); height: gREm(26); margin-right: gREm(0); @include SetBgImage(url('../assets/img/foot/ic-medium.svg')); }

				}
			}
		}
		.right-box {
			@include FLEX(flex-end, center);
			@include Transition($tsTime);
			width: gREm(105 + 91 + 180);
			height: 100%;
			.right-wrap {
				@include FLEX(space-between, center);
				@include Transition($tsTime);
				width: gREm(105 + 91 + 180);
				height: gREm(177);
			}
			.box {
				@include FLEXV(space-between, flex-start);
				@include Transition($tsTime);
				margin-top: gREm(40);
				height: gREm(100 + 20);
				&.docs {
					width: auto; }
				&.contact { width: auto; }
				.title {

					width: gREm(42);
					height: gREm(20);
					@include Set-Font($AppFont, gREm(17), gREm(20), #201360, 500);

					&[theme="black"]{
					width: gREm(42);
					height: gREm(20);
					@include Set-Font($AppFont, gREm(17), gREm(20), #ffffff, 500);
					}

					&[theme="blue"]{
					width: gREm(42);
					height: gREm(20);
					@include Set-Font($AppFont, gREm(17), gREm(20), #ffffff, 500);
					}


				}
				.msg-box {
					@include Transition($tsTime);
					margin-top: gREm(15);
					height: gREm(18 + 75);

					.msg {

						@include FLEXV(flex-start, flex-start);
						margin-bottom: gREm(9);
						height: gREm(18);
						@include Set-Font($AppFont, gREm(14), gREm(18), #8382a7);
						text-align: left;
						// @include OnOverTransition();
						&:hover{ color:#ffffff; }
						&[theme="white"]{
							&:hover{ color:#201360; }
						}
					}
				}
			}
		}
	}
}

.FOOT[theme="black"] {
	background-color: #181721;
	.h-bar {
		background-color: #24232f;
	}
	.foot-box {
		background-color: #181721;
	}
}

.FOOT[theme="white"] {
	background-color: white;
	.h-bar {
		background-color: #f1f1f1;
	}
	.foot-box {
		background-color: white;
	}
}
.FOOT[theme="blue"] {
	background-color: #201360;
	.h-bar {
		background-color: #392889;
	}
	.foot-box {
		background-color: #201360;
	}
}


@include media-max($media_large) { // 1200
.FOOT {
	.foot-box {
		width: gW_L(126 + 403 + 28 + 248 +  105 + 31 + 180);
		min-width: gREm(126 + 403 + 28 + 100 + 105 + 31 + 180);
		margin-left:gW_L(40);
		margin-right:gW_L(40);
		.left-box {
			width: gREm(126 + 403 + 28);
			.logo {
				margin-right: gREm(40);
			}
		}
		.right-box {
			width: gREm(105 + 31 + 180);
			.right-wrap {
				width: gREm(105 + 31 + 180);
			}
			.box {
				&.docs { width: gREm(105 + 31 - 15); }
				&.contact { width: gREm(179 + 15); }
			}
		}
	}
}}

// @include media-max($media_medium) { // 1024
// .FOOT {
// 	.foot-box {
// 		width: gW_M(126 + 403 + 28 + 72 +  105 + 31 + 180);
// 		min-width: gREm(126 + 403 + 28 + 50 + 105 + 31 + 180);
// 	}
// }}


// @include media-max($media_small) { // 768
@include media-max($media_medium) { // 768
.FOOT {
	height: gREm(273);
	.foot-box {
		@include FLEXV(space-between, center);
		width: gW_S(750);
		min-width: gREm(500);
		margin-top: 20px;
		.left-box {
			@include FLEX(space-between, flex-end);
			width: gW_S(750 - 40 * 2);
			height: gREm(50 + 46);
			.logo {
				min-width: gREm(126);
				margin-right: gW_S(50);
			}
			.icon-box {
				height: gREm(46);
			}
		}
		.right-box {
			width: gW_S(750 - 40 * 2);
			height: gREm(177);
			margin-bottom: 10px;
			.right-wrap {
				width: gREm(105 + 107 + 179);
			}
			.box {
				@include FLEXV(flex-start, flex-start);
				margin-top: gREm(47);
			}
		}
	}
}}


@include media-max(500px) { // 768
.FOOT {
	.foot-box {
		width: 100vw;
		min-width: 100vw;
		height: auto;
		margin-top: 120px;
		.left-box {
			@include FLEX(flex-start, flex-end);
			flex-wrap: wrap;
			height: auto;
			.logo {
				margin-top: 10px;
			}
			.icon-box {
				flex-wrap: wrap;
				height:auto;
				margin-top: 10px;
				.a-link{
					margin-top: 10px;
				}
			}
		}
		.right-box {
			flex-wrap: wrap;
			height:auto;
			margin-bottom: 10px;
			.right-wrap {
				flex-wrap: wrap;
			}
		}
	}
}}
</style>
