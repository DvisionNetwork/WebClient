<template>
	<div class="Creator">
		<div class="msg-box">
			<div class="msg-item" v-for="(item, idx) in items" :key="idx">
				<div class="msg-item-wrap">
					<div class="image-box">
						<div class="image" :type="item.id"></div>
					</div>
					<div class="intro-box">
						<div class="title-box">
							<div class="msg-label">{{item.label}}</div>
							<div class="desc">{{item.description}}</div>
						</div>
						<div class="content-box">
							<div class="title">{{item.title}}</div>
							<div class="content">
								<span v-html="item.content"></span>
								<ol v-if="item.contentList && item.contentList.length > 0">
									<li v-for="(listItem, idx) in item.contentList" :key="idx" >
										{{listItem}}
									</li>
								</ol>
							</div>
						</div>
					</div>
				</div>
				<div v-if="(idx != items.length -1)" class="h-bar"></div>
			</div>
		</div>
	</div>

</template>

<script>
import creator from '@/data/Guide.Creator.js'
export default {
	name: "Guide-Creator",
	components: {
	},
	props: {
	},
	beforeMount () {
		console.log("[Guide.Creator.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[Guide.Creator.vue] mounted(), route : ", this.$route)
	},
	beforeUpdate () {
		console.log("[Guide.Creator.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[Guide.Creator.vue] updated(), route : ", this.$route)
	},
	data () {
		var currLang = this.$route.params.lang;
		if(!currLang) currLang = 'en';
		return {
			abc:1,
			items: creator[currLang]
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
.Creator {
	.msg-box{
		width: gREm(948);
		height: auto;
		padding-top:gREm(130);
		padding-bottom:gREm(130 - 50);
		.msg-item{
			.msg-item-wrap{
				width:100%;
				height: gREm(300);
				@include FLEX(space-between , flex-start);
				.image-box{
					.image{
						width:gREm(220);
						height: gREm(220);
						&[type="space-maker"]{
							@include SetBgImage(url('../assets/img/guide/img-space-maker.png'));
						}
						&[type="virtual-creator"]{
							@include SetBgImage(url('../assets/img/guide/img-virtual.png'));
						}
						&[type="dicker"]{
							@include SetBgImage(url('../assets/img/guide/img-introduction.png'));
						}

						//
						//
					}
				}
				.intro-box{
					padding-right: gREm(60);
					.title-box{
						.msg-label{
							width:gREm(163);
							height: gREm(32);
							@include Set-Font($AppFont, gREm(26), gREm(32), #201360);
						}
						.desc{
							width: auto;
							height: auto;
							margin-top:gREm(15);
							@include Set-Font($AppFont, gREm(16), gREm(28), #6a6a6a,300);
						}
					}
					.content-box{
						margin-top:gREm(60);
						.title{
							width:auto;
							height: gREm(32);
							@include Set-Font($AppFont, gREm(26), gREm(32), #201360);
						}
						.content{
							width: auto;
							height: auto;
							margin-top:gREm(15);
							span {
								@include Set-Font($AppFont, gREm(16), gREm(28), #6a6a6a,300);
							}
							ol {
								padding-left: 20px;
								li {
									list-style: auto;
									padding-left: 10px;
									@include Set-Font($AppFont, gREm(16), gREm(28), #6a6a6a,300);
								}
							}
						}
					}
				}
			}
			.h-bar{
				width: gREm(948);
				height: gREm(1);
				margin-bottom:gREm(50);
				margin-top:gREm(50);
				background-color: #dedede;
			}
		}
	}
}

@include media-max($media_medium) { // 1024
.Creator {
	.msg-box{
		padding-left: 0px;
		width: 90vw;
		left:50%; transform: translateX(-50%);
		.msg-item {
			.msg-item-wrap {
				height: auto;
				.image-box {
					.image {
						width: gREm(200);
						height: gREm(200);
					}
				}
				.intro-box{
					padding-right: 0px;
					padding-left: 0px;
					width: calc(100% - 200px - 60px);
					.title-box{
						.msg-label{
							width:auto;
							height: auto;
							font-size: gREm(24);
							line-height: gREm(30);
							white-space: normal;
						}
						.desc{
							width: auto;
							height: auto;
							white-space: normal;
						}
					}
					.content-box{
						margin-top:gREm(60);
						.title{
							width:auto;
							height: auto;
							font-size: gREm(24);
							line-height: gREm(30);
							white-space: normal;
						}
						.content{
							span {
								white-space: normal;
							}
							ol {
								li {
									white-space: normal;
								}
							}
						}
					}
				}
			}
			.h-bar{
				width: 100%;
			}
		}
	}
}}

@include media-max($media_small) {
.Creator {
		.msg-box{
		width: 100vw;
		padding-left: 0px;
		width: 80vw;
		left:50%; transform: translateX(-50%);
		.msg-item {
			.msg-item-wrap {
				height: auto;
				@include FLEXV(flex-start, flex-start);
				.image-box {
					.image {
						width: gREm(200);
						height: gREm(200);
					}
				}
				.intro-box{
					padding-right: 0px;
					padding-left: 0px;
					width: 100%;
					margin-top: gREm(60);
				}
			}
			.h-bar{
				width: 100%;
			}
		}
	}
}}

</style>
