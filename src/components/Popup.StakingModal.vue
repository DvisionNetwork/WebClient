<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div class="modal-header">
						<div class="title">Staking: Add LAND(s)</div>
						<button class="modal-close-btn">
							<img
								src="../assets/img/Close.svg"
								alt="close"
								@click="closePopup"
							/>
						</button>
					</div>
					<div class="search">
						<img
							class="ic-search"
							src="../assets/img/ic-search.svg"
						/>
						<input
							type="text"
							v-model="keyword"
							ref="inputSearch"
							@keyup="onSearch($event.target.value)"
							maxlength="255"
						/>
						<div id="erc" class="erc">
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
					<div class="desc" v-if="listShowers.length !== 0">
						Staking a LAND(s) will yield DVG in Dvision WORLD.
						Select one or multiple LANDs to stake.
					</div>
					<div class="list-staking">
						<LandCard
							v-for="item in landItemsInPopup.list"
							:name="item.n"
							:id="item.id"
							:key="item.id"
							:nftId="Number(item.nft_id)"
							:imageUrl="item.thumburl"
							:isActive="getActive(Number(item.tokenId))"
							:onConfirmQuantity1155="
								(quantity, nftId) =>
									onConfirmQuantity1155(quantity, nftId)
							"
							:onCheckItem="
								() => onCheckItem(Number(item.tokenId))
							"
							:isErc1155="isErc1155"
							:cancelQuantityModal="
								() => closeSelectQuantityModal()
							"
							:maxQuantity="item.value"
							:hashRate="item.hashRate"
							:tokenId="item.tokenId"
							:item="item"
						/>
						<div v-if="landMenu.length === 0" class="no-lands">
							No LANDs found.
						</div>
					</div>
					<div class="line"></div>
					<div class="bottom">
						<div class="bottom-left" @click="onCheckingUnder">
							<div class="box-chk">
								<img
									v-if="hadUnderstand"
									src="../assets/img/img-checkbox-active.svg"
								/>
								<img
									v-else
									src="../assets/img/img-checkbox.svg"
								/>
							</div>
							<span
								>I understand that will not be able to use or
								unstake my LANDs during the Staking period
							</span>
						</div>
						<div class="bottom-right">
							<span
								v-if="onEnableStakeButton()"
								class="btn-stake active"
								@click="onStakeNft"
								>Stake</span
							>
							<span v-else class="btn-stake">Stake</span>
							<span class="btn-cancel" @click="closePopup"
								>Cancel</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import Web3 from 'web3'
