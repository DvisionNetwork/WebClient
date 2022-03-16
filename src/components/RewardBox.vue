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
				const contractConn = getContractConnect(this.loginBy, ABI_STAKING, this.staking_address, this.networkRPC, this.fortmaticNetwork)
				const data = await contractConn.methods
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
		// async contractConnect(abi, address_ct) {
		// 	try {
		// 		let web3
		// 		if (this.loginBy === FORTMATIC) {
		// 			const options = {
		// 				rpcUrl: this.networkRPC,
		// 				chainId: this.fortmaticNetwork,
		// 			}
		// 			const fm = new Fortmatic(FORTMATIC_API_KEY, options)
		// 			web3 = new Web3(fm.getProvider())
		// 		} else if (this.loginBy === WALLETCONNECT) {
		// 			wcProvider.enable()
		// 			web3 = new Web3(wcProvider)
		// 		} else if(this.loginBy === BITSKI) {
		// 			const network = {
  	// 				rpcUrl: BSC_RPC_ENDPOINT,
  	// 				chainId: 97
		// 			}
		// 			const bitskiProvider = bitski.getProvider({ network: network });
		// 			web3 = new Web3(bitskiProvider)
		// 		}
		// 		else web3 = new Web3(Web3.givenProvider)
		// 		const contractConn = new web3.eth.Contract(abi, address_ct)
		// 		return contractConn
		// 	}
		// 	catch(err) {
		// 		console.log('err', err)
		// 	}
		// },
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
