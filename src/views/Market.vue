<template>
	<div v-if="$route.name == 'Market-Detail' && hasMarketItem() == true " class="MarketDetail">
		<MarketDetail />
	</div>

	<div v-else class="Market">
		<div class="title-box">
			<div class="title">{{$t('market.title')}}</div>
			<div class="title-desc" v-html="getTitleDesc"></div>
		</div>
		<div class="content-body-wrap">

			<div class="tabs">
				<div class="item"
					v-for="(item, idx) in markets"
					:selected="currTabIdx==idx ? true : false"
					@click="onTabClick(idx)"
				>
					{{ item.name }}
				</div>
			</div>

			<div class="tab-line"></div>

			<div class="content-box">

				<div class="side-menu">
					<SideMenu :sideMenu="assetMenu" @selection-changed="onChangeSideMenu"/>
				</div>

				<div class="contents">
					<div class="content-menu-box">
						<div class="search-box">
							<div class="icon"></div>
							<input class="text-input"
								placeholder="Search..."
								@input="onSearchBoxChange($event)"
							>
						</div>
						
						<!-- TODO Fix page number UI, and for sale bug -->
						<!-- <div class="switch-box">
							<label class="switch">
								<input id="forsale" type="checkbox" checked
									@click="onClickToggle()"
								>
								<span class="slider round"></span>
							</label>
							<div class="switch-label">For Sale</div>
						</div> -->

						<div class="order-by-box"
							@mouseover="showOrderPopup=true"
							@mouseleave="showOrderPopup=false"
							:active="(showOrderPopup ? 'on': 'off')"
						>
							<div class="order">{{$t('market.search.order.'+currentOrder.name)}}</div>
							<div class="icon"></div>
							<transition appear name="fade">
								<div v-if="showOrderPopup" class="order-popup-box-wrap">
									<div class="order-popup-box">
										<div class="order-item"
											v-for="(item,idx) in orderList" :key="idx"
											@click="onClickOrderSelect(item)"
										>
												{{$t('market.search.order.'+item.name)}}
										</div>
									</div>
								</div>
							</transition>
						</div>
					</div>
					<div class="item-box">
						<div class="items"
							v-if="marketItems && marketItems.list && marketItems.list.length > 0"
						>
							<Product v-for="(item, idx) in marketItems.list"
								:key="item.id" :product="item"
								:callFrom="'market'"
								@click-item="onClickItem"
							/>
						</div>
						<div class="message" v-else>
							{{$t('market.search.content')}}
						</div>
						<div class="page-box">
							<div class="page-wrap" v-if="pages && pages.length > 1">
								<div v-if="!firstPageGroup" class="arrow-left"></div>
								<div class="page"
									v-for="(page,idx) in pages"
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
		</div>


	</div>

	<FOOT :theme="'black'"/>

	<!-- <br><br>

	<p> Debug <br>
		<ul style="margin-left: 20px;">
			<li> current option: <span style="color:red;" >{{ currOptionValue }} </span> </li>
			<li> order by latest: <span style="color:red;">{{orderbylates}} </span></li>
			<li> current category Idx: <span style="color:red;">{{currCategoryIdx}} : {{ category[currCategoryIdx] }} </span></li>
			<li> products: <span style="color:blue;">{{ products }} </span></li>
		</ul>
	</p> -->

</template>

<script>

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();


import SideMenu from '@/components/SideMenu.vue'
import Product from '@/components/Product.vue'
import FOOT from '@/components/FOOT.vue'
import MarketDetail from '@/views/Market.Detail.vue'

