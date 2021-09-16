<template>
	<div class="Guide">
		<div class="msg-box">
			<div class="msg-item" v-for="(item, idx) in items">
				<div class="msg-item-wrap">
					<div class="msg-label">{{item.label}}</div>
					<div class="msg-info-box">
						<div class="title">{{item.title}}</div>
						<div class="desc">
							<span v-html="item.description"></span>
							<ol v-if="item.descList && item.descList.length > 0">
								<li v-for="(listItem, idx) in item.descList" :key="idx" >
									{{listItem}}
								</li>
							</ol>
						</div>
					</div>
				</div>
				<div v-if="(idx != items.length -1)" class="h-bar"></div>
			</div>
		</div>

	</div>
</template>

<script>

import guideContent from '@/data/Guide.Guide.Content.js'

export default {
	name: "Guide-Guide",
	components: {
	},
	props: {
	},
	beforeMount () {
		console.log("[Guide.Guide.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[Guide.Guide.vue] mounted(), route : ", this.$route)
	},
	beforeUpdate () {
		console.log("[Guide.Guide.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[Guide.Guide.vue] updated(), route : ", this.$route)
	},
	data () {
		var currLang = this.$route.params.lang;
		if(!currLang) currLang = 'en';
		return {
			items: guideContent[currLang]
		}
	},
	computed: {

	},
	methods : {
	}
}

</script>

<style lang="scss" scoped>
.Guide {
	margin-top: gREm(130 - 50);
	margin-bottom: gREm(130);
	height: auto;
	width: gREm(948);

	& * {
		color: black;
	}

	.msg-box {
		padding-left:gREm(32);
		height: auto;
		width: 100%;
		.msg-item {
			.msg-item-wrap{
				height: auto;
				@include FLEX(flex-start, flex-start);
				.msg-label {
					width: gREm(205);
					height: gREm(39);
					@include Set-Font($AppFont, gREm(32), gREm(39), #17141a, 600);
				}
				.msg-info-box{
					padding-left: gREm(160);
					.title{
						width:auto;
						height: gREm(32);
						@include Set-Font($AppFont, gREm(26), gREm(32), #201360);
					}
					.desc{
						width: auto;
						height: auto;
						margin-top:gREm(15);
						span {
							@include Set-Font($AppFont, gREm(16), gREm(28), #6a6a6a,300);
						}
						ol {
							padding-left: gREm(20);
							li {
								list-style: auto;
								padding-left: gREm(10);
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
			margin-top:gREm(50);
			margin-bottom:gREm(50);
			background-color: #dedede;
		}
	}
}


@include media-max($media_medium) { // 1024
.Guide {

	width: 100vw;

	.msg-box {
		padding-left: 0px;
		width: 90vw;
		left:50%; transform: translateX(-50%);
		.msg-item {
			.msg-item-wrap{
				.msg-label {
					width: gREm(250);
					font-size:gREm(30);
				}
				.msg-info-box{
					padding-left: gREm(30);
					.title{
						height: auto;
						font-size: gREm(24);
						line-height: gREm(30);
						white-space: normal;
					}
					.desc{
						span {
							font-size: gREm(14);
							line-height: gREm(26);
							white-space: normal;
						}
						ol {
							li {
								font-size: gREm(14);
								line-height: gREm(26);
								white-space: normal;
							}
						}
					}
				}
			}
		}
		.h-bar{
			width: 100%;
			margin-top:gREm(45);
			margin-bottom:gREm(45);
		}
	}
}}

@include media-max($media_small) {
.Guide {

	.msg-box {
		padding-left: 0px;
		width: 80vw;
		left:50%; transform: translateX(-50%);
		.msg-item {
			.msg-item-wrap{

				@include FLEXV(flex-start, flex-start);

				.msg-label {
					width: auto;
				}
				.msg-info-box{
					margin-top: gREm(20);
					padding-left: gREm(0);
				}
			}
		}
	}

}}

</style>
