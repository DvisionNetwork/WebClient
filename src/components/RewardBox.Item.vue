<template>
	<div class="box-item">
		<div>
			<div class="name">{{ name }}</div>
			<div class="point" v-if="data">{{ data }}</div>
		</div>
		<div
			class="harvest"
			v-if="hadHarvest"
			:class="{ active: isActive }"
			@click="handleClickHarvest"
		>
			Harvest
		</div>
	</div>
</template>

<script>
import { renderOnClickHarvestContent } from '@/data/RenderContent.js'
export default {
	name: 'RewardBox',
	props: {
		name: String,
		hadHarvest: Boolean,
		data: String,
	},
	data() {
		return {
			isActive: false,
		}
	},
	methods: {
		handleClickHarvest() {
			const obj = {
				width: '712px',
				height: '244px',
				title: 'Reward harvested',
				content: renderOnClickHarvestContent('3123'),
				buttonTxt: 'OK',
				isShow: true,
			}
			this.mxShowSuccessModal(obj)
		},
	},
}
</script>

<style lang="scss" scoped>
.box-item {
	border-radius: 8px;
	border: 1px solid #ffffff66;
	width: 100%;
	height: gREm(81);
	max-width: gREm(276.33);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: gREm(16) gREm(11) gREm(16) gREm(18);
	.name {
		font-family: Montserrat, sans-serif;
		font-size: gREm(16);
		font-weight: 400;
		line-height: gREm(22.4);
		color: #ffffff66;
	}
	.point {
		font-family: Montserrat, sans-serif;
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
		font-family: Montserrat, sans-serif;
		cursor: pointer;
		&.active {
			background: #f6583e;
		}
	}
}
@include media-max($media_small) {
	.MyPage {
		display: unset;
		.content-body-wrap {
			width: 100%;
			max-width: 100%;
			.box-item {
				width: 100%;
				max-width: 100%;
			}
		}
	}
}
</style>
