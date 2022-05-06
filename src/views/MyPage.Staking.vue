<template>
	<div class="my-staked-land">
		<StakingTab :poolDuration="poolDuration" />
		<div class="contents">
			<h2 class="title" v-if="poolDuration.id === 1">
				Campaign status (30-day pool)
			</h2>
			<h2 class="title" v-if="poolDuration.id === 2">
				Campaign status (90-day pool)
			</h2>
			<h2 class="title" v-if="poolDuration.id === 3">
				Campaign status (180-day pool)
			</h2>
			<RewardBox
				:poolDuration="poolDuration"
				:rewardPool="rewardPool"
				:statusCampain="statusCampain"
				:switchStatusCampain="switchStatusCampain"
				:timeCount="timeCount"
				:current_network="current_network"
			/>
			<div class="staked-land">
				<div class="left-title">
					<h2>Staked LANDs</h2>
					<div class="dropdown-wrapper">
						<span class="child" id="name-land">
							<!-- <span v-if="isErc1155">ERC-1155</span>
								<span v-else>ERC-721</span> -->
							{{ landCode }}
							<img
								id="arrow"
								class="ic-filter"
								src="../assets/img/ic-arrow-down.svg"
						/></span>
						<Transition>
							<div
								v-if="showDropdown"
								class="dropdown-list"
								id="dropdown-list"
							>
								<div
									class="dropdown-item"
									v-for="item in listLandCode"
									:key="item"
									@click="handleClickItem(item)"
								>
									{{ item.name }}
								</div>
							</div>
						</Transition>
					</div>
				</div>
				<div
					v-if="statusCampain !== 3"
					class="unlock-lands"
					:class="{ active: landItems?.list?.length > 0 }"
					@click="handleUnlockAll"
				>
					Unlock all LANDs
				</div>
				<div v-else class="unlock-lands">Unlock all LANDs</div>
			</div>
			<div class="list-card">
				<AddLand :onClick="checkShowModal" :listStaking="listStaking" />
				<LandCard
					v-for="item in landItems.list"
					:name="item.n"
					:id="item.id"
					:key="item.id"
					:nftId="Number(item.nft_id)"
					:imageUrl="item.thumburl"
					:isErc1155="item.is_ERC1155 === 1 ? true : false"
					:isUnstake="true"
					:item="item"
					:tokenId="item.tokenId"
					:onCheckItem="
						() =>
							onCheckItemUnStakeModalConfirm(
								Number(item.tokenId),
								item.is_ERC1155 === 1 ? true : false,
								item.locked,
								item.n
							)
					"
					:isUnlock="true"
					:enableUnlock="statusCampain !== 3"
					:maxQuantity="item.locked"
				/>
			</div>
		</div>
		<PopupInput />
	</div>
</template>

