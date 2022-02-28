<template>
	<div class="add-land">
		<div class="add" @click="onClick">
			<img src="../assets/img/ic-circle-plus.svg" class="add-img" />
		</div>
		<div class="card-title">Add LAND(s)</div>
		<div class="line" />
		<div class="bottom">
			<span class="left">Hash Rate</span>
			<span>--</span>
		</div>
		<div class="bottom">
			<span class="left">ID</span>
			<span>--</span>
		</div>
		<div class="bottom">
			<span class="left">Quantity</span>
			<span>--</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'LandCard',
	props: {
		name: String,
		hadHarvest: Boolean,
		value: String,
		onClick: Function,
		listStaking: Array,
	},
	data() {
		return {
			isUnlock: false,
			isActive: false,
			isDisable: false,
		}
	},
	methods: {},
}
</script>

<style lang="scss" scoped>
.add-land {
	border-radius: gREm(10);
	width: gREm(282);
	height: gREm(463);
	padding: gREm(15) gREm(28);
	background: #1c1a2e;
	.add {
		width: gREm(226);
		height: gREm(270);

		position: relative;
		background: #ffffff;
		& .add-img {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			cursor: pointer;
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
		margin-top: gREm(9);
		margin-bottom: gREm(32);
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
		& .left {
			font-size: gREm(12);
			line-height: gREm(16);
			font-family: Montserrat, sans-serif;
			line-height: gREm(17);
			color: #ffffff66;
			& span {
				color: #ffffff;
			}
		}
	}
}

@include media-max($media_small) {
	.add-land {
		border: 1px solid rgba(255, 255, 255, 0.7);
		border-radius: gREm(8);
		padding: gREm(24);
		.add {
			width: 100%;
		}

		.bottom {
			.left {
				@include Set-Font($AppFont, gREm(14), gREm(24), #777682, 200);
			}
		}
	}
}
</style>
