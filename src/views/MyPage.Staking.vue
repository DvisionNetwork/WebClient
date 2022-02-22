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
				:totalStakedLand="totalStakedLand"
				:myStakedLand="myStakedLand"
				:totalMiningHashRate="totalMiningHashRate"
				:myMiningHashRate="myMiningHashRate"
				:mininghashRatePerHour="mininghashRatePerHour"
				:timeCount="timeCount"
				:staking_address="staking_address"
			/>
			<div class="staked-land">
				<h2>Staked LANDs</h2>
				<div
					v-if="allowWithdraw"
					class="unlock-lands active"
					@click="handleUnlockAll"
				>
					Unlock all LANDs
				</div>
				<div v-else class="unlock-lands">Unlock all LANDs</div>
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
					:onCheckItem="
						() =>
							onCheckItemUnStakeModalConfirm(
								Number(item.nft_id),
								item.is_ERC1155 === 1 ? true : false,
								item.locked,
								item.name
							)
					"
					:isUnlock="true"
					:enableUnlock="allowWithdraw"
					:maxQuantity="item.locked"
					:hashRate="item.hashRate"
				/>
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
import { BigNumber, ethers } from 'ethers'
import {
	BSC_RPC_ENDPOINT,
	BSC_STAKING_ADDRESS,
	ETH_STAKING_ADDRESS,
	MATIC_STAKING_ADDRESS,
	BSC_CHAIN_ID,
	ETH_CHAIN_ID,
	MATIC_CHAIN_ID,
	BSC_ADDRESS_721,
	BSC_ADDRESS_1155,
	ETH_ADDRESS_721,
	ETH_ADDRESS_1155,
	MATIC_ADDRESS_721,
	MATIC_ADDRESS_1155,
} from '@/features/Common.js'
import { MSG_METAMASK_1, MSG_METAMASK_2 } from '@/features/Messages.js'
import ABI_STAKING from '@/abi/DvisionStakingUpgradeable.json'

import {
	renderUnlockContent,
	renderCampainNotYetContent,
	renderNotLoginContent,
	renderOnUnStakeAllNftsSuccessContent,
	renderOnUnStakeNftsSuccessContent,
	renderOnCheckItemUnStakeModalConfirmContent,
} from '@/data/RenderContent.js'
import { formatEther } from '@ethersproject/units'
import moment from 'moment'

