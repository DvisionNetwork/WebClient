<template>
	<div class="News-Detail">

		<div class="title-box">
				<div class="title-wrap">
					<div class="title" v-html="getTitleDesc"></div>
					<div class="sub-title" v-html="getsubTitleDesc"></div>
				</div>
		</div>

		<div class="content-body-wrap">
			<div class="content-box-wrap">
				<!-- <pre style="color:red"> {{ newsItem }} </pre> -->
				<div v-if="newsItem && newsItem.id" class="content-box">
					<div class="content">
						<div class="date" > {{getCreateTime(newsItem.createtime)}} </div>
						<div class="title">{{newsItem.title}}</div>
						<div class="img" :style="mxGetBgImageStyle(newsItem.thumbnail)"
							@click="onClickItem()"
							:clickable="newsItem.ext_link ? 'on' : 'off' "
						></div>
						<div class="detail" v-html="mxGetVHtml(newsItem.detail)"></div>
					</div>

					<div class="icon-box-wrap">
						<div class="icon-box">
							<div class="back-icon"></div>
							<div class="back-text" @click="goToList()">Go to list</div>
						</div>
					</div>
				</div>
			</div>
			<div class=""></div>
		</div>

	</div>

	<FOOT :theme="'white'" />

</template>

<script>

import { gConfig } from '@/App.Config'

import FOOT from '@/components/FOOT.vue'

export default {
	name: "News-Detail",
	components: {
		FOOT,
	},
	props: {
		itemId: {
			type: String,
			default: '',
		},
	},
	beforeMount () {
		//console.log("[News.Detail.vue] beforeMout(), route : ", this.$route)
		this.mxSetNewsItem({});	 // 빈 뉴스
	},
	mounted () {
		console.log("[News-Detail.vue] mounted(), route : ", this.$route)
		this.callNewsItem();
	},
	beforeUpdate () {
		console.log("[News.Detail.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[News.Detail.vue] updated(), route : ", this.$route)
	},
	data () {
		return{

		}
	},
	computed: {
		getTitleDesc() { return this.$t('news.title'); },
		getsubTitleDesc() { return this.$t('news.sub-title'); },
		newsItem(){
			console.log("[News-Detail] mxGetNewsItem:",this.mxGetNewsItem())
			return this.mxGetNewsItem();
		},
	},
	methods : {
		getCreateTime(str) {
			return _U.getCreateTime(str);
		},
		onClickItem() {
			var extLink = this.newsItem.ext_link;
			if(extLink) {
				window.open(extLink);
			}
		},
		callNewsItem() {

			var data = {
				id: this.itemId,
			};

			this.mxShowLoading();

			_U.callPost({
				url:gConfig.news_get_item,
				data: data,
				callback: (resp) =>{

					this.mxCloseLoading();

					console.log("[News-Detail] callNewsItem()-> resp ", resp);
					var data = _U.getIfDefined(resp,'data');
					if(!(data && data.length > 0)) {
						console.log("[News-Detail] No Data:: callNewsItem()-> resp ================ ", resp);
						this.mxSetNewsItem({});	 // 빈 뉴스
						return;
					}
					this.mxSetNewsItem(resp.data[0]);
				}
			});
		},
		goToList() {
			this.$router.go(-1);
		}
	}

 }

</script>

<style lang="scss" scoped>
.News-Detail {
	@include FLEXV(flex-start, center);
	width: 100%;
	height: auto;

	min-height: calc(100vh - 176px); // Foot 176px
	background-color: white;

	.title-box {
		@include FLEXV(flex-start, center);
		width: 100%;
		height: gREm(370);
		background-image: linear-gradient(to bottom, #6c38ef, #6c38ef);
		.title-wrap{
			@include FLEXV(center, center);
			width:auto;
			height: gREm(95);
			margin-top:gREm(215);
			.title {
				height: auto;
				width: gREm(322);
				@include Set-Font($AppFont, gREm(34), gREm(52), #ffffff,600);
				text-align: center;
			}
			.sub-title{
				height: auto;
				width: auto;
				@include Set-Font($AppFont, gREm(34), gREm(52), #ffffff);
				text-align: center;
			}
		}

	}
	.content-body-wrap {
		@include FLEXV(center, center);
		width: 100%;
		height: auto;
		background-color: white;
		// height: gW(600);
		.content-box-wrap{
			width: gREm(768);
			height: auto;
			margin-top: gREm(156);
			margin-bottom: gREm(132);
			// margin-bottom:gREm(145);
			.content-box {
				@include FLEXV(center,center);
				.content{
					@include FLEXV(flex-start, flex-start);
					.date{
						width:gREm(79);
						height: gREm(18);
						@include Set-Font($AppFont, gREm(14), gREm(18), #6a6a6a,300);
					}
					.title{
						width: 100%;
						height: auto;
						margin-top: gREm(12);
						@include Set-Font($AppFont, gREm(34), gREm(42), #000000,600);
						word-wrap: break-word;
						white-space: pre-wrap;
					}
					.img{
						width:gREm(768);
						height: gREm(432);
						margin-top:gREm(50);
						&[clickable="on"] {
							cursor: pointer;
						}
					}
					.detail{
						width: auto;
						height: auto;
						margin-top:gREm(20);
						@include Set-Font($AppFont, gREm(14), gREm(24), #6a6a6a,300);
						white-space: normal;
					}
				}
				.icon-box-wrap{
					.icon-box{
						margin-top:gREm(106);
						@include FLEX(flex-start,center);
						cursor: pointer;
						&:hover{
							.back-icon{	width: gREm(25); height: gREm(8); @include SetBgImage(url('../assets/img/ic-news-back-h.svg'));}
							.back-text{color: #18a7f8;}
						}
						.back-icon{
							width: gREm(25);
							height: gREm(8);
							@include SetBgImage(url('../assets/img/ic-news-back-n.svg'));

						}
						.back-text{
							width:gREm(65);
							height: gREm(19);
							margin-left: gREm(15);
							text-align: center;
							@include FLEX(center,center);
							@include Set-Font($AppFont, gREm(15), gREm(26), #17141a,300);
						}
					}
				}
			}
		}
	}
}

</style>
