<template>
	<canvas id="cv-land" type="main" class="cv-land"></canvas>
	<canvas id="cv-land" type="drawing" class="cv-land"
		:isdrag="dragInfo.drag.toString()"

		@mouseleave="onMouseleave_Map"
		@mousedown="onMousedown_Map"
		@mouseup="onMouseup_Map"
		@mousemove="onMousemove_Map"
		@wheel="onWheel_Map"

	></canvas>
	<div class="tool-tip-box"
		:oshow="toolTip.show.toString()"
		:style="toolTip.style"
	>
		<div class="title-box">
			<div class="header">{{toolTip.getName()}}</div>
			<div class="pos-box">
				<div class="icon"></div>
				<div class="pos">{{toolTip.getBlockPos()}}</div>
			</div>
		</div>
		<div class="owner info">
			<div class="header">{{$t('market.land.owner')}}</div>
			<div class="desc">{{toolTip.getWAddr()}}</div>
		</div>
		<div v-if="toolTip.isForSale()==true" class="price info">
			<div class="header">{{$t('market.land.price')}}</div>
			<div v-if="toolTip.getTokenType()=='0'" class="pol-box">
				<div class="pol-icon"></div>
				<div class="pol-value">{{toolTip.getPrice()}}</div>
			</div>
			<div v-else class="price-box">
				<div class="icon"></div>
				<div class="value">{{toolTip.getPrice()}}</div>
			</div>
		</div>
	</div>
</template>

<script>

import AppConfig from '@/App.Config.js'
import CVLib from '@/features/CanvasLib.js'

var gConfig = AppConfig();
var gCvLib = CVLib();