import _ from 'lodash'
import axios from 'axios'
import AppConfig from '@/App.Config.js'
var gConfig = AppConfig()
import ABI_721 from '@/abi/ABI712.json'
import ABI_1155 from '@/abi/ABI1155.json'
import ABI_STAKING from '@/abi/DvisionStakingUpgradeable.json'
import {
	renderSuccessContent,
	renderSwitchNftContent,
} from '@/data/RenderContent.js'
import {
	FORTMATIC,
	formatChainId,
	WALLETCONNECT,
	checkErrorMessage,
	USER_DECLINED,
	LAND_CODE,
	METAMASK,
	COINBASE,
} from '@/features/Common.js'
import { getContractConnect } from '@/features/Connectors.js'
import {
	MSG_METAMASK_1,
	MSG_METAMASK_2,
	MSG_METAMASK_4,
} from '@/features/Messages.js'
import LandCard from '@/components/LandCard.vue'
import { BITSKI, checkGasWithBalance, OUT_OF_GAS } from '../features/Common'
import { getWeb3 } from '../features/Connectors'
const { ethereum } = window
export default {
	components: {
		LandCard,
	},
	data() {
		return {
			loginBy: window.localStorage.getItem('loginBy'),
			submitData: null,
			hadUnderstand: false,
			isErc1155: false,
			listNfts: [],
			listNfts721Check: [],
			listNfts1155Check: [],
			listNfts1155Quantity: [],
			keyword: '',
			listShowers: [],
			current_addr: this.$store?.state?.wallet?.accounts[0],
			current_network: window.localStorage.getItem('currentNetwork'),
			wallet_addr: this.$store?.state?.userInfo?.wallet_addr,
			networkRPC: window.localStorage.getItem('networkRPC'),
			fortmaticNetwork: window.localStorage.getItem('fortmaticNetwork'),
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
			currentOrder: { name: 'land_ct_all', ct: 'all' },
		}
	},
	beforeMount() {
		if (this.loginBy === WALLETCONNECT) {
			const walletconnect = window.localStorage.getItem('walletconnect')
			let wll = JSON.parse(walletconnect)
			const chainId = formatChainId(wll.chainId)
			this.current_network = chainId
		} else if (this.loginBy === FORTMATIC) {
			const fortmaticNetwork =
				window.localStorage.getItem('fortmaticNetwork')
			this.current_network = formatChainId(fortmaticNetwork)
		} else {
			const fortmaticNetwork =
				window.localStorage.getItem('currentNetwork')
			this.current_network = formatChainId(fortmaticNetwork)
		}
		this.setSearchQuery(1)
	},
	mounted() {
		if (
			(ethereum && this.loginBy === METAMASK) ||
			this.loginBy === COINBASE
		) {
			ethereum.on('accountsChanged', (accounts) => {
				this.current_addr = accounts[0]
			})
			this.getEtherAccounts()
		}
		// this.onGetNftowner(this.isErc1155)
		this.checkDropdown()
		// this.popType = authInfo.type;
		this.setLandMapId(this.listLandCode[0].id)
		this.callLandItemList()
	},
	beforeUnmount() {
		window.removeEventListener('click', this.checkStateDropdown)
	},
	computed: {
		userInfo() {
			return this.mxGetUserInfo()
		},
		getDvLand() {
			console.log('map iddddd', this.mapId)
			return this.mxGetLandMap(this.mapId, true)
		},
		landMenu() {
			return this.mxGetLandMenuPopUp()
		},
		mapId() {
			let mapId = null
			const landQuery = this.mxGetLandQuery()
			console.log('landQuery in popup', landQuery)
			// console.log("[Market.Land.vue] computed() mapId(): landQuery ==", landQuery);
			if (landQuery) {
				mapId = landQuery.mapId
			} else {
				mapId = this.mxGetLandDefaultMapId()
			}
			return mapId
		},
		landItemsInPopup() {
			console.log('arrays', this.mxGetLandItemsInPopupStaking())
			return this.mxGetLandItemsInPopupStaking()
		},
		searchQuery() {
			return this.mxGetLandQuery()
		},
	},
	props: {
		data: Object,
		onStakingSuccess: Function,
	},
	watch: {
		isErc1155() {
			this.onGetNftowner(this.isErc1155)
		},
		value(value) {
			this.$emit('onChange', value)
		},
		keyword() {
			if (this.keyword.length > 0) {
				const result = this.listNfts.filter(
					(x) =>
						x.name
							?.toLowerCase()
							.includes(this.keyword.trim().toLowerCase()) ||
						x.nft_id === this.keyword
				)
				this.listShowers = result
			} else {
				this.listShowers = this.listNfts
			}
		},
		searchQuery(newVal, oldVal) {
			// console.log("[Market.Land.vue] ======================= watch searchQuery ", newVal, oldVal);
			this.setLandItems(newVal)
		},
		mapId(newVal, oldVal) {
			// console.log("[Market.Land.vue] ======================= watch mapId ", newVal, oldVal);
			var landQuery = this.mxGetLandQuery()
			console.log('landQuery', landQuery)
			landQuery.page = 1
			landQuery.search = ''
			this.search = ''
			var o = _U.Q('.search-box .text-input')
			if (o) o.value = ''
			this.mxSetLandQuery(landQuery)
			this.callLandItemList()
		},
	},
	methods: {
		setSearchQuery(page) {
			if (!page || page == 0) page = 1

			let landType = this.tab_page == 'land-list' ? 'list' : 'map'
			let mapId = this.mapId
			const landQuery = this.mxGetLandQuery()
			console.log('in set search query', landQuery)
			if (_U.isDefined(landQuery, 'type')) landType = landQuery.type
			if (_U.isDefined(landQuery, 'mapId')) mapId = landQuery.mapId

			const query = {
				type: landType,
				mapId: mapId,
				page: page,
				count: gConfig.marketItem_count_per_page,
				search: this.search,
				for_sale: this.landSwitchForsale,
				order: this.currentOrder,
			}
			console.log('query', query)

			this.mxSetLandQuery(query)
		},
		setLandItems(query) {
			var dvLand = this.getDvLand
			if (!dvLand) return
			console.log('[Market.Land.vue] setLandItems() dvLand==> ', dvLand)
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
			this.mxSetLandItemsInPopupStaking({
				total,
				page: 1,
				cpp: query.count,
				list: blockListAll,
			})
		},
		callLandItemList() {
			const network = window.localStorage.getItem('currentNetwork')
			this.mxCallAndSetMyLandItemList(this.mapId, network, false)
		},
		handleClickItem(item) {
			this.landCode = item.name
			this.keyword = ''
			this.setLandMapId(item.id)
		},
		setLandMapId(mapId) {
			const landQuery = this.mxGetLandQuery()
			if (!landQuery) landQuery = {}
			// console.log("[Market.Land.vue] setLandMapId  mapId",mapId, landQuery);
			if (landQuery.mapId != mapId) {
				// console.log("[Market.Land.vue] setLandMapId  mapId call mxSetLandQuery()",mapId, landQuery);
				landQuery.mapId = mapId
				this.mxSetLandQuery(landQuery)
			}
		},
		checkStateDropdown(e) {
			const className = ['dropdown-list', 'erc', 'name-land', 'arrow']
			const index = className.findIndex((ele) => ele === e.target.id)
			this.showDropdown = index !== -1 ? !this.showDropdown : false
		},
		checkDropdown() {
			window.addEventListener('click', this.checkStateDropdown)
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
			let accountAddWalletConnect = null
			if (this.loginBy === WALLETCONNECT) {
				const walletConnect =
					window.localStorage.getItem('walletconnect')
				const wc = JSON.parse(walletConnect)
				accountAddWalletConnect = wc.accounts[0]
			}
			const currentAddress =
				this.loginBy === WALLETCONNECT
					? accountAddWalletConnect
					: window.localStorage.getItem('addressMetamask')
			return currentAddress
				? currentAddress.toLowerCase() ===
						this.wallet_addr.toLowerCase()
				: true
		},
		onEnableStakeButton() {
			if (!this.hadUnderstand) return false
			if (this.isErc1155 && this.listNfts1155Check.length === 0)
				return false
			if (!this.isErc1155 && this.listNfts721Check.length === 0)
				return false
			return true
		},
		// async onGetHashRate(is_ERC1155, nft_id, idx) {
		// 	try {
		// 		const nft = this.listNfts.find((x) => x.nft_id === nft_id)
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
		// 			this.data.staking_address,
		// 			this.networkRPC,
		// 			this.fortmaticNetwork
		// 		)
		// 		await contractConn.methods
		// 			.tokenHashrate(is_ERC1155, nft_id)
		// 			.call()
		// 			.then((tx) => {
		// 				nft.hashRate = Number(tx) / 10
		// 			})
		// 		if (this.listNfts.length - 1 === idx) {
		// 			setTimeout(() => {
		// 				this.mxCloseLoading()
		// 			}, 2000)
		// 		}
		// 	} catch (err) {
		// 		this.mxCloseLoading()
		// 		console.log('catch', err)
		// 	}
		// },
		onSearch(text) {
			const defaultData = { ...this.$store.state.defaultLandItemsPopup }
			let filterItems = [...defaultData.list]
			if (text) {
				filterItems = [...defaultData.list].filter(
					(ele) =>
						ele.tokenId.includes(text) ||
						ele.n.toLowerCase().includes(text.toLowerCase())
				)
			}

			const params = {
				...defaultData,
				list: filterItems,
			}
			this.mxSetLandItemsInPopupStaking(params)
		},
		confirmSwitch() {
			this.keyword = ''
			this.hadUnderstand = false
			this.isErc1155 = !this.isErc1155
			this.listNfts721Check = []
			this.listNfts1155Check = []
			this.mxCloseConfirmModal()
		},
		switchErc() {
			if (
				this.listNfts721Check.length > 0 ||
				this.listNfts1155Check.length > 0
			) {
				const obj = {
					width: '712px',
					title: 'Switch LAND type?',
					content: renderSwitchNftContent(),
					buttonTxt: 'Switch LAND type',
					isShow: true,
					onClick: this.confirmSwitch,
				}
				this.mxShowConfirmModal(obj)
			} else {
				this.confirmSwitch()
			}
		},
		closePopup() {
			this.mxCloseStakingModal()
		},
		showSuccess() {
			this.mxCloseStakingModal()
			const obj = {
				width: '712px',
				height: '328px',
				title: 'Success',
				content: renderSuccessContent(),
				buttonTxt: 'OK',
				isShow: true,
			}
			this.mxShowSuccessModal(obj)
		},
		getActive(nft_id) {
			if (this.isErc1155) {
				return this.listNfts1155Check?.includes(Number(nft_id))
			} else {
				return this.listNfts721Check?.includes(Number(nft_id))
			}
		},
		onConfirmQuantity1155(quantity, nftId) {
			if (_.includes(this.listNfts1155Check, nftId) || quantity === 0) {
				let index = this.listNfts1155Check.indexOf(nftId)
				if (quantity === 0) {
					this.listNfts1155Check.splice(index, 1)
					this.listNfts1155Quantity.splice(index, 1)
				} else {
					this.listNfts1155Quantity[index] = quantity
				}
			} else {
				this.listNfts1155Check.push(nftId)
				this.listNfts1155Quantity.push(quantity)
			}

			console.log(this.listNfts1155Check, this.listNfts1155Quantity)
		},

		onCheckItem(id) {
			if (_.includes(this.listNfts721Check, id)) {
				const index = this.listNfts721Check.indexOf(id)
				if (index > -1) {
					this.listNfts721Check.splice(index, 1)
				}
			} else {
				this.listNfts721Check.push(id)
			}
		},

		onCheckingUnder() {
			if (!this.checkAddress(this.current_addr)) {
				this.mxShowToast(MSG_METAMASK_1)
				return
			}
			if (!this.checkNetwork(this.current_network)) {
				this.mxShowToast(MSG_METAMASK_2)
				return
			}
			if (this.hadUnderstand) {
				this.hadUnderstand = false
			} else {
				this.checkStatusNft()
			}
		},
		async onGetNftowner(collection) {
			this.mxShowLoading()
			let params = {
				owner: this.$store?.state?.userInfo?.wallet_addr,
				collectionAddress: collection
					? this.data.address1155
					: this.data.address721,
				chainId: this.data.chainId,
			}
			const response = await axios.get(
				`${gConfig.public_api_sotatek}/nft-owner`,
				{ params }
			)
			if (response?.status === 200) {
				this.listNfts = response.data
				this.listNfts721Check = []
				// response.data.map((item, idx) => {
				// 	this.onGetHashRate(item.is_ERC1155, item.nft_id, idx)
				// })
				this.listShowers = this.listNfts
			} else {
				this.mxCloseLoading()
				this.listNfts = []
			}
		},
		async getEtherAccounts() {
			try {
				const accounts = await ethereum.request({
					method: 'eth_requestAccounts',
				})
				this.current_addr = accounts[0]
			} catch (e) {
				return []
			}
		},
		async checkStatusNft() {
			if (!this.checkAddress(this.current_addr)) {
				this.mxShowToast(MSG_METAMASK_1)
				return
			}
			if (!this.checkNetwork(this.current_network)) {
				this.mxShowToast(MSG_METAMASK_2)
				return
			}
			this.mxShowLoading('inf')
			const abi = this.isErc1155 ? ABI_1155 : ABI_721
			const address = this.isErc1155
				? this.data.address1155
				: this.data.address721
			const contractConn = getContractConnect(
				this.loginBy,
				abi,
				address,
				this.networkRPC,
				this.fortmaticNetwork
			)
			// if (this.loginBy === COINBASE || this.loginBy === BITSKI || this.loginBy === WALLETCONNECT) {
			// 	const web3 = getWeb3(
			// 		this.loginBy,
			// 		this.networkRPC,
			// 		this.current_network
			// 	)
			// 	const gasNumber = await contractConn.methods
			// 		.isApprovedForAll(
			// 			this.$store?.state?.userInfo?.wallet_addr,
			// 			this.data.staking_address
			// 		)
			// 		.estimateGas({
			// 			from: this.current_addr,
			// 		})
			// 	const condition = await checkGasWithBalance(
			// 		web3,
			// 		gasNumber,
			// 		this.current_addr
			// 	)
			// 	console.log('condition', condition)
			// 	if (condition) {
			// 		this.mxCloseLoading()
			// 		this.mxShowToast(OUT_OF_GAS)
			// 		return
			// 	}
			// }
			const res = await contractConn.methods
				.isApprovedForAll(
					this.$store?.state?.userInfo?.wallet_addr, //address owner
					this.data.staking_address // address Staking
				)
				.call()
				.catch((e) => {
					if (
						e.message.includes('104') &&
						e.message.includes(USER_DECLINED)
					) {
						this.mxShowToast(USER_DECLINED)
					} else {
						this.mxShowToast(e.message)
					}
					this.hadUnderstand = false
					this.mxCloseLoading()
				})
			if (res === true) {
				this.hadUnderstand = true
				this.mxCloseLoading()
			} else {
				this.onApprovedForAll()
			}
		},

		async onApprovedForAll() {
			const abi = this.isErc1155 ? ABI_1155 : ABI_721
			const address = this.isErc1155
				? this.data.address1155
				: this.data.address721
			const contractConn = getContractConnect(
				this.loginBy,
				abi,
				address,
				this.networkRPC,
				this.fortmaticNetwork
			)
			try {
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
						.setApprovalForAll(
							this.data.staking_address, // address Staking
							true
						)
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
				const res = await contractConn.methods
					.setApprovalForAll(
						this.data.staking_address, // address Staking
						true
					)
					.send({
						from: this.current_addr,
					})
				if (res) {
					this.hadUnderstand = true
				}
			} catch (e) {
				console.log('e', e)
				if (
					e.message.includes('104') &&
					e.message.includes(USER_DECLINED)
				) {
					this.mxShowToast(USER_DECLINED)
				} else {
					this.mxShowToast(e.message)
				}
				this.hadUnderstand = false
			} finally {
				this.mxCloseLoading()
			}
		},

		async onStakeNft() {
			if (!this.checkAddress(this.current_addr)) {
				this.mxShowToast(MSG_METAMASK_1)
				return
			}
			if (!this.checkNetwork(this.current_network)) {
				this.mxShowToast(MSG_METAMASK_2)
				return
			}
			this.mxShowLoading('inf')
			const contractConn = getContractConnect(
				this.loginBy,
				ABI_STAKING,
				this.data.staking_address,
				this.networkRPC,
				this.fortmaticNetwork
			)
			let params = {
				erc721TokenIds: this.isErc1155 ? [] : this.listNfts721Check,
				erc1155TokenIds: this.isErc1155 ? this.listNfts1155Check : [],
				erc1155Amounts: this.isErc1155 ? this.listNfts1155Quantity : [],
			}
			params = JSON.parse(JSON.stringify(params))
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
					.deposit(this.data.duration.id, params)
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
			contractConn.methods
				.deposit(this.data.duration.id, params)
				.send({
					from: this.wallet_addr,
				})
				.then((res) => {
					// this.mxGetLandItems()
					this.mxCloseLoading()
					this.showSuccess()
					this.mxShowLoading()
					setTimeout(() => {
						this.onStakingSuccess()
					}, 5000);
				})
				.catch((e) => {
					if (e.code === 4001) {
						this.mxShowToast(e.message)
					} else {
						this.mxShowToast(MSG_METAMASK_4)
					}
				})
				.finally(() => {
					// this.mxCloseLoading()
				})
		},
	},
}
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
.modal-mask {
	position: absolute;
	z-index: $Z-INDEX-LOGIN-POPUP;
	// margin-top: 224px;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: table;
	transition: opacity 0.5s ease;

	.modal-wrapper {
		display: table-cell;
		vertical-align: middle;

		.modal-container {
			background: #181721;
			border-radius: 10px;
			width: gREm(1231);
			max-width: 90vw;
			max-height: 95vh;
			margin: 0px auto;
			padding: 50px 28px 22px 28px;
			transition: all 0.3s ease;
			font-family: Montserrat, sans-serif;

			.modal-close-btn {
				display: none;
			}

			& .title {
				font-size: gREm(28);
				line-height: gREm(20);
				font-weight: 800;
			}
			& .search {
				width: 100%;
				height: gREm(44);
				position: relative;
				margin: gREm(19) 0;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: gREm(13);
				& .ic-search {
					position: absolute;
					top: 12px;
					left: 12px;
				}
				& input {
					width: calc(100% - 283px - 140px);
					height: 100%;
					border: 1px solid #d6d8dc;
					border-radius: 10px;
					padding: gREm(10) gREm(20) gREm(10) gREm(44);
					font-weight: 400;
					font-size: gREm(13);
					line-height: gREm(19);
					flex: 1;
					margin-right: 10px;
				}
				& .erc {
					width: gREm(140);
					height: 100%;
					background: #1c1a2e;
					border: 1px solid #d6d8dc;
					border-radius: 10px;
					padding: 0 10px;
					line-height: gREm(44);
					cursor: pointer;

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
						}
					}
					& .child {
						display: flex;
						align-items: center;
						justify-content: space-between;
					}
				}
			}
			& .desc {
				font-family: Montserrat, sans-serif;
				font-size: gREm(16);
				font-style: normal;
				font-weight: 400;
				line-height: gREm(19);
				letter-spacing: 0em;
				text-align: left;
				color: #ffffff;
				margin-bottom: gREm(19);
			}
			& .list-staking {
				width: 100%;
				overflow: auto;
				max-height: 60vh;
				min-height: 60vh;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				flex-wrap: wrap;
				gap: gREm(10);
				margin-bottom: gREm(20);
				&::-webkit-scrollbar {
					width: gREm(7);
				}
				&::-webkit-scrollbar-thumb {
					background: #d6d8dc;
					border-radius: gREm(7);
				}
				.no-lands {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}
			& .line {
				background: #ffffff;
				height: 1px;
			}
			& .bottom {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: gREm(15.5);
				& .bottom-left {
					display: flex;
					align-items: center;
					cursor: pointer;
					& .box-chk {
						width: gREm(32);
						height: gREm(32);
					}
					& span {
						font-family: Montserrat;
						font-size: gREm(16);
						font-style: normal;
						font-weight: 400;
						line-height: gREm(30);
						letter-spacing: 0em;
					}
				}
				& .bottom-right {
					display: flex;
					align-items: center;
					gap: 10px;
					& .btn-stake {
						background: #5f5f5f;
						color: #ffffff;
						border-radius: gREm(13);
						width: gREm(130);
						height: gREm(41);
						display: flex;
						align-items: center;
						justify-content: center;
						&.active {
							background: #f6583e;
							cursor: pointer;
						}
					}
					& .btn-cancel {
						border: 1px solid #f6583e;
						color: #f6583e;
						border-radius: gREm(13);
						width: gREm(130);
						height: gREm(41);
						display: flex;
						align-items: center;
						justify-content: center;
						cursor: pointer;
					}
				}
			}
		}
	}
}

