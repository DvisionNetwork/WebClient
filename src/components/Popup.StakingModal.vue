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
							@change="onSearch"
							maxlength="255"
						/>
						<div class="erc">
							<span class="child" @click="switchErc">
								<span v-if="isErc1155">ERC-1155</span>
								<span v-else>ERC-721</span>
								<img
									class="ic-filter"
									src="../assets/img/ic-arrow-down.svg"
							/></span>
						</div>
						<div class="fill" @click="setFilter">
							<span class="child" v-if="filterBy === 'asc'"
								><span>Sort by Hash Rate (ascending)</span>
								<img
									class="ic-filter"
									src="../assets/img/ic-filter-asc.svg"
							/></span>
							<span class="child" v-else
								><span>Sort by Hash Rate (descending)</span
								><img
									class="ic-filter"
									src="../assets/img/ic-filter-desc.svg"
							/></span>
						</div>
					</div>
					<div class="desc" v-if="listShowers.length !== 0">
						Staking a LAND(s) will yield DVG in Dvision WORLD.
						Select one or multiple LANDs to stake.
					</div>
					<div class="list-staking">
						<LandCard
							v-for="item in listShowers"
							:name="item.name"
							:id="item.id"
							:key="item.id"
							:nftId="Number(item.nft_id)"
							:imageUrl="item.imageUrl"
							:isActive="getActive(Number(item.nft_id))"
							:onConfirmQuantity1155="
								(quantity, nftId) =>
									onConfirmQuantity1155(quantity, nftId)
							"
							:onCheckItem="
								() => onCheckItem(Number(item.nft_id))
							"
							:isErc1155="isErc1155"
							:cancelQuantityModal="
								() => closeSelectQuantityModal()
							"
							:maxQuantity="item.value"
							:hashRate="item.hashRate"
						/>
						<div v-if="listShowers.length === 0" class="no-lands">
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
import WalletConnectProvider from '@walletconnect/web3-provider'
import {
	renderSuccessContent,
	renderSwitchNftContent,
} from '@/data/RenderContent.js'
import {
	BSC_RPC_ENDPOINT,
	ETH_RPC_ENDPOINT,
	MATIC_RPC_ENDPOINT,
	FORTMATIC_API_KEY,
	FORTMATIC,
	formatChainId,
	WALLETCONNECT
} from '@/features/Common.js'
import {
	MSG_METAMASK_1,
	MSG_METAMASK_2,
	MSG_METAMASK_3,
} from '@/features/Messages.js'
import LandCard from '@/components/LandCard.vue'
import Fortmatic from 'fortmatic'
const { ethereum } = window
const fortmaticOptions = {
	rpcUrl: window.localStorage.getItem('networkRPC'),
	chainId: window.localStorage.getItem('fortmaticNetwork'),
}
const fortmaticProvider = new Fortmatic(FORTMATIC_API_KEY, fortmaticOptions)

