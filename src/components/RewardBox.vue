<template>
	<div class="reward-box">
		<div class="box-title">
			<div>
				<span class="title">
					<span v-if="!isStarted">Campaign not started yet.</span>
					<span v-if="isStarted"
						>Staking campaign starts in:
						<span
							class="status"
							:class="{ green: !isExpried, red: isExpried }"
							>01d:12h:43m:22s</span
						>
					</span>
				</span>
			</div>
			<div class="point">0 DVG</div>
		</div>
		<div class="box-content">
			<RewardBoxItem name="DVG Earned" :hadHarvest="true" value="0 DVG" />
			<RewardBoxItem name="Total Staked LANDs" value="0" />
			<RewardBoxItem name="My Staked LANDs" value="0" />
			<RewardBoxItem name="Total Mining Hash Rate" value="0" />
			<RewardBoxItem name="My Mining Hash Rate" value="0" />
			<RewardBoxItem
				name="1000 Mining Hash Rate/24H to get"
				value="0 DVG"
			/>
		</div>
	</div>
</template>

<script>
import RewardBoxItem from '@/components/RewardBox.Item.vue'

export default {
	name: 'RewardBox',
	components: {
		RewardBoxItem,
	},
	data() {
		return {
			isStarted: false,
			isExpried: false,
		}
	},
	props: {},
	methods: {},
}
</script>

<style lang="scss" scoped>
.reward-box {
	background: #1c1a2e;
	border-radius: gREm(10);
	width: 100%;
	min-height: gREm(352);
	padding: gREm(43) gREm(26.5) gREm(44);
	margin-bottom: gREm(52);
	.box-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: gREm(35);
		.title {
			font-family: 'Montserrat';
			font-weight: 400;
			font-size: gREm(16);
			line-height: gREm(24);
			color: #ffffff;
			.status {
				font-weight: 700;
				margin-left: gREm(18);
			}
			.green {
				color: #47e269;
			}
			.red {
				color: #f6583e;
			}
		}

		.point {
			font-size: gREm(36);
			line-height: gREm(35);
			font-family: 'Montserrat';
		}
	}
	.box-content {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 29px;
	}
}
</style>