export default {
	name: 'MapLand',
	props: {
		tab_page: String,
		mapId: String,
		blockId: Number
	},
	data() {
		return {
			cvId: 'cv-land',

			dragInfo: {
				drag: false,
				prev_pos: {on: false, x:-1, y:-1}, // {dx, dy}
				setPos(x,y) {
					this.prev_pos.x = x;
					this.prev_pos.y = y;
				},
				initPos() {
					this.prev_pos.x = -1;
					this.prev_pos.y = -1;
					this.prev_pos.on = false;
				},
				getDelta(x,y) {
					if(this.prev_pos.on==false) {
						this.prev_pos.on = true;
						this.setPos(x,y);
					}
					var rv = {
						dx: x - this.prev_pos.x,
						dy: y - this.prev_pos.y
					}
					return rv;
				}
			},
			toolTip: {
				show: false,
				block: null, // block{id, x1, y1 .. },
				blockPos: null,
				style:'',
				getPos() {
					if(this.block) {
						return '('+this.block.x1+','+this.block.y1+')~('+this.block.x2+','+this.block.y2+')';
					}else{
						return 'NONE';
					}
				},
				getBlockPos() {
					if(this.blockPos) {
						return this.blockPos.x+','+this.blockPos.y;
					}else{
						return 'NONE';
					}
				},
				getId() {
					if(this.block) {
						return this.block.id;
					}else{
						return 'NONE';
					}
				},
				getName() {
					if(this.block) {
						return this.block.n;
					}else{
						return 'NONE';
					}
				},
				getWAddr() {
					// if(_U.isDefined(this.block,'id')) {
					// 	return this.block.id;
					// }else{
					// 	return 'x';
					// }
					// return "0xe-3424-23";
					if(_U.isDefined(this.block,'owner_address')) {
						return this.block.owner_address; // wallet address
					}else{
						return '';
					}
				},
				isForSale() {
					var rv = false;
					if(this.block) {
						if(this.block.c == "1") {
							rv = true;
						}
					}
					return rv;
				},
				getPrice() {
					// return "1,000,000";
					if(_U.isDefined(this.block,'dviprice')) {
						return _U.addComma(this.block.dviprice);
					}else{
						return '0';
					}
				},
				getTokenType() {
					if(_U.isDefined(this.block,'tokentype')) {
						return  _U.getIfDefined(this.block, 'tokentype');
					}else{
						return '0';
					}
				},
				setInfo(block, blockPos) {
					this.block = block;
					this.blockPos = blockPos;
					this.show = true;
				},
				initInfo() {
					this.block = null;
					this.blockPos = null;
					this.show = false;
				},
				isAlreadySet(pos) {
					var rv = false;
					if(this.show && this.block) {
						if(gCvLib.Utils.isPointInRect(this.block, pos)) {
							rv = true;
						}
					}
					return rv;
				}
			}

		}
	},
	computed: {
		isPageLandDetail() {
			return this.$route.name =='Market-Detail-Index' ? true : false;
		},
		isPageLandFromDetail() {
			var rv = false;
			if(this.$route.name =='Market-Page'
				&& this.$route.params.from
				&& this.$route.params.from.name =='Market-Detail-Index'
				&& (
				( 	this.$route.params.from.params.from
					&& this.$route.params.from.params.from.name =='Market-Page')
					||
					this.$route.params.from.params.routerReplace == "true"
				)
			) {
				rv=true;
			}
			return rv;
		}
	},
	beforeMount () {
		// console.log("[MapLand.vue] beforeMout(), route : ", this.$route)
	},
	mounted() {
		// console.log('[MapLand.vue] mounted() mapId:'+this.mapId+', blockId:'+this.blockId, this.$route.params);

		// testing
		// init map
		this.mapInit();
	},
	beforeUpdate () {
		// console.log("[MapLand.vue] beforeUpdate(), route : ", this.$route);
		if(this.$route.name == 'Market-Page') {
			// console.log("[MapLand.vue] 'Market-Page' beforeUpdate(), route : ", this.$route);
			// this.mapInit();
		}
	},
	updated() {
		// console.log("[MapLand.vue] updated(), route : ", this.$route)
	},
	watch: {
		blockId(newVal, oldVal) {
			// console.log("[MapLand.vue] watch.blockId ", newVal, oldVal);
			gCvLib.Func.reDraw(newVal);
		},
		mapId(newVal, oldVal) {
			// console.log("[MapLand.vue] watch.mapId ", newVal, oldVal);
			this.mapInit('changed');
		},
	},

	methods: {
		getDvLand() {
			return this.mxGetLandMap(this.mapId);
		},
		mapInit(changed) {
			var dvLand = this.getDvLand();
			// console.log("@@@ blocks",dvLand);
			if(!dvLand) {
				console.error('[MapLand.vue] mapInit() DvLand Map. mapId:'+this.mapId+', blockId:'+this.blockId, dvLand);
				return;
			}

			var ox = Math.ceil(dvLand.w / 2);
			var oy = Math.ceil(dvLand.h / 2);
			var landInfo = {
				mapId: this.mapId,
				width: dvLand.w,
				height: dvLand.h,
				blockSize: gConfig.canvas.blockSize, // used for zoom in/out
				blockSizeMin: gConfig.canvas.blockSizeMin, // max zoom out
				blockSizeMax: gConfig.canvas.blockSizeMax, // max zoom in
				cvStyle: {
					bg: gConfig.canvas.bg,
					landBlock: gConfig.canvas.landBlock,
					landBlockOnSale: gConfig.canvas.landBlockOnSale,
					selectedBlock: gConfig.canvas.selectedBlock,
					centerBlock: gConfig.canvas.centerBlock,
					myBlock: gConfig.canvas.myBlock
				},
				center: {
					x: dvLand.cx, // land base x
					y: dvLand.cy, // land base y
					ox: ox, // center of canvas
					oy: oy, // center of canvas
					dx: dvLand.cx - ox,
					dy: dvLand.cy - oy
				}
			};

			var initLandInfo = true;

			if(changed != 'changed') {
				if(this.isPageLandDetail) {
					// console.log("[MapLand.vue] ======================= route.name ", this.$route.name);
					if(_U.getIfDefined(gCvLib,['Data','landInfo','blockSize'])) {
						if(gCvLib.Data.landInfo.mapId == this.mapId) {
							landInfo = gCvLib.Data.landInfo;
							initLandInfo = false;
							// console.log("[MapLand.vue] ======================= landInfo ", landInfo);
						}
					}
				}
				if(this.isPageLandFromDetail) {
					// console.log("[MapLand.vue] ======================= route.name from.name ", this.$route.name, this.$route.params.from.name);
					if(_U.getIfDefined(gCvLib,['Data','landInfo','blockSize'])) {
						var info = this.mxGetLandInfo();
						if(info && info.mapId == this.mapId) {
							landInfo = info;
							initLandInfo = false;
						}else if(gCvLib.Data.landInfo.mapId == this.mapId) {
							landInfo = gCvLib.Data.landInfo;
							initLandInfo = false;
						}
						// console.log("[MapLand.vue] ======================= mxGetLandInfo ", landInfo);
					}
				}
			}

			gCvLib.init(this.cvId, landInfo);

			var cvInfo = gCvLib.Data.getCvInfo(this.cvId,'main');
			if(landInfo.cvCoord && this.isPageLandFromDetail ) {
				cvInfo.coord = JSON.parse(JSON.stringify(landInfo.cvCoord));
			}

			// console.log("[MapLand.vue] ======= cvInfo",cvInfo, 'blockId='+this.blockId);

			gCvLib.Func.draw(cvInfo, dvLand.map, dvLand.mon, this.blockId);
			if(this.isPageLandDetail && this.blockId) {
				gCvLib.Func.centerOnBlock(this.blockId);
			}else if(initLandInfo) {
				var s = landInfo.blockSize;
				var dxy = {
					dx: landInfo.center.dx * s * -1,
					dy: landInfo.center.dy * s * -1
				}
				gCvLib.Func.move(dxy);
			}

		},
		blockInfo(blockId) {
			var dvLand = this.getDvLand();
			var blocks = dvLand.map;
			var rv = null;
			for(var i=0; i<blocks.length; i++) {
				var b = blocks[i];
				if(b.id == blockId) {
					rv = b;
					break;
				}
			}
			return rv;
		},

		getBlockInfo(pos) {
			var dvLand = this.getDvLand();
			var blocks = dvLand.map;
			var rv = null;
			for(var i=0; i<blocks.length; i++) {
				var b = blocks[i];
				if(b.x1 <= pos.x && pos.x <= b.x2) {
					if(pos.y <= b.y1 && pos.y >= b.y2) {
						rv = b;
						break;
					}
				}
			}
			return rv;
		},

		onMouseleave_Map(e) {
			// console.log("@@@ on mouse Leave:",e);
			this.dragInfo.drag = false;
			this.dragInfo.initPos();
			this.toolTip.initInfo();
		},
		onMousedown_Map(e) {
			// console.log("@@@ on mouse Down:",e);
			this.dragInfo.drag = true;
			this.dragInfo.initPos();
			this.toolTip.initInfo();
			this.downT = e.timeStamp;
		},
		onMousemove_Map(e) {
			e.preventDefault();
			// console.log("@@@@@@@@@@@  ==== onMousemove_Map ", e);
			if(!this.dragInfo.drag) {
				if(_U.checkDuplicatedCall({id:'dvi.market.land.onmousemove.over',interval:100,t:e.timeStamp})) {
					// console.log("@@@@@@@@@@@ skip dvi.market.land.onmousemove.over ====", e.timeStamp);
					return;
				}
				var pos = { x: e.offsetX, y: e.offsetY };
				// console.log("@@@@@@ show Tool tip",pos.x, pos.y);
				var blockPos = gCvLib.Func.getBlockPos(pos);

				if(!blockPos) {
					// console.log("@@@@@@ block pos NONE");
					this.toolTip.initInfo();
					return;
				}
				// console.log("@@@@@@ block pos",blockPos.x, blockPos.y);
				var left = gConfig.getREm(pos.x + 20);
				var top = gConfig.getREm(pos.y - (150 + 20)); // 100 -> toolTip Height
				this.toolTip.style = "left:"+left+"rem; top:"+top+"rem;";

				var block = this.getBlockInfo(blockPos);
				// console.log("@@@@@@ block info ",blockPos, block);
				if(!block || block && block.c == '4') {
					// console.log("@@@@@@ block pos NONE");
					this.toolTip.initInfo();
					return;
				}

				if(this.toolTip.isAlreadySet(blockPos)) {
					// console.log("@@@@@@ block pos Already shown:",this.toolTip.block);
					return;
				}

				this.toolTip.setInfo(block, blockPos);
				// console.log("@@@@@@ Tooltip info ", this.toolTip.block);

				return;
			}
			if(_U.checkDuplicatedCall({id:'dvi.market.land.onmousemove.drag',interval:100,t:e.timeStamp})) {
				// console.log("@@@@@@@@@@@ skip ====");
				return;
			}
			// console.log("@@@ on mouse Move:",e);
			var pos = this.dragInfo.getDelta(e.offsetX, e.offsetY);
			var dd = pos.dx*pos.dx + pos.dy*pos.dy;
			if(dd > 2) {
				// console.log("@@@ on mouse Move D:",pos);
				this.dragInfo.setPos(e.offsetX, e.offsetY);
				gCvLib.Func.move(pos);
			}
		},
		onMouseup_Map(e) {
			var now = e.timeStamp;
			var prev = this.downT;
			this.dragInfo.drag = false;
			this.dragInfo.initPos();
			this.toolTip.initInfo();

			if( now - prev < 250.0) {
				// console.log("@@@ on mouse Up --> click:");
				this.onClick_Map(e);
			}
		},
		onWheel_Map(e) {
			// console.log("@@@ on wheel:",e);
			this.dragInfo.drag = false;
			this.toolTip.initInfo();
			e.preventDefault();
			var pointerPos = {x:e.offsetX, y:e.offsetY};
			if(e.wheelDelta > 0 ) {
				gCvLib.Func.zoom('in',pointerPos);
			}else{
				gCvLib.Func.zoom('out',pointerPos);
			}
		},
		onClick_Map(e) {
			console.log("@@@ on Click:",e);
			this.toolTip.initInfo();
			var pos = { x: e.offsetX, y: e.offsetY };
			var blockPos = gCvLib.Func.getBlockPos(pos);
			if(!blockPos) {
				return;
			}
			var block = this.getBlockInfo(blockPos);
			if(block && block.id && block.c < 4) {
				var rInfo = {
					name:"Market-Detail-Index",
					params:{
						'tab_page': 'land-detail',
						'itemId': this.mapId,
						'index': block.id
					}
				};
				if(this.$route.name == 'Market-Detail-Index') {
					rInfo.params['routerReplace'] = true;
					this.$router.replace(rInfo);
				}else{
					var cvInfo = gCvLib.Data.getCvInfo(this.cvId,'main');
					gCvLib.Data.landInfo.cvCoord = cvInfo.coord;
					this.mxSetLandInfo(gCvLib.Data.landInfo);
					this.$router.push(rInfo);
				}
			}
		},
	}
}
</script>