export default {
	components: {
		LandCard,
	},
	data() {
		return {
			loginBy: window.localStorage.getItem('loginBy'),
			submitData: null,
			hadUnderstand: false,
			filterBy: 'default',
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
		}
	},
	beforeMount() {
		if (this.loginBy === WALLETCONNECT) {
			const walletconnect = window.localStorage.getItem('walletconnect')
			let wll = JSON.parse(walletconnect)
			const chainId = formatChainId(wll.chainId)
			this.current_network = chainId
		} else if(this.loginBy === FORTMATIC) {
			const fortmaticNetwork = window.localStorage.getItem('fortmaticNetwork')
			this.current_network = formatChainId(fortmaticNetwork)
		}
		else {
			const fortmaticNetwork = window.localStorage.getItem('currentNetwork')
			this.current_network = formatChainId(fortmaticNetwork)
		}
	},
	mounted() {
		if(ethereum) {
			ethereum.on('accountsChanged', (accounts) => {
				this.current_addr = accounts[0]
		})
		}
		this.onGetNftowner(this.isErc1155)
		// this.popType = authInfo.type;
	},
	computed: {
		userInfo() {
			return this.mxGetUserInfo()
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
	},
	methods: {
		checkNetwork(chainId) {
			const networkBSC = gConfig.wlt.getBscAddr().Network
			const networkPoygon = gConfig.wlt.getPolygonAddr().Network
			const networkETH = gConfig.wlt.getEthAddr().Network
			console.log('chainId',chainId)
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
		onEnableStakeButton() {
			if (!this.hadUnderstand) return false
			if (this.isErc1155 && this.listNfts1155Check.length === 0)
				return false
			if (!this.isErc1155 && this.listNfts721Check.length === 0)
				return false
			return true
		},
		async onGetHashRate(is_ERC1155, nft_id, idx) {
			try {
				const nft = this.listNfts.find((x) => x.nft_id === nft_id)
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
					this.data.staking_address
				)
				await contractConn.methods
					.tokenHashrate(is_ERC1155, nft_id)
					.call()
					.then((tx) => {
						nft.hashRate = Number(tx) / 10
					})
				if (this.listNfts.length - 1 === idx) {
					setTimeout(() => {
						this.setFilter()
						this.mxCloseLoading()
					}, 2000)
				}
			} catch (err) {
				this.mxCloseLoading()
				console.log('catch', err)
			}
		},
		onSearch() {
			console.log('search')
		},
		confirmSwitch() {
			this.filterBy = 'default'
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
		setFilter() {
			if (this.filterBy === 'default') {
				this.listShowers = this.listShowers.sort(function (a, b) {
					return a.hashRate - b.hashRate
				})
				this.filterBy = 'asc'
			} else if (this.filterBy === 'asc') {
				this.filterBy = 'desc'
				this.listShowers = this.listShowers.sort(function (a, b) {
					return b.hashRate - a.hashRate
				})
			} else {
				this.listShowers = this.listShowers.sort(function (a, b) {
					return a.hashRate - b.hashRate
				})
				this.filterBy = 'asc'
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
				buttonTxt: 'I understand',
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
				response.data.map((item, idx) => {
					this.onGetHashRate(item.is_ERC1155, item.nft_id, idx)
				})
				this.listShowers = this.listNfts
			} else {
				this.mxCloseLoading()
				this.listNfts = []
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

		async contractConnect(abi, address_ct) {
			try {
				let web3
				if (this.loginBy === FORTMATIC) {
					web3 = new Web3(fortmaticProvider.getProvider())
				} else if (this.loginBy === WALLETCONNECT) {
					const provider = new WalletConnectProvider({
						rpc: {
							1: 'https://mainnet.mycustomnode.com',
							3: 'https://ropsten.mycustomnode.com',
							97: BSC_RPC_ENDPOINT,
							4: ETH_RPC_ENDPOINT,
							80001: MATIC_RPC_ENDPOINT,
						},
					})
					provider.enable()
					web3 = new Web3(provider)
				}
				else web3 = new Web3(Web3.givenProvider)
				const contractConn = new web3.eth.Contract(abi, address_ct)
				return contractConn
			}
			catch(err) {
				console.log('err', err)
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
			const contractConn = await this.contractConnect(
				this.isErc1155 ? ABI_1155 : ABI_721, // abi collection
				this.isErc1155 ? this.data.address1155 : this.data.address721 // address collection
			)
			console.log('this.data.staking_address',this.data.staking_address)
			console.log('this.current_addr',this.current_addr)
			console.log('this.data.address1155',this.data.address1155)
			const res = await contractConn.methods
				.isApprovedForAll(
					this.$store?.state?.userInfo?.wallet_addr, //address owner
					this.data.staking_address // address Staking
				)
				.call()
				.catch((e) => {
					this.mxCloseLoading()
					this.hadUnderstand = false
					if (e.code === 4001 || e.code === -32603) {
						this.mxShowToast(e.message)
					} else {
						this.mxShowToast(MSG_METAMASK_3)
					}
				})
			if (res === true) {
				this.hadUnderstand = true
				this.mxCloseLoading()
			} else {
				this.onApprovedForAll()
			}
		},

		async onApprovedForAll() {
			const contractConn = await this.contractConnect(
				this.isErc1155 ? ABI_1155 : ABI_721, // abi collection
				this.isErc1155 ? this.data.address1155 : this.data.address721 // address collection
			)
			console.log('this.data.staking_address',this.data.staking_address)
			const res = await contractConn.methods
				.setApprovalForAll(
					this.data.staking_address, // address Staking
					true
				)
				.send({
					from: this.current_addr,
				})
				.catch((e) => {
					console.log('e',e)
					this.hadUnderstand = false
					this.mxCloseLoading()
					if (
						e.code === 4001 ||
						e.code === -32603 ||
						e.code === -32602
					) {
						this.mxShowToast(e.message)
					} else {
						this.mxShowToast(MSG_METAMASK_3)
					}
				})
			console.log('res', res)
			if (res) {
				this.mxCloseLoading()
				this.hadUnderstand = true
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
			// this.mxShowLoading('inf')
			const contractConn = await this.contractConnect(
				ABI_STAKING,
				this.data.staking_address // address Staking
			)

			let params = {
				erc721TokenIds: this.isErc1155 ? [] : this.listNfts721Check,
				erc1155TokenIds: this.isErc1155 ? this.listNfts1155Check : [],
				erc1155Amounts: this.isErc1155 ? this.listNfts1155Quantity : [],
			}

			params = JSON.parse(JSON.stringify(params))
			console.log('params',params)
			console.log('this.data.duration.id',this.data.duration.id)
			console.log('this.current_addr',this.current_addr)
			const res = await contractConn.methods
				.deposit(this.data.duration.id, params)
				.send({
					from: this.current_addr,
				})
				.catch((e) => {
					console.log('onStakeNft e', e)
					this.mxCloseLoading()
					if (e.code === 4001 || e.code === -32603) {
						this.mxShowToast(e.message)
					} else {
						this.mxShowToast(MSG_METAMASK_3)
					}
				})
			if (res) {
				this.mxCloseLoading()
				this.showSuccess()
				this.onStakingSuccess()
			}
		},
	},
}
</script>

<style lang="scss" scoped>
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
					& .child {
						display: flex;
						align-items: center;
						justify-content: space-between;
					}
				}
				& .fill {
					width: gREm(263);
					height: 100%;
					background: #1c1a2e;
					border: 1px solid #d6d8dc;
					border-radius: 10px;
					padding: 0 10px;
					line-height: gREm(44);
					cursor: pointer;
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

					.fill {
						width: 100%;
					}

					.erc,
					.fill {
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
