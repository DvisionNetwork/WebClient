<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div class="modal-header">
						<div class="modal-title">My reward</div>
					</div>
					<div class="modal-tab tabs">
						<div
							class="item"
							v-for="(tab, index) in tabList"
							:selected="selectedIndex === index"
							:key="tab.name"
							@click="selectedIndex = index"
						>
							{{ tab.name }}
						</div>
					</div>
					<div class="modal-description">
						{{ tabList[selectedIndex].header }}
					</div>
					<div class="modal-body">
						<MyRewardInfo
							v-if="selectedIndex === 0"
							:data="dataOngoing"
							:selectedIndex="selectedIndex"
						/>
						<MyRewardInfo
							v-else
							:data="dataReward"
							:selectedIndex="selectedIndex"
						/>
					</div>
					<hr />
					<div class="btn-wrapper">
						<button
							v-if="selectedIndex === 1"
							class="btn btn-primary"
							@click="claimRewards"
							:disabled="dataReward.length === 0 || data.statusCampain === 3"
						>
							Claim rewards
						</button>
						<button
							class="btn btn-outline-primary"
							@click="mxCloseMyRewardModal"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import axios from 'axios'
import { getContractConnect, getWeb3 } from '../features/Connectors'
import ProxyABI from '@/abi/Proxy.json'
import MyRewardInfo from './MyReward.Info.vue'
import { renderStakingRewardsClaimed } from '@/data/RenderContent'
import {
	ADDRESS_METAMASK,
	BITSKI,
	BSC_PROXY_ADDRESS,
	checkGasWithBalance,
	COINBASE,
	METAMASK,
	OUT_OF_GAS,
	WALLETCONNECT,
	fromHexToChainId,
	DENIED_TRANSACTION,
} from '../features/Common'
import AppConfig from '@/App.Config.js'
import jwt from 'jsonwebtoken'
import { MSG_METAMASK_1, MSG_METAMASK_2 } from '../features/Messages'
var gConfig = AppConfig()