<script>
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
import {
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
	formatChainId,
	checkProviderWallet,
	FORTMATIC,
	COINBASE,
	METAMASK,
	WALLETCONNECT,
	BITSKI,
	DENIED_TRANSACTION,
	USER_DECLINED,
} from '@/features/Common.js'
import { getContractConnect } from '@/features/Connectors.js'
import {
	MSG_METAMASK_1,
	MSG_METAMASK_2,
	MSG_METAMASK_4,
} from '@/features/Messages.js'
import ABI_STAKING from '@/abi/DvisionStakingUpgradeable.json'
import {
	renderUnlockContent,
	renderCampainNotYetContent,
	renderNotLoginContent,
	renderOnUnStakeAllNftsSuccessContent,
	renderOnUnStakeNftsSuccessContent,
	renderOnCheckItemUnStakeModalConfirmContent,
} from '@/data/RenderContent.js'
import moment from 'moment'
import {
	checkAddress,
	checkGasWithBalance,
	LAND_CODE,
	OUT_OF_GAS,
} from '../features/Common'
import { getWeb3 } from '../features/Connectors'
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
			loginBy: window.localStorage.getItem('loginBy'),
			// wallet_addr: this.$store?.state?.userInfo?.wallet_addr,
			current_addr: this.$store?.state?.wallet?.accounts[0],
			current_network: window.localStorage.getItem('currentNetwork'),
			fortmaticNetwork: window.localStorage.getItem('fortmaticNetwork'),
			networkRPC: window.localStorage.getItem('networkRPC'),
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
			showReward: false,
			landCode: LAND_CODE.SEOUL,
			showDropdown: false,
			listLandCode: [
				{
					name: 'SeoulA',
					id: 'gangnam',
				},
				{
					name: 'Newyork',
					id: 'newyork',
				},
				{
					name: 'London',
					id: 'london',
				},
				{
					name: 'Tokyo',
					id: 'tokyo',
				},
			],
			visible: false,
			// landItems: {},
		}
	},
	beforeMount() {
		if (this.loginBy === WALLETCONNECT) {
			const walletconnect = window.localStorage.getItem('walletconnect')
			let wll = JSON.parse(walletconnect)
			const chainId = formatChainId(Number(wll.chainId))
			this.setStakingAddress(chainId)
		} else if (this.loginBy === METAMASK || this.loginBy === COINBASE) {
			checkProviderWallet(this.loginBy)
			const chainId = window.localStorage.getItem('currentNetwork')
			const chainNetwork = formatChainId(Number(chainId))
			this.setStakingAddress(chainNetwork)
		} else if (this.loginBy === FORTMATIC || this.loginBy === BITSKI) {
			const chainId = window.localStorage.getItem('fortmaticNetwork')
			const chainNetwork = formatChainId(Number(chainId))
			this.setStakingAddress(chainNetwork)
		} else {
			const chainId = window.localStorage.getItem('currentNetwork')
			const chainNetwork = formatChainId(Number(chainId))
			this.setStakingAddress(chainNetwork)
		}
		this.setSearchQuery(1)
	},
	mounted() {
		// if (ethereum) {
		// 	ethereum.on('accountsChanged', (accounts) => {
		// 		this.current_addr = accounts[0]
		// 	})
		// }
		this.listenToDropdown()
		this.callLandItemList()
	},
	beforeUnmount() {
		window.removeEventListener('click', this.checkStateDropdown)
	},
	computed: {
		getDvLand() {
			return this.mxGetLandMap(this.mapId)
		},

		landMenu() {
			return this.mxGetLandMenu()
		},
		defaultMapId() {
			return this.mxGetLandDefaultMapId()
		},

		mapId() {
			var mapId = null
			var landQuery = this.mxGetLandQuery()
			// console.log("[Market.Land.vue] computed() mapId(): landQuery ==", landQuery);
			if (landQuery) {
				mapId = landQuery.mapId
			} else {
				mapId = this.mxGetLandDefaultMapId()
			}
			console.log('mapId in staking', mapId)
			return mapId
		},
		landItems() {
			// console.log("[Market.Land.vue] computed, landItems ", this.mxGetLandItems());
			return this.mxGetLandItems()
		},
		searchQuery() {
			return this.mxGetLandQuery()
		},
		wallet_addr() {
			return this.$store?.state?.userInfo?.wallet_addr
		},
	},
	watch: {
		'poolDuration.id': {
			handler(id) {
				this.handleClickItem(this.listLandCode[0])
				this.getCampaignInfo(id)
				// this.callLandItemList()
				// this.onGetNftsStaked(id)
				// this.getTotalMiningHashRate(id)
				// this.getMyMiningHashRate(id)
				// this.getTotalStaked(id)
				// this.getMyStaked(id)
			},
		},
		// '$store.state.landItems'(newVal) {
		// 	console.log('this.landItems', this.visible, this.landItems)
		// 	if (!this.visible) {
		// 		this.landItems = newVal
		// 	}
		// },
		'$store.state.showStakingModal.isShowModal': function () {
			const state = this.$store.state.showStakingModal
			this.visible = !!state
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
		mapId(newVal, oldVal) {
			if (!this.visible) {
				console.log('in mapIddddddd staking')
				const landQuery = this.mxGetLandQuery()
				landQuery.page = 1
				landQuery.search = ''
				this.search = ''
				const o = _U.Q('.search-box .text-input')
				if (o) o.value = ''
				this.mxSetLandQuery(landQuery)
				this.callLandItemList()
			}
		},
		searchQuery(newVal, oldVal) {
			// console.log("[Market.Land.vue] ======================= watch searchQuery ", newVal, oldVal);
			// this.setLandItems(newVal)
		},
		// current_network() {
		// 	if (this.current_network) {
		// 		this.setStakingAddress(this.current_network)
		// 	}
		// },
	},

	methods: {
		setSearchQuery(page) {
			if (!page || page == 0) page = 1

			var landType = this.tab_page == 'land-list' ? 'list' : 'map'
			var mapId = this.mapId
			var landQuery = this.mxGetLandQuery()
			console.log('in set search query', landQuery)
			if (_U.isDefined(landQuery, 'type')) landType = landQuery.type
			if (_U.isDefined(landQuery, 'mapId')) mapId = landQuery.mapId

			var query = {
				type: landType,
				mapId: mapId,
				page: page,
				count: gConfig.marketItem_count_per_page,
				search: this.search,
				for_sale: this.landSwitchForsale,
				order: this.currentOrder,
			}

			this.mxSetLandQuery(query)
		},
		handleClickItem(item) {
			this.landCode = item.name
			this.setLandMapId(item.id)
		},
		setLandMapId(mapId) {
			const landQuery = this.mxGetLandQuery()
			if (!landQuery) landQuery = {}
			if (landQuery.mapId != mapId) {
				console.log(
					'[Market.Land.vue] setLandMapId  mapId call mxSetLandQuery()',
					mapId,
					landQuery
				)
				landQuery.mapId = mapId
				this.mxSetLandQuery(landQuery)
			}
		},
		checkStateDropdown(e) {
			const className = ['dropdown-list', 'erc', 'name-land', 'arrow']
			const index = className.findIndex((ele) => ele === e.target.id)
			this.showDropdown = index !== -1 ? !this.showDropdown : false
		},
		listenToDropdown() {
			window.addEventListener('click', this.checkStateDropdown)
		},
		setStakingAddress(chainId) {
			this.current_network = chainId
			const networkBSC = gConfig.wlt.getBscAddr().Network
			const networkPolygon = gConfig.wlt.getPolygonAddr().Network
			const networkETH = gConfig.wlt.getEthAddr().Network
			if (
				chainId !== networkBSC &&
				chainId !== networkETH &&
				chainId !== networkPolygon
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
			} else if (chainId === networkPolygon) {
				this.staking_address = MATIC_STAKING_ADDRESS
				this.chainId = MATIC_CHAIN_ID
				this.address721 = MATIC_ADDRESS_721
				this.address1155 = MATIC_ADDRESS_1155
			}
			const id = this.poolDuration.id
			this.getCampaignInfo(id)
			this.onGetNftsStaked(id)
			this.getTotalMiningHashRate(id)
			this.getMyMiningHashRate(id)
			this.getTotalStaked(id)
			this.getMyStaked(id)
		},
		checkNetwork() {
			const networkBSC = gConfig.wlt.getBscAddr().Network
			const networkPolygon = gConfig.wlt.getPolygonAddr().Network
			const networkETH = gConfig.wlt.getEthAddr().Network
			const currentNetwork = window.localStorage.getItem('currentNetwork')
			if (
				currentNetwork === networkBSC ||
				currentNetwork === networkPolygon ||
				currentNetwork === networkETH
			) {
				return true
			} else {
				this.mxShowToast(MSG_METAMASK_2)
				return false
			}
		},
		checkAddress() {
			const currentAddress =
				window.localStorage.getItem('addressMetamask')
			return (
				currentAddress.toLowerCase() === this.wallet_addr.toLowerCase()
			)
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
			if (this.landItems.list.length <= 0) {
				return
			}
			// if (!checkAddress(this.wallet_addr)) {
			// 	this.mxShowToast(MSG_METAMASK_1)
			// 	this.mxCloseConfirmModal()
			// 	return
			// }
			if (!this.checkNetwork()) {
				this.mxCloseConfirmModal()
				return
			}
			const item721 = [...this.landItems.list]
			const item1155 = await this.listNftsStake.filter(
				(item) => item.is_ERC1155 === 1
			)

			let params = {
				erc721TokenIds: this.pluck(item721, 'tokenId'),
				erc1155TokenIds: this.pluck(item1155, 'tokenId'),
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
			} else if (this.statusCampain === 3) {
				obj.title = 'The campaign is ongoing'
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
						setTimeout(() => {
							this.onStakingSuccess(this.poolDuration.id)
						}, 2000),
				}
				this.mxShowStakingModal(stakingData)
			}
		},
		onStakingSuccess(campaignId) {
			this.onGetNftsStaked(campaignId)
			this.getCampaignInfo(campaignId)
			this.getTotalMiningHashRate(campaignId)
			this.getMyMiningHashRate(campaignId)
			this.getTotalStaked(campaignId)
			this.getMyStaked(campaignId)
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
				if (response.status === 200 && response.data.total_staked) {
					this.totalStakedLand =
						response.data?.total_staked?.toString()
				} else {
					this.totalStakedLand = '0'
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
			if (response.status === 200 && response.data.totalStaked) {
				this.myStakedLand = response.data?.totalStaked?.toString()
			} else {
				this.myStakedLand = '0'
			}
		},
		async getTotalMiningHashRate(campainId) {
			if (typeof window.ethereum !== 'undefined') {
				const contractConn = getContractConnect(
					this.loginBy,
					ABI_STAKING,
					this.staking_address,
					this.networkRPC,
					this.fortmaticNetwork
				)
			}
		},
		async getMyMiningHashRate(campainId) {
			if (typeof window.ethereum !== 'undefined') {
				const contractConn = getContractConnect(
					this.loginBy,
					ABI_STAKING,
					this.staking_address,
					this.networkRPC,
					this.fortmaticNetwork
				)
			}
		},

		getMiningHashRatePerHour(duration, totalMiningHashRate) {
			const mininghashRatePerHour =
				(10 * Number(this.rewardPool)) /
				(Number(totalMiningHashRate) * (duration / 86400))
			this.mininghashRatePerHour = `${mininghashRatePerHour} DVG`
		},

		async getCampaignInfo(campainId) {
			try {
				this.mxShowLoading()
				const contractConn = getContractConnect(
					this.loginBy,
					ABI_STAKING,
					this.staking_address,
					this.networkRPC,
					this.fortmaticNetwork
				)
				// const isAllow = await contractConn.methods
				// 	.allowWithdrawAll()
				// 	.call()
				const isAllow = true
				const data = await contractConn.methods
					.campaignInfo(campainId)
					.call()
				if (data) {
					this.poolDuration.duration = Number(data.duration)
					// let resultNumber = BigNumber.from(data.rewardRate).mul(
					// 	data.duration
					// )
					// this.rewardPool = Number(
					// 	formatEther(resultNumber)
					// ).toFixed()
					//set time countdown
					const endValue = Number(data.campaignEndTime)
					// const endValue = Number('1650444630')
					const startValue = Number(data.campaignStartTime)
					const currValue = moment().unix()
					// if (!isAllow) {
					// 	if (currValue > endValue) {
					// 		this.allowWithdraw = true
					// 	} else {
					// 		this.allowWithdraw = false
					// 	}
					// } else {
					// 	this.allowWithdraw = true
					// }
					this.timeCount.startValue = startValue
					this.timeCount.endValue = endValue
					if (currValue > endValue) {
						//it's end
						this.switchStatusCampain(1)
					} else if (
						startValue <= currValue &&
						currValue <= endValue
					) {
						//had start not staking
						this.switchStatusCampain(3)
					} else if (currValue < startValue) {
						//not start yet
						this.switchStatusCampain(2)
					}
				}
				this.mxCloseLoading()
			} catch (err) {
				this.mxCloseLoading()
				console.log('catch', err)
			}
		},
		callLandItemList() {
			const network = window.localStorage.getItem('currentNetwork')
			this.mxCallAndSetMyLandItemList(this.mapId, network, true)
		},
		setLandItems(query) {
			const dvLand = this.getDvLand
			if (!dvLand) return
			var landQuery = this.mxGetLandQuery()

			var ct = _U.getIfDefined(landQuery, ['order', 'ct'])
			if (!ct) ct = 'all'

			// console.log("[Marke.Land.vue] setLandItems() forSale:", forSale, this.landSwitchForsale);

			// 2자 이상
			var search =
				_U.isDefined(landQuery, 'search') && landQuery.search.length > 1
					? landQuery.search
					: null

			var blockListAll = []
			var currentOwner = _U
				.getIfDefined(this.$store.state, ['userInfo', 'wallet_addr'])
				.toLowerCase()

			for (let i = 0; i < dvLand.map.length; i++) {
				if (_U.isDefined(dvLand.map[i], 'id')) {
					var block = dvLand.map[i]
					if (
						block.owner_address &&
						block.owner_address.toLowerCase() == currentOwner
					) {
						blockListAll.push(block)
					}
				}
			}

			console.log('[Market.Land.vue] blockListAll==> ', blockListAll)

			const blockList = []
			// console.log('landQuery', landQuery)
			// var start = (landQuery.page - 1) * landQuery.count;
			// var end = start + landQuery.count;
			// for(var i=start; i <end; i++) {
			// 	if(_U.isDefined(blockListAll[i],'id')) {
			// 		blockList.push(blockListAll[i]);
			// 	}
			// }

			// console.log("[Market.Land.vue] blockList==> ", blockList);
			const total = blockListAll.length
			this.mxSetLandItems({
				total,
				page: 1,
				cpp: query.count,
				isStake: true,
				list: blockListAll,
				inMixin: false,
			})
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
				console.log('response.data', response.data)
			} else {
				this.listNftsStake = []
			}
		},
		// async onGetHashRate(is_ERC1155, nft_id, idx) {
		// 	try {
		// 		const nft = this.listNftsStake[idx]
		// 		//cal API
		// 		const search = is_ERC1155 ? '1155' : '721'
		// 		const response = await axios.get(
		// 			`${gConfig.public_api_sotatek_2}/search_bep_${search}?token_id=${nft_id}`
		// 		)
		// 		if (response.status === 200) {
		// 			nft.name = response.data.name
		// 			nft.imageUrl = response.data.image
		// 			nft.description = response.data.description
		// 		}
		// 		const contractConn = getContractConnect(
		// 			this.loginBy,
		// 			ABI_STAKING,
		// 			this.staking_address,
		// 			this.networkRPC,
		// 			this.fortmaticNetwork
		// 		)
		// 		await contractConn.methods
		// 			.tokenHashrate(is_ERC1155, nft_id)
		// 			.call()
		// 			.then((tx) => {
		// 				nft.hashRate = Number(tx) / 10
		// 			})
		// 	} catch (err) {
		// 		console.log('catch', err)
		// 	}
		// },
		onUnStakeAllNftsSuccess() {
			this.mxCloseConfirmModal()
			const obj = {
				width: '478px',
				title: 'Success',
				content: renderOnUnStakeAllNftsSuccessContent(),
				buttonTxt: 'OK',
				isShow: true,
			}
			setTimeout(() => {
				this.onStakingSuccess(this.poolDuration.id)
			}, 2000)
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
			setTimeout(() => {
				this.onStakingSuccess(this.poolDuration.id)
			}, 2000)
			this.mxShowSuccessModal(obj)
		},

		onCheckItemUnStakeModalConfirm(nftId, is_ERC1155, locked, name) {
			if (!this.checkNetwork()) {
				this.mxShowToast(MSG_METAMASK_2)
				return
			}
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
			if (!checkAddress(this.wallet_addr)) {
				this.mxShowToast(MSG_METAMASK_1)
				this.mxCloseConfirmModal()
				return
			}
			if (!this.checkNetwork()) {
				this.mxCloseConfirmModal()
				return
			}
			this.mxShowLoading('inf')
			const contractConn = getContractConnect(
				this.loginBy,
				ABI_STAKING,
				this.staking_address,
				this.networkRPC,
				this.fortmaticNetwork
			)
			if (
				this.loginBy === COINBASE ||
				this.loginBy === BITSKI ||
				this.loginBy === WALLETCONNECT
			) {
				const web3 = getWeb3(
					this.loginBy,
					this.networkRPC,
					this.current_network
				)
				const gasNumber = await contractConn.methods
					.withdraw(this.poolDuration.id, params)
					.estimateGas({
						from: this.current_addr,
					})
				const condition = await checkGasWithBalance(
					web3,
					gasNumber,
					this.current_addr
				)
				if (condition) {
					this.mxCloseLoading()
					this.mxShowToast(OUT_OF_GAS)
					return
				}
			}
			await contractConn.methods
				.withdraw(this.poolDuration.id, params)
				.send({
					from: this.current_addr,
				})
				.then((tx) => {
					console.log('onUnStakeNfts', tx)
					this.mxCloseLoading()
					this.onStakingSuccess(this.poolDuration.id)
					this.mxCloseConfirmModal()
					if (unLockAll) {
						this.onUnStakeAllNftsSuccess()
					} else {
						this.onUnStakeNftsSuccess()
					}
				})
				.catch((e) => {
					console.log('e', e)
					this.mxCloseLoading()
					if (
						e.message.includes('104') &&
						e.message.includes(USER_DECLINED)
					) {
						this.mxShowToast(USER_DECLINED)
					} else if (
						e.code === 4001 ||
						e.message === DENIED_TRANSACTION
					) {
						this.mxShowToast(e.message)
					} else {
						this.mxShowToast(MSG_METAMASK_4)
					}
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
	.left-title {
		display: flex;
		align-items: center;
		gap: gREm(30);

		.dropdown-wrapper {
			.child {
				display: flex;
				align-items: center;
				background: #f6583e;
				padding: gREm(10) 0.6875rem;
				border-radius: 0.625rem;
				cursor: pointer;
			}
			.dropdown-list {
				border: 1px solid #fff;
				background-color: #fff;
				width: 100%;
				padding: gREm(10);
				position: absolute;
				left: 0;
				border-radius: gREm(10);
				margin-top: gREm(5);
				z-index: 10;

				.dropdown-item {
					color: #000;
					padding: gREm(8) 0;
					cursor: pointer;
				}
			}
		}
	}
	.title {
		font-weight: 600;
		font-family: Montserrat, sans-serif;
		font-size: gREm(24);
		line-height: gREm(29);
		margin-bottom: gREm(24);
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

			.title {
				padding: 0 gREm(20);
			}

			.staked-land {
				flex-direction: column;
				height: 100%;
				gap: gREm(16);
				align-items: flex-start;
				padding: 0 gREm(20);
				h2 {
					@include Set-Font(
						$AppFont,
						gREm(22),
						gREm(32),
						#ffffff,
						600
					);
				}

				.unlock-lands {
					@include Set-Font(
						$AppFont,
						gREm(16),
						gREm(24),
						#ffffff,
						200
					);
				}
			}

			.list-card {
				padding: 0 gREm(20);
				width: 100%;
				.add-land {
					// width: 100%;
					max-width: 100%;
				}
			}
		}
	}
}
</style>
