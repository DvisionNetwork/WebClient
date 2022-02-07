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
			<div class="point">{{ rewardPool }} DVG</div>
		</div>
		<div class="box-content">
			<RewardBoxItem
				name="DVG Earned"
				:hadHarvest="harvest"
				value="0 DVG"
			/>
			<RewardBoxItem name="Total Staked LANDs" :data="totalStakedLand" />
			<RewardBoxItem name="My Staked LANDs" :data="myStakedLand" />
			<RewardBoxItem
				name="Total Mining Hash Rate"
				:data="totalMiningHashRate"
			/>
			<RewardBoxItem name="My Mining Hash Rate" :data="miningHashRate" />
			<RewardBoxItem
				name="1000 Mining Hash Rate/24H to get"
				:data="mininghashRatePerHour"
			/>
		</div>
	</div>
</template>

<script>
import RewardBoxItem from '@/components/RewardBox.Item.vue'
import Web3 from 'web3'
import ABI_APPROVE_ADD_LISTING from '@/abi/DvisionStakingUpgradeable.json'
export default {
	name: 'RewardBox',
	components: {
		RewardBoxItem,
	},
	data() {
		return {
			isStarted: false,
			isExpried: false,
			totalStakedLand: '0',
			myStakedLand: '0',
			totalMiningHashRate: '0',
			miningHashRate: '0',
			mininghashRatePerHour: '0 DVG',
			rewardPool: 1200000,
			harvest: true,
		}
	},
	mounted() {
		this.getTotalMiningHasRate(),
			this.getMiningHashRate(),
			this.getMiningHashRatePerHour(this.poolDuration.data)
	},
	props: {
		poolDuration: {
			type: Object,
		},
	},
	watch: {
		'poolDuration.data': {
			handler(val) {
				this.getMiningHashRatePerHour(val)
			},
		},
	},
	methods: {
		async getTotalMiningHasRate() {
			if (typeof window.ethereum !== 'undefined') {
				let web3 = new Web3(
					Web3.givenProvider ||
						'https://data-seed-prebsc-1-s1.binance.org:8545/'
				)
				const contractConn = await new web3.eth.Contract(
					ABI_APPROVE_ADD_LISTING.abi,
					'0x0e403338cdEe8043D603eF895D987b74AD4603c6'
				)
				console.log('contractConn', contractConn)
				await contractConn.methods
					.totalCampaignHashrate(1)
					.call()
					.then((tx) => {
						this.totalMiningHasRate = tx.toString()
					})
			}
		},
		async getMiningHashRate() {
			if (typeof window.ethereum !== 'undefined') {
				let web3 = new Web3(
					Web3.givenProvider ||
						'https://data-seed-prebsc-1-s1.binance.org:8545/'
				)
				const contractConn = await new web3.eth.Contract(
					ABI_APPROVE_ADD_LISTING.abi,
					'0x0e403338cdEe8043D603eF895D987b74AD4603c6'
				)
				await contractConn.methods
					.userInfo(1, '0x0e403338cdEe8043D603eF895D987b74AD4603c6')
					.call()
					.then((tx) => {
						this.miningHashRate = tx[0].toString()
					})
			}
		},
		getMiningHashRatePerHour(duration) {
			const x =
				((1000 * this.rewardPool) / (Number(this.totalMiningHashRate) * duration)) | 0
			this.mininghashRatePerHour = `${x} DVG`
		},
	},
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
			font-family: 'Montserrat, sans-serif';
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
			font-family: 'Montserrat, sans-serif';
		}
	}
	.box-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 29px;
	}
}
</style>
