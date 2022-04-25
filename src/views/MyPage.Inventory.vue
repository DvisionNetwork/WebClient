<template>
	<div class="Inventory">
		<div class="content-box">
			<div class="side-menu">
				<SideMenu
					v-if="!isMobile"
					:sideMenu="assetMenu"
					@selection-changed="onChangeSideMenu"
				/>
			</div>
			<div class="contents">
				<div class="item-box">
					<div class="items"
						v-if="myItems && myItems.list && myItems.list.length > 0"
					>
						<Product v-for="(item, idx) in myItems.list"
							:key="item.id" :product="item"
							:callFrom="'mypage'"
							@click-item="onClickItem"
						/>
					</div>
					<div v-else>
					</div>
					<div class="page-box">
						<div class="page-wrap" v-if="pages && pages.length > 1">
							<div class="arrow-left"
								:active="(firstPageGroup ? 'off' : 'on')"
								@click="onClickPageArrow('left')"
							>
								<div class="icon"></div>
							</div>
							<div class="page"
								v-for="(page,idx) in pages"
								:key="page"
								:active="(currentPage == page ? 'on' : 'off')"
								@click="onClickPage(page)"
							>
								{{page}}
							</div>
							<div class="arrow-right"
								:active="(lastPageGroup ? 'off' : 'on')"
								@click="onClickPageArrow('right')"
							>
								<div class="icon"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="filter" v-if="isMobile">
			<div class="img-wrapper">
				<img src="../assets/img/Filter.svg" alt="filter" @click="openInfoModal">
			</div>
		</div>
	</div>
</template>

<script>

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();

import SideMenu from '@/components/SideMenu.vue'
import Product from '@/components/Product.vue'


