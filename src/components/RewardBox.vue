<template>
	<div class="reward-wrap">
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
				<div class="status red" v-if="statusCampain === 1">N/A</div>
				<div class="status yellow" v-if="statusCampain === 2">Upcoming</div>
				<div class="status green" v-if="statusCampain === 3">Ongoing</div>
			</div>
			<!-- <div class="box-content">
				<RewardBoxItem
					name="DVG Earned"
					:hadHarvest="harvest"
					:data="dvgEarned"
					:statusCampain="statusCampain"
					:hasUnit="true"
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
					:hasUnit="true"
				/>
			</div> -->
		</div>
		<div>
			<div class="reward-btn">Reward table</div>
			<div class="reward-btn">My reward</div>
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
import WalletConnectProvider from '@walletconnect/web3-provider'
import Fortmatic from 'fortmatic'
import {
	toFixedDecimal,
	BSC_RPC_ENDPOINT,
	ETH_RPC_ENDPOINT,
	MATIC_RPC_ENDPOINT,
	FORTMATIC_API_KEY,
	formatChainId,
	FORTMATIC,
	WALLETCONNECT,
	BITSKI
} from '@/features/Common.js'
import { bitski, getContractConnect } from '@/features/Connectors.js'
var gConfig = AppConfig()
const wcProvider = new WalletConnectProvider({
	rpc: {
		97: BSC_RPC_ENDPOINT,
		4: ETH_RPC_ENDPOINT,
		80001: MATIC_RPC_ENDPOINT,
	},
})

export default {
	name: 'RewardBox',
	components: {
		RewardBoxItem,
		CountDownTimer,
	},
	data() {
		return {
			loginBy: window.localStorage.getItem('loginBy'),
			miningHashRate: '0',
			dvgEarned: '0 DVG',
			harvest: true,
			wallet_addr: this.$store?.state?.userInfo?.wallet_addr,
			networkRPC: window.localStorage.getItem('networkRPC'),
			fortmaticNetwork : window.localStorage.getItem('fortmaticNetwork'),
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
		staking_address: String
	},
	beforeMount() {
		if (this.loginBy === WALLETCONNECT) {
			const walletconnect = window.localStorage.getItem('walletconnect')
			let wll = JSON.parse(walletconnect)
			const chainId = formatChainId(wll.chainId)
		}
		this.contractCnn = getContractConnect(this.loginBy, ABI_STAKING, this.staking_address, this.networkRPC, this.fortmaticNetwork)
	},
	mounted() {
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
			try {
				//const contractConn = getContractConnect(this.loginBy, ABI_STAKING, this.staking_address, this.networkRPC, this.fortmaticNetwork)
				const data = await this.contractCnn.methods
					.getCampaignEarned(this.poolDuration.id, this.wallet_addr)
					.call()
				if (data) {
					this.dvgEarned = `${toFixedDecimal(
						formatEther(data),
						0
					)} DVG`
				}
			}
			catch(err) {
				console.log('err',err)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.reward-wrap {
	display: flex;
	width: 100%;

	.reward-box {
		background: #1c1a2e;
		border-radius: gREm(10);
		width: gREm(736);
		max-width: 100%;
		padding: gREm(35) gREm(20);
		margin-bottom: gREm(52);
		margin-right: gREm(25);
		.box-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
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

			.status {
				font-family: Montserrat, sans-serif;
				font-style: normal;
				font-weight: 700;
				font-size: gREm(20);
				line-height: gREm(22);
				&.green {
					color: #47e269;
				}
				&.red {
					color: #f6583e;
				}
				&.yellow {
					color: #FFD041;
				}
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
	.reward-btn {
		width: gREm(160);
		height: gREm(40);
		background: #F6583E;
		border-radius: gREm(10);
		font-size: gREm(16);
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: 'Montserrat';
		font-weight: 400;
		font-size: gREm(16);
		line-height: gREm(22);
		cursor: pointer;
	}
	.reward-btn + .reward-btn {
		margin-top: gREm(12);
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
