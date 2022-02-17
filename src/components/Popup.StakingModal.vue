<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div class="title">Staking: Add LAND(s)</div>
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
							:imageUrl="item.image_url"
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
import {
	renderSuccessContent,
	renderSwitchNftContent,
} from '@/data/RenderContent.js'
import {
	STAKING_ADDRESS,
	BSC_RPC_ENDPOINT,
	ADDRESS_721,
	ADDRESS_1155,
} from '@/features/Common.js'
import { MSG_METAMASK_1, MSG_METAMASK_2 } from '@/features/Messages.js'
import LandCard from '@/components/LandCard.vue'
const { ethereum } = window

export default {
	components: {
		LandCard,
	},
	data() {
		return {
			submitData: null,
			hadUnderstand: false,
			filterBy: 'asc',
			isErc1155: false,
			listNfts: [],
			listNfts721Check: [],
			listNfts1155Check: [],
			listNfts1155Quantity: [],
			keyword: '',
			listShowers: [],
			current_addr: '',
			wallet_addr: this.$store?.state?.userInfo?.wallet_addr,
			current_network: gConfig.wlt.getBscAddr().Network, //default
		}
	},
	mounted() {
		ethereum.on('chainChanged', (chainId) => {
			const network = gConfig.wlt.getBscAddr().Network
			this.current_network = chainId
			this.checkNetwork(this.current_network)
			if (chainId !== network) {
				this.mxShowToast(MSG_METAMASK_2)
			}
		})
		ethereum.on('accountsChanged', (accounts) => {
			this.current_addr = accounts[0]
		})

		this.getCurrentAddress()
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
			const network = gConfig.wlt.getBscAddr().Network
			if (network === chainId) return true
			return false
		},
		checkAddress(current_addr) {
			if (current_addr.toLowerCase() === this.wallet_addr.toLowerCase())
				return true
			else return false
		},
		async getCurrentAddress() {
			let web3 = new Web3(Web3.givenProvider || BSC_RPC_ENDPOINT)
			const acc = await web3.eth.getAccounts()
			console.log('acc', acc)
			this.current_addr = acc[0]
		},
		onEnableStakeButton() {
			if (!this.hadUnderstand) return false
			if (this.isErc1155 && this.listNfts1155Check.length === 0)
				return false
			if (!this.isErc1155 && this.listNfts721Check.length === 0)
				return false
			return true
		},
		async onGetHashRate(is_ERC1155, nft_id) {
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
					STAKING_ADDRESS
				)
				await contractConn.methods
					.tokenHashrate(is_ERC1155, nft_id)
					.call()
					.then((tx) => {
						nft.hashRate = Number(tx)
					})
			} catch (err) {
				console.log('catch', err)
			}
		},
		onSearch() {
			console.log('search')
		},
		confirmSwitch() {
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
			if (this.filterBy === 'asc') {
				this.filterBy = 'desc'
				this.listShowers = this.listNfts.sort(function (a, b) {
					return b.hashRate - a.hashRate
				})
			} else {
				this.listShowers = this.listNfts.sort(function (a, b) {
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
			let params = {
				owner: this.$store?.state?.userInfo?.wallet_addr,
				collectionAddress: collection ? ADDRESS_1155 : ADDRESS_721,
				chainId: 97,
			}
			const response = await axios.get(
				`${gConfig.public_api_sotatek}/nft-owner`,
				{ params }
			)
			if (response?.status === 200) {
				this.listNfts = response.data
				this.listNfts721Check = []
				this.listShowers = this.listNfts
				response.data.map((item) => {
					this.onGetHashRate(item.is_ERC1155, item.nft_id)
				})
				this.setFilter()
			} else {
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
			if (typeof window.ethereum !== 'undefined') {
				let web3 = new Web3(Web3.givenProvider || BSC_RPC_ENDPOINT)
				let contractConn = await new web3.eth.Contract(abi, address_ct)
				return contractConn
			}
		},

		async checkStatusNft() {
			this.mxShowLoading('inf')
			const contractConn = await this.contractConnect(
				this.isErc1155 ? ABI_1155 : ABI_721, // abi collection
				this.isErc1155 ? ADDRESS_1155 : ADDRESS_721 // address collection
			)

			await contractConn.methods
				.isApprovedForAll(
					this.$store?.state?.userInfo?.wallet_addr, //address owner
					STAKING_ADDRESS // address Staking
				)
				.call()
				.then((tx) => {
					if (tx === true) {
						this.hadUnderstand = true
						this.mxCloseLoading()
					} else {
						this.onApprovedForAll()
					}
				})
				.catch((e) => {
					this.mxCloseLoading()
					this.hadUnderstand = false
					this.mxShowToast(e.message)
				})
		},

		async onApprovedForAll() {
			const contractConn = await this.contractConnect(
				this.isErc1155 ? ABI_1155 : ABI_721, // abi collection
				this.isErc1155 ? ADDRESS_1155 : ADDRESS_721 // address collection
			)

			await contractConn.methods
				.setApprovalForAll(
					STAKING_ADDRESS, // address Staking
					true
				)
				.send({
					from: (await this.getAccounts())[0],
				})
				.then((tx) => {
					this.mxCloseLoading()
					this.hadUnderstand = true
				})
				.catch((e) => {
					this.hadUnderstand = false
					this.mxCloseLoading()
					this.mxShowToast(e.message)
				})
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
			const contractConn = await this.contractConnect(
				ABI_STAKING,
				STAKING_ADDRESS // address Staking
			)

			let params = {
				erc721TokenIds: this.isErc1155 ? [] : this.listNfts721Check,
				erc1155TokenIds: this.isErc1155 ? this.listNfts1155Check : [],
				erc1155Amounts: this.isErc1155 ? this.listNfts1155Quantity : [],
			}

			params = JSON.parse(JSON.stringify(params))

			await contractConn.methods
				.deposit(this.data.duration.id, params)
				.send({
					from: (await this.getAccounts())[0],
				})
				.then((tx) => {
					console.log('onStakeNft', tx)
					this.mxCloseLoading()
					this.showSuccess()
					this.onGetNftowner(this.isErc1155)
					this.onStakingSuccess()
				})
				.catch((e) => {
					console.log('onStakeNft e', e)
					this.mxCloseLoading()
					this.mxShowToast(e.message)
					this.onGetNftowner(this.isErc1155)
				})
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
</style>