export default {
	name: "Inventory",
	components: {
		SideMenu,
		Product
	},
	props: {
		param1: {
			type: String,
			default: '',
		},
	},
	beforeMount () {
		console.log("[Inventory.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[Inventory.vue] mounted(), route : ", this.$route)
		if(this.$route.name!=='Market-Detail') {
			this.setMyItemQuery(1);
			this.callMyItems(this.myItemQuery);
		}
		this.isMobile = this.checkMobile();
	},
	beforeUpdate () {
		console.log("[Inventory.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[Inventory.vue] updated(), route : ", this.$route)
	},
	data () {
		return {
			assetMenu: gConfig.assetMenu,

			currentOrder: {name: 'newest', idx: 0},
			orderList: [
				{name: 'newest', idx: 0},
				{name: 'oldest' , idx: 1},
				{name: 'lower-price', idx: 4},
				{name: 'highest-price', idx: 5},
				{name: 'least-amount', idx:2},
				{name: 'highest-amount', idx: 3},
			],

			pages: [1],
			currentPage: 1,
			firstPageGroup: true,
			lastPageGroup: true,

			category_1: 0,
			category_2: 0,
			filters: '',
			isMobile: false,
		}
	},
	computed: {
		myItems() {
			// console.log("[MyPage.Inventory] computed, myItems ", this.mxGetMyItems());
			return this.mxGetMyItems();
		},
		myItemQuery() {
			return this.mxGetMyItemQuery();
		}
	},
	watch: {
		myItems(newVal, oldVal) {
			console.log("======================= myItems ", newVal, oldVal);
			this.setPages()
		},
		myItemQuery(newVal, oldVal) {
			this.callMyItems(newVal);
		},
		'$store.state.dataClickedInfoModal': function () {
			this.onChangeSideMenu();
			this.mxCloseInfoModal();
		},
	},
	methods : {

		onClickItem(item) {
			console.log("======= onClickItem :: itemInfo", item.id);

			if(item.name == 'ATTENDANCE TICKET') {
				this.mxShowToast('After opening the Dvision Meta-City, you can exchange the tickets for various items.');
				return;
			}

			this.mxSetMarketItem(item);
			this.$router.push({name:"Market-Detail", 
				params:{
					'tab_page': 'mypage',
					'itemId': item.id
				}
			});
		},

		getCtIdxes() {
			var sm = this.assetMenu;
			var ct_idx1=0;
			var ct_idx2=0;
			var found = false;
			for(var i=0; i<sm.length; i++) {
				var menu1 = sm[i];
				if(menu1.child && menu1.child.length > 0) {
					for(var j=0; j<menu1.child.length; j++) {
						var menu2 = menu1.child[j];
						// console.log("===== menu2 idx:",menu2.ct_idx, menu2.active)
						ct_idx1 = menu2.ct_idx;
						if(menu2.child && menu2.child.length > 0) {
							for(var k=0; k<menu2.child.length; k++) {
								var menu3 = menu2.child[k];
								// console.log("=====     menu3 idx:",menu3.ct_idx, menu3.active)
								if(menu3.active == true) {
									ct_idx2 = menu3.ct_idx;
									found = true;
									break;
								}
								// console.log("===== ct_idx2",ct_idx2)
							}
						}
						if(found) break;
					}
				}
				if(found) break;
			}
			return {idx1: ct_idx1, idx2: ct_idx2};
		},
		getFilters() {
			var sm = this.assetMenu;
			var filters = {};
			for(var i=0; i<sm.length; i++) {
				var menu1 = sm[i];
				if(menu1.name=='filter') {
					if(menu1.child && menu1.child.length > 0) {
						for(var j=0; j<menu1.child.length; j++) {
							var menu2 = menu1.child[j];
							if(menu2.active==true) {
								filters[menu2.name] = true;
							}
							// else {
							// 	filters[menu2.name] = false;
							// }
						}
					}
				}else if(menu1.name == 'level') {
					var level = [];
					if(menu1.child && menu1.child.length > 0) {
						for(var j=0; j<menu1.child.length; j++) {
							var menu2 = menu1.child[j];
							if(menu2.active==true) {
								level.push(menu2.name);
							}
						}
					}
					filters["rarity"] = level;
				}
			}
			return filters;
		},
		onChangeSideMenu() {

			console.log("[MyPage.Inventory.vue] ===  onChangeSideMenu(): --> check active==true on assetMenu --> change content-box.content, assetMenu :", this.assetMenu);
			var sm = this.assetMenu;

			var ctIdxes = {idx1: 0, idx2: 0};;
			if(sm[0].all!=='on') {
				ctIdxes = this.getCtIdxes();
			}
			var filters = this.getFilters();

			// 같으면 return
			if(	this.category_1 == ctIdxes.idx1 &&
				this.category_2 == ctIdxes.idx2 &&
				this.filter == JSON.stringify(filters)
			){
				console.log("[Market.vue] === slip search :: onChangeSideMenu() same:", ctIdxes.idx1, ctIdxes.idx2, filters);
				return;
			}

			this.category_1 = ctIdxes.idx1;
			this.category_2 = ctIdxes.idx2;
			this.filters=JSON.stringify(filters);

			console.log("[Market.vue] ===  onChangeSideMenu(): --> ct1/2", ctIdxes.idx1, ctIdxes.idx2, this.filters);

			this.setMyItemQuery(1);

		},

		setMyItemQuery(page) {
			if(!page || page == 0) page =1;

			var data = {
				page: page,
				count: gConfig.myItem_count_per_page,
				sort: this.currentOrder.idx,
				network: '("'+ gConfig.wlt.getBscAddr().Network + '","' +  gConfig.wlt.getAddr().Network + '")',
				category_1: this.category_1,
				category_2: this.category_2,
				for_sale: false,
				// TODO: Bug Fix needed
				owner: _U.getIfDefined(this.$store.state,['userInfo','wallet_addr']),
				filter: this.filters
			};

			this.mxSetMyItemQuery(data);

		},

		setPages() {

			var pno_p_grp = gConfig.marketItem_pages_in_group; // 하단에 뿌릴 page group내 page 수
			var pgrStartPageNo = Math.floor((this.myItems.page -1) / pno_p_grp)*pno_p_grp +1;

			var totalPages = Math.ceil(this.myItems.total/this.myItems.cpp);
			this.pages = []; // 초기화 해 줄 것.
			for(var i=0; i< pno_p_grp && (i + pgrStartPageNo) <= totalPages; i++) {
				this.pages[i] = i + pgrStartPageNo;
			}

			this.currentPage = this.myItems.page;
			this.firstPageGroup= pgrStartPageNo < pno_p_grp ? true: false;
			this.lastPageGroup = this.currentPage + pno_p_grp > totalPages ? true : false;
		},

		onClickPage(page) {
			this.setMyItemQuery(page);
		},		

		onClickPageArrow(leftRight) {

			var pno_p_grp = gConfig.marketItem_pages_in_group; // 하단에 뿌릴 page group내 page 수
			var pgrStartPageNo = Math.floor((this.myItems.page -1) / pno_p_grp)*pno_p_grp +1;
			var page = 1;
			if(leftRight == 'right') {
				page = pgrStartPageNo + pno_p_grp;
			}else if(leftRight == 'left'){
				page = pgrStartPageNo - pno_p_grp;
			}

			var totalPages = Math.ceil(this.myItems.total/this.myItems.cpp);
			if(page < 1) page = 1;
			if(page > totalPages) page = totalPages;

			// console.log("[MyPage.Inventory.vue] >>>>>>> onClickPageArrow("+leftRight+")", page, pgrStartPageNo,totalPages)

			this.setMyItemQuery(page);
		},

		callMyItems(query) {

			console.log("[MyPage.Inventory] callMyItems() query:", query);

			this.mxShowLoading();
			_U.callPost({
				url:gConfig.market_item_list_with_owner,
				data: query,
				callback: (resp) =>{
					console.log("[MyPage.Inventory] callMyItems()-> resp ", resp);
					var rows = _U.getIfDefined(resp,['data','rows']);
					var total = _U.getIfDefined(resp,['data','total']);
					if(!rows && rows.length > 0) {
						console.log("[MyPage.Inventory] No Data:: callMyItems()-> resp mxSetMyItemss ================ ", rows);
						this.mxCloseLoading();
						this.mxSetMyItems({total:0, page:0, cpp: 0, list:[]});	 // 빈 뉴스
						return;
					}
					this.mxSetMyItems({total:total,  page:query.page, cpp: query.count,  list:rows});
					this.mxCloseLoading();
				}
			});
		},
		checkMobile() {
			return window.matchMedia('(max-width: 768px)').matches;
		},
		openInfoModal() {
			const obj = {
				title: 'Filter',
				component: SideMenu,
				dataComponent: this.assetMenu,
				isShow: true,
			}
			this.mxShowInfoModal(obj);
		},
	}
}

