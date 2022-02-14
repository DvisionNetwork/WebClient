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
			<div class="point">{{ rewardPool }} DVG</div>
		</div>
		<div class="box-content">
			<RewardBoxItem
				name="DVG Earned"
				:hadHarvest="harvest"
				:data="dvgEarned"
			/>
			<RewardBoxItem name="Total Staked LANDs" :data="totalStakedLand" />
			<RewardBoxItem name="My Staked LANDs" :data="myStakedLand" />
			<RewardBoxItem
				name="Total Mining Hash Rate"
				:data="totalMiningHashRate"
			/>
			<RewardBoxItem name="My Mining Hash Rate" :data="miningHashRate" />
			<RewardBoxItem
				name="1000 Hash Rate/24H to get"
				:data="mininghashRatePerHour"
			/>
		</div>
	</div>
</template>

<script>
import RewardBoxItem from '@/components/RewardBox.Item.vue'
import Web3 from 'web3'
import ABI_APPROVE_ADD_LISTING from '@/abi/DvisionStakingUpgradeable.json'
import CountDownTimer from '@/components/CountDownTimer.vue'
import axios from 'axios'
import AppConfig from '@/App.Config.js'
var gConfig = AppConfig()

export default {
	name: 'RewardBox',
	components: {
		RewardBoxItem,
		CountDownTimer,
	},
	data() {
		return {
			totalStakedLand: '0',
			myStakedLand: '0',
			totalMiningHashRate: '0',
			miningHashRate: '0',
			mininghashRatePerHour: '0 DVG',
			dvgEarned: '0 DVG',
			harvest: true,
		}
	},
	props: {
		statusCampain: Number,
		switchStatusCampain: Function,
		poolDuration: {
			type: Object,
		},
		rewardPool: Number,
	},

	mounted() {
		this.mxShowLoading()
		this.getTotalStaked()
		this.getMyStaked()
		this.getTotalMiningHasRate()
		this.getMiningHashRate()
		this.getMiningHashRatePerHour(this.poolDuration.data)
		this.mxCloseLoading()
		setInterval(() => {
			this.getCampaignEarned()
		}, 3000)
	},
	watch: {
		'poolDuration.data': {
			handler(val) {
				this.getMiningHashRatePerHour(val)
				this.getCampaignEarned()
			},
		},
	},
	methods: {
		async getTotalStaked() {
			const response = await axios.get(
				`${gConfig.public_api_sotatek}/nft-total-staked`
			)
			if (response.status === 200) {
				this.totalStakedLand = response.data.totalStaked.toString()
			}
		},
		async getMyStaked() {
			const response = await axios.get(
				`${gConfig.public_api_sotatek}/nft-my-staked`
			)
			if (response.status === 200) {
				this.myStakedLand = response.data.myStaked.toString()
			}
		},
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
		async getCampaignEarned() {
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
					.getCampaignEarned(
						1,
						'0x0e403338cdEe8043D603eF895D987b74AD4603c6'
					)
					.call()
					.then((data) => {
						console.log('data earn', data)
						this.dvgEarned = `${data} DVG`
					})
			}
		},
		getMiningHashRatePerHour(duration) {
			const x =
				((1000 * this.rewardPool) /
					(Number(this.totalMiningHashRate) * duration)) |
				0
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
