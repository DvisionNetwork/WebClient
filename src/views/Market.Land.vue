<template>

	<div class="side-menu">
		<SimpleSideMenu :sideMenu="landMenu" @selection-changed="onChangeSideMenu"/>
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
			<div class="right-menu-box">

				<div v-if="tab_page=='land-list'" class="switch-box">
					<div class="switch-label">For Sale</div>
					<label class="switch">
						<input id="land-switch-forsale" type="checkbox" v-model="landSwitchForsale"
							@click="onClickToggle()"
						>
						<span class="slider round"></span>
					</label>
				</div>

				<div class="order-by-box"
					@mouseover="showOrderPopup=true"
					@mouseleave="showOrderPopup=false"
					:active="(showOrderPopup ? 'on': 'off')"
				>
					<div class="order">{{$t('market.land.'+currentOrder.name)}}</div>
					<div class="icon"></div>
					<transition appear name="fade">
						<div v-if="showOrderPopup" class="order-popup-box-wrap">
							<div class="order-popup-box">
								<div class="order-item"
									v-for="(order,idx) in orderList" :key="idx"
									@click="onClickOrderSelect(order)"
								>
										{{$t('market.land.'+order.name)}}
								</div>
							</div>
						</div>
					</transition>
				</div>

				<div class="content-type-box">
					<div class="icon list-type"
						:active ="tab_page=='land-list' ? 'on' : 'off'"
						@click="onClickLandType('list')"
					></div>
					<div class="icon map-type"
						:active ="tab_page=='land-map' ? 'on' : 'off'"
						@click="onClickLandType('map')"
					></div>
				</div>

			</div>

		</div>
		<div v-if="tab_page=='land-list'" class="item-box">
			<div class="items"
				v-if="landItems && landItems.list && landItems.list.length > 0"
			>
				<MapItem v-for="(item, idx) in landItems.list"
					:key="item.id" :item="item"
					:itemIdx="idx"
					:itemLastIdx="landItems.list.length -1"
					:mapId="mapId"
					:callFrom="'market-land'"
					@click-item="onClickItem"
				/>
			</div>
			<div v-else class="message">
				{{$t('market.search.content')}}
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
		<div v-else-if="tab_page=='land-map'" class="canvas-box">
			<MapLand ref="refMapLand" :mapId="mapId" />
		</div>
	</div>

</template>

<script>

import AppConfig from '@/App.Config.js'
import SimpleSideMenu from '@/components/SimpleSideMenu.vue'
import MapLand from '@/components/MapLand.vue'
import MapItem from '@/components/MapItem.vue'

var gConfig = AppConfig();