const { ethereum } = window

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
			wallet_addr: this.$store?.state?.userInfo?.wallet_addr,
			current_addr: '',
			current_network: '',

			pages: [1],
			currentPage: 1,
			timeCount: {
				startValue: 0,
				endValue: 0,
			},
			poolDuration: {
				id: 1,
				duration: 0,
			},
			rewardPool: 0,
			statusCampain: 1,
			listNftsStake: [],
			totalStakedLand: '0',
			myStakedLand: '0',
			totalMiningHashRate: '0',
			myMiningHashRate: '0',
			mininghashRatePerHour: '0 DVG',
			allowWithdraw: false,
			staking_address: '',
			chainId: 0,
			address721: '',
			address1155: '',
		}
	},
	beforeMount() {
		this.getCurrentNetwork()
		this.getCurrentAddress()
	},
	mounted() {
		ethereum.on('accountsChanged', (accounts) => {
			this.current_addr = accounts[0]
		})
		// this.getAllowWithdrawAll()
		// this.onGetNftsStaked(1)
		// this.getCampaignInfo(1)
		// this.getMyStaked(1)
	},
	watch: {
		'poolDuration.id': {
			handler(id) {
				this.getCampaignInfo(id)
				this.onGetNftsStaked(id)
				this.getTotalMiningHashRate(id)
				this.getMyMiningHashRate(id)
				this.getTotalStaked(id)
				this.getMyStaked(id)
			},
		},
		statusCampain() {
			if (this.statusCampain !== 1) {
				const campainId = this.poolDuration.id
				// this.getCampaignInfo(campainId)
				this.onGetNftsStaked(campainId)
				this.getTotalMiningHashRate(campainId)
				this.getMyMiningHashRate(campainId)
				this.getTotalStaked(campainId)
				this.getMyStaked(campainId)
			}
		},
		current_network() {
			if (this.current_network) {
				this.setStakingAddress(this.current_network)
			}
		},
	},

	methods: {
		setStakingAddress(chainId) {
			const networkBSC = gConfig.wlt.getBscAddr().Network
			const networkPoygon = gConfig.wlt.getPolygonAddr().Network
			const networkETH = gConfig.wlt.getEthAddr().Network
			const id = this.poolDuration.id
			if (
				chainId !== networkBSC &&
				chainId !== networkETH &&
				chainId !== networkPoygon
			) {
				this.mxShowToast(MSG_METAMASK_2)
				return
			} else if (chainId === networkBSC) {
				this.staking_address = BSC_STAKING_ADDRESS
				this.chainId = BSC_CHAIN_ID
				this.address721 = BSC_ADDRESS_721
				this.address1155 = BSC_ADDRESS_1155
			} else if (chainId === networkETH) {
				this.staking_address = ETH_STAKING_ADDRESS
				this.chainId = ETH_CHAIN_ID
				this.address721 = ETH_ADDRESS_721
				this.address1155 = ETH_ADDRESS_1155
			} else if (chainId === networkPoygon) {
				this.staking_address = MATIC_STAKING_ADDRESS
				this.chainId = MATIC_CHAIN_ID
				this.address721 = MATIC_ADDRESS_721
				this.address1155 = MATIC_ADDRESS_1155
			}
			this.getAllowWithdrawAll()
			this.getCampaignInfo(id)
			this.onGetNftsStaked(id)
			this.getTotalMiningHashRate(id)
			this.getMyMiningHashRate(id)
			this.getTotalStaked(id)
			this.getMyStaked(id)
		},
		async getAllowWithdrawAll() {
			if (typeof window.ethereum !== 'undefined') {
				let web3 = new Web3(Web3.givenProvider || BSC_RPC_ENDPOINT)
				const contractConn = await new web3.eth.Contract(
					ABI_STAKING,
					this.staking_address
				)
				await contractConn.methods
					.allowWithdrawAll()
					.call()
					.then((tx) => {
						this.allowWithdraw = tx
					})
			}
		},
		checkNetwork(chainId) {
			const networkBSC = gConfig.wlt.getBscAddr().Network
			const networkPoygon = gConfig.wlt.getPolygonAddr().Network
			const networkETH = gConfig.wlt.getEthAddr().Network
			if (
				chainId === networkBSC ||
				chainId === networkPoygon ||
				chainId === networkETH
			) {
				return true
			} else {
				this.mxShowToast(MSG_METAMASK_2)
				return false
			}
		},
		checkAddress(current_addr) {
			if (current_addr.toLowerCase() === this.wallet_addr.toLowerCase())
				return true
			else return false
		},
		async getCurrentNetwork() {
			const chainId = await ethereum.request({
				method: 'eth_chainId',
			})
			this.current_network = chainId
			this.setStakingAddress(chainId)
		},
		async getCurrentAddress() {
			let web3 = new Web3(Web3.givenProvider || BSC_RPC_ENDPOINT)
			const acc = await web3.eth.getAccounts()
			this.current_addr = acc[0]
		},
		switchStatusCampain(status) {
			if (this.statusCampain !== status) {
				this.statusCampain = status
			}
		},

		pluck(objs, name) {
			var sol = []
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
			let obj = {
				width: '712px',
				title: 'Wallet not connected yet',
				content: renderNotLoginContent(),
				buttonTxt: 'I understand',
				isShow: true,
			}
			if (!this.wallet_addr) {
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
					staking_address: this.staking_address,
					chainId: this.chainId,
					address721: this.address721,
					address1155: this.address1155,
					onStakingSuccess: () =>
						this.onGetNftsStaked(this.poolDuration.id),
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
		async getTotalStaked(campaignId) {
			try {
				let params = {
					campaignId: campaignId,
					chainId: this.chainId,
				}
				const response = await axios.get(
					`${gConfig.public_api_sotatek}/nft-total-staked`,
					{ params }
				)
				if (response.status === 200) {
					this.totalStakedLand =
						response.data?.total_staked?.toString()
				}
			} catch (err) {
				console.log('catch', err)
			}
		},
		async getMyStaked(campaignId) {
			let params = {
				campaignId: campaignId,
				user: this.wallet_addr,
				chainId: this.chainId,
			}
			const response = await axios.get(
				`${gConfig.public_api_sotatek}/nft-my-staked`,
				{ params }
			)
			if (response.status === 200 && response.data) {
				this.myStakedLand = response.data?.totalStaked?.toString()
			}
		},
		async getTotalMiningHashRate(campainId) {
			if (typeof window.ethereum !== 'undefined') {
				let web3 = new Web3(Web3.givenProvider || BSC_RPC_ENDPOINT)
				const contractConn = await new web3.eth.Contract(
					ABI_STAKING,
					this.staking_address
				)
				await contractConn.methods
					.totalCampaignHashrate(campainId)
					.call()
					.then((tx) => {
						const mathTx = Number(tx) / 10
						this.totalMiningHashRate = mathTx
						if (Number(tx) > 0) {
							this.getMiningHashRatePerHour(
								this.poolDuration.duration,
								this.totalMiningHashRate
							)
						}
					})
			}
		},
		async getMyMiningHashRate(campainId) {
			if (typeof window.ethereum !== 'undefined') {
				let web3 = new Web3(Web3.givenProvider || BSC_RPC_ENDPOINT)
				const contractConn = await new web3.eth.Contract(
					ABI_STAKING,
					this.staking_address
				)
				await contractConn.methods
					.userInfo(campainId, this.wallet_addr)
					.call()
					.then((tx) => {
						const myMiningHashRate = Number(tx[0]) / 10
						this.myMiningHashRate = myMiningHashRate.toString()
					})
			}
		},

		getMiningHashRatePerHour(duration, totalMiningHashRate) {
			const mininghashRatePerHour =
				((10 * Number(this.rewardPool)) /
					(Number(totalMiningHashRate) * (duration / 86400))) |
				0
			this.mininghashRatePerHour = `${mininghashRatePerHour} DVG`
		},

		async getCampaignInfo(campainId) {
			console.log('staking_address', this.staking_address)
			try {
				if (typeof window.ethereum !== 'undefined') {
					let web3 = new Web3(Web3.givenProvider || BSC_RPC_ENDPOINT)
					const contractConn = await new web3.eth.Contract(
						ABI_STAKING,
						this.staking_address
					)
					await contractConn.methods
						.campaignInfo(campainId)
						.call()
						.then((data) => {
							this.poolDuration.duration = Number(data.duration)
							let resultNumber = BigNumber.from(
								data.rewardRate
							).mul(data.duration)
							this.rewardPool = Number(
								formatEther(resultNumber)
							).toFixed()
							//set time countdown
							const endValue = Number(data.timestampFinish)
							const startValue = endValue - Number(data.duration)
							const currValue = moment().unix()
							if (!this.allowWithdraw) {
								if (currValue > endValue) {
									this.allowWithdraw = true
								} else {
									this.allowWithdraw = false
								}
							}

							this.timeCount.startValue = startValue
							this.timeCount.endValue = endValue
							if (currValue > endValue) {
								//it's end
								this.switchStatusCampain(1)
							} else if (
								startValue <= currValue &&
								currValue <= endValue
							) {
								//had start
								this.switchStatusCampain(3)
							} else if (currValue < startValue) {
								//not start yet
								this.switchStatusCampain(2)
							}
						})
				}
			} catch (err) {
				console.log('catch', err)
			}
		},

		async onGetNftsStaked(campaignId) {
			let params = {
				owner: this.$store?.state?.userInfo?.wallet_addr,
				campaignId: campaignId,
				chainId: this.chainId,
			}
			const response = await axios.get(
				`${gConfig.public_api_sotatek}/nft-staked`,
				{ params }
			)
			if (response?.status === 200) {
				this.listNftsStake = response.data
				response.data.map((item) => {
					this.onGetHashRate(item.is_ERC1155, item.nft_id)
				})
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
		async onGetHashRate(is_ERC1155, nft_id) {
			try {
				const nft = this.listNftsStake.find((x) => x.nft_id === nft_id)
				//cal API
				const search = is_ERC1155 ? '1155' : '721'
				const response = await axios.get(
					`${gConfig.public_api_sotatek_2}/search_bep_${search}?token_id=${nft_id}`
				)
				if (response.status === 200) {
					nft.name = response.data.name
					nft.imageUrl = response.data.image
					nft.description = response.data.description
				}
				//Call SC
				const contractConn = await this.contractConnect(
					ABI_STAKING,
					this.staking_address
				)
				await contractConn.methods
					.tokenHashrate(is_ERC1155, nft_id)
					.call()
					.then((tx) => {
						nft.hashRate = Number(tx) / 10
					})
			} catch (err) {
				console.log('catch', err)
			}
		},
		onUnStakeAllNftsSuccess() {
			this.mxCloseConfirmModal()
			const obj = {
				width: '478px',
				title: 'Success',
				content: renderOnUnStakeAllNftsSuccessContent(),
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
				content: renderOnUnStakeNftsSuccessContent(),
				buttonTxt: 'OK',
				isShow: true,
			}
			this.mxShowSuccessModal(obj)
		},

		onCheckItemUnStakeModalConfirm(nftId, is_ERC1155, locked, name) {
			let params = {
				erc721TokenIds: is_ERC1155 ? [] : [nftId],
				erc1155TokenIds: is_ERC1155 ? [nftId] : [],
				erc1155Amounts: is_ERC1155 ? [locked] : [],
			}
			params = JSON.parse(JSON.stringify(params))
			const obj = {
				width: '712px',
				title: 'Unlock the selected LAND?',
				content: renderOnCheckItemUnStakeModalConfirmContent(name),
				buttonTxt: 'Unlock',
				isShow: true,
				onClick: () => this.onUnStakeNfts(params, false),
			}
			this.mxShowConfirmModal(obj)
		},
		async onUnStakeNfts(params, unLockAll) {
			if (!this.checkAddress(this.current_addr)) {
				this.mxShowToast(MSG_METAMASK_1)
				this.mxCloseConfirmModal()
				return
			}
			if (!this.checkNetwork(this.current_network)) {
				this.mxCloseConfirmModal()
				return
			}
			this.mxShowLoading('inf')
			const contractConn = await this.contractConnect(
				ABI_STAKING,
				this.staking_address // address Staking
			)

			console.log('params', params)

			await contractConn.methods
				.withdraw(this.poolDuration.id, params)
				.send({
					from: (await this.getAccounts())[0],
				})
				.then((tx) => {
					console.log('onUnStakeNfts', tx)
					this.mxCloseLoading()
					this.onGetNftsStaked(this.poolDuration.id)
					this.mxCloseConfirmModal()
					if (unLockAll) {
						this.onUnStakeAllNftsSuccess()
					} else {
						this.onUnStakeNftsSuccess()
					}
				})
				.catch((e) => {
					this.mxCloseLoading()
					console.log('onUnStakeNfts e', e)
					this.mxShowToast(e.message)
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
			&.active {
				background: #f6583e;
				cursor: pointer;
			}
		}
	}
	.list-card {
		display: flex;
		justify-content: flex-start;
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
@include media-max($media_small) {
	.my-staked-land {
		display: unset;
		margin-top: 20px;
		padding: 0 10px;
		.tab-menu {
			max-width: unset;
		}
		.contents {
			margin-left: unset;
			max-width: unset;
		}
	}
}
</style>
