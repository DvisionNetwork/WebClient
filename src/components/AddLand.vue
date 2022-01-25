<template>
	<div class="add-land">
		<div class="add" @click="onClick">
			<img src="../assets/img/ic-circle-plus.svg" class="add-img" />
		</div>
		<div class="card-title">Add LAND(s)</div>
		<div class="line" />
		<div class="bottom">
			<span class="left">Hash Rate</span>
			<span>ID</span>
		</div>
		<div class="bottom">
			<span class="left">--</span>
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
		onClick: Function
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
	width: gREm(275);
	height: gREm(435);
	padding: gREm(17) gREm(20);
	background: #1c1a2e;
	.add {
		width: gREm(234);
		height: gREm(279);

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
		font-family: 'Montserrat, sans-serif';
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
		span {
			font-size: gREm(12);
			line-height: gREm(16);
			font-family: 'Montserrat, sans-serif';
			color: #ffffff66;
			line-height: gREm(17);
		}
	}
}
</style>
