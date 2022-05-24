<template>

	<div class="News">

		<div class="title-box">
				<div class="title-wrap">
					<div class="title" v-html="getTitleDesc"></div>
					<div class="sub-title" v-html="getsubTitleDesc"></div>
				</div>
		</div>

			<div class="content-body-wrap">
			<div class="msg-box">
				<div class="msg-item" v-for="(item, idx) in newsInfo.list"
					:key="idx"
					:callFrom="'news'"
					@click="onClickList(item)"
				>
					<div class="msg-img">
						<!-- //<img class="img" :src="item.imgUrl"> -->
						<div class="img-box" :style="mxGetBgImageStyle(item.thumbnail)"></div>
					</div>
					<div class="msg-info-box">
						<div class="noti-type">{{$t('news.categoryname-'+item.category)}}</div>
						<div class="title">{{item.title}}</div>
						<div class="detail" v-html="mxGetVHtml(item.detail)"></div>
						<div class="foot-box" >
							<div class="date" > {{getCreateTime(item.createtime)}} </div>
						</div>
					</div>
				</div>
				<div class="page-box">
					<div class="page-wrap" v-if="pages && pages.length > 1">
						<div v-if="!firstPageGroup" class="arrow-left"></div>
						<div class="page"
							v-for="(page) in pages"
							:key="page"
							:active="(currentPage == page ? 'on' : 'off')"
							@click="onClickPage(page)"
						>
							{{page}}
						</div>
						<div v-if="!lastPageGroup" class="arrow-right">
							<div class="icon"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<FOOT :theme="'white'" />

</template>

<script>

import { gConfig } from '@/App.Config'

import FOOT from '@/components/FOOT.vue'

export default {
	name: "News",
	components: {
		FOOT,
	},
	props: {
		page: {
			type: String,
			default: '',
		},
	},
	beforeRouteLeave (to, from, next) {
		// console.log("----- beforeRouteLeave :: ", to, from);
		if(to.name!=='News-Detail') {
			this.mxSetNews({total:0, page:0, cpp: 0, list:[]});	 // 빈 뉴스
		}
		next();
	},
	beforeMount () {
		console.log("[News.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[News.vue] mounted(), route : ", this.$route)
		if(this.newsInfo && this.newsInfo.page ) {
			this.setPages();
		}else{
			this.callNewsItems(1);
		}
	},
	beforeUpdate () {
		console.log("[News.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[News.vue] updated(), route : ", this.$route)
	},
	data () {
		var currLang = this.$route.params.lang;
		if(!currLang) currLang = 'en';
		return {

			pages: [1],
			currentPage: 1,
			firstPageGroup: true,
			lastPageGroup: false,
		}
	},
	computed: {
		getTitleDesc() { return this.$t('news.title'); },
		getsubTitleDesc() { return this.$t('news.sub-title'); },
		newsInfo() {
			return this.mxGetNews();
		},
	},
	watch: {
		newsInfo(newVal, oldVal) {
			console.log("======================= newsInfo ", newVal, oldVal);
			this.setPages();
		}
	},
	methods : {
		getDesc(item) {
			return item.detail
		},

		setPages() {

			var pno_p_grp = gConfig.news_pages_in_group; // 하단에 뿌릴 page group내 page 수
			var pgrStartPageNo = 1;

			var totalPages = Math.ceil(this.newsInfo.total/this.newsInfo.cpp);
			for(var i=0; i< totalPages; i++) {
				this.pages[i] = i + pgrStartPageNo;
			}

			this.currentPage = this.newsInfo.page;
			this.firstPageGroup= true;
			this.lastPageGroup = true;

		},

		callNewsItems(page){

			if(!page || page == 0) page =1;

			var data = {
				type : 3, // 0: All, 1: footer, 2: popuup, 3: others
				page: page,
				count: _U.getIfDefined(this.newsInfo,'cpp') > 0 ? this.newsInfo.cpp : gConfig.news_count_per_page
			};

			this.mxShowLoading();

			_U.callPost({
				url:gConfig.news_get_list,
				data: data,
				callback: (resp) =>{

					this.mxCloseLoading();

					console.log("[News] getNextItem()-> resp ", resp);
					var rows = _U.getIfDefined(resp,['data','rows']);
					var total = _U.getIfDefined(resp,['data','total']);
					if(!(rows && rows.length > 0)) {
						console.log("[News] No Data:: getNextItem()-> resp mxSetNews ================ ", rows);
						this.mxSetNews({total:0, page:0, cpp: 0, list:[]});	 // 빈 뉴스
						return;
					}
					var list = rows;
					this.mxSetNews({total:total,  page:data.page, cpp: data.count,  list: list});
				}
			});
		},
		onClickPage(page) {
			this.callNewsItems(page);
		},

		onClickList(newsInfo){
			console.log("======= onClickNews :: newsInfo",newsInfo.id);
			this.$router.push({name:"News-Detail", params:{'itemId': newsInfo.id}});
		},

		getCreateTime(str) {
			return _U.getCreateTime(str);
		}
	}
}