export default {
	name: "Market-Land",
	components: {
		SimpleSideMenu,
		MapLand,
		MapItem,
	},
	props: {
		tab_page: {
			type: String,
			default: 'land-map',
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
		console.log("[Market.Land.vue] beforeMount(), route : ", this.$route, this.tab_page);
		var from = _U.getIfDefined(this.$route,['params','from']);
		var fromFrom = _U.getIfDefined(this.$route,['params','from','params','from']);
		if(from && fromFrom && from.name == 'Market-Detail-Index' && fromFrom.name == 'Market-Page') {
			var landQuery = this.mxGetLandQuery();
			this.currentOrder = landQuery.order;
			this.mxSetLandQuery(landQuery);
		}else{
			if(this.tab_page == 'land-list') {
				this.landSwitchForsale = false;
			}
			this.setSearchQuery(1);
		}
		// this.setSearchQuery(this.marketItems.page);
	},
	mounted () {
		// console.log("[Market.Land.vue] && mounted(), route : ", this.$route);
		// this.setLandItems(this.searchQuery);
		this.callLandItemList();
	},
	beforeUpdate () {
		// console.log("[Market.Land.vue] ##### beforeUpdate(), route : ", this.tab_page, this.mapId, this.$route);
	},
	updated() {
		// console.log("[Market.Land.vue] ##### updated(), route : ", this.tab_page, this.$route);
	},
	data () {
		return {

			pages: [1],
			currentPage: 1,
			firstPageGroup: true,
			lastPageGroup: true,

			showOrderPopup: false,
			currentOrder: {name: 'land_ct_all', ct: 'all'},
			orderList: [
				{name: 'land_ct_all', ct: 'all'},
				{name: 'land_ct_0', ct: "0"},
				{name: 'land_ct_1' , ct: "1"},
				{name: 'land_ct_2', ct: "2"},
				{name: 'land_ct_3', ct: "3"}
			],

			landSwitchForsale: false,

			search: '',
			searchInputTimer: null,

		}
	},
	computed: {

		getDvLand() {
			return this.mxGetLandMap(this.mapId);
		},

		landMenu() {
			return this.mxGetLandMenu();
		},
		defaultMapId() {
			return this.mxGetLandDefaultMapId();
		},

		mapId() {
			var mapId = null;
			var landQuery = this.mxGetLandQuery();
			// console.log("[Market.Land.vue] computed() mapId(): landQuery ==", landQuery);
			if(landQuery) {
				mapId = landQuery.mapId;
			} else {
				mapId = this.mxGetLandDefaultMapId();
			}
			return mapId;
		},
		landItems() {
			// console.log("[Market.Land.vue] computed, landItems ", this.mxGetLandItems());
			return this.mxGetLandItems();
		},
		landItem() {
			return this.mxGetLandItem();
		},
		searchQuery() {
			return this.mxGetLandQuery();
		}

	},
	watch: {
		tab_page(newVal, oldVal) {

			this.search = '';
			var o = _U.Q('.search-box .text-input');
			if(o) o.value = '';

			if(newVal == 'land-list') {
				var landQuery = this.mxGetLandQuery();
				// console.log("[Market.Land.vue] ======================= watch tabpage ", newVal, oldVal);
				landQuery.page = 1;
				landQuery.for_sale = false;

				var o = _U.Q('.search-box .text-input');
				if(o) o.value = landQuery.search;

				this.landSwitchForsale = false;
				this.mxSetLandQuery(landQuery);
				this.setLandItems(landQuery);
			}else if(newVal == 'land-map') {
				var landQuery = this.mxGetLandQuery();
				// console.log("[Market.Land.vue] ======================= watch tabpage ", newVal, oldVal);
				this.currentOrder= this.orderList[0];
				landQuery.order = this.currentOrder;
				landQuery.search = '';
				this.mxSetLandQuery(landQuery);
			}

		},
		// mapId가 바뀌면 searchQuery에서 watch되기전에 MapItem이 변경됨. mapId watch 별도 처리함.
		mapId(newVal, oldVal) {
			// console.log("[Market.Land.vue] ======================= watch mapId ", newVal, oldVal);
			var landQuery = this.mxGetLandQuery();
			landQuery.page = 1;
			landQuery.search = '';
			this.search = '';
			var o = _U.Q('.search-box .text-input');
			if(o) o.value = '';
			this.mxSetLandQuery(landQuery);
			this.callLandItemList();
			// this.setLandItems(landQuery);
		},
		searchQuery(newVal, oldVal) {
			// console.log("[Market.Land.vue] ======================= watch searchQuery ", newVal, oldVal);
			this.setLandItems(newVal);
		},
		landItems(newVal, oldVal) {
			//console.log("[Market.Land.vue] ======================= watch landItems ", newVal, oldVal);
			this.setPages();
		},
	},
	methods : {
		// getLandType() {
		// 	var landQuery = this.mxGetLandQuery();
		// 	if(landQuery) return landQuery.type;
		// 	return 'map';
		// },
		// setLandType(landType) {
		// 	console.log("[Market.Land.vue] setLandType landType", landType);
		// 	var landQuery = this.mxGetLandQuery();
		// 	if(!landQuery) landQuery ={};
		// 	if(landQuery.type != landType) {
		// 		landQuery.type = landType;
		// 		this.mxSetLandQuery(landQuery);
		// 	}
		// },

		/// API
		getDvLand() {
			return this.mxGetLandMap(this.mapId);
		},

		callLandItemList() {

			console.log("[Market.Land.vue] callLandItemList() ");

			var network = gConfig.wlt.getNetworkAddr(this.getDvLand.network).Network;

			this.mxCallAndSetLandItemList(this.mapId, network, ()=>{
				console.log("[Market.Land.vue] mxCallAndSetLandItemList() => func !! ", this.searchQuery);
				this.setLandItems(this.searchQuery);
			});

		},

		setLandMapId(mapId) {
			var landQuery = this.mxGetLandQuery();
			if(!landQuery) landQuery ={};
			// console.log("[Market.Land.vue] setLandMapId  mapId",mapId, landQuery);
			if(landQuery.mapId != mapId) {
				// console.log("[Market.Land.vue] setLandMapId  mapId call mxSetLandQuery()",mapId, landQuery);
				landQuery.mapId = mapId;
				this.mxSetLandQuery(landQuery);
			}
		},
		setLandOrder(order) {
			if(!order) return;
			var landQuery = this.mxGetLandQuery();
			if(!landQuery) landQuery ={};
			// console.log("[Market.Land.vue] setLandOrder() order",order);
			if(!landQuery.order || (landQuery.order.name != order.name)) {
				// console.log("[Market.Land.vue] setLandOrder() order call mxSetLandQuery()",order);
				landQuery.order = order;
				this.mxSetLandQuery(landQuery);
			}
		},
		onClickLandType(landType) {
			// console.log("[Market.Land.vue] onClickLandType landType", landType);
			if(this.tab_page == 'land-'+landType) {
				return;
			}
			// this.setLandType(landType);
			var rInfo = {
				name:'Market-Page',
				params:{
					'tab_page': 'land-'+landType
				}
			};
			this.$router.push(rInfo);
			// rInfo.params['routerReplace'] = true;
			// this.$router.replace(rInfo);
		},
		onClickItem(item) {
			// console.log("[Market.Land.vue] onClickItem :: itemInfo", item.id);
			var rInfo = {
				name:"Market-Detail-Index",
				params:{
					'tab_page': 'land-detail',
					'itemId': this.mapId,
					'index': item.id
				}
			};
			this.$router.push(rInfo);
		},
		onChangeSideMenu(mapId) {
			// console.log("[Market.Land.vue] onChangeSideMenu() landName:", mapId);
			this.setLandMapId(mapId);

		},
		//// LAND //////////////////////////////////
		setSearchQuery(page) {
			if(!page || page == 0) page =1;

			var landType = this.tab_page == 'land-list' ? 'list' : 'map';
			var mapId = this.mapId;
			var landQuery = this.mxGetLandQuery();
			if(_U.isDefined(landQuery,"type")) landType = landQuery.type;
			if(_U.isDefined(landQuery,"mapId")) mapId = landQuery.mapId;

			var query = {
				type: landType,
				mapId: mapId,
				page: page,
				count: gConfig.marketItem_count_per_page,
				search: this.search,
				for_sale: this.landSwitchForsale,
				order: this.currentOrder,
			};

			this.mxSetLandQuery(query);

		},
		setLandItems(query) {
			var dvLand = this.getDvLand;
			if(!dvLand) return;

			console.log("[Market.Land.vue] setLandItems() dvLand==> ", dvLand);
			var landQuery = this.mxGetLandQuery();

			var ct = _U.getIfDefined(landQuery,["order","ct"]);
			if(!ct) ct = 'all';

			var forSale = landQuery.for_sale;
			// console.log("[Marke.Land.vue] setLandItems() forSale:", forSale, this.landSwitchForsale);

			// 2자 이상
			var search = _U.isDefined(landQuery,'search') && landQuery.search.length > 1 ? landQuery.search : null;

			var blockListAll = [];
			for(var i=0; i <dvLand.map.length; i++) {
				if(_U.isDefined(dvLand.map[i],'id')) {
					var block = dvLand.map[i];
					if( ct=='all' || ct == block.c.toString()) {
						if(forSale){
							if(block.c.toString() == '1' && block.btn_state == '1' && block.salestate == '1') {
								if(search && search.length > 1) {
									var name = block.n;
									if(name && name.length > 0 && name.toLowerCase().indexOf(search.toLowerCase())>=0) {
										blockListAll.push(block);
									}
								}else{
									blockListAll.push(block);
								}
							}
						}else{
							if(search) {
								var name = block.n;
								if(name && name.length > 0 && name.toLowerCase().indexOf(search.toLowerCase())>=0) {
									blockListAll.push(block);
								}
							}else{
								blockListAll.push(block);
							}
						}
					}
				}
			}

			// console.log("[Market.Land.vue] blockListAll==> ", blockListAll);

			var blockList = [];
			var start = (landQuery.page - 1) * landQuery.count;
			var end = start + landQuery.count;
			for(var i=start; i <end; i++) {
				if(_U.isDefined(blockListAll[i],'id')) {
					blockList.push(blockListAll[i]);
				}
			}

			// console.log("[Market.Land.vue] blockList==> ", blockList);

			var total = blockListAll.length;
			this.mxSetLandItems({total:total,  page:query.page, cpp: query.count,  list:blockList});

			if(this.$refs.refMapLand) {
				this.$refs.refMapLand.mapInit();
			}
		},

		setPages() {
			var pno_p_grp = gConfig.marketItem_pages_in_group; // 하단에 뿌릴 page group내 page 수
			var pgrStartPageNo = Math.floor((this.landItems.page -1) / pno_p_grp)*pno_p_grp +1;

			var totalPages = Math.ceil(this.landItems.total/this.landItems.cpp);
			this.pages = []; // 초기화 해 줄 것.
			for(var i=0; i< pno_p_grp && (i + pgrStartPageNo) <= totalPages; i++) {
				this.pages[i] = i + pgrStartPageNo;
			}

			this.currentPage = this.landItems.page;
			this.firstPageGroup= pgrStartPageNo < pno_p_grp ? true: false;
			this.lastPageGroup = this.currentPage + pno_p_grp > totalPages ? true : false;

		},

		onClickPage(page) {
			this.setSearchQuery(page);
		},
		onClickPageArrow(leftRight) {

			var pno_p_grp = gConfig.marketItem_pages_in_group; // 하단에 뿌릴 page group내 page 수
			var pgrStartPageNo = Math.floor((this.landItems.page -1) / pno_p_grp)*pno_p_grp +1;
			var page = 1;
			if(leftRight == 'right') {
				page = pgrStartPageNo + pno_p_grp;
			}else if(leftRight == 'left'){
				page = pgrStartPageNo - pno_p_grp;
			}

			var totalPages = Math.ceil(this.landItems.total/this.landItems.cpp);
			if(page < 1) page = 1;
			if(page > totalPages) page = totalPages;

			// console.log("[Market.Land.vue] >>>>>>> onClickPageArrow("+leftRight+")", page, pgrStartPageNo,totalPages)

			this.setSearchQuery(page);
		},

		///////////////////////

		onClickToggle() {
			// console.log("[[Market.Land.vue] onClickToggle() land-switch-forsale changed to : " + this.landSwitchForsale);
			var landQuery = this.mxGetLandQuery();
			this.landSwitchForsale = this.landSwitchForsale ? false : true;
			landQuery.for_sale = this.landSwitchForsale;
			if(this.tab_page == 'land-list') {
				this.mxSetLandQuery(landQuery);
				this.setLandItems(landQuery);
			}else{
				landQuery.page = 1;
				var landType = 'list';
				landQuery.type = landType;
				var rInfo = {
					name:'Market-Page',
					params:{
						'tab_page': 'land-'+landType
					}
				};
				this.$router.push(rInfo);
			}
		},
		onClickOrderSelect(order) {
			this.currentOrder=order;
			this.showOrderPopup=false;
			// console.log("[Market.Land.vue] onClickOrderSelect order", order);
			var landType = 'list';
			var landQuery = this.mxGetLandQuery();
			if(!landQuery) landQuery ={};
			landQuery.type = landType;
			landQuery.page = 1;
			landQuery.order = order;
			this.mxSetLandQuery(landQuery);

			if(this.tab_page == 'land-list') {
				this.setLandItems(landQuery);
			}else{
				var rInfo = {
					name:'Market-Page',
					params:{
						'tab_page': 'land-'+landType
					}
				};
				this.$router.push(rInfo);
			}
		},

		onSearchBoxChange(event) {
			var search = event.target.value;
			this.search = search;

			if(this.searchInputTimer) {
				clearTimeout(this.searchInputTimer);
				this.searchInputTimer = null;
			}
			this.searchInputTimer = setTimeout(()=>{

				var landType = 'list';
				if(this.tab_page == 'land-list') {
					// this.setLandItems(landQuery);
					this.setSearchQuery(1);
				}else{
					var landQuery = this.mxGetLandQuery();
					if(!landQuery) landQuery ={};
					landQuery.search = search;
					landQuery.type = landType;
					this.mxSetLandQuery(landQuery);

					var rInfo = {
						name:'Market-Page',
						params:{
							'tab_page': 'land-'+landType
						}
					};
					this.$router.push(rInfo);
				}
			},1000)
		},

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
		// padding-right: gREm(30);
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
		.right-menu-box {
			@include FLEX(flex-end, center);
			height: 100%;
			width: gREm(500);

			.switch-box {
				@include FLEX(flex-end, center);

				z-index: $Z-INDEX-MENU-POPUP-PLUS-5;
				width: gREm(120);
				height: gREm(30);
				.switch {
					position: relative;
					display: inline-block;
					width: gREm(40);
					height: gREm(18);
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
					background-color: #363446;
					-webkit-transition: .4s;
					transition: .4s;
				}

				.slider:before {
					position: absolute;
					content: "";
					height: gREm(14);
					width: gREm(14);
					left: gREm(4);
					right: gREm(26);
					bottom: gREm(2);
					background-color: white;
					-webkit-transition: .4s;
					transition: .4s;
				}

				input:checked + .slider {
					background-color: #f6583e;
				}

				input:focus + .slider {
					box-shadow: 0 0 1px #f6583e;
				}

				input:checked + .slider:before {
					-webkit-transform: translateX(26px);
					-ms-transform: translateX(26px);
					transform: translateX(26px);
					left: gREm(-4);
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
					margin-right: gREm(12);
					@include Set-Font($AppFont, gREm(15), gREm(19), #f6583e);
				}
			}

			.order-by-box {
				@include FLEX(flex-end, center);
				z-index: $Z-INDEX-MENU-POPUP-PLUS-5;
				height: 100%;
				width: auto;
				margin-left: gREm(30);
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
				height: gREm(37 * 6 + 12 + 19);
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

			.content-type-box {
				@include FLEX(flex-end, center);
				height: 100%;
				width: auto;
				// margin-right:gREm(10);
				// padding-right: gREm(11);
				cursor: pointer;
				z-index: $Z-INDEX-MENU-POPUP-PLUS-5;
				.icon {
					margin-left: gREm(26);
					width:gREm(19);
					height: gREm(19);
					opacity: 0.5;
					&.map-type {
						width:gREm(14);
						@include SetBgImage(url('../assets/img/market/ic-land-map.svg'));
					}
					&.list-type {
						@include SetBgImage(url('../assets/img/market/ic-land-list.svg'));
					}
					&[active="on"] {
						opacity: 1;
					}
				}
			}
		}
	}

	.item-box {
		width: calc(100% + 20px);
		height: auto; // gREm(395 + 1365 + 44);
		margin-top: gREm(15);
    	margin-left: gREm(-20);
		margin-bottom: gREm(15);
		@include FLEXV(flex-start, flex-start);
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
			padding-left: gREm(15);
			padding-right: gREm(15);
			.page-wrap {
				@include FLEX(center, center);
				height: gREm(44);
				width: gREm(600);
				.arrow-left, .arrow-right, .page {
					@include FLEX(center, center);
					cursor: pointer;
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

	.canvas-box {
		width: gREm(933);
		height: gREm(700);

		// @include FLEXV(space-between, flex-start);
		margin-top: gREm(30);
		margin-bottom: gREm(96);
	}

}


@include media-max($media_large) { // 1200
.contents  {
}}

@include media-max($media_medium) { // 1024
.contents  {
}}

</style>