<style lang="scss" scoped>

	.cv-land {
		position:absolute;
		width: 100%;
		height: 100%;

		&[type="main"] {
			z-index:1;
			background-color: #24242b;
			// background-color: white;
		}
		&[type="drawing"] {
			z-index:10;
			&[isdrag="true"] {
				cursor: move;
			}
		}
	}
	.tool-tip-box {
		z-index:-1;
		position:absolute;
		top:0px;
		width: auto;
		height: auto;
		border-radius: gREm(10);
		background-color: black;
		opacity: 0;
		transition: all .25s ease;

		&[oshow="true"] {
			opacity: 1;
			z-index: 5;
		}

		padding-left: gREm(20);
		padding-right: gREm(20);
		padding-top: gREm(24);
		padding-bottom: gREm(24);

		.title-box {
			@include FLEX(flex-start, center);
			.header {
				width: auto;
				height: gREm(24);
				@include Set-Font($AppFont, gREm(14), gREm(24), #ffff,300);
			}
			.pos-box {
				@include FLEX(flex-start, flex-start);
				width: auto;
				height: gREm(24);
				margin-left: gREm(11);
				background-color: #2a2932;
				border-radius: gREm(4);
				padding-right: gREm(8);
				.icon {
					flex: none;
					float:left;
					width:gREm(8);
					height: gREm(11);
					margin-top: gREm(7);
					margin-left: gREm(8);
					margin-right: gREm(6);
					@include SetBgImage(url('../assets/img/market/ic-land-map.svg'));
				}
				.pos {
					float:left;
					width: auto;
					height: gREm(24);
					@include Set-Font($AppFont, gREm(13), gREm(24), #ffff,300);
				}
			}
		}

		.owner {
			margin-top: gREm(26);
			.header {
				width: auto;
				height: gREm(18);
				@include Set-Font($AppFont, gREm(14), gREm(18), #959699,300);
			}
			.desc {
				width: auto;
				height: gREm(18);
				margin-top: gREm(12);
				@include Set-Font($AppFont, gREm(14), gREm(18), #ffffff,300);
			}
		}

		.price {
			margin-top: gREm(26);
			.header {
				width: auto;
				height: gREm(18);
				@include Set-Font($AppFont, gREm(14), gREm(18), #959699,300);
			}
			.pol-box {
				@include FLEX(flex-start, center);
				margin-top:gREm(13);
				.pol-icon {
					width: gREm(22);
					height: gREm(19);
					@include SetBgImage(url('../assets/img/ic-polygon-market.svg'));
				}
				.pol-value {
					width: auto;
					height: gREm(18);
					margin-left:gREm(8);
					@include Set-Font($AppFont, gREm(15), gREm(19), #7A4ADD);
				}
			}
			.price-box {
				@include FLEX(flex-start, center);
				margin-top:gREm(13);
				.icon {
					width:gREm(14);
					height: gREm(16);
					@include SetBgImage(url('../assets/img/ic-dvi-market.svg'));
				}
				.value {
					width: auto;
					height: gREm(18);
					margin-left:gREm(8);
					@include Set-Font($AppFont, gREm(14), gREm(18), #febf37);
				}
			}
		}
	}

@include media-max($media_small) { // 768
	.item-land-wrap {
		width: 100%;
	}
}
</style>