</script>

<style lang="scss" scoped>
.News {
	@include FLEXV(flex-start, center);
	width: 100%;
	height: auto;
	background-color: white;

	min-height: calc(100vh - 176px); // Foot 176px

	& * {
		color: black;
	}

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

		@include FLEXV(flex-start, center);
		width: auto;
		height: auto;
		padding-bottom: gREm(132);

		.msg-box {
			height: auto;
			width: 100%;
			margin-top: gREm(145 - 60);
			// margin-bottom:gREm(145);
			.msg-item {
				height: gREm(200);
				margin-top: gREm(60);
				@include FLEX(flex-start, center);
				cursor: pointer;
				.msg-img{
					.img-box{
						width:gREm(315);
						height: gREm(180);
						border-radius: gREm(12);
					}
				}
				.msg-info-box{
					width: auto;
					height: auto;
					margin-left:gREm(40);

					.noti-type{
						width: gREm(59);
						height: gREm(19);
						@include Set-Font($AppFont, gREm(16), gREm(19), #f6583e,500);
						text-align: left;
					}
					.title{
						width:gREm(905);
						height: gREm(42);
						@include Set-Font($AppFont, gREm(34), gREm(42), #000000,600);
						margin-top:gREm(12);
						text-align: left;
						@include Multiline-Dotted-Text(1);
					}
					.detail{
						width: gREm(905);
						height: auto;
						margin-top:gREm(8);
						@include Set-Font($AppFont, gREm(14), gREm(24), #6a6a6a,300);
						white-space: normal;
						@include Multiline-Dotted-Text(2);

					}
					.foot-box{
						@include FLEX(flex-start, center);
						// .writer{
						// 	width:gREm(39);
						// 	height: gREm(18);
						// 	@include Set-Font($AppFont, gREm(14), gREm(18), #6a6a6a,300);

						// }
						// .slash{
						// 	width: gREm(5);
						// 	height: gREm(18);
						// 	margin-left:gREm(12);
						// 	margin-right:gREm(12);
						// 	@include Set-Font($AppFont, gREm(14), gREm(18), #6a6a6a,300);
						// }
						.date{
							margin-top: gREm(15) ;
							width:gREm(79);
							height: gREm(18);
							@include Set-Font($AppFont, gREm(14), gREm(18), #6a6a6a,300);
						}
					}
				}
				.msg-label {
					color: black;
				}
			}

			.page-box {
				@include FLEX(center, flex-start);
				height: gREm(44);
				width: 100%;
				margin-top: gREm(100);
				// margin-bottom: gREm(132);
				.page-wrap {
					@include FLEX(center, center);
					height: gREm(44);
					width: gREm(600);
					.arrow-left, .arrow-right, .page {
						@include FLEX(center, center);
						width: gREm(40);
						height: gREm(44);
						.icon {
							width: gREm(6);
							height: gREm(12);
						}
					}
					.page {
						width: gREm(44);
						cursor: pointer;
						background-color: transparent;
						border-radius: 50%;
						@include Set-Font($AppFont, gREm(15), gREm(19), #b5b5b5);
						&[active="on"] {
							color: #000000;
						}
						&:hover {
							background-color: #f7f7f7;
							color: #201360;
						}
					}

					.arrow-left .icon {
						@include SetBgImage(url('../assets/img/ic-arrow-page-l.svg'));
					};
					.arrow-right .icon {
						@include SetBgImage(url('../assets/img/ic-arrow-page-r.svg'));
					};
				}
			}
		}
	}

}

@include media-max($media_large) { // 1200

.News .content-body-wrap {
	@include FLEXV(flex-start, center);
	width: gREm(1200 - 200) ;
	.msg-box .msg-item .msg-info-box {
		.title {
			width: gREm(1200 - 315 - 40 - 200)
		}
		.detail {
			width: gREm(1200 - 315 - 40 - 200)
		}
	}

}}

@include media-max($media_medium) { // 1024

.News .content-body-wrap {
	@include FLEXV(flex-start, center);
	width: gREm(700) ;
	.msg-box .msg-item .msg-info-box {
		.title {
			width: gREm(700 - 315 - 40 )
		}
		.detail {
			width: gREm(700 - 315 - 40 )
		}
	}
}}

@include media-max($media_small) { // 720
.News {
	.title-box {
		.title-wrap{
			.title {
				@include Set-Font($AppFont, gREm(30), gREm(52), #ffffff,600);
			}
			.sub-title{
				@include Set-Font($AppFont, gREm(26), gREm(52), #ffffff);
			}
		}

	}
}
.News .content-body-wrap {
	@include FLEXV(flex-start, center);
	width: 90vw ;
	.msg-box {
		.msg-item {
			height: auto;
			@include FLEXV(flex-start, center);
		}
	}
	.msg-box .msg-item .msg-info-box {
		margin-top: 20px;
		margin-left: 9px;
		.title {
			width: 80vw;
		}
		.detail {
			width: 80vw;
		}
	}
}}


</style>
