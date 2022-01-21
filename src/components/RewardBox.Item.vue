<template>
	<div class="box-item">
		<div>
			<div class="name">{{ name }}</div>
			<div class="point" v-if="value">{{ value }}</div>
		</div>
		<div class="harvest" v-if="hadHarvest" :class="{ active: isActive }">
			Harvest
		</div>
	</div>
</template>

<script>
export default {
	name: 'RewardBox',
	props: {
		name: String,
		hadHarvest: Boolean,
		value: String,
	},
	data() {
		return {
			isActive: false,
		}
	},
	methods: {},
}
</script>

<style lang="scss" scoped>
.box-item {
	border-radius: 8px;
	border: 1px solid #ffffff66;
	width: 100%;
	height: gREm(81);
	max-width: gREm(284);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: gREm(16) gREm(11) gREm(16) gREm(18);
	.name {
		font-family: 'Montserrat';
		font-size: gREm(16);
		font-weight: 400;
		line-height: gREm(22.4);
		color: #ffffff66;
	}
	.point {
		font-family: 'Montserrat';
		font-size: gREm(17);
		font-weight: 400;
		line-height: gREm(25);
		color: #ffffff;
	}
	.harvest {
		background: #5f5f5f;
		border-radius: gREm(10);
		height: gREm(32);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 gREm(17.5);
		font-size: gREm(16);
		line-height: gREm(22);
		font-family: 'Montserrat';
		&.active {
			background: #f6583e;
		}
	}
}
</style>
