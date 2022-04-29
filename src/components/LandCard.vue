<template>
	<SelectQuantityModal
		v-if="showSelectQuantity"
		:onClick="(quantity) => onConfirmQuantity(quantity, nftId)"
		:onCancel="closeSelectQuantityModal"
		:id="id"
		:name="name"
		:imageUrl="imageUrl"
		:maxQuantity="maxQuantity"
	/>
	<div
		class="land-card"
		:class="{ active: isActive }"
		:key="key"
		@click="() => !isUnlock && onClicktoItem()"
	>
		<div class="quantity-box" v-if="quantity > 0">
			<span class="quantity">{{ quantity }}</span>
		</div>
		<div class="image">
			<img v-if="imageUrl" :src="imageUrl" :alt="name" />
			<img v-else src="../assets/img/default.png" :alt="name" />
			<div v-if="isDisable" class="lock">
				<span v-if="isUnlock" class="lock-desc"
					>Staking has ended.</span
				>
				<span v-if="!isUnlock" class="lock-desc"
					>Staking in progress</span
				>
			</div>
		</div>
		<div class="card-title">
			{{ name }}
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
		<div class="line" />
		<div class="bottom">
			<span class="left">ID</span>
			<span>{{ tokenId }}</span>
		</div>
		<div class="bottom">
			<span class="left">Quantity</span>
			<span>1</span>
		</div>
		<div class="bottom">
			<span class="left">Type</span>
			<span class="erc-type is1155" v-if="isErc1155">ERC-1155</span>
			<span class="erc-type is721" v-else>ERC-721</span>
		</div>
		<div
			v-if="isUnlock"
			:class="enableUnlock ? 'active' : ''"
			class="btn-unlock"
			v-on="enableUnlock ? { click: onClicktoItemUnStake } : {}"
		>
			<span>Unlock</span>
		</div>
	</div>
</template>

<script>
import SelectQuantityModal from '@/components/Popup.SelectQuantityModal.vue'

export default {
	name: 'LandCard',
	props: {
		key: Number,
		name: String,
		imageUrl: String,
		id: Number,
		hadHarvest: Boolean,
		value: String,
		isUnlock: Boolean,
		isActive: Boolean,
		isDisable: Boolean,
		onCheckItem: Function,
		listNftsCheck: Array,
		cancelQuantityModal: Function,
		isErc1155: Boolean,
		nftId: Number,
		onConfirmQuantity1155: Function,
		maxQuantity: Number,
		isUnstake: Boolean,
		enableUnlock: Boolean,
		tokenId: String,
		item: Object,
	},
	components: {
		SelectQuantityModal,
	},
	data() {
		return {
			showSelectQuantity: false,
			quantity: 0,
		}
	},
	methods: {
		isOneByOne() {
			var block = this.item;
			if(block.x1 == block.x2 && block.y1 == block.y2) {
				return true;
			}
			return false;
		},
		getBlockPosInfo(infoType) {
			const block = this.item;
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
		closeSelectQuantityModal() {
			this.showSelectQuantity = false
		},

		onConfirmQuantity(quantity, nftId) {
			this.quantity = quantity
			this.showSelectQuantity = false
			this.onConfirmQuantity1155(quantity, nftId)
		},

		onClicktoItemUnStake() {
			this.onCheckItem()
		},

		onClicktoItem() {
			if (this.isErc1155) {
				if (this.isActive) {
					this.quantity = 0
					this.onConfirmQuantity1155(this.quantity, this.nftId)
				} else {
					this.showSelectQuantity = true
				}
			} else {
				this.onCheckItem()
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.land-card {
	border-radius: gREm(10);
	border: 2px solid #d6d8dc;
	width: 100%;
	max-width: gREm(282);
	padding: gREm(15) gREm(20);
	position: relative;
	&.active {
		background: #372e83;
	}

	.map-block-info-box {
		width: 100%;
		height: auto;
		@include FLEX(space-between, center);
		margin-top: gREm(10);
		margin-bottom: gREm(10);
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
				background: center/ contain no-repeat url('../assets/img/market/ic-land-map.svg');
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
	.quantity-box {
		position: absolute;
		top: 7px;
		left: 10px;
		z-index: 9;
		min-width: 50px;
		min-height: 50px;
		border: 4px solid #ffffff;
		border-radius: 50%;
		background: #f6583e;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		& .quantity {
			width: 40px;
			text-align: center;
			font-size: 20px;
		}
	}
	.image {
		width: gREm(240);
		height: gREm(285);
		position: relative;
		& img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			border-radius: 3px;
		}
		& .lock {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			background: #282727e5;
			z-index: 9;
			border-radius: gREm(3);
			width: 240px;
			& .lock-desc {
				width: 100%;
				font-size: gREm(16);
				line-height: gREm(25);
				font-weight: 600;
				font-family: Montserrat, sans-serif;
				text-align: center;
				position: absolute;
				top: gREm(148);
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
	.card-title {
		font-family: Montserrat, sans-serif;
		font-weight: 400;
		font-size: gREm(16);
		line-height: gREm(25);
		color: #ffffff;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: gREm(8);
		margin-top: gREm(8)
	}
	.line {
		background: #ffffff14;
		width: 100%;
		height: 1px;
		margin-bottom: gREm(3);
	}
	.bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: gREm(5);
		span {
			font-size: gREm(12);
			line-height: gREm(16);
			font-family: Montserrat, sans-serif;
			&.left {
				color: #ffffff66;
				line-height: gREm(17);
			}
		}
		& .erc-type {
			width: gREm(57);
			height: gREm(16);

			font-weight: 600;
			font-size: gREm(12);
			line-height: gREm(12);
			border-radius: 3px;
			display: flex;
			align-items: center;
			justify-content: center;
			&.is1155 {
				background: #ff7a00;
			}
			&.is721 {
				background: #1bd7bd;
			}
		}
	}
	.btn-unlock {
		width: 100%;
		height: gREm(32);
		background: #5f5f5f;
		border-radius: gREm(10);
		font-family: Montserrat, sans-serif;
		font-weight: 400;
		font-size: gREm(16);
		color: #ffffff;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: gREm(17);
		&.active {
			background: #f6583e;
			cursor: pointer;
		}
	}
}
@include media-max($media_small) {
	.land-card {
		width: 100%;
		max-width: 100%;
		margin-bottom: gREm(15);

		.image {
			width: 100%;
		}

		.line {
			margin-bottom: gREm(8);
			margin-top: gREm(32);
		}

		.card-title {
			margin-top: gREm(8);
		}

		.bottom {
			margin-bottom: gREm(8);
			.left {
				@include Set-Font($AppFont, gREm(14), gREm(24), #777682, 200);
			}

			.erc-type {
				width: auto;
				padding: gREm(1) gREm(10);
			}

			span:last-child:not(.erc-type) {
				font-size: gREm(14);
			}
		}
	}
}
</style>