export default {
	name: "Market",
	itemfocus : false,
	components: {
		SideMenu,
		Product,
		MarketDetail,
		FOOT,
	},
	props: {
		itemId: {
			type: String,
			default: '',
		},
	},

	// beforeRouteEnter (to, from, next) {
	// 	console.log("----- beforeRouteEnter :: ", to, from);
	// 	if(from.name !== 'Market-Detail' && from.name !== 'Market') {
	// 		next(vm=>{
	// 			var data = vm.searchQuery;
	// 			console.log("Data============================", data)
	// 			vm.mxSetMarketQuery(data);
	// 		});
	// 	}else{
	// 		next();
	// 	}
	// },

	// beforeRouteLeave (to, from, next) {
	// 	console.log("----- beforeRouteLeave :: ", to, from);
	// 	if(from.name == 'Market' && to.name!=='Market-Detail') {
	// 		var data = this.searchQuery;
	// 		this.mxSetMarketQuery(data);
	// 	}
	// 	next();
	// },

	beforeMount () {
		var m = this.mxGetMarketItem();
		if(this.$route.name=='Market-Detail' && !_U.isDefined(m,'id')) {
			this.$router.replace({name:"Market"});
			this.setSearchQuery(this.marketItems.page);
		}
	},
	mounted () {
		console.log("[Market.vue] && mounted(), route : ", this.$route);
		if(this.$route.name!=='Market-Detail') {
			this.setSearchQuery(1);
			this.callMarketItems(this.searchQuery);
		}
	},
	beforeUpdate () {
		console.log("[Market.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[Market.vue] updated(), route : ", this.$route)
	},
	data () {
		return {
			searchInputTimer: null,
			showOrderPopup: false,
			currentOrder: {name: 'newest', idx: 0},
			orderList: [
				{name: 'newest', idx: 0},
				{name: 'oldest' , idx: 1},
				{name: 'lower-price', idx: 4},
				{name: 'highest-price', idx: 5},
				{name: 'least-amount', idx:2},
				{name: 'highest-amount', idx: 3},
			],

			// type :
			// fold [async] : 열고 닫기 다른 폴더에 영향없음
			// fold sync : 열고 닫기 , sibling node 닫음
			// choice [name]: radio 버튼 처럼 name이 같은 것들 중 하나만 선택
			// check-box : 체크 박스
			// 말단 : fold가 아닌거.
			assetMenu: gConfig.assetMenu,

			currTabIdx: 0,

			pages: [1],
			currentPage: 1,
			firstPageGroup: true,
			lastPageGroup: true,

			markets: [
				{name: 'Dvision', id:'dvision'},
				{name: 'Enjin (soon)', id:'partner_1'},
			],

			category_1: 0,
			category_2: 0,
			filters: '',
			search: '',
		}
	},
	computed: {
		getTitleDesc() { return this.$t('market.title-desc'); },
		marketItems() {
			// console.log("[Market] computed, marketItems ", this.mxGetMarketItems());
			return this.mxGetMarketItems();
		},
		marketItem() {
			return this.mxGetMarketItem();
		},
		searchQuery() {
			return this.mxGetMarketQuery();
		}
	},
	watch: {
		marketItems(newVal, oldVal) {
			console.log("======================= marketItems ", newVal, oldVal);
			this.setPages()
		},
		searchQuery(newVal, oldVal) {
			this.callMarketItems(newVal);
		}
	},
	methods : {

		onTabClick (idx) {
			return ; // 1차에서 사용하지 않음.
			// this.currTabIdx = idx;
		},

		hasMarketItem() {
			if( _U.isDefined(this.marketItem,'id')) return true;
			else return false;
		},

		onSearchBoxChange(event) {
			this.search = event.target.value;
			if(this.searchInputTimer) {
				clearTimeout(this.searchInputTimer);
				this.searchInputTimer = null;
			}
			this.searchInputTimer = setTimeout(()=>{
				this.setSearchQuery(1);
			},1000)
		},

		// TODO Fix page number UI, and for sale bug
		// onClickToggle() {
		// 	console.log("[onClickToggle] forsale changed to : " + document.getElementById('forsale').checked);
		// 	this.setSearchQuery(1);
		// },

		onClickOrderSelect(item) {
			this.currentOrder=item;
			this.showOrderPopup=false;
			this.setSearchQuery(1);
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
				if(menu1.active == false) {
					continue;
				}
				if(menu1.name=='filter') {
					if(menu1.child && menu1.child.length > 0) {
						for(var j=0; j<menu1.child.length; j++) {
							var menu2 = menu1.child[j];
							if(menu2.active==true) {
								filters[menu2.name] = true;
							}
							else {
								filters[menu2.name] = false;
							}
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

			console.log("[Market.vue] ===  onChangeSideMenu(): --> check active==true on assetMenu --> change content-box.content, assetMenu :", this.assetMenu);
			var sm = this.assetMenu;

			var ctIdxes = {idx1: 0, idx2: 0};;
			if(sm[0].all!=='on') {
				ctIdxes = this.getCtIdxes();
			}
			var filter = this.getFilters();
			var filters;

			if(JSON.stringify(filter) === JSON.stringify({})) {
				filters = "";
			} else {
				filters = JSON.stringify(filter)
			}

			// 같으면 return
			if(	this.category_1 == ctIdxes.idx1 &&
				this.category_2 == ctIdxes.idx2 &&
				this.filters == filters
			){
				console.log("[Market.vue] === slip search :: onChangeSideMenu() same:", ctIdxes.idx1, ctIdxes.idx2, filters);
				return;
			}

			this.category_1 = ctIdxes.idx1;
			this.category_2 = ctIdxes.idx2;
			this.filters = filters;

			console.log("[Market.vue] ===  onChangeSideMenu(): --> ct1/2", ctIdxes.idx1, ctIdxes.idx2, this.filters);

			this.setSearchQuery(1);

		},

		setPages() {

			var pno_p_grp = gConfig.marketItem_pages_in_group; // 하단에 뿌릴 page group내 page 수
			var pgrStartPageNo = 1;

			var totalPages = Math.ceil(this.marketItems.total/this.marketItems.cpp);
			this.pages = [];
			for(var i=0; i< totalPages; i++) {
				this.pages[i] = i + pgrStartPageNo;
			}

			this.currentPage = this.marketItems.page;
			this.firstPageGroup= true;
			this.lastPageGroup = true;

		},
		onClickPage(page) {
			this.setSearchQuery(page);
		},

		onClickItem(item) {
			console.log("======= onClickItem :: itemInfo", item.id);
			this.mxSetMarketItem(item);
			this.$router.push({name:"Market-Detail", params:{'itemId': item.id}});
		},

		setSearchQuery(page) {
			if(!page || page == 0) page =1;

			var data = {
				page: page,
				count: gConfig.marketItem_count_per_page,
				sort: this.currentOrder.idx,
				network: "(\""+ gConfig.wlt.getBscAddr().Network + "\",\"" +  gConfig.wlt.getAddr().Network + "\")",
				category_1: this.category_1,
				category_2: this.category_2,
				filter: this.filters,
				search: this.search,
				// TODO Fix page number UI, and for sale bug
				// for_sale: document.getElementById('forsale').checked,
				for_sale: true,
			};

			this.mxSetMarketQuery(data);

		},

		callMarketItems(query) {

			console.log("[Market] callMarketItems() query:", query);

			this.mxShowLoading();
			_U.callPost({
				url:gConfig.market_item_list,
				data: query,
				callback: (resp) =>{
					console.log("[Market] callMarketItems()-> resp ", resp);
					var rows = _U.getIfDefined(resp,['data','rows']);
					var total = _U.getIfDefined(resp,['data','total']);
					if(!(rows && rows.length > 0)) {
						console.log("[Market] No Data:: callMarketItems()-> resp mxSetMarketItems ================ ", rows);
						this.mxCloseLoading();
						this.mxSetMarketItems({total:0, page:0, cpp: 0, list:[]});	 // 빈 뉴스
						return;
					}
					this.mxSetMarketItems({total:total,  page:query.page, cpp: query.count,  list:rows});
					this.mxCloseLoading();
				}
			});
		}

	}
}
</script>

<style lang="scss" scoped>

.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.Market {
	@include FLEXV(flex-start, center);

	width: 100%;
	height: auto;
	background-color: #181721;

	min-height: calc(100vh - 176px); // Foot 176px

	.title-box {
		@include FLEXV(flex-start, center);
		width: 100%;
		height: gREm(370);
		.title {
			height: gREm(42);
			width: gREm(500);
			margin-top: gREm(213);
			@include Set-Font($AppFont, gREm(34), gREm(42), #ffffff, 600);
			text-align: center;
		}
		.title-desc {
			height: gREm(41);
			width: gREm(500);
			margin-top: gREm(14);
			@include Set-Font($AppFont, gREm(15), gREm(22), #ffffff);
			text-align: center;
		}
	}
	.content-body-wrap {

		@include FLEXV(flex-start, center);
		@include Transition(0.5s ease);
		width: gREm(1400 - 139);

		.tabs {
			width: 100%;
			height: gREm(24 + 20 + 3);
			margin-top: gREm(80);
			cursor: pointer;
			@include FLEX(flex-start, flex-start);
			.item {
				height: gREm(24);
				width: auto;
				margin-right: gREm(49);
				@include Set-Font($AppFont, gREm(20), gREm(24), #ffffff, 500);
				opacity: 0.4;
				@include Transition( .5s ease-in-out);

				&[selected=true] {
					opacity: 1;
				}

				&:after {
					@include Transition( .25s ease-in-out);
					position: absolute;
					bottom: gREm(-23);
					content: "";
					display: block;
					height: gREm(3);
					left: 50%;
					width: 0px;
				}

				&[selected='true']:after {
					width: 100%;
					left: 0;
					background-color: #f6583e;
				}
			}
		}
		.tab-line {
			width: 100%;
			height: 1px;
			background-color: #34304b;
		}

	}

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
				width: gREm(933);
				height: gREm(19);
				padding-right: gREm(30);
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
				.switch-box {
					width: gREm(150);
					height: gREm(30);
					left: gREm(100);
					@include FLEX(flex-end, center);

					.switch {
						position: relative;
						display: inline-block;
						width: gREm(50);
						height: gREm(25);
						vertical-align:middle;
					}

					/* Hide default HTML checkbox */
					.switch input {display:none;}

					/* The slider */
					.slider {
						position: absolute;
						cursor: pointer;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background-color: #ccc;
						-webkit-transition: .4s;
						transition: .4s;
					}

					.slider:before {
						position: absolute;
						content: "";
						height: gREm(20);
						width: gREm(20);
						left: gREm(2);
						bottom: gREm(3);
						background-color: white;
						-webkit-transition: .4s;
						transition: .4s;
					}

					input:checked + .slider {
						background-color: #2196F3;
					}

					input:focus + .slider {
						box-shadow: 0 0 1px #2196F3;
					}

					input:checked + .slider:before {
						-webkit-transform: translateX(26px);
						-ms-transform: translateX(26px);
						transform: translateX(26px);
					}

					/* Rounded sliders */
					.slider.round {
						border-radius: gREm(34);
					}

					.slider.round:before {
						border-radius: 50%;
					}

					.switch-label {
						left: gREm(4);
						@include Set-Font($AppFont, gREm(15), gREm(19), #f6583e);
					}
				}
				.order-by-box {
					@include FLEX(flex-end, center);
					height: 100%;
					width: gREm(200);
					margin-right:gREm(10);
					// padding-right: gREm(11);
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
				.message{
					@include VH-Center;
					position: absolute;
					width: gREm(248);
					height: gREm(24);
					@include Set-Font($AppFont, gREm(20), gREm(27), #f1f1f1,300);
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
							width: gREm(44);
							cursor: pointer;
							background-color: transparent;
							border-radius: 50%;
							@include Set-Font($AppFont, gREm(15), gREm(19), #ffffff);
							&[active="on"] {
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

</style>
