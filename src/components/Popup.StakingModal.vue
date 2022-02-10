<template>
	<transition name="modal">
		<div class="modal-mask">
			<SelectQuantityModal
				v-if="showSelectQuantity"
				:onClick="() => closeSelectQuantityModal()"
				:onCancel="() => closeSelectQuantityModal()"
			/>
			<div class="modal-wrapper">
				<div class="modal-container">
					<div class="title">Staking: Add LAND(s)</div>
					<div class="search">
						<img
							class="ic-search"
							src="../assets/img/ic-search.svg"
						/>
						<input type="text" />
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
					<div class="desc">
						Staking a LAND(s) will yield DVG in Dvision WORLD.
						Select one or multiple LANDs to stake.
					</div>
					<div class="list-staking">
						<LandCard
							v-for="item in listNfts"
							:name="item.name"
							:id="item.id"
							:key="item.id"
							:imageUrl="item.image_url"
							:isActive="
								listNfts721Check?.includes(Number(item.nft_id))
							"
							:onCheckItem="
								() => onCheckItem(Number(item.nft_id))
							"
						/>
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
								v-if="hadUnderstand"
								class="btn-stake active"
								@click="() => onStakeNft()"
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
import SelectQuantityModal from '@/components/Popup.SelectQuantityModal.vue'
import ABI_721 from '@/abi/ABI712.json'
import ABI_1155 from '@/abi/ABI1155.json'
import ABI_STAKING from '@/abi/DvisionStakingUpgradeable.json'

const Contract721Address = '0xF36721581B3dB68408A7189840C79Ad47C719c71'
const Contract1155Address = '0xD7191DDdF64D2Cf94Fe32e52ad3f9C6104926fb1'

const ADDRESS_721 = '0xD41eddEdB1891B626FADD17B328e14077c8248Cb'
const ADDRESS_1155 = '0x3a0792d301a40eBcd9199431b00AD26603b7cdc4'
const STAKING_ADDRESS = '0x019D5b2B45fb01FbD77401bd1809EA121e222A23'

const BSC_RPC_ENDPOINT = 'https://data-seed-prebsc-1-s1.binance.org:8545/'

import LandCard from '@/components/LandCard.vue'

export default {
	components: {
		LandCard,
		SelectQuantityModal,
	},
	data() {
		return {
			submitData: null,
			hadUnderstand: false,
			filterBy: 'asc',
			isErc1155: true,
			listNfts: [],
			listNfts721Check: [],
			showSelectQuantity: false,
		}
	},
	mounted() {
		this.onGetNftowner(this.isErc1155)
		// this.popType = authInfo.type;
	},
	computed: {
		userInfo() {
			return this.mxGetUserInfo()
		},
	},
	props: {},
	watch: {
		isErc1155() {
			this.onGetNftowner(this.isErc1155)
		},
	},
	methods: {
		closeSelectQuantityModal() {
			this.showSelectQuantity = false
		},
		confirmSwitch() {
			this.isErc1155 = !this.isErc1155
			this.mxCloseConfirmModal()
		},
		switchErc() {
			const obj = {
				width: '712px',
				title: 'Switch LAND type?',
				content:
					'All changes made and all of your selections in the current screen will be lost if you switch to another LAND type. Proceed?',
				buttonTxt: 'Switch LAND type',
				isShow: true,
				onClick: this.confirmSwitch,
			}
			this.mxShowConfirmModal(obj)
		},
		setFilter() {
			if (this.filterBy === 'asc') {
				this.filterBy = 'desc'
			} else {
				this.filterBy = 'asc'
			}
		},
		closePopup() {
			this.mxCloseStakingModal()
		},
		renderSuccessContent() {
			return `
			<p>You have staked your LAND(s) successfully. The staked LANDs will be shown under “Staked LANDs” section.</p><br />
			<p>Please note that you will be unable to unlock your LAND(s) during the Staking period. You can harvest the accumulated DVG reward at any time during the Staking period (up until the Harvest time).</p>
			`
		},
		showSuccess() {
			this.mxCloseStakingModal()
			const obj = {
				width: '712px',
				height: '328px',
				title: 'Success',
				content: this.renderSuccessContent(),
				buttonTxt: 'I understand',
				isShow: true,
			}
			this.mxShowSuccessModal(obj)
		},

		onCheckItem(id) {
			if (this.isErc1155) {
				this.showSelectQuantity = true
			} else {
				if (_.includes(this.listNfts721Check, id)) {
					const index = this.listNfts721Check.indexOf(id)
					if (index > -1) {
						this.listNfts721Check.splice(index, 1)
					}
				} else {
					this.listNfts721Check.push(id)
				}
			}
		},

		onCheckingUnder() {
			// if (this.isErc1155) {
			// 	this.checkStatusNft()
			// } else {
			// 	this.hadUnderstand = !this.hadUnderstand
			// }
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
			this.mxShowLoading()
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
					this.mxCloseLoading()
					if (tx === true) {
						this.hadUnderstand = true
						// this.onStakeNft()
					} else {
						this.onApprovedForAll()
					}
				})
				.catch((e) => {
					this.mxCloseLoading()
					this.hadUnderstand = false
					console.log('checkStatusNft e', e)
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
					this.hadUnderstand = true
					console.log('onApprovedForAll', tx)
					// this.onStakeNft()
				})
				.catch((e) => {
					this.hadUnderstand = false
					console.log('onApprovedForAll e', e)
				})
		},

		async onStakeNft() {
			const contractConn = await this.contractConnect(
				ABI_STAKING.abi,
				STAKING_ADDRESS // address Staking
			)

			let params = {
				erc721TokenIds: this.isErc1155 ? [] : this.listNfts721Check,
				erc1155TokenIds: [],
				erc1155Amounts: [],
			}

			params = JSON.parse(JSON.stringify(params))

			console.log(params)

			await contractConn.methods
				.deposit(
					1, // 30 days = 1, 60 days = 2, 90 days = 3
					params
				)
				.send({
					from: (await this.getAccounts())[0],
				})
				.then((tx) => {
					this.showSuccess
					console.log('onStakeNft', tx)
					this.onGetNftowner(this.isErc1155)
				})
				.catch((e) => {
					console.log('onStakeNft e', e)
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
			max-height: 95vh;
			margin: 0px auto;
			padding: 50px 28px;
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
				min-height: 30vh;
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
