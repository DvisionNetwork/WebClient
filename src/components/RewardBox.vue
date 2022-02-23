<template>
	<div class="reward-box">
		<div class="box-title">
			<div>
				<span class="title">
					<CountDownTimer
						:statusCampain="statusCampain"
						:switchStatusCampain="switchStatusCampain"
						:poolDuration="poolDuration"
						:timeCount="timeCount"
					/>
				</span>
			</div>
			<div class="point" v-if="statusCampain === 1">0 DVG</div>
			<div class="point" v-else>{{ rewardPool }} DVG</div>
		</div>
		<div class="box-content">
			<RewardBoxItem
				name="DVG Earned"
				:hadHarvest="harvest"
				:data="dvgEarned"
				:statusCampain="statusCampain"
			/>
			<RewardBoxItem
				name="Total Staked LANDs"
				:data="totalStakedLand"
				:statusCampain="statusCampain"
			/>
			<RewardBoxItem
				name="My Staked LANDs"
				:data="myStakedLand"
				:statusCampain="statusCampain"
			/>
			<RewardBoxItem
				name="Total Mining Hash Rate"
				:data="totalMiningHashRate"
				:statusCampain="statusCampain"
			/>
			<RewardBoxItem
				name="My Mining Hash Rate"
				:data="myMiningHashRate"
				:statusCampain="statusCampain"
			/>
			<RewardBoxItem
				name="10 Hash Rate/24H to get"
				:data="mininghashRatePerHour"
				:statusCampain="statusCampain"
			/>
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
import {
	toFixedDecimal,
	BSC_RPC_ENDPOINT,
} from '@/features/Common.js'
var gConfig = AppConfig()

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
		timeCount: {
			type: Object,
		},
		poolDuration: {
			type: Object,
		},
		rewardPool: Number,
		totalStakedLand: String,
		myStakedLand: String,
		totalMiningHashRate: String,
		myMiningHashRate: String,
		mininghashRatePerHour: String,
		staking_address:String
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
		'poolDuration.id': {
			handler() {
				this.getCampaignEarned()
			},
		},
	},
	methods: {
		async getCampaignEarned() {
			if (typeof window.ethereum !== 'undefined') {
				let web3 = new Web3(Web3.givenProvider || BSC_RPC_ENDPOINT)
				const contractConn = await new web3.eth.Contract(
					ABI_STAKING,
					this.staking_address
				)
				await contractConn.methods
					.getCampaignEarned(this.poolDuration.id, this.wallet_addr)
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
@include media-max($media_small) {
	.reward-box {
		padding: 20px;
		.box-title {
			display: block;
			margin-bottom: 10px;
			.point {
				text-align: right;
				margin-top: 10px;
			}
		}
	}
}
</style>
