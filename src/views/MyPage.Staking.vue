<template>
	<StakingTab :poolDuration="poolDuration" />
	<div class="contents">
		<h2 class="title">Reward Pool</h2>
		<RewardBox
			:poolDuration="poolDuration"
			:rewardPool="rewardPool"
			:statusCampain="statusCampain"
			:switchStatusCampain="switchStatusCampain"
		/>
		<div class="staked-land">
			<h2>Staked LANDs</h2>
			<div class="unlock-lands active" @click="handleUnlockAll">
				Unlock all LANDs
			</div>
		</div>
		<div class="list-card">
			<AddLand :onClick="checkShowModal" :listStaking="listStaking" />
			<LandCard :isDisable="false" :isUnlock="false" :isActive="true" />
			<LandCard :isDisable="false" :isUnlock="false" />
			<LandCard :isDisable="false" :isUnlock="true" />
		</div>
	</div>
	<PopupInput />
</template>

<script>
import Web3 from 'web3'
import StakingTab from '@/components/StakingTab.vue'
import MapLand from '@/components/MapLand.vue'
import MapItem from '@/components/MapItem.vue'
import RewardBox from '@/components/RewardBox.vue'
import LandCard from '@/components/LandCard.vue'
import AddLand from '@/components/AddLand.vue'
import { BigNumber } from 'ethers'
import { toFixedDecimal } from '@/features/Common.js'
import ABI_721 from '@/abi/ABI712.json'
import ABI_1155 from '@/abi/ABI1155.json'
import ABI_STAKING from '@/abi/DvisionStakingUpgradeable.json'

import {
	renderUnlockContent,
	renderCampainNotYetContent,
	renderNotLoginContent,
} from '@/data/RenderContent.js'
import { formatEther, parseEther } from '@ethersproject/units'

const Contract721Address = '0xF36721581B3dB68408A7189840C79Ad47C719c71'
const Contract1155Address = '0xD7191DDdF64D2Cf94Fe32e52ad3f9C6104926fb1'
const STATUS_721 = '0xD41eddEdB1891B626FADD17B328e14077c8248Cb'
const STATUS_1155 = '0x3a0792d301a40eBcd9199431b00AD26603b7cdc4'
const STAKING_ABI = '@/abi/StakingABI.json'

export default {
	name: 'staking',
	components: {
		StakingTab,
		MapLand,
		MapItem,
		RewardBox,
		LandCard,
		AddLand,
	},
	props: {
		tab_page: {
			type: String,
			default: 'staking',
		},
	},
	data() {
		return {
			pages: [1],
			currentPage: 1,
			poolDuration: {
				data: 30,
			},
			rewardPool: 0,
			statusCampain: 1,
		}
	},
	beforeMount() {
		console.log(
			'[Market.Land.vue] beforeMount(), route : ',
			this.$route,
			this.tab_page
		)
	},
	mounted() {
		this.getCampaignInfo()
	},
	beforeUpdate() {},
	updated() {},
	methods: {
		switchStatusCampain(status) {
			this.statusCampain = status
			if (status === 1) {
				this.rewardPool = '0'
			}
		},
		handleClick() {
			this.mxCloseConfirmModal()
			const obj = {
				width: '478px',
				title: 'Success',
				content:
					'All of your staked LANDs have been unlocked and returned to your account.',
				buttonTxt: 'OK',
				isShow: true,
			}
			this.mxShowSuccessModal(obj)
		},
		handleUnlockAll() {
			const obj = {
				width: '712px',
				title: 'Unlock all LANDs?',
				content: renderUnlockContent(),
				buttonTxt: 'Unlock all',
				isShow: true,
				onClick: this.handleClick,
			}
			this.mxShowConfirmModal(obj)
		},
		checkShowModal() {
			const acc = this.$store?.state?.userInfo?.wallet_addr
			let obj = {
				width: '712px',
				title: 'Wallet not connected yet',
				content: renderNotLoginContent(),
				buttonTxt: 'I understand',
				isShow: true,
			}
			if (!acc) {
				this.mxShowSuccessModal(obj)
			} else if (this.statusCampain !== 3) {
				obj.title = 'Staking campaign is unavailable'
				obj.content = renderCampainNotYetContent()
				this.mxShowSuccessModal(obj)
			} else {
				this.visible = true
				const stakingData = {
					duration: this.poolDuration,
					isShowModal: true,
				}
				this.mxShowStakingModal(stakingData)
			}
		},
		async getAccounts() {
			try {
				let acc = await window.ethereum.request({
					method: 'eth_requestAccounts',
				})
				return acc
			} catch (e) {
				return []
			}
		},
		async getCampaignInfo() {
			if (typeof window.ethereum !== 'undefined') {
				let web3 = new Web3(
					Web3.givenProvider ||
						'https://data-seed-prebsc-1-s1.binance.org:8545/'
				)
				const contractConn = await new web3.eth.Contract(
					ABI_STAKING.abi,
					'0x019D5b2B45fb01FbD77401bd1809EA121e222A23'
				)
				await contractConn.methods
					.campaignInfo(1)
					.call()
					.then((data) => {
						let x = BigNumber.from(data.rewardRate).mul(
							data.duration
						)
						this.rewardPool = toFixedDecimal(formatEther(x), 0)
					})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.contents {
	margin-left: gREm(91);
	width: 100%;
	max-width: gREm(921);
	@include FLEXV(space-between, flex-start);
	.title {
		font-weight: 600;
		font-family: Montserrat, sans-serif;
		font-size: gREm(24);
		line-height: gREm(29);
		margin-bottom: gREm(25);
	}
	.staked-land {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: gREm(45);
		width: 100%;
		margin-bottom: gREm(17);
		font-family: Montserrat, sans-serif;
		.staked-title {
			font-family: Montserrat, sans-serif;
			font-size: gREm(24);
			font-style: normal;
			font-weight: 600;
			line-height: gREm(29);
			letter-spacing: 0em;
			text-align: left;
		}
		.unlock-lands {
			border-radius: gREm(10);
			height: gREm(45);
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 gREm(11);
			font-size: gREm(16);
			line-height: gREm(22);
			font-family: Montserrat, sans-serif;
			background: #5f5f5f;
			cursor: pointer;
			&.active {
				background: #f6583e;
			}
		}
	}
	.list-card {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: gREm(34);
		margin-bottom: gREm(20);
	}
}

@include media-max($media_large) {
	// 1200
	.contents {
	}
}

@include media-max($media_medium) {
	// 1024
	.contents {
	}
}
</style>
