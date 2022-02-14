<template>
	<div class="reward-box">
		<div class="box-title">
			<div>
				<span class="title">
					<CountDownTimer
						:statusCampain="statusCampain"
						:switchStatusCampain="switchStatusCampain"
						:poolDuration="poolDuration"
					/>
				</span>
			</div>
			<div class="point" v-if="statusCampain === 1">0 DVG</div>
			<div class="point" v-else>{{ rewardPool }} DVG</div>
		</div>
		<div class="box-content">
			<RewardBoxItem name="DVG Earned" :hadHarvest="harvest" :data="dvgEarned" />
			<RewardBoxItem name="Total Staked LANDs" :data="totalStakedLand" />
			<RewardBoxItem name="My Staked LANDs" :data="myStakedLand" />
			<RewardBoxItem name="Total Mining Hash Rate" :data="totalMiningHashRate" />
			<RewardBoxItem name="My Mining Hash Rate" :data="myMiningHashRate" />
			<RewardBoxItem name="1000 Hash Rate/24H to get" :data="mininghashRatePerHour" />
		</div>
	</div>
</template>

<script>
import RewardBoxItem from '@/components/RewardBox.Item.vue'
import Web3 from 'web3'
import ABI_STAKING from '@/abi/DvisionStakingUpgradeable.json'
import CountDownTimer from '@/components/CountDownTimer.vue'
import AppConfig from '@/App.Config.js'
import { formatEther } from '@ethersproject/units'
import { toFixedDecimal } from '@/features/Common.js'
var gConfig = AppConfig()
const STAKING_ADDRESS = '0x019D5b2B45fb01FbD77401bd1809EA121e222A23'

export default {
	name: 'RewardBox',
	components: {
		RewardBoxItem,
		CountDownTimer,
	},
	data() {
		return {
			miningHashRate: '0',
			dvgEarned: '0 DVG',
			harvest: true,
			wallet_addr: this.$store?.state?.userInfo?.wallet_addr,
		}
	},
	props: {
		statusCampain: Number,
		switchStatusCampain: Function,
		poolDuration: {
			type: Object,
		},
		rewardPool: Number,
		totalStakedLand:String,
		myStakedLand:String,
		totalMiningHashRate:String,
		myMiningHashRate:String,
		mininghashRatePerHour:String
	},

	mounted() {
		if (this.statusCampain !== 1) {
			this.getTotalStaked()
			this.getMyStaked()
		}
		setInterval(() => {
			this.getCampaignEarned()
		}, 3000)
	},
	watch: {
		'poolDuration.data': {
			handler(val) {
				const x = this.getUint8(val)
				this.getCampaignEarned()
			},
		},
	},
	methods: {
		getUint8(val) {
			if (val === 90) {
				return 3
			} else if (val === 60) {
				return 2
			} else {
				return 1
			}
		},
		async getCampaignEarned() {
			if (typeof window.ethereum !== 'undefined') {
				let web3 = new Web3(
					Web3.givenProvider ||
						'https://data-seed-prebsc-1-s1.binance.org:8545/'
				)
				const contractConn = await new web3.eth.Contract(
					ABI_STAKING.abi,
					STAKING_ADDRESS
				)
				await contractConn.methods
					.getCampaignEarned(this.statusCampain, this.wallet_addr)
					.call()
					.then((data) => {
						this.dvgEarned = `${toFixedDecimal(
							formatEther(data),
							0
						)} DVG`
					})
			}
		},
	
	},
}
</script>

<style lang="scss" scoped>
.reward-box {
	background: #1c1a2e;
	border-radius: gREm(10);
	width: 100%;
	min-height: gREm(308);
	padding: gREm(35) gREm(26) gREm(26);
	margin-bottom: gREm(52);
	.box-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: gREm(35);
		.title {
			font-family: Montserrat, sans-serif;
			font-weight: 400;
			font-size: gREm(16);
			line-height: gREm(24);
			color: #ffffff;
			.status {
				font-weight: 700;
				margin-left: gREm(18);
			}
		}

		.point {
			font-size: gREm(36);
			line-height: gREm(35);
			font-family: Montserrat, sans-serif;
		}
	}
	.box-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: gREm(20);
	}
}
</style>
