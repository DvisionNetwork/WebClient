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
		</div>
		<div class="reward-wrap-btn">
			<div @click="showRewardTable" class="reward-btn">Reward table</div>
			<div @click="showMyReward" class="reward-btn">My reward</div>
		</div>
	</div>
</template>

<script>
import RewardBoxItem from '@/components/RewardBox.Item.vue'
import ABI_STAKING from '@/abi/DvisionStakingUpgradeable.json'
import CountDownTimer from '@/components/CountDownTimer.vue'
import AppConfig from '@/App.Config.js'
import { formatEther } from '@ethersproject/units'
import {
	toFixedDecimal,
	formatChainId,
	WALLETCONNECT,
	REWARD_TABLE_1,
	REWARD_TABLE_2,
	REWARD_TABLE_3,
} from '@/features/Common.js'
import { getContractConnect } from '@/features/Connectors.js'
import { fromHexToChainId } from '@/features/Common.js'
var gConfig = AppConfig()

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
		current_network: String,
		// staking_address: String
	},
	// beforeMount() {
	// 	if (this.loginBy === WALLETCONNECT) {
	// 		const walletconnect = window.localStorage.getItem('walletconnect')
	// 		let wll = JSON.parse(walletconnect)
	// 		const chainId = formatChainId(wll.chainId)
	// 	}
	// 	this.contractCnn = getContractConnect(this.loginBy, ABI_STAKING, this.staking_address, this.networkRPC, this.fortmaticNetwork)
	// },
	methods: {
		showRewardTable() {
			const obj = {
				isShow: true,
				day: 30,
				info: REWARD_TABLE_1,
			}
			switch(this.poolDuration.id) {
				case 1:
					obj.day = 30
					obj.info = REWARD_TABLE_1
					break;
				case 2:
					obj.day = 90
					obj.info = REWARD_TABLE_2
					break;
				case 3:
					obj.day = 180
					obj.info = REWARD_TABLE_3
					break;
				default: break;
			}	
			this.mxShowRewardTable(obj)
		},
		showMyReward() {
			const network = this.current_network
			const chainId = fromHexToChainId(network)
			const obj = {
				isShow: true,
				poolDuration: this.poolDuration,
				chainId,
				statusCampain: this.statusCampain
			}
			this.mxShowMyRewardModal(obj)
		},
	},
}
</script>

<style lang="scss" scoped>
.reward-wrap {
	display: flex;
	width: 100%;
	margin-bottom: gREm(52);
	
	.reward-box {
		background: #1c1a2e;
		border-radius: gREm(10);
		width: gREm(736);
		max-width: 100%;
		padding: gREm(35) gREm(20);
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
	.reward-wrap {
		display: flex;
    	flex-direction: column;
		.reward-box {
			padding: 20px;
			.box-title {
				.point {
					text-align: right;
					margin-top: 10px;
				}
			}
			.status {
				margin-top: auto;
			}
		}
		.reward-wrap-btn {
			display: flex;
			margin-top: gREm(24);
			justify-content: center;
			.reward-btn + .reward-btn {
				margin-top: gREm(0);
				margin-left: gREm(12);
			}
		}
	}
}
</style>
