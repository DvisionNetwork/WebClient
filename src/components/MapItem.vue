<template>
	<div class="item-card"
		:page-from="callFrom"
		@click="onClickItem(item)"
		level="common"
	>
		<canvas :id="'cv-item-'+item.id" type="main" class="cv-land"></canvas>
		<div class="desc-box">
			<span class="desc-name">{{ item.n }} </span>
			<div class="price-box">
				<div class="marketimage"></div>
				<span class="desc-price">{{ item.dviprice ? addComma(item.dviprice) : "0.00" }}</span>
			</div>
		</div>
		<div class="map-block-info-box">
			<div class="pos-box">
				<div class="icon"></div>
				<div class="pos">{{getBlockPosInfo('start')}}</div>
			</div>

			<div v-if="isOneByOne()==false" class="pos-tilde"> ~ </div>

			<div v-if="isOneByOne()==false" class="pos-box">
				<div class="icon"></div>
				<div class="pos">{{getBlockPosInfo('end')}}</div>
			</div>

			<div class="pos-size">
				{{getBlockPosInfo('size')}}
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
	name: 'ItemCard',
	props: {
		item: {
			type: Object,
			default: () => ({}),
		},
		callFrom:{
			type: String,
		},
		mapId: String,
		itemIdx: Number,
		itemLastIdx: Number,
	},
	mounted() {
		// console.log('[MapItem.vue] #### mounted() mapId:'+this.mapId+', item:'+this.item.id, this.item, this.itemIdx, this.itemLastIdx);
		var loading_on = false;
		if(loading_on) {
			if(this.itemIdx == 0) {
				console.log("[MapItem.vue] ====================== show loading ======");
				setTimeout(()=>{
					this.mxShowLoading();
				},10);
			}
			if(this.itemLastIdx == this.itemIdx ) {
				console.log("[MapItem.vue] ====================== close loading ======");
				setTimeout(()=>{
					this.mxCloseLoading();
				},10);
			}
		}

		setTimeout(()=>{
			this.mapInit();
		},10);


	},
	updated() {
		// this.mxCloseLoading();
	},
	watch: {
		mapId(newVal, oldVal) {
			console.log("[MapItem.vue] watch.mapId ", newVal, oldVal);
			setTimeout(()=>{
				this.mapInit();
			},10);
		},
	},
	methods: {
		onClickItem(item) {
			this.$emit('click-item',item)
		},
		isOneByOne() {
			var block = this.item;
			if(block.x1 == block.x2 && block.y1 == block.y2) {
				return true;
			}
			return false;
		},
		getBlockPosInfo(infoType) {
			var block = this.item;
			var rv = '';
			if(infoType == 'start') {
				rv = block.x1+','+block.y1;
			}else if(infoType == 'end') {
				rv = block.x2+','+block.y2;
			}else if(infoType == 'size') {
				rv = this.$t('market.land.size')+' : '+(block.x2 - block.x1 + 1)+'x'+(block.y1 - block.y2 + 1);
			}
			return rv;
		},

		getDvLand() {
			return this.mxGetLandMap(this.mapId);
		},
		mapInit() {
			var dvLand = this.getDvLand();
			// console.log("@@@ blocks",dvLand);
			if(!dvLand) {
				console.error('[MapLand.vue] mapInit() DvLand Map. mapId:'+this.mapId+', item.id:'+this.item.id, dvLand);
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

			var cvId = 'cv-item-'+this.item.id.toString();

			gCvLib.init(cvId, landInfo);

			var cvInfo = gCvLib.Data.getCvInfo(cvId,'main');
			if(!cvInfo) return;
			cvInfo['forItemCanvas'] = true;
			var blockId = this.item.id;

			// console.log("[MapItem.vue] ======= cvInfo", this.item,'cvId='+cvId, cvInfo, 'blockId='+blockId);

			gCvLib.Func.draw(cvInfo, dvLand.map, dvLand.mon, blockId);
			gCvLib.Func.centerOnBlock(blockId);

		},
	}
}
</script>

<style lang="scss" scoped>
.item-card {

	width: gREm(282 + 6);
	height: gREm(338 + 6);
	margin: gREm(18);
	border-radius: gREm(10);
	transition: all 0.2s linear;
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
	float: left;
	border: solid 2px transparent;
	background-image: none;
	background-origin: border-box;
	background-clip: content-box, border-box;

	@include FLEXV(flex-start, center);
	@include OnOverTransition();
	cursor: pointer;


	&[level="common"] {
		border: solid 2px #72767f;
		.leveltag {
			background: #72767f;
		}
	}

	.cv-land {
		// @include FLEXV(center, center);
		border-radius: gREm(10);
		width: 100%; // gREm(282);
		height: gREm(245);
		background-color: #24242b;
	}

	.desc-box {
		width: 100%;
		padding-left: gREm(20);
		padding-right: gREm(20);
		height: gREm(19);
		margin-top: gREm(20);
		@include FLEX(space-between,center);
		.desc-name{
			@include Dotted-Text;
			width: auto;
			height: gREm(19);
			padding-right: gREm(28);
			@include Set-Font($AppFont, gREm(16), gREm(19), #ffffff);
		}
		.price-box{
			@include FLEX(flex-end,center);
			.marketimage{
				width: gREm(14);
				height: gREm(16);
				@include SetBgImage(url('../assets/img/ic-dvi-market.svg'));
				margin-right: gREm(8);
			}
			.desc-price{
				width: auto;
				height: gREm(19);
				@include Set-Font($AppFont, gREm(16), gREm(19), #febf37);
			}
		}
	}

	.map-block-info-box {
		width: 100%;
		padding-left: gREm(20);
		padding-right: gREm(20);
		height: gREm(24);
		@include FLEX(flex-start, center);
		margin-top: gREm(10);
		.pos-tilde {
			width: gREm(6);
			float:left;
			height: gREm(24);
			margin-left: gREm(6);
			margin-right: gREm(6);
			@include Set-Font($AppFont, gREm(13), gREm(24), #ffff,300);
		}
		.pos-box {
			width: auto;
			float:left;
			height: gREm(24);
			background-color: #2a2932;
			border-radius: gREm(6);
			padding-left: gREm(12);
			padding-right: gREm(12);
			.icon {
				float:left;
				width:gREm(8);
				height: gREm(11);
				margin-top: gREm(7);
				@include SetBgImage(url('../assets/img/market/ic-land-map.svg'));
			}
			.pos {
				float:left;
				width: auto;
				height: gREm(16);
				margin-left: gREm(6);
				margin-top: gREm(4);
				// @include Set-Font($AppFont, gREm(13), gREm(16), #ffff,300);
				@include Set-Font($AppFont, gREm(11), gREm(16), #ffff,300);
				text-align: left;
			}
		}
		.pos-size {
			width: auto;
			float:left;
			margin-left: gREm(16);
			height: gREm(24);
			// @include Set-Font($AppFont, gREm(15), gREm(24), #ffff,300);
			@include Set-Font($AppFont, gREm(12), gREm(24), #ffff,300);
			text-align: left;
		}
	}
}
</style>