.form {
	@include FLEXV(flex-start, center);
	width: 100%;
	height: 100%;
	padding-left: gREm(50);
	padding-right: gREm(50);

	.field-set-box {
		@include FLEXV(space-between, flex-start);
		margin-top: gREm(70);
		// margin-bottom: gREm(10);
		width: 100%;
		height: auto; //gREm(28px + 24px + 30 + 123 + 2);
	}

	.closebtn {
		@include SetBgImage(url('../assets/img/ic-closed-popup.svg'));
		width: gREm(40);
		height: gREm(40);
		margin-top: gREm(-51);
		margin-bottom: gREm(10);
		cursor: pointer;
		@include OnOverTransition();
	}

	.title {
		height: gREm(29);
		width: 100%;
		margin-top: gREm(70);
		text-align: center;
		@include Set-Font($AppFont, gREm(24), gREm(29), #0d0c22, 600);
	}

	.submit-btn {
		margin-top: gREm(50);
		width: gREm(200);
		height: gREm(60);
		border-radius: 6px;
		@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
		@include OnOverTransition();
	}
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.5s ease;
}

// .modal-enter {
//   opacity: 0;
// }

.modal-leave-active {
	opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}

@include media-max($media_small) {
	.modal-mask {
		.modal-wrapper {
			.modal-container {
				padding: gREm(32) gREm(20);
				margin: 0;
				width: 100%;
				max-width: 100vw;
				max-height: 100vh;
				height: 100vh;

				.modal-header {
					display: flex;
					justify-content: space-between;
					.title {
						@include Set-Font(
							$AppFont,
							gREm(22),
							gREm(32),
							#ffffff,
							600
						);
					}

					.modal-close-btn {
						display: block;
					}
				}

				.search {
					flex-wrap: wrap;
					gap: gREm(10);
					height: auto;
					input {
						width: 57%;
						padding: gREm(14) gREm(16) gREm(14) gREm(34);
					}

					.erc {
						width: 40%;
					}

					.erc {
						@include Set-Font(
							$AppFont,
							gREm(14),
							gREm(44),
							#ffffff,
							200
						);
					}
				}

				.desc {
					color: #777682;
					line-height: gREm(24);
				}

				.line {
					display: none;
				}

				.bottom {
					flex-direction: column;
					bottom: gREm(0);
					background: #181721;
					width: 100%;
					padding: gREm(20);
					position: absolute;
					margin-left: gREm(-20);

					.bottom-left {
						align-items: flex-start;
						gap: gREm(16);
						margin-bottom: gREm(32);

						span {
							line-height: gREm(24);
						}
					}

					.bottom-right {
						.btn-stake,
						.btn-cancel {
							border-radius: gREm(6);
							padding: gREm(13) gREm(30);
							line-height: gREm(22);
							font-size: gREm(14);
							width: auto;
							height: auto;
						}
					}
				}
			}
		}
	}
}
</style>
