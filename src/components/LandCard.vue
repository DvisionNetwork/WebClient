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
		<div class="line" />
		<div class="bottom">
			<span class="left">Hash Rate</span>
			<span>{{ hashRate }}</span>
		</div>
		<div class="bottom">
			<span class="left">ID</span>
			<span>{{ nftId }}</span>
		</div>
		<div class="bottom">
			<span class="left">Quantity</span>
			<span>{{ maxQuantity }}</span>
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
		hashRate: Number,
		enableUnlock: Boolean,
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
</style>