</script>

<style lang="scss" scoped>
.Inventory {
	width:100%;
	.content-box {

		@include FLEX(flex-start, flex-start);
		margin-top: gREm(77);
		width: 100%;
		height: auto;

		.side-menu {
			width: gREm(216);
			height: auto;
			min-width: gREm(216);
		}
		.contents {
			padding-left: gREm(82);
			width: 100%;
			@include FLEXV(space-between, flex-start);

			.content-menu-box {
				@include FLEX(space-between, center);
				width: 100%;
				height: gREm(19);
				padding-right: gREm(40);
				.search-box {
					@include FLEX(flex-start, center);
					height: 100%;
					width: gREm(330);
					.icon {
						width: gREm(20);
						height: gREm(18);
						@include SetBgImage(url('../assets/img/ic-search-market.svg'));
					}
					.text-input {
						margin-left: gREm(12);
						height: gREm(19);
						width: 100%;
						opacity: 0.4;
						@include Set-Font($AppFont, gREm(15), gREm(19), #ffffff);
						&:focus {
							opacity: 1;
						}
					}

				}
				.order-by-box {
					@include FLEX(flex-end, center);
					height: 100%;
					width: gREm(200);
					padding-right: gREm(11);
					cursor: pointer;
					.order {
						width:100%;
						text-align: right;
						@include Set-Font($AppFont, gREm(15), gREm(19), #f6583e);
					}
					.icon {
						width: gREm(8);
						height: gREm(5);
						margin-left: gREm(7);
						@include SetBgImage(url('../assets/img/ic-arrow-sortby.svg'));
					}
					&[active="on"] {
						.icon {
							transform: rotateX(180deg);
						}
					}
				}
				.order-popup-box-wrap {
					position: absolute;
					z-index:$Z-INDEX-MENU-POPUP;
					@include FLEXV(flex-end,center);
					top: gREm(0); left: gREm(-30);
					width: gREm(220);
					height: gREm(254 + 12 + 19);
					padding-top: gREm( 12 + 19);

					.order-popup-box {
						@include FLEXV(flex-start,center);
						top: 0; left: 0; width: 100%; height: gREm(254);
						padding-top: gREm(16);
						padding-bottom: gREm(16);
						border-radius: gREm(10);
						background-color: #ffffff;
						.order-item {
							@include FLEX(flex-start,center);
							width: 100%;
							padding-left: gREm(40);
							padding-right: gREm(40);
							height: gREm(37);
							@include Set-Font($AppFont, gREm(15), gREm(30), #6a6a6a);
							background-color: #ffffff;
							cursor: pointer;
							&:hover {
								color: #6c38ef;
								background-color: #f1f1f1;

							}
						}
					}
				}
			}

			.item-box {
				width: 100%;
				height: auto; // gREm(395 + 1365 + 44);
				@include FLEXV(space-between, flex-start);
				.items {
					@include FLEX(flex-start, flex-start);
					flex-wrap: wrap;
					width: 100%;
					height: auto; // gREm(395 + 1365 + 44 - 100 - 44);
				}
				.page-box {
					@include FLEX(center, flex-start);
					height: gREm(44);
					width: 100%;
					margin-top: gREm(100);
					margin-bottom: gREm(132);
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
							@include OnOverTransition();
							width: gREm(44);
							cursor: pointer;
							background-color: transparent;
							border-radius: 50%;
							@include Set-Font($AppFont, gREm(15), gREm(19), #ffffff);
							&[active="on"] {
								background-color: #f7f7f7;
								color: #201360;
								@include OnOverTransition-Off();
							}
						}

						.arrow-left {
						@include OnOverTransitionX-L();
						&[active="off"] {
							visibility: hidden;
							z-index: -1;
							}
						}
						.arrow-right {
							@include OnOverTransitionX-R();
							&[active="off"] {
								visibility: hidden;
								z-index: -1;
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

}


@include media-max($media_large) { // 1200

.Market .content-body-wrap {
	@include FLEXV(flex-start, center);
	width: gREm(1200 - 200) ;

}}

@include media-max($media_medium) { // 1024

.Market .content-body-wrap {
	@include FLEXV(flex-start, center);
	width: gREm(700) ;
	.content-box .contents .content-menu-box {
		.search-box {
			width: gREm(130);
		}
		.order-by-box {
			width: gREm(130);
		}
	}
}}

@include media-max($media_small) { // 768
	.Inventory {
		.content-box {
			margin-top: 0px;

			.side-menu {
				min-width: 0px;
				width: 0px;
			}
			
			.contents {
				padding-left: 0px;

				.item-box {
					.items {
						justify-content: center;
						.product-card {
							margin-right: 0px;
						}
					}
				}
			}
		}
		
		.filter {
			width: 100%;
			height: gREm(80);
	
			.img-wrapper {
				position: absolute;
				z-index: 11;
				background: #2A2932;
				border-radius: 50%;
				right: gREm(20);
				padding: gREm(22);
				bottom: -100%;
				box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.28);
			}
		}
	}
}
</style>