export default {
	components: {
		MyRewardInfo,
	},
	mounted() {
		this.mountedPopup()
	},
	computed: {},
	data() {
		return {
			tabList: [
				{
					name: 'Ongoing campaign',
					header: 'You will receive the below rewards based on your staked LANDs after the campaign:',
				},
				{
					name: 'All rewards',
					header: 'These are the rewards that you can claim for participating in the staking campaign.',
				},
			],
			selectedIndex: 0,
			listReward: [],
			listOngoing: [],
			dataOngoing: [],
			dataReward: [],
			loginBy: window.localStorage.getItem('loginBy'),
		}
	},
	props: {
		data: Object,
	},
	created() {},
	watch: {
		async selectedIndex() {
			if (this.selectedIndex === 1 && (this.data.statusCampain === 1 || this.data.statusCampain === 2)) {
				await this.getListReward()
				this.filterReward()
			}
			if (this.selectedIndex === 0) {
				await this.getListOngoing()
				this.filterOngoing()
			}
		},
	},
	methods: {
		showPopupSuccess() {
			const obj = {
				isShow: true,
				content: renderStakingRewardsClaimed(),
				title: 'Rewards have been claimed',
				buttonTxt: 'OK',
				width: '712px',
			}
			this.mxCloseMyRewardModal()
			this.mxShowSuccessModal(obj)
		},
		async claimRewards() {
			this.mxShowLoading('inf')

			const oldChainId = this.data.chainId
			const network = window.localStorage.getItem('currentNetwork')
			const currentChainId = fromHexToChainId(network)

			if (oldChainId !== currentChainId) {
				this.mxCloseLoading()
				this.mxShowToast(MSG_METAMASK_2)
				return
			}

			const address = this.$store.state.userInfo.wallet_addr
			const addressChange = window.localStorage.getItem(ADDRESS_METAMASK)
			if (
				addressChange &&
				addressChange !== address &&
				this.loginBy === METAMASK
			) {
				this.mxCloseLoading()
				this.mxShowToast(MSG_METAMASK_1)
				return
			}
			const payload = {
				address,
				campaignId: this.data.poolDuration.id,
				chainId: this.data.chainId,
				currentTime: Date.now(),
			}
			const url = `${gConfig.public_api_sotatek}/claim-reward`
			const data = jwt.sign(payload, gConfig.privateKeyEncode)

			const res = await axios.put(url, { data })

			if (res.data.data && res.data.signature) {
				const contract = getContractConnect(
					this.loginBy,
					ProxyABI,
					BSC_PROXY_ADDRESS,
					this.networkRPC,
					this.currentNetwork
				)
				if (
					this.loginBy === COINBASE ||
					this.loginBy === BITSKI ||
					this.loginBy === WALLETCONNECT
				) {
					const web3 = getWeb3(
						this.loginBy,
						this.networkRPC,
						this.currentNetwork
					)
					const gasNumber = await contract.methods
						.execTransaction(res.data.data, res.data.signature)
						.estimateGas({
							from: address,
						})
					const condition = await checkGasWithBalance(
						web3,
						gasNumber,
						address
					)
					if (condition) {
						this.mxCloseLoading()
						this.mxShowToast(OUT_OF_GAS)
						return
					}
				}

				contract.methods
					.execTransaction(res.data.data, res.data.signature)
					.send({ from: address })
					.then((tx) => {
						const url = `${gConfig.public_api_sotatek}/update-reward`
						axios
							.put(url, { data })
							.then((res) => {
								console.log(res)
								this.showPopupSuccess()
							})
							.catch((err) => {
								console.log(err)
							})
						console.log('tx', tx)
					})
					.catch((e) => {
						console.log('err', e)
						this.mxShowToast(DENIED_TRANSACTION)
					})
					.finally(() => {
						this.mxCloseLoading()
					})
			} else {
				this.mxCloseLoading()
			}
		},
		async getListReward() {
			const address = this.$store.state.userInfo.wallet_addr
			const campainId = this.data.poolDuration.id
			const chainId = this.data.chainId
			const res = await axios(
				`${gConfig.public_api_sotatek}/get-list-reward?owner=${address}&campaignId=${campainId}&chainId=${chainId}`
			)
			this.listReward = res.data.NftCampaignArr
		},
		filterReward() {
			if (this.listReward && this.listReward.length > 0) {
				const data = []
				for (let i = 1; i <= 9; i++) {
					const nft = this.listReward.reduce(
						(obj, item) => {
							if (item?.rewardRandomBox?.boxType == i) {
								obj.amount += item?.rewardRandomBox.amount
							}
							if (item?.rewardBuildingBoxA?.boxType == i) {
								obj.amount += item?.rewardBuildingBoxA.amount
							}
							if (item?.rewardBuildingBoxB?.boxType == i) {
								obj.amount += item?.rewardBuildingBoxB.amount
							}

							return {
								amount: obj.amount,
								boxType: i,
							}
						},
						{ amount: 0, boxType: '' }
					)

					if (nft.amount > 0) {
						data.push(nft)
					}
				}
				this.dataReward = [...data]
			}
		},
		async getListOngoing() {
			const address = this.$store.state.userInfo.wallet_addr
			const campainId = this.data.poolDuration.id
			const chainId = this.data.chainId
			const res = await axios(
				`${gConfig.public_api_sotatek}/get-reward-on-going-campaign?owner=${address}&campaignId=${campainId}&chainId=${chainId}`
			)
			this.listOngoing = res.data
		},
		filterOngoing() {
			if (this.listOngoing && this.listOngoing.length > 0) {
				const data = []
				for (let i = 1; i <= 9; i++) {
					const nft = this.listOngoing.reduce(
						(obj, item) => {
							if (item?.virtualRewardRandomBox?.boxType == i) {
								obj.amount +=
									item?.virtualRewardRandomBox.amount
							}
							if (item?.virtualRewardBuildingBoxA?.boxType == i) {
								obj.amount +=
									item?.virtualRewardBuildingBoxA.amount
							}
							if (item?.virtualRewardBuildingBoxB?.boxType == i) {
								obj.amount +=
									item?.virtualRewardBuildingBoxB.amount
							}

							return {
								amount: obj.amount,
								boxType: i,
							}
						},
						{ amount: 0, boxType: '' }
					)

					if (nft.amount > 0) {
						data.push(nft)
					}
				}
				this.dataOngoing = [...data]
			}
		},
		async mountedPopup() {
			if (this.selectedIndex === 0) {
				await this.getListOngoing()
				this.filterOngoing()
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
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;

		.modal-container {
			background: #181721;
			border-radius: gREm(10);
			margin: 0px auto;
			padding: gREm(33) gREm(28);
			transition: all 0.3s ease;
			font-family: Montserrat, sans-serif;
			position: absolute;
			width: 100%;
			max-height: 100vh;
			// overflow-y: auto;
			max-width: gREm(939);

			.modal-body {
				margin-bottom: 10px;
			}

			.modal-header {
				display: flex;
				justify-content: space-between;
				margin-bottom: gREm(29);

				.modal-title {
					@include Set-Font($AppFont, gEm(28), auto, #ffffff, 600);
					white-space: pre-wrap;
				}
			}

			.modal-description {
				margin-top: gREm(9);
				margin-bottom: gREm(39);
			}

			.tabs {
				width: 100%;
				height: gREm(24 + 16 + 3);
				@include FLEX(flex-start, flex-start);
				.item {
					height: gREm(24);
					width: auto;
					margin-right: gREm(49);
					@include Set-Font(
						$AppFont,
						gREm(16),
						gREm(24),
						#ffffff,
						500
					);
					opacity: 0.4;
					@include Transition(0.5s ease-in-out);
					cursor: pointer;

					&[selected='true'] {
						opacity: 1;
					}

					&:after {
						@include Transition(0.25s ease-in-out);
						position: absolute;
						bottom: gREm(-10);
						content: '';
						display: block;
						height: gREm(5);
						left: 50%;
						width: 0px;
					}

					&[selected='true']:after {
						width: 100%;
						left: 0;
						background-color: #f6583e;
					}
				}
			}

			.btn-wrapper {
				display: flex;
				justify-content: end;
				margin-top: gREm(24);
				text-align: right;
				.btn {
					color: #f6583e;
					border: 1px solid #f6583e;
					border-radius: gREm(13.2258);
					padding: gREm(6) 0;
					max-width: gREm(180);
					width: 100%;
					font-family: $AppFont;
					font-size: gREm(16);
					line-height: gREm(29.63);
				}

				.btn-primary {
					background: #f6583e;
					color: #fff;
					margin-right: gREm(16);

					&:disabled {
						background-color: #5f5f5f;
						border-color: #5f5f5f;
					}
				}
			}

			::-webkit-scrollbar {
				width: gREm(7);
			}

			/* Handle */
			::-webkit-scrollbar-thumb {
				background: #d6d8dc;
				border-radius: gREm(7);
			}

			& .title {
				font-size: gREm(28);
				line-height: gREm(19);
				font-weight: 800;
				margin-bottom: gREm(30);
			}
		}
	}
}
@include media-max($media_small) {
	.modal-mask {
		.modal-wrapper {
			.modal-container {
				.btn-wrapper {
					justify-content: center;
				}
			}
		}
	}
}
</style>
