<template>
	<StakingTab />
	<div class="contents">
		<h2 class="title">Reward Pool</h2>
		<RewardBox />
		<div class="staked-land">
			<h2 class="">Staked LANDs</h2>
			<div class="unlock-lands active" @click="handleUnlockAll">
				Unlock all LANDs
			</div>
		</div>
		<div class="list-card">
			<AddLand :onClick="showModal" />
			<LandCard :isDisable="false" :isUnlock="false" :isActive="true" />
			<LandCard :isDisable="false" :isUnlock="false" />
			<LandCard :isDisable="false" :isUnlock="true" />
			<LandCard :isDisable="true" :isUnlock="true" />
			<LandCard :isDisable="true" :isUnlock="false" />
		</div>
	</div>
	<PopupInput />
</template>

<script>
import axios from 'axios'
import Web3 from "web3"
import AppConfig from '@/App.Config.js'
var gConfig = AppConfig()

import StakingTab from '@/components/StakingTab.vue'
import MapLand from '@/components/MapLand.vue'
import MapItem from '@/components/MapItem.vue'
import RewardBox from '@/components/RewardBox.vue'
import LandCard from '@/components/LandCard.vue'
import AddLand from '@/components/AddLand.vue'


import ABI_721 from '@/abi/ABI712.json'
import ABI_1155 from '@/abi/ABI1155.json'
import ABI_APPROVE_ADD_LISTING from '@/abi/DvisionStakingUpgradeable.json'

const Contract721Address= "0xF36721581B3dB68408A7189840C79Ad47C719c71"
const Contract1155Address= "0xD7191DDdF64D2Cf94Fe32e52ad3f9C6104926fb1"
const STATUS_721 = "0xD41eddEdB1891B626FADD17B328e14077c8248Cb"
const STATUS_1155 = "0x3a0792d301a40eBcd9199431b00AD26603b7cdc4"


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

	beforeMount() {
		console.log(
			'[Market.Land.vue] beforeMount(), route : ',
			this.$route,
			this.tab_page
		)
	},
	mounted() {
		// this.onGetNftowner();
		// this.onAddListing()
	},
	beforeUpdate() {},
	updated() {},
	data() {
		return {
			pages: [1],
			currentPage: 1,
			tab_left: 1,
		}
	},
	watch: {},
	methods: {
		renderUnlockContent() {
			return `
			<p>All staked LANDs will be unlocked and returned to your account. Are you sure you want to unlock all staked LANDs?</p><br />
			<p>(You can:</p>
			<p>- leave the staked LANDs in the pool until the next campaign starts to continue staking them</p>
			<p>- or, unlock them now if you want to use them)</p>
			`
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
				content: this.renderUnlockContent(),
				buttonTxt: 'Unlock',
				isShow: true,
				onClick: this.handleClick,
			}
			this.mxShowConfirmModal(obj)
		},
		showModal() {
			// this.visible = true;
			this.mxShowStakingModal()
		},
		handleOk(e) {
			this.ModalText = 'The modal will be closed after two seconds'
			this.confirmLoading = true
			setTimeout(() => {
				this.visible = false
				this.confirmLoading = false
			}, 2000)
		},
		handleCancel(e) {
			console.log('Clicked cancel button')
			this.visible = false
		},

		async onGetNftowner() {
			let params = {
				owner: '0x53f28C491f44EF9d37d3EBc83E2193c170423B80', 
				collectionAddress: "0xd41eddedb1891b626fadd17b328e14077c8248cb",
				chainId: 97,
			}
			console.log('[MyPage.Inventory] callMyItems() query:', params)
			const response = await axios.get(
				`${gConfig.public_api_sotatek}/nft-owner`,
				{ params }
			)
			console.log('response', response)
			// this.mxShowLoading()
			// _U.callPost({
			// 	url: `${gConfig.public_api_sotatek}/nft-owner`,
			// 	data: params,
			// 	callback: (resp) =>{
			// 		console.log("[MyPage.Inventory] callMyItems()-> resp ", resp);
			// 	}
			// });
			// console.log('Clicked cancel button111111111111111')
		},

		async onAddListing() {
			if (typeof window.ethereum !== 'undefined') {
				let web3 = new Web3(Web3.givenProvider || "https://data-seed-prebsc-1-s1.binance.org:8545/")
				const contractConn = await new web3.eth.Contract(
					ABI_721,
					Contract721Address
				)
				await contractConn.methods
					.approve(Contract721Address, 123131)
					.send({
						from: '0x53f28C491f44EF9d37d3EBc83E2193c170423B80',
					})
					.then((tx) => {
						console.log(tx)
					})
					.catch((e) => {
						console.log(e)
					})
			}
		}
	},
}
</script>

<style lang="scss" scoped>
.contents {
	padding-left: gREm(35);
	width: 100%;
	@include FLEXV(space-between, flex-start);
	.title {
		font-weight: 600;
		font-family: 'Montserrat, sans-serif';
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
		.staked-title {
			font-family: 'Montserrat, sans-serif';
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
			font-family: 'Montserrat, sans-serif';
			background: #5f5f5f;
			cursor: pointer;
			&.active {
				background: #f6583e;
			}
		}
	}
	.list-card {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: gREm(10);
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
