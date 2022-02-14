<template>
	<div class="my-staked-land">
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
				<LandCard
					v-for="item in listNftsStake"
					:name="item.name"
					:id="item.id"
					:key="item.id"
					:nftId="Number(item.nft_id)"
					:imageUrl="item.image_url"
					:isErc1155="item.is_ERC1155 === 1 ? true : false"
					:isUnstake="true"
					:onCheckItem="() => onCheckItemUnStakeModalConfirm( Number(item.nft_id), (item.is_ERC1155 === 1 ? true : false), item.locked )"
					:isUnlock="true"
					:maxQuantity="item.locked"
				/>
				<!-- <LandCard :isDisable="false" :isUnlock="false" :isActive="true" />
				<LandCard :isDisable="false" :isUnlock="false" />
				<LandCard :isDisable="false" :isUnlock="true" /> -->
			</div>
		</div>
		<PopupInput />
	</div>
</template>

<script>
import Web3 from 'web3'
import axios from 'axios'
import AppConfig from '@/App.Config.js'
var gConfig = AppConfig()

import StakingTab from '@/components/StakingTab.vue'
import MapLand from '@/components/MapLand.vue'
import MapItem from '@/components/MapItem.vue'
import RewardBox from '@/components/RewardBox.vue'
import LandCard from '@/components/LandCard.vue'
import AddLand from '@/components/AddLand.vue'
import { BigNumber } from 'ethers'
import { toFixedDecimal } from '@/features/Common.js'
import ABI_STAKING from '@/abi/DvisionStakingUpgradeable.json'

import {
	renderUnlockContent,
	renderCampainNotYetContent,
	renderNotLoginContent,
} from '@/data/RenderContent.js'
import { formatEther, parseEther } from '@ethersproject/units'

const ADDRESS_721 = '0xD41eddEdB1891B626FADD17B328e14077c8248Cb'
const ADDRESS_1155 = '0x3a0792d301a40eBcd9199431b00AD26603b7cdc4'
const STAKING_ADDRESS = '0x019D5b2B45fb01FbD77401bd1809EA121e222A23'
const BSC_RPC_ENDPOINT = 'https://data-seed-prebsc-1-s1.binance.org:8545/'

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
			listNftsStake: [],
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
		this.onGetNftsStaked(1)
		this.getCampaignInfo()
	},
	beforeUpdate() {},
	updated() {},
	watch: {
		'poolDuration.data': {
			handler(dur) {
				this.onGetNftsStaked(this.getUint8(dur))
			},
		},
	},

	methods: {
		switchStatusCampain(status) {
			this.statusCampain = status
			if (status === 1) {
				this.rewardPool = '0'
			}
		},

		getUint8(val) {
			if (val === 90) {
				return 3
			} else if (val === 60) {
				return 2
			} else {
				return 1
			}
		},

		pluck(objs, name) {
			var sol = [];
			for (var i in objs) {
				if (objs[i]?.hasOwnProperty(name)) {
					sol.push(Number(objs[i][name]))
				}
			}
			return sol
		},

		async handleUnlockAll() {
			const item721 = await this.listNftsStake.filter(
				(item) => item.is_ERC1155 === 0
			)
			const item1155 = await this.listNftsStake.filter(
				(item) => item.is_ERC1155 === 1
			)

			let params = {
				erc721TokenIds: this.pluck(item721, 'nft_id'),
				erc1155TokenIds: this.pluck(item1155, 'nft_id'),
				erc1155Amounts: this.pluck(item1155, 'locked'),
			}

			const obj = {
				width: '712px',
				title: 'Unlock all LANDs?',
				content: renderUnlockContent(),
				buttonTxt: 'Unlock all',
				isShow: true,
				onClick: () => this.onUnStakeNfts(params, true),
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

		async onGetNftsStaked(campaignId) {
			let params = {
				owner: this.$store?.state?.userInfo?.wallet_addr,
				campaignId: campaignId,
				chainId: 97,
			}
			const response = await axios.get(
				`${gConfig.public_api_sotatek}/nft-staked`,
				{ params }
			)
			if (response?.status === 200) {
				this.listNftsStake = response.data
				// this.listNfts721Check = []
				// this.listShowers = this.listNfts
			} else {
				this.listNftsStake = []
			}
		},

		async contractConnect(abi, address_ct) {
			if (typeof window.ethereum !== 'undefined') {
				let web3 = new Web3(Web3.givenProvider || BSC_RPC_ENDPOINT)
				let contractConn = await new web3.eth.Contract(abi, address_ct)
				return contractConn
			}
		},

		onUnStakeAllNftsSuccess() {
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

		onUnStakeNftsSuccess() {
			this.mxCloseConfirmModal()
			const obj = {
				width: '478px',
				title: 'Success',
				content:
					'The selected LAND has been unlocked and returned to your account.',
				buttonTxt: 'OK',
				isShow: true,
			}
			this.mxShowSuccessModal(obj)
		},

		onCheckItemUnStakeModalConfirm(nftId, is_ERC1155, locked) {
			let params = {
				erc721TokenIds: is_ERC1155 ? [] : [nftId],
				erc1155TokenIds: is_ERC1155 ? [nftId] : [],
				erc1155Amounts: is_ERC1155 ? [locked] : [],
			}
			params = JSON.parse(JSON.stringify(params))
			const obj = {
				width: '712px',
				title: 'Unlock the selected LAND?',
				content:
					'The selected LAND will be unlocked and returned to your account. Are you sure you want to unlock Dvision LAND: Gangnam-Daero Intersection 3x3?',
				buttonTxt: 'Unlock',
				isShow: true,
				onClick: () => this.onUnStakeNfts(params, false),
			}
			this.mxShowConfirmModal(obj)
		},

		async onUnStakeNfts(params, unLockAll) {
			const contractConn = await this.contractConnect(
				ABI_STAKING.abi,
				STAKING_ADDRESS // address Staking
			)

			const unit8 = await this.getUint8(this.poolDuration.data)

			console.log('params', params)

			await contractConn.methods
				.withdraw(
					unit8, // 30 days = 1, 60 days = 2, 90 days = 3
					params
				)
				.send({
					from: (await this.getAccounts())[0],
				})
				.then((tx) => {
					console.log('onUnStakeNfts', tx)
					this.onGetNftsStaked(unit8)
					this.mxCloseConfirmModal()
					if (unLockAll) {
						this.onUnStakeAllNftsSuccess()
					} else {
						this.onUnStakeNftsSuccess()
					}
				})
				.catch((e) => {
					console.log('onUnStakeNfts e', e)
					this.mxCloseConfirmModal()
				})
		},
	},
}
</script>

<style lang="scss" scoped>
.my-staked-land {
	display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 4.8125rem;
    width: 100%;
    height: auto;
}
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
