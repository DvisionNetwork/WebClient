<template>
	<div class="Market-Detail">
		<div v-if="tab_page == 'land-detail'" class="top-land">
			<MapLand ref="refMapLand" :mapId="mapId" :blockId="blockId" />
		</div>
		<div
			v-else
			class="top-info"
			:level="mxGetLevelCssType(marketItem.rarity)"
		>
			<div
				class="item-img"
				:style="mxGetBgImageStyle(marketItem.thumbnail_url)"
			/>
		</div>
		<div class="item-land-wrap" v-if="tab_page == 'land-detail'">
			<div class="item-info">
				<div class="item-title-box">
					<div class="item-navi-path">
						<span class="item-category">{{ ct1Name + ' > ' }}</span>
						<span class="item-level">{{ ct2Name }}</span>
					</div>
				</div>
				<div class="item-desc-box">
					<div class="title-count-box">
						<div class="name">{{ $t(marketItem.name) }}</div>
					</div>
				</div>

				<div class="item-detail-box">
					<div class="detail-info">
						<div class="description-box">
							<div class="label">
								{{ $t('market.detail.description') }}
							</div>
							<div class="description">
								<p v-html="marketItem.detail"></p>
							</div>
						</div>
						<div v-if="isItemOwned()" class="price info">
							<div class="header">
								{{ $t('market.detail.input-price') }}
							</div>
							<div
								v-if="marketItem.tokentype == '0'"
								class="price-box"
							>
								<div class="pol-icon"></div>
								<input
									class="pol-value"
									id="input-price"
									type="number"
									v-model="sellPrice"
								/>
							</div>
							<div v-else class="price-box">
								<div class="icon"></div>
								<input
									class="value"
									id="input-price"
									type="number"
									v-model="sellPrice"
								/>
							</div>
						</div>
						<div v-else class="price info">
							<div class="header">
								{{ $t('market.detail.price') }}
							</div>
							<div
								v-if="marketItem.tokentype == '0'"
								class="price-box"
							>
								<div class="pol-icon"></div>
								<div class="pol-value">
									{{ marketItem.price }}
								</div>
							</div>
							<div v-else class="price-box">
								<div class="icon"></div>
								<div class="value">{{ marketItem.price }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="buy-info">
				<div
					class="buy-certificate-photo"
					:premium="marketItem.premium"
					:type="getBlockPosInfo('size')"
					:map_id="mapId"
				>
					<div class="description">
						<p>{{ reducedOwnerAddress }}</p>
					</div>

					<div class="text pos-size">
						{{ getBlockPosInfo('size') }}
					</div>
					<div class="text pos-start">
						{{ getBlockPosInfo('start') }}
					</div>
					<div class="text pos-tilde">~</div>
					<div class="text pos-end">{{ getBlockPosInfo('end') }}</div>
					<div class="text pos-square">
						{{ getBlockPosInfo('square') }}m<sup>2</sup>
					</div>
				</div>
				<div class="buy-box">
					<div
						v-if="isItemOwned()"
						class="buy-button"
						:buytype="1"
						@click="onClickSellLand()"
					>
						{{ $t('market.detail.list-sell') }}
					</div>
					<div
						v-else
						class="buy-button"
						:buytype="buyType"
						@click="onClickBuyLand()"
					>
						{{ getBuyBtnLabel() }}
					</div>
				</div>
			</div>
		</div>
		<div v-else class="item-info-wrap">
			<div class="item-info">
				<div class="item-title-box">
					<div class="item-navi-path">
						<span class="item-category">{{ ct1Name + ' > ' }}</span>
						<span class="item-level">{{ ct2Name }}</span>
					</div>
				</div>
				<div class="item-desc-box">
					<div class="title-count-box">
						<div class="name">{{ $t(marketItem.name) }}</div>
						<div class="count-image">
							<div class="owned">{{ itemOwned }}</div>
							<div class="owned-label">
								{{ $t('market.detail.owned') }}
							</div>
						</div>
					</div>
					<div class="description-box">
						<div class="label">
							{{ $t('market.detail.description') }}
						</div>
						<div class="description">
							<p v-html="marketItem.detail"></p>
						</div>
					</div>
				</div>
				<div class="item-detail-box">
					<div class="detail-info">
						<div v-if="isItemOwned()" class="price info">
							<div class="header">
								{{ $t('market.detail.input-price') }}
							</div>
							<div class="price-box">
								<div class="icon"></div>
								<input
									class="value"
									id="input-price"
									type="number"
									v-model="sellPrice"
								/>
							</div>
						</div>
						<div v-else class="price info">
							<div class="header">
								{{ $t('market.detail.price') }}
							</div>
							<div class="price-box">
								<div class="icon"></div>
								<div class="value">{{ marketItem.price }}</div>
							</div>
						</div>
						<div class="total info">
							<div class="header">
								{{ $t('market.detail.total') }}
							</div>
							<div class="value">
								{{ marketItem.total_supply }}
							</div>
						</div>
						<div class="left info">
							<div class="header">
								{{ $t('market.detail.left') }}
							</div>
							<div class="value">
								{{ marketItem.sell_amount }}
							</div>
						</div>
						<div class="owner info">
							<div class="header">
								{{ $t('market.detail.owner') }}
							</div>
							<div class="value">{{ marketItem.own_amount }}</div>
						</div>
					</div>
					<div class="buy-info">
						<div class="count-box">
							<div
								class="icon-sub icon"
								@click="onClickCount('sub')"
								:active="buyCount == 0 ? 'on' : 'off'"
							></div>
							<div class="buy-count">{{ buyCount }}</div>
							<div
								class="icon-add icon"
								@click="onClickCount('add')"
							></div>
						</div>
						<div class="buy-box">
							<div
								v-if="isItemOwned()"
								class="buy-button"
								@click="onClickSell()"
							>
								{{ $t('market.detail.list-sell') }}
							</div>

							<div
								v-else
								class="buy-button"
								@click="onClickBuy()"
							>
								{{ $t('market.detail.buy-now') }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import WalletAPI from '@/features/WalletAPI.js'
import MapLand from '@/components/MapLand.vue'

var wAPI = new WalletAPI()

import AppConfig from '@/App.Config.js'
import {
	BITSKI,
	checkProviderWallet,
	COINBASE,
	FORTMATIC,
	METAMASK,
	renderNetworkName,
	WALLETCONNECT,
} from '../features/Common'
import {
	coinbaseProvider,
	fortmaticProvider,
	walletConnectProvider,
	bitski,
} from '../features/Connectors'
import Web3 from 'web3'

var gConfig = AppConfig()

export default {
	name: 'Market-Detail',
	components: {
		MapLand,
	},
	props: {
		mapId: {
			type: String,
			default: '',
		},
		itemId: {
			type: String,
			default: '',
		},
		blockId: {
			type: String,
			default: '',
		},
	},
	beforeMount() {
		// console.log("[Market-Detail.vue] beforeMout(), route : ", this.$route)
		this.tab_page = this.$route.params.tab_page
		if (this.tab_page == 'land-detail') {
			this.blockInfo = this.getBlockInfo()
		}
	},
	mounted() {
		// console.log("[Market-Detail.vue] mounted(), route : ", this.$route, this.tab_page, this.mapId, this.blockId);
		console.log('this.mapId', this.mapId)
		if (this.tab_page == 'land-detail') {
			var landItems = this.mxGetLandItems()
			console.log('@@ landItems === ', landItems)

			var network = gConfig.wlt.getNetworkAddr(
				this.getDvLand().network
			).Network

			if (Object.keys(landItems).length == 0) {
				this.mxCallAndSetLandItemList(this.mapId, network, () => {
					console.log(
						'@@ landItems === undefined ==> after mxCallAndSetLandItemList() '
					)
					this.callLandItem()
					var land = this.getDvLand()
					this.ct1Name = land.n
					this.ct2Name = this.$t(
						'market.land.land_ct_' + this.blockInfo.c.toString()
					)
				})
				return
			} else {
				this.callLandItem()
				var land = this.getDvLand()
				this.ct1Name = land.n
				this.ct2Name = this.$t(
					'market.land.land_ct_' + this.blockInfo.c.toString()
				)
			}

			return
		}

		// this.mxScrollToTop();

		var item = this.mxGetMarketItem()
		if (item) {
			var cts = this.mxGetCtNames(
				Number(item.category_1),
				Number(item.category_2)
			)
			this.ct1Name = cts.ct1Name
			this.ct2Name = cts.ct2Name
		}
		// nft 721은 1개만 구매
		if (item.category == '721' && item.sell_amount > 1) {
			item.sell_amount = 1
		}

		this.getOwnerName(item)
	},
	beforeUpdate() {
		console.log('[Market-Detail.vue] beforeUpdate(), route : ', this.$route)
		// if(this.tab_page == 'land-detail') {
		// 	var land = this.getDvLand();
		// 	this.blockInfo = this.getBlockInfo();
		// 	this.ct1Name = land.n;
		// 	this.ct2Name = this.$t('market.land.land_ct_'+this.blockInfo.c.toString());
		// 	return;
		// }
	},
	updated() {
		// console.log("[Market-Detail.vue] updated(), route : ", this.$route);
	},
	data() {
		return {
			blockInfo: null,
			subfocus: false,
			addfocus: false,
			ct1Name: '',
			ct2Name: '',
			itemOwned: 0,
			buyCount: 0,
			prependingId: null,
			trHash: null,
			approve_data: null,
			trade_data: null,
			sellPrice: 0,
		}
	},
	watch: {
		blockId(newVal, oldVal) {
			console.log(
				'[Market.Detail.vue] ======================= watch blockId ',
				newVal,
				oldVal
			)
			this.callLandItem()
			var land = this.getDvLand()
			this.blockInfo = this.getBlockInfo()
			this.ct1Name = land.n
			this.ct2Name = this.$t(
				'market.land.land_ct_' + this.blockInfo.c.toString()
			)
		},
	},
	computed: {
		blockDetail() {
			return this.mxGetLandItemDetail()
		},
		buyType() {
			var btn_state = _U.getIfDefined(this.blockDetail, 'btn_state')
				? this.blockDetail.btn_state.toString()
				: '0'
			var salestate = _U.getIfDefined(this.blockDetail, 'salestate')
				? this.blockDetail.salestate.toString()
				: '0'
			if (salestate == '0') {
				btn_state = '0'
			}
			var stake = _U.getIfDefined(this.blockDetail, 'stake')
			if (stake == 'true') {
				btn_state = '0'
			}
				
			return btn_state
		},

		marketItem() {
			// console.log("[Market.Detail] computed, marketItem ", this.mxGetMarketItem());
			if (this.tab_page == 'land-detail') {
				return {
					name: this.blockInfo.n,
					detail: _U.getIfDefined(this.blockDetail, 'description'),
					price: this.addComma(
						_U.getIfDefined(this.blockDetail, 'dviprice')
					),
					tokentype: _U.getIfDefined(this.blockDetail, 'tokentype'),
					owner_id: _U.getIfDefined(
						this.blockDetail,
						'owner_address'
					),
					token_id: _U.getIfDefined(this.blockDetail, 'token_id'),
					premium: _U.getIfDefined(this.blockDetail, 'premium'),
					total_supply: 1,
					sell_amount: 1,
					own_amount: 1,
					// 05.09 market index undefined fix
					market_index: _U.getIfDefined(this.blockDetail, 'market_index'),
					network: gConfig.wlt.getNetworkAddr(this.blockInfo.network)
						.Network, // testing
				}
			} else {
				return this.mxGetMarketItem()
			}
		},
		reducedOwnerAddress() {
			var address = this.marketItem.owner_id
			var reducedAddress = ''
			if (address != undefined && address.length == 42) {
				reducedAddress =
					address.slice(0, 10) + '...' + address.slice(32, 42)
			}

			return reducedAddress
		},
		networkName() {
			var marketItem = ''
			if (this.tab_page == 'land-detail') {
				marketItem = this.marketItem
			} else {
				marketItem = this.mxGetMarketItem()
			}

			if (marketItem.network === gConfig.wlt.getAddr().Network) {
				return 'ETH'
			} else if (
				marketItem.network === gConfig.wlt.getBscAddr().Network
			) {
				return 'BSC'
			}

			return ''
		},
		userInfo() {
			return this.$store.state.userInfo
		},
		blockInfo() {
			var dvLand = this.getDvLand()
			var blocks = dvLand.map
			var rv = null
			for (var i = 0; i < blocks.length; i++) {
				var b = blocks[i]
				if (b.id == this.blockId) {
					rv = b
					break
				}
			}
			return rv
		},
	},
	methods: {
		getDvLand() {
			console.log('get dv land', this.mapId)
			return this.mxGetLandMap(this.mapId)
		},

		isItemOwned() {
			var stake = _U.getIfDefined(this.blockDetail, 'stake')
			
			if (this.marketItem.owner_id && this.userInfo.wallet_addr && stake != "true") {			
				var curWallet = this.userInfo.wallet_addr.toLowerCase()
				var ownerId = this.marketItem.owner_id.toLowerCase()
				console.log({curWallet, ownerId}, 'test')

				return ownerId == curWallet
			}
			return false
		},

		refreshPage() {
			this.$router.go()
		},

		/// API

		callLandItemList() {
			console.log('[Market.Detail.vue] callLandItemList()')
			var network = gConfig.wlt.getNetworkAddr(
				this.getDvLand().network
			).Network

			this.mxCallAndSetLandItemList(this.mapId, network)
		},

		callLandItem() {
			var dvLand = this.getDvLand()
			var landCode = dvLand.n
			var network = gConfig.wlt.getNetworkAddr(dvLand.network).Network
			var query = {
				land_code: landCode,
				index: this.blockId,
				network: '("' + network + '")',
			}
			console.log(
				'[Market.Detail.vue] callLandItem(), query, dvLand : ',
				query,
				dvLand
			)

			this.mxShowLoading()
			_U.callPost({
				url: gConfig.market_land_item,
				data: query,
				callback: (resp) => {
					console.log(
						'[Market.Detail.vue] callLandItem()-> resp ',
						resp
					)
					var rows = _U.getIfDefined(resp, ['data', 'rows'])
					if (rows && rows.length > 0) {
						var blockDetail = rows[0]
						this.mxSetLandItemDetail(blockDetail)
					}
					console.log(
						'[Market.Detail.vue] callLandItem(), blockDetail:',
						blockDetail
					)

					this.mxCloseLoading()

					if (this.$refs.refMapLand) {
						this.$refs.refMapLand.mapInit()
					}
				},
			})
		},
		getBuyBtnLabel() {
			var txt = 'Not For Sale' // btn_state : 0
			switch (this.buyType) {
				case '1':
					txt = 'Buy'
					break
				case '2':
					txt = 'Link'
			}
			return txt
		},
		getBlockPosInfo(infoType) {
			var block = this.blockInfo
			var rv = ''
			if (infoType == 'start') {
				rv = block.x1 + ',' + block.y1
			} else if (infoType == 'end') {
				rv = block.x2 + ',' + block.y2
			} else if (infoType == 'size') {
				// rv = this.$t('market.land.size')+' : '+(block.x2 - block.x1 + 1)+'x'+(block.y1 - block.y2 + 1);
				var x = block.x2 - block.x1 + 1
				var y = block.y1 - block.y2 + 1
				rv = x + 'x' + y
				if (y > x) rv = y + 'x' + x
			} else if (infoType == 'square') {
				var x = block.x2 - block.x1 + 1
				var y = block.y1 - block.y2 + 1
				var idx = x + 'x' + y
				if (y > x) idx = y + 'x' + x
				rv = gConfig.getLandSquare(idx)
			}
			return rv
		},
		getBlockInfo() {
			var dvLand = this.getDvLand()
			var blocks = dvLand.map
			var rv = null
			for (var i = 0; i < blocks.length; i++) {
				var b = blocks[i]
				if (b.id == this.blockId) {
					rv = b
					break
				}
			}
			return rv
		},
		wasLogin() {
			if (_U.isDefined(this.userInfo, 'id')) {
				return true
			} else {
				return false
			}
		},
		getOwnerName(item) {
			// console.log("[Market.Detail] getOwnerName:", item.owner_name);
			this.itemOwned = item.owner_name
			// J = {category, account, tokenId, fToast }
			// wAPI.getOwnAmount({
			// 	category: item.category,
			// 	account: this.mxGetWalletAccount(),
			// 	tokenId: item.token_id,
			// 	fToast: this.mxShowToast,
			// }).then((resp)=>{
			// 	console.log("================ getOwnAmount() ->", resp);
			// });
		},
		checkCanBuy() {
			var maxCount = this.isItemOwned()
				? this.marketItem.own_amount
				: this.marketItem.sell_amount

			if (maxCount - this.buyCount > 0) {
				return true
			} else {
				return false
			}
		},
		onClickCount(type) {
			if (!this.wasLogin()) {
				this.mxShowAlert({ msg: this.$t('popup.login-required') })
				return
			}
			if (type == 'add') {
				if (this.checkCanBuy()) {
					this.buyCount += 1
				} else {
					this.mxShowToast(
						this.$t('market.detail.alert-no-left-item')
					)
				}
			} else {
				this.buyCount -= 1
				if (this.buyCount < 0) this.buyCount = 0
			}
		},
		redirectWallet(isSell = false, isLand) {
			const loginBy = window.localStorage.getItem('loginBy')
			switch (loginBy) {
				case METAMASK:
				case COINBASE:
					this.handleClickMetamaskCoinbase(loginBy, isSell, isLand)
					break
				case FORTMATIC:
					this.handleClickFortmatic(isSell, isLand)
					break
				case WALLETCONNECT:
					this.handleClickWalletConnect(isSell, isLand)
					break
				case BITSKI:
					this.handleClickBitski(isSell, isLand)
					break
			}
		},

		onClickSell() {
			if (!this.wasLogin()) {
				this.mxShowAlert({ msg: this.$t('popup.login-required') })
				return
			}
			this.redirectWallet(true, false)
		},

		onClickSellLand() {
			if (!this.wasLogin()) {
				this.mxShowAlert({ msg: this.$t('popup.login-required') })
				return
			}

			this.redirectWallet(true, true)
		},

		async handleClickSell(
			curActiveAccount,
			loginBy,
			provider,
			currentNetwork,
			isLand
		) {
			const walletName = loginBy
			if (curActiveAccount.toLowerCase() != this.$store.state.userInfo.wallet_addr.toLowerCase()) {
				this.mxShowAlert({
					msg:
						`Current active ${walletName} account is not your wallet address.` +
						'\n' +
						this.$store.state.userInfo.wallet_addr,
				})
			} else {
				const networkName = isLand
					? this.getDvLand().network
					: this.networkName
				if (networkName !== currentNetwork) {
					this.mxShowToast(
						`Your ${walletName} in not on network item registered.\nChange your network.`
					)
					this.mxCloseLoading()
					return
				}

				if (this.sellPrice <= 0) {
					this.mxShowToast(
						this.$t('market.detail.alert-sell-amount-invalid')
					)
					this.mxCloseLoading()
					return
				}

				const currentAccount = _U.getIfDefined(this.$store.state, [
					'userInfo',
					'wallet_addr',
				])

				if (!currentAccount) {
					this.mxShowToast(`Invalid ${walletName} wallet account`)
					this.mxCloseLoading()
					return
				}

				this.mxShowLoading('inf')

				if (this.buyCount <= 0 && !isLand) {
					this.mxShowToast(
						this.$t('market.detail.alert-no-selected-count')
					)
					this.mxCloseLoading()
					return
				}

				this.trade_data = {
					type: 'Sell',
					category: isLand ? '721' : this.marketItem.category,
					price: this.sellPrice,
					tokenId: this.marketItem.token_id,
					amount: this.buyCount,
					fToast: this.mxShowToast,
					network: networkName,
					provider,
					accountAddress: curActiveAccount,
					// 04.25 Market
					nftName: isLand ? this.getDvLand().nftName : this.marketItem.name,
					market_index: this.marketItem.market_index,
					callback: isLand ? this.onSellLand : this.onSellItem,
				}

				const objClone = { ...this.trade_data }
				if (isLand) {
					const tokenType = this.marketItem.tokentype
					delete objClone.amount
					objClone.tokenType = tokenType
				}

				this.trade_data = { ...objClone }

					// 04.25 Market
				if (isLand && (this.getDvLand().nftName == 'bsc-land-3rd' || this.getDvLand().nftName == 'pol-land-3rd')) {
					var onSale = this.mxGetLandItemDetail().salestate;

					if (onSale == '1') {
						this.approve_data = {
							type: 'CancelSell',
							category: '721',
							price: this.sellPrice,
							fToast: this.mxShowToast,
							network: networkName,
							provider,
							accountAddress: curActiveAccount,
							tokenId: this.marketItem.token_id,
							ownerId: this.marketItem.owner_id,
							// 05.09 market index undefined fix
							market_index: this.marketItem.market_index,
							callback: this.onCacelSellApprove,
						}

						this.mxCloseLoading()
						
						this.mxShowAlert({
							msg: this.$t('market.detail.alert-cancel-sell-msg'),
							btn: this.$t('market.detail.alert-cancel-sell-button'),
							callback: this.onCallbackCancelSellPopup,
						})
					} else {
						this.approve_data = {
							type: 'SellApproval',
							category: '721',
							price: this.sellPrice,
							fToast: this.mxShowToast,
							network: networkName,
							provider,
							accountAddress: curActiveAccount,
							// 05.09 market index undefined fix
							market_index: this.marketItem.market_index,
							callback: this.onSellApprove,
						}

						this.mxCloseLoading()
						
						this.mxShowAlert({
							msg: this.$t('market.detail.alert-sell-approve-msg'),
							btn: this.$t('market.detail.alert-approve-button'),
							callback: this.onCallbackSellApprovePopup,
						})
					}
					return;
				}
				
				this.mxCloseLoading()

				this.mxShowAlert({
					msg: this.$t('market.detail.alert-sell-msg'),
					btn: this.$t('market.detail.alert-sell-button'),
					callback: this.onCallbackSellPopup,
				})
			}

			return
		},

		async handleClickBuy(
			curActiveAccount,
			loginBy,
			provider,
			currentNetwork,
			isLand
		) {
			if (curActiveAccount) {
				const walletName = loginBy
				if (
					curActiveAccount.toLowerCase() != this.$store.state.userInfo.wallet_addr.toLowerCase()
				) {
					this.mxShowAlert({
						msg:
							this.$t('market.detail.alert-address-not-matched') +
							'\n' +
							this.$store.state.userInfo.wallet_addr,
					})
					return
				}
				const networkName = isLand
					? this.getDvLand().network
					: this.networkName
				if (networkName !== currentNetwork) {
					this.mxShowToast(
						`Your ${walletName} is not on network item registered.\nChange your network.`
					)
					this.mxCloseLoading()
					return
				}
				const buyer = _U.getIfDefined(this.$store.state, [
					'userInfo',
					'wallet_addr',
				])
				if (!buyer) {
					this.mxShowToast(
						this.$t('market.detail.alert-no-wallet-account')
					)
					this.mxCloseLoading()
					return
				}

				const seller = this.marketItem.owner_id

				if (buyer == seller) {
					this.mxShowToast(
						this.$t('market.detail.alert-same-account')
					)
					this.mxCloseLoading()
					return
				}

				this.mxShowLoading('inf')

				if (this.buyCount <= 0 && !isLand) {
					this.mxShowToast(
						this.$t('market.detail.alert-no-selected-count')
					)
					this.mxCloseLoading()
					return
				}

				if (isLand) {
					const tokenType = this.marketItem.tokentype
					const priceWithoutComma = this.marketItem.price.replace(
						/,/g,
						''
					)
					console.log(tokenType, 'tokenType')
					if (+tokenType === 0) {
						const data = {
							account: buyer,
							itemId: this.blockInfo.id,
							ownerId: this.marketItem.owner_id,
							land_code: this.getDvLand().n,
							price: this.marketItem.price,
							network: this.marketItem.network,
							nftName: this.getDvLand().nftName,
							// 04.25 Market
							market_index: this.marketItem.market_index,
							callback: this.onBuyLandItem,
						}
						this.mxCloseLoading()
						wAPI.buyLandItem(data)
					} else if (+tokenType === 1) {
						this.approve_data = {
							type: 'Approval',
							category: '721',
							price: priceWithoutComma,
							fToast: this.mxShowToast,
							network: networkName,
							provider,
							accountAddress: curActiveAccount,
							nftName: this.getDvLand().nftName,
							// 04.25 Market
							market_index: this.marketItem.market_index,
							callback: this.onApproveDvi,
						}
					}
				} else {
					this.approve_data = {
						type: 'Approval',
						category: this.marketItem.category,
						price: this.marketItem.price * this.buyCount,
						fToast: this.mxShowToast,
						network: this.networkName,
						provider,
						accountAddress: curActiveAccount,
						// 04.25 Market
						market_index: this.marketItem.market_index,
						callback: this.onApproveDvi,
					}
				}
				console.log('outtt', this.approve_data)
				this.mxCloseLoading()
				this.mxShowAlert({
					msg: `Approve the DVI expenditure in your ${walletName} Wallet to complete the purchase.`,
					btn: this.$t('market.detail.alert-approve-button'),
					callback: this.onCallbackApprovePopup,
				})
				return
			}
			this.mxShowAlert({
				msg:
					this.$t('signup.register.error-on-wallet-url') +
					'\n' +
					this.$t('popup.metamask-request-error') +
					'\n',
			})
		},
		async onClickBuy() {
			if (!this.wasLogin()) {
				this.mxShowAlert({ msg: this.$t('popup.login-required') })
				return
			}
			this.redirectWallet(false, false)
		},

		async handleClickMetamaskCoinbase(loginBy, isSell, isLand) {
			const network = await wAPI.checkMetamask()
			wAPI.Request_Account((resp) => {
				const curActiveAccount = _U.getIfDefined(resp, [
					'data',
					'account',
				])
				isSell
					? this.handleClickSell(
							curActiveAccount,
							loginBy,
							null,
							network,
							isLand
					  )
					: this.handleClickBuy(
							curActiveAccount,
							loginBy,
							null,
							network,
							isLand
					  )
			})
		},

		async handleClickFortmatic(isSell, isLand) {
			let web3 = new Web3(fortmaticProvider.getProvider())
			console.log('provider', fortmaticProvider)
			const currentNetwork = window.localStorage.getItem('currentNetwork')
			const network = renderNetworkName(
				currentNetwork
					? currentNetwork
					: window.localStorage.getItem('fortmaticNetwork')
			)

			web3.eth.getAccounts((error, accounts) => {
				if (error) {
					console.log(error)
				}
				const account = accounts[0]
				isSell
					? this.handleClickSell(
							account,
							FORTMATIC,
							fortmaticProvider.getProvider(),
							network,
							isLand
					  )
					: this.handleClickBuy(
							account,
							FORTMATIC,
							fortmaticProvider.getProvider(),
							network,
							isLand
					  )
			})
		},

		async handleClickWalletConnect(isSell, isLand) {
			await walletConnectProvider.enable()
			const web3 = new Web3(walletConnectProvider)
			const accounts = await web3.eth.getAccounts()
			const walletConnect = window.localStorage.getItem('walletconnect')
			const chainId = JSON.parse(walletConnect).chainId
			const network = renderNetworkName(chainId)
			isSell
				? this.handleClickSell(
						accounts[0],
						WALLETCONNECT,
						walletConnectProvider,
						network,
						isLand
				  )
				: this.handleClickBuy(
						accounts[0],
						WALLETCONNECT,
						walletConnectProvider,
						network,
						isLand
				  )
		},

		async handleClickBitski(isSell, isLand) {
			const res = await bitski.signIn()
			const currentNetwork = window.localStorage.getItem('currentNetwork')
			const network = renderNetworkName(
				currentNetwork
					? currentNetwork
					: window.localStorage.getItem('fortmaticNetwork')
			)

			if (res) {
				const provider = bitski.getProvider()
				isSell
					? this.handleClickSell(
							res.accounts[0],
							BITSKI,
							provider,
							network,
							isLand
					  )
					: this.handleClickBuy(
							res.accounts[0],
							BITSKI,
							provider,
							network,
							isLand
					  )
			}
		},
		onClickBuyLand() {
			const landItem = this.mxGetLandItemDetail()

			if (this.buyType == '2') {
				const url = landItem.extern_url
				window.open(url, '_blank')
			}

			if (this.buyType == '1') {
				if (!this.wasLogin()) {
					this.mxShowAlert({ msg: this.$t('popup.login-required') })
					return
				}

				this.redirectWallet(false, true)
			}
		},
		onPrependData(resp) {
			console.log('[Market-Detail] onPrependData(), resp:', resp)
			var prependingId = _U.getIfDefined(resp, ['data', 'result'])
			if (!prependingId) {
				this.mxShowToast(
					this.$t('market.detail.alert-no-prepending-id')
				)
				this.prependingId = null
				this.mxCloseLoading()
				return
			}
			this.prependingId = prependingId

			const provider = this.getProvider()

			this.trade_data = {
				type: 'Trade',
				category: this.marketItem.category,
				price: this.marketItem.price * this.buyCount,
				tokenId: this.marketItem.token_id,
				amount: this.buyCount,
				ownerId: this.marketItem.owner_id,
				fToast: this.mxShowToast,
				network: this.networkName,
				provider,
				accountAddress: this.$store.state.userInfo.wallet_addr,
				// 04.25 Market
						market_index: this.marketItem.market_index,
				callback: this.onTradeDvi,
			}

			this.mxCloseLoading()
			this.mxShowAlert({
				msg: this.$t('market.detail.alert-trade-msg'),
				btn: this.$t('market.detail.alert-trade-button'),
				callback: this.onCallbackTradePopup,
			})
		},
		getProvider() {
			let provider = null
			const loginBy = window.localStorage.getItem('loginBy')
			switch (loginBy) {
				case FORTMATIC:
					provider = fortmaticProvider.getProvider()
					break
				case WALLETCONNECT:
					provider = walletConnectProvider
					break
				case BITSKI:
					provider = bitski.getProvider()
					break
			}
			return provider
		},
		onBuyLandItem(resp) {
			console.log('[Market-Detail] onBuyLandItem(), resp:', resp)
			var result = _U.getIfDefined(resp, ['data', 'result'])
			if (result != 'success') {
				console.log('error')
			}

			console.log(result, 'result')

			var priceWithoutComma = this.marketItem.price.replace(/,/g, '')

			var networkName = this.getDvLand().network

			const provider = this.getProvider()

			this.trade_data = {
				type: 'Trade',
				category: '721',
				price: priceWithoutComma,
				tokenType: this.marketItem.tokentype,
				tokenId: this.marketItem.token_id,
				amount: 1,
				ownerId: this.marketItem.owner_id,
				fToast: this.mxShowToast,
				network: networkName,
				provider,
				accountAddress: this.$store.state.userInfo.wallet_addr,
				nftName: this.getDvLand().nftName,
				// 04.25 Market
				market_index: this.marketItem.market_index,
				callback: this.onTradeDvi,
			}

			this.mxCloseLoading()

			this.mxShowAlert({
				msg: this.$t('market.detail.alert-trade-msg'),
				btn: this.$t('market.detail.alert-trade-button'),
				callback: this.onCallbackTradePopup,
			})
		},
		onCallbackApprovePopup(resp) {
			console.log('on callback approve', resp)
			const data = this.approve_data
			console.log('data', data)
			if (!data) {
				return
			}
			
			if (_U.getIfDefined(resp, 'result') == true) {
				if (data.nftName == 'bsc-land-3rd' || data.nftName == 'pol-land-3rd')
				{
					this.mxShowLoading('inf')
					wAPI.ContractDviNew(data)
				} else {			
					this.mxShowLoading('inf')
					wAPI.ContractDvi(data)
				}
			}
		},
		onApproveDvi(resp) {
			console.log('[Market-Detail] onApproveDvi(), resp:', resp)
			this.trHash = _U.getIfDefined(resp, ['data', 'trHash'])
			if (_U.getIfDefined(resp, 'res_code') !== 200 || !this.trHash) {
				var msg = _U.getIfDefined(resp, 'msg')
				if (!msg) msg = '[Error] undefined.'
				this.trHash = null
				this.mxCloseLoading()
				this.mxShowAlert({ msg: msg })
				return
			}

			// TODO: Bug Fix needed
			var buyer = _U.getIfDefined(this.$store.state, [
				'userInfo',
				'wallet_addr',
			])

			if (buyer == undefined || buyer == null || buyer == '') {
				this.mxShowToast(
					this.$t('market.detail.alert-no-wallet-account')
				)
				this.mxCloseLoading()
				return
			}

			var dvLand = this.getDvLand()

			if (this.tab_page == 'land-detail') {
				const data = {
					account: buyer,
					itemId: this.blockInfo.id,
					ownerId: this.marketItem.owner_id,
					land_code: dvLand.n,
					price: this.marketItem.price,
					network: this.marketItem.network,
					callback: this.onBuyLandItem,
				}
				console.log('[Market-Detail] onApproveDvi(), call data:', data)
				wAPI.buyLandItem(data)
			} else {
				const data = {
					account: buyer,
					itemId: this.marketItem.id,
					ownerId: this.marketItem.owner_id,
					amount: this.buyCount,
					price: this.marketItem.price,
					callback: this.onPrependData,
				}
				// console.log('[Market-Detail] onApproveDvi(), call data:', data);
				wAPI.prependData(data)
			}
		},
		onCallbackTradePopup(resp) {
			var data = this.trade_data
			if (!data) {
				return
			}
			const myBalance = Number(this.$store.state.wallet.balance)
			const price = Number(data.price) * data.amount
			const loginBy = window.localStorage.getItem('loginBy')
			const currentNetwork = window.localStorage.getItem('currentNetwork')
			if(loginBy === BITSKI || loginBy === FORTMATIC) {
				if(myBalance < price && currentNetwork === gConfig.wlt.getAddr().Network) {
					this.mxShowToast('Your wallet does not have enough DVI to make this transaction')
					return
				}
			}

			if (_U.getIfDefined(resp, 'result') == true) {

				if (data.nftName == 'bsc-land-3rd' || data.nftName == 'pol-land-3rd')
				{
					this.mxShowLoading('inf')
					wAPI.ContractDviNew(data)
				} else {			
					this.mxShowLoading('inf')
					wAPI.ContractDvi(data)
				}
			} else {
				// console.log("[Market-Detail] onCallbackTradePopup() trade canceled on popup.");
			}
		},
		onTradeDvi(resp) {
			console.log('[Market-Detail] onTradeDvi(), resp:', resp)
			this.trHash = _U.getIfDefined(resp, ['data', 'trHash'])
			if (
				_U.getIfDefined(resp, 'res_code') !== 200 ||
				!this.trHash ||
				this.trHash === ''
			) {
				var msg = _U.getIfDefined(resp, 'msg')
				if (!msg) msg = '[Error] undefined.'
				this.trHash = null
				this.mxCloseLoading()
				this.mxShowAlert({
					msg: msg,
					callback: this.refreshPage,
				})
				return
			}

			var data = {
				prependingId: this.prependingId,
				hash_addr: this.trHash,
				callback: this.onCompleteData,
			}

			wAPI.CompleteData(data)
		},
		onCompleteData(resp) {
			// console.log('[Market-Detail] onCompleteData(), resp:', resp);
			var result = _U.getIfDefined(resp, ['data', 'result'])
			if (result !== 'success') {
				var msg = this.$t('market.detail.alert-failed-on-buy')
				this.mxShowAlert({ msg: msg })
				this.mxCloseLoading()
				return
			}
			this.mxCloseLoading()
			var msg = this.$t('market.detail.alert-success-on-buy')
			this.mxShowAlert({
				msg: msg,
				callback: this.refreshPage,
			})
		},
		onCallbackSellApprovePopup(resp) {
			console.log('on callback sell approve', resp)
			const data = this.approve_data
			console.log('data', data)
			if (!data) {
				return
			}
			
			if (_U.getIfDefined(resp, 'result') == true) {
				this.mxShowLoading('inf')
				wAPI.ContractDviNew(data)
			}
		},
		onCallbackCancelSellPopup(resp) {
			console.log('on callback cancel sell', resp)
			const data = this.approve_data
			console.log('data', data)
			if (!data) {
				return
			}
			
			if (_U.getIfDefined(resp, 'result') == true) {
				this.mxShowLoading('inf')
				wAPI.ContractDviNew(data)
			}
		},
		onCallbackSellPopup(resp) {
			var data = this.trade_data
			if (!data) {
				return
			}
			if (_U.getIfDefined(resp, 'result') == true) {
				if (data.nftName == 'bsc-land-3rd' || data.nftName == 'pol-land-3rd')
				{
					this.mxShowLoading('inf')
					wAPI.ContractDviNew(data)
				} else {			
					this.mxShowLoading('inf')
					wAPI.ContractDvi(data)
				}
			} else {
				// console.log("[Market-Detail] onCallbackTradePopup() trade canceled on popup.");
			}
		},
		onSellItem(resp) {
			this.trHash = _U.getIfDefined(resp, ['data', 'trHash'])

			if (
				_U.getIfDefined(resp, 'res_code') !== 200 ||
				!this.trHash ||
				this.trHash === ''
			) {
				var msg = _U.getIfDefined(resp, 'msg')
				if (!msg) msg = '[Error] undefined.'
				this.trHash = null
				this.mxCloseLoading()
				this.mxShowAlert({ msg: msg })
				return
			}

			var query = {
				item_id: this.marketItem.item_id,
				wallet_addr: this.marketItem.owner_id,
				price: this.sellPrice,
				for_sale: 'true',
				sell_amount: this.buyCount,
			}

			_U.callPost({
				url: gConfig.market_item_sell,
				data: query,
				callback: (resp) => {
					console.log(
						'[Market.Detail.vue] onSellItem()-> resp ',
						resp
					)

					var result = _U.getIfDefined(resp, ['data', 'result'])
					if (result !== 'success') {
						var msg = this.$t('market.detail.alert-failed-on-sell')
						this.mxShowAlert({ msg: msg })
						this.mxCloseLoading()
						return
					}

					this.mxCloseLoading()
					var msg = this.$t('market.detail.alert-success-on-sell')
					this.mxShowAlert({
						msg: msg,
						callback: this.refreshPage,
					})
				},
			})
		},
		onSellApprove(resp) {
			console.log("list nfts on sale. price : ", this.sellPrice)

			this.mxCloseLoading()

			this.mxShowAlert({
				msg: this.$t('market.detail.alert-sell-msg'),
				btn: this.$t('market.detail.alert-sell-button'),
				callback: this.onCallbackSellPopup,
			})
		},
		onCacelSellApprove(resp) {
			this.mxCloseLoading()
			var msg = this.$t('market.detail.alert-success-on-cancel')
			this.mxShowAlert({
				msg: msg,
				callback: this.refreshPage,
			})
		},
		onSellLand(resp) {
			this.trHash = _U.getIfDefined(resp, ['data', 'trHash'])

			if (
				_U.getIfDefined(resp, 'res_code') !== 200 ||
				!this.trHash ||
				this.trHash === ''
			) {
				var msg = _U.getIfDefined(resp, 'msg')
				if (!msg) msg = '[Error] undefined.'
				this.trHash = null
				this.mxCloseLoading()
				this.mxShowAlert({ msg: msg })
				return
			}

			var network = gConfig.wlt.getNetworkAddr(
				this.getDvLand().network
			).Network

			var query = {
				token_id: this.marketItem.token_id,
				network: network,
				dvi_price: this.sellPrice,
				sale_state: 'true',
			}

			_U.callPost({
				url: gConfig.market_land_sell,
				data: query,
				callback: (resp) => {
					console.log(
						'[Market.Detail.vue] onSellLand()-> resp ',
						resp
					)

					var result = _U.getIfDefined(resp, ['data', 'result'])
					if (result !== 'success') {
						var msg = this.$t('market.detail.alert-failed-on-sell')
						this.mxShowAlert({ msg: msg })
						this.mxCloseLoading()
						return
					}

					this.mxCloseLoading()
					var msg = this.$t('market.detail.alert-success-on-sell')
					this.mxShowAlert({
						msg: msg,
						callback: this.refreshPage,
					})
				},
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.Market-Detail {
	@include FLEXV(flex-start, center);
	width: 100%;
	height: auto;
	background-color: #181721;
	padding-top: gREm(164);

	min-height: calc(100vh - 176px); // Foot 176px

	.top-info,
	.top-land {
		width: 100%;
		height: gREm(420);
		@include FLEX(center, center);

		&[level='common'] {
			background-color: #72767f;
		}
		&[level='advance'] {
			background-color: #f2f4f8;
		}
		&[level='rare'] {
			background-image: linear-gradient(to right, #3dd3bc, #22e073);
		}
		&[level='unique'] {
			background-image: linear-gradient(to right, #dc8dff, #b953e6);
		}
		&[level='unique+alpha'] {
			background-image: linear-gradient(
				to right,
				#85cee5,
				#61e5d1 47%,
				#489afa
			);
		}
		&[level='legend'] {
			background-image: linear-gradient(
				to right,
				#ffcc88 -5%,
				#feaad6 41%,
				#c3c3f2 63%,
				#51f8f2 109%
			);
		}

		.item-img {
			width: gREm(370);
			height: gREm(370);
		}
	}
	.item-info-wrap {
		@include FLEX(center, center);
		width: 100%;
		height: gREm(443);
		.item-info {
			width: gREm(238 + 742 + 66);
			@include Transition(0.5s ease);

			.item-navi-path {
				width: auto;
				height: gREm(19);
				margin-top: gREm(60);
				.item-category {
					@include Set-Font($AppFont, gREm(16), gREm(19), #959699);
				}
				.item-level {
					@include Set-Font($AppFont, gREm(13), gREm(16), #ffffff);
				}
			}
			.item-desc-box {
				.title-count-box {
					width: 100%;
					@include FLEX(space-between, center);
					.name {
						width: auto;
						height: gREm(57);
						margin-top: gREm(5);
						@include Set-Font(
							$AppFont,
							gREm(46),
							gREm(57),
							#ffffff,
							500
						);
					}

					.count-image {
						width: gREm(66);
						height: gREm(66);
						// @include SetBgImage(url('../assets/img/market/ic-owend.svg'));
						@include FLEXV(flex-start, center);
						.owned {
							width: gREm(40);
							height: gREm(18);
							margin-top: gREm(15);
							text-align: center;
							@include Set-Font(
								$AppFont,
								gREm(14),
								gREm(18),
								#c7c7c7,
								500
							);
						}
						.owned-label {
							width: gREm(41);
							height: gREm(13);
							margin-top: gREm(3);
							text-align: center;
							@include Set-Font(
								$AppFont,
								gREm(10),
								gREm(13),
								#c7c7c7,
								500
							);
						}
					}
				}
				.map-block-info-box {
					height: gREm(32);
					@include FLEX(flex-start, center);
					margin-top: gREm(12);
					.pos-tilde {
						width: gREm(6);
						float: left;
						height: gREm(32);
						margin-left: gREm(10);
						margin-right: gREm(10);
						@include Set-Font(
							$AppFont,
							gREm(13),
							gREm(32),
							#ffff,
							300
						);
					}
					.pos-box {
						width: auto;
						float: left;
						height: gREm(32);
						background-color: #2a2932;
						border-radius: gREm(6);
						padding-left: gREm(14);
						padding-right: gREm(14);
						.icon {
							float: left;
							width: gREm(8);
							height: gREm(11);
							margin-top: gREm(11);
							@include SetBgImage(
								url('../assets/img/market/ic-land-map.svg')
							);
						}
						.pos {
							float: left;
							width: auto;
							height: gREm(16);
							margin-left: gREm(6);
							margin-top: gREm(8);
							@include Set-Font(
								$AppFont,
								gREm(13),
								gREm(16),
								#ffff,
								300
							);
							text-align: left;
						}
					}
					.pos-size {
						width: auto;
						float: left;
						margin-left: gREm(16);
						height: gREm(32);
						@include Set-Font(
							$AppFont,
							gREm(15),
							gREm(32),
							#ffff,
							300
						);
						text-align: left;
					}
				}
				.description-box {
					margin-top: gREm(50);
					.label {
						width: gREm(90);
						height: gREm(19);
						@include Set-Font(
							$AppFont,
							gREm(16),
							gREm(19),
							#959699,
							300
						);
					}
					.description {
						width: auto;
						height: gREm(22);
						margin-top: gREm(10);
					}
				}
			}
			.item-detail-box {
				margin-top: gREm(50);
				margin-bottom: gREm(100);
				width: auto;
				@include FLEX(space-between, flex-start);
				.detail-info {
					width: auto;
					min-width: gREm(500);
					height: gREm(48);
					@include FLEX(space-between, center);
					@include Transition(0.5s ease);

					.price {
						.header {
							width: auto;
							height: gREm(19);
							@include Set-Font(
								$AppFont,
								gREm(16),
								gREm(19),
								#959699,
								300
							);
						}
						.price-box {
							@include FLEX(flex-start, center);
							margin-top: gREm(10);
							.icon {
								width: gREm(14);
								height: gREm(16);
								@include SetBgImage(
									url('../assets/img/ic-dvi-market.svg')
								);
							}
							.value {
								width: auto;
								height: gREm(22);
								margin-left: gREm(5);
								@include Set-Font(
									$AppFont,
									gREm(18),
									gREm(22),
									#febf37
								);
							}
						}
					}
					.total {
						.header {
							width: auto;
							height: gREm(19);
							@include Set-Font(
								$AppFont,
								gREm(16),
								gREm(19),
								#959699,
								300
							);
						}

						.value {
							width: auto;
							height: gREm(22);
							margin-top: gREm(10);
							margin-left: gREm(5);
							@include Set-Font(
								$AppFont,
								gREm(18),
								gREm(22),
								#ffffff
							);
						}
					}
					.left {
						.header {
							width: auto;
							height: gREm(19);
							@include Set-Font(
								$AppFont,
								gREm(16),
								gREm(19),
								#959699,
								300
							);
						}

						.value {
							width: auto;
							height: gREm(22);
							margin-top: gREm(10);
							margin-left: gREm(5);
							@include Set-Font(
								$AppFont,
								gREm(18),
								gREm(22),
								#ffffff
							);
						}
					}
					.owner {
						.header {
							width: auto;
							height: gREm(19);
							@include Set-Font(
								$AppFont,
								gREm(16),
								gREm(19),
								#959699,
								300
							);
						}
						.value {
							width: auto;
							height: gREm(22);
							margin-top: gREm(10);
							margin-left: gREm(5);
							@include Set-Font(
								$AppFont,
								gREm(18),
								gREm(22),
								#ffffff
							);
						}
					}
				}
				.buy-info {
					@include FLEX(space-between, center);
					padding-left: gREm(100);
					.count-box {
						width: gREm(120);
						@include FLEX(space-between, center);
						margin-right: gREm(30);
						.icon {
							width: gREm(24);
							height: gREm(24);
							cursor: pointer;
							@include Transition(0.5s ease-in-out);
						}
						.icon-sub {
							@include SetBgImage(
								url('../assets/img/market/ic-minus-market-n.svg')
							);
							&[active='off']:hover {
								@include SetBgImage(
									url('../assets/img/market/ic-minus-market-h.svg')
								);
								opacity: 1;
							}
							&[active='on'] {
								opacity: 0.4;
							}
						}
						.buy-count {
							width: auto;
							height: gREm(22);
							padding-left: gREm(26);
							padding-right: gREm(26);
						}
						.icon-add {
							@include SetBgImage(
								url('../assets/img/market/ic-plus-market-n.svg')
							);
							&:hover {
								@include SetBgImage(
									url('../assets/img/market/ic-plus-market-h.svg')
								);
							}
						}
					}
					.buy-box {
						.buy-button {
							width: gREm(168);
							height: gREm(48);
							border-radius: gREm(6);
							background-image: linear-gradient(
								256deg,
								#8d8d8d,
								#8d8d8d
							);
							@include FLEX(center, center);
							// background-image:
							@include Set-Font(
								$AppFont,
								gREm(18),
								gREm(22),
								#ffffff
							);
							text-align: center;

							&[buytype='1'] {
								cursor: pointer;
								@include OnOverTransition();
								background-image: linear-gradient(
									to right,
									rgb(155, 119, 245),
									#6c38ef 100%
								);
							}
							&[buytype='2'] {
								cursor: pointer;
								@include OnOverTransition();
								background-image: linear-gradient(
									to right,
									#a4d522 0%,
									#21b449 100%
								);
							}
							&:hover {
								cursor: pointer;
								background-image: linear-gradient(
									to right,
									rgb(155, 119, 245),
									#6c38ef 100%
								);
							}
						}
					}
				}
			}
		}
	}
	.item-land-wrap {
		@include FLEX(space-between, flex-start);
		width: gREm(238 + 742 + 66);
		height: gREm(643);
		.item-info {
			width: auto;
			@include Transition(0.5s ease);
			margin-top: gREm(60);
			.item-navi-path {
				width: auto;
				height: gREm(19);
				.item-category {
					@include Set-Font($AppFont, gREm(16), gREm(19), #959699);
				}
				.item-level {
					@include Set-Font($AppFont, gREm(13), gREm(16), #ffffff);
				}
			}
			.item-desc-box {
				.title-count-box {
					width: 100%;
					@include FLEX(space-between, center);
					.name {
						width: auto;
						height: gREm(57);
						margin-top: gREm(5);
						@include Set-Font(
							$AppFont,
							gREm(46),
							gREm(57),
							#ffffff,
							500
						);
					}

					.count-image {
						width: gREm(66);
						height: gREm(66);
						// @include SetBgImage(url('../assets/img/market/ic-owend.svg'));
						@include FLEXV(flex-start, center);
						.owned {
							width: gREm(40);
							height: gREm(18);
							margin-top: gREm(15);
							text-align: center;
							@include Set-Font(
								$AppFont,
								gREm(14),
								gREm(18),
								#c7c7c7,
								500
							);
						}
						.owned-label {
							width: gREm(41);
							height: gREm(13);
							margin-top: gREm(3);
							text-align: center;
							@include Set-Font(
								$AppFont,
								gREm(10),
								gREm(13),
								#c7c7c7,
								500
							);
						}
					}
				}
				.map-block-info-box {
					height: gREm(32);
					@include FLEX(flex-start, center);
					margin-top: gREm(12);
					.pos-tilde {
						width: gREm(6);
						float: left;
						height: gREm(32);
						margin-left: gREm(10);
						margin-right: gREm(10);
						@include Set-Font(
							$AppFont,
							gREm(13),
							gREm(32),
							#ffff,
							300
						);
					}
					.pos-box {
						width: auto;
						float: left;
						height: gREm(32);
						background-color: #2a2932;
						border-radius: gREm(6);
						padding-left: gREm(14);
						padding-right: gREm(14);
						.icon {
							float: left;
							width: gREm(8);
							height: gREm(11);
							margin-top: gREm(11);
							@include SetBgImage(
								url('../assets/img/market/ic-land-map.svg')
							);
						}
						.pos {
							float: left;
							width: auto;
							height: gREm(16);
							margin-left: gREm(6);
							margin-top: gREm(8);
							@include Set-Font(
								$AppFont,
								gREm(13),
								gREm(16),
								#ffff,
								300
							);
							text-align: left;
						}
					}
					.pos-size {
						width: auto;
						float: left;
						margin-left: gREm(16);
						height: gREm(32);
						@include Set-Font(
							$AppFont,
							gREm(15),
							gREm(32),
							#ffff,
							300
						);
						text-align: left;
					}
				}
			}
			.item-detail-box {
				margin-top: gREm(50);
				margin-bottom: gREm(100);
				width: auto;
				@include FLEX(space-between, flex-start);
				.detail-info {
					width: auto;
					min-width: gREm(500);
					height: gREm(48);
					@include FLEXV(flex-start, flex-start);
					@include Transition(0.5s ease);

					.description-box {
						.label {
							width: gREm(90);
							height: gREm(19);
							@include Set-Font(
								$AppFont,
								gREm(16),
								gREm(19),
								#959699,
								300
							);
						}
						.description {
							width: auto;
							height: gREm(22);
							margin-top: gREm(10);
						}
					}

					.price {
						margin-top: gREm(50);

						.header {
							width: auto;
							height: gREm(19);
							@include Set-Font(
								$AppFont,
								gREm(16),
								gREm(19),
								#959699,
								300
							);
						}
						.price-box {
							@include FLEX(flex-start, center);
							margin-top: gREm(10);
							.pol-icon {
								width: gREm(22);
								height: gREm(19);
								@include SetBgImage(
									url('../assets/img/ic-polygon-market.svg')
								);
							}
							.pol-value {
								width: auto;
								height: gREm(22);
								margin-left: gREm(5);
								@include Set-Font(
									$AppFont,
									gREm(18),
									gREm(22),
									#7a4add
								);
							}
							.icon {
								width: gREm(14);
								height: gREm(16);
								@include SetBgImage(
									url('../assets/img/ic-dvi-market.svg')
								);
							}
							.value {
								width: auto;
								height: gREm(22);
								margin-left: gREm(5);
								@include Set-Font(
									$AppFont,
									gREm(18),
									gREm(22),
									#febf37
								);
							}
						}
					}
				}
			}
		}

		.buy-info {
			width: gREm(285);
			margin-top: gREm(90);
			@include FLEXV(flex-start, center);

			.buy-certificate-photo {
				width: gREm(285);
				height: gREm(340);

				.description {
					position: absolute;
					@include FLEX(center, center);
					bottom: gREm(50);
					height: gREm(30);
					width: 100%;
					@include Set-Font(
						$AppFont,
						gREm(16),
						gREm(19),
						#ffffff,
						800
					);
					// -webkit-text-stroke: 1px #555555;
					text-shadow: 0px 3px 3px #000000;
					//  text-shadow:
					// 	3px 3px 0 #000,
					// 	-1px -1px 0 #000,
					// 	1px -1px 0 #000,
					// 	-1px 1px 0 #000,
					// 	1px 1px 0 #000;
					text-transform: uppercase;
				}

				.text {
					position: absolute;
					@include FLEX(center, center);
					bottom: gREm(28);
					height: gREm(18);
					color: white;
					@include Set-Font(
						$AppFont,
						gREm(9),
						gREm(18),
						#ffffff,
						300
					);
					text-align: center;
					letter-spacing: gREm(1.2);
				}
				.pos-size {
					left: gREm(28);
					width: gREm(56);
				}
				.pos-start {
					left: gREm(96);
					width: gREm(40);
				}
				.pos-tilde {
					left: gREm(140);
					width: gREm(10);
				}
				.pos-end {
					left: gREm(154);
					width: gREm(40);
				}
				.pos-square {
					left: gREm(206);
					width: gREm(56);
					sup {
						transform: scale(0.7);
						margin-top: gREm(-7);
					}
				}

				// testing
				// @include SetBgImage(url('../assets/img/market/certi_land_seoul_01.png'));

				&[map_id='gangnam'] {
					&[premium='FALSE'] {
						&[type='1x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_seoul_01.png')
							);
						}
						&[type='2x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_seoul_02.png')
							);
						}
						&[type='2x2'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_seoul_03.png')
							);
						}
						&[type='3x3'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_seoul_04.png')
							);
						}
					}
					&[premium='TRUE'] {
						&[type='1x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_seoul_01_premium.png')
							);
						}
						&[type='2x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_seoul_02_premium.png')
							);
						}
						&[type='2x2'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_seoul_03_premium.png')
							);
						}
						&[type='3x3'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_seoul_04_premium.png')
							);
						}
					}
					@include SetBgImage(
						url('../assets/img/market/certi_land_seoul_04_premium.png')
					);
				}

				&[map_id='newyork'] {
					&[premium='FALSE'] {
						&[type='1x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_newyork_01.png')
							);
						}
						&[type='2x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_newyork_02.png')
							);
						}
						&[type='2x2'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_newyork_03.png')
							);
						}
						&[type='3x3'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_newyork_04.png')
							);
						}
					}
					&[premium='TRUE'] {
						&[type='1x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_newyork_01_premium.png')
							);
						}
						&[type='2x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_newyork_02_premium.png')
							);
						}
						&[type='2x2'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_newyork_03_premium.png')
							);
						}
						&[type='3x3'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_newyork_04_premium.png')
							);
						}
					}
					@include SetBgImage(
						url('../assets/img/market/certi_land_newyork_04_premium.png')
					);
				}

				&[map_id='london'] {
					&[premium='FALSE'] {
						&[type='1x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_london_01.png')
							);
						}
						&[type='2x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_london_02.png')
							);
						}
						&[type='2x2'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_london_03.png')
							);
						}
						&[type='3x3'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_london_04_premium.png')
							);
						}
					}
					&[premium='TRUE'] {
						&[type='1x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_london_01_premium.png')
							);
						}
						&[type='2x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_london_02_premium.png')
							);
						}
						&[type='2x2'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_london_03_premium.png')
							);
						}
						&[type='3x3'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_london_04_premium.png')
							);
						}
					}
					@include SetBgImage(
						url('../assets/img/market/certi_land_london_04_premium.png')
					);
				}

				&[map_id='tokyo'] {
					&[premium='FALSE'] {
						&[type='1x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_tokyo_01.png')
							);
						}
						&[type='2x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_tokyo_02.png')
							);
						}
						&[type='2x2'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_tokyo_03.png')
							);
						}
						&[type='3x3'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_tokyo_04_premium.png')
							);
						}
					}
					&[premium='TRUE'] {
						&[type='1x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_tokyo_01_premium.png')
							);
						}
						&[type='2x1'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_tokyo_02_premium.png')
							);
						}
						&[type='2x2'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_tokyo_03_premium.png')
							);
						}
						&[type='3x3'] {
							@include SetBgImage(
								url('../assets/img/market/certi_land_tokyo_04_premium.png')
							);
						}
					}
					@include SetBgImage(
						url('../assets/img/market/certi_land_tokyo_04_premium.png')
					);
				}

				&[map_id="berlin"] {
					&[premium="FALSE"]{
						&[type="1x1"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_berlin_01.png')
							);
						}
						&[type="2x1"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_berlin_02.png')
							);
						}
						&[type="2x2"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_berlin_03.png')
							);
						}
						&[type="3x3"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_berlin_04_premium.png')
							);
						}
					}
					&[premium="TRUE"]{
						&[type="1x1"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_berlin_01_premium.png')
							);
						}
						&[type="2x1"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_berlin_02_premium.png')
							);
						}
						&[type="2x2"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_berlin_03_premium.png')
							);
						}
						&[type="3x3"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_berlin_04_premium.png')
							);
						}
					}
					@include SetBgImage(url(
						'../assets/img/market/certi_land_berlin_04_premium.png')
					);
				}

				&[map_id="saopaulo"] {
					&[premium="FALSE"]{
						&[type="1x1"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_saopaulo_01.png')
							);
						}
						&[type="2x1"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_saopaulo_02.png')
							);
						}
						&[type="2x2"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_saopaulo_03.png')
							);
						}
						&[type="3x3"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_saopaulo_04_premium.png')
							);
						}
					}
					&[premium="TRUE"]{
						&[type="1x1"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_saopaulo_01_premium.png')
							);
						}
						&[type="2x1"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_saopaulo_02_premium.png')
							);
						}
						&[type="2x2"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_saopaulo_03_premium.png')
							);
						}
						&[type="3x3"] {
							@include SetBgImage(url(
								'../assets/img/market/certi_land_saopaulo_04_premium.png')
							);
						}
					}
					@include SetBgImage(url(
						'../assets/img/market/certi_land_saopaulo_04_premium.png')
					);
				}
			}
			.buy-box {
				margin-top: gREm(50);
				.buy-button {
					width: gREm(168);
					height: gREm(48);
					border-radius: gREm(6);
					background-image: linear-gradient(256deg, #8d8d8d, #8d8d8d);
					@include FLEX(center, center);
					// background-image:
					@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
					text-align: center;

					&[buytype='1'] {
						cursor: pointer;
						@include OnOverTransition();
						background-image: linear-gradient(
							to right,
							rgb(155, 119, 245),
							#6c38ef 100%
						);
					}
					&[buytype='2'] {
						cursor: pointer;
						@include OnOverTransition();
						background-image: linear-gradient(
							to right,
							#a4d522 0%,
							#21b449 100%
						);
					}
				}
			}
		}
	}
}

@include media-max($media_medium) {
	// 1024
	.Market-Detail {
		.item-info-wrap {
			.item-info {
				width: gREm(238 + 742 + 66 - 200);
				.item-detail-box {
					.detail-info {
						width: auto;
						min-width: gREm(300);
					}
					.buy-info {
						padding-left: gREm(50);
					}
				}
			}
		}
	}
}

@include media-max($media_small) {
	// 768
	.Market-Detail {
		padding: 0 gREm(20);

		.item-land-wrap {
			width: 100%;
			height: auto;
			flex-direction: column;

			.item-info {
				width: 100%;
				margin-top: gREm(40);

				.item-title-box {
					height: auto;

					.item-navi-path {
						height: auto;
						.item-category,
						.item-level {
							font-size: gREm(16);
							line-height: gREm(24);
						}
					}
				}

				.item-desc-box {
					.title-count-box {
						.name {
							width: 100%;
							height: auto;
							margin-top: gREm(24);
							white-space: pre-wrap;
						}
					}
				}

				.item-detail-box {
					margin-top: gREm(24);
					margin-bottom: 0;
					width: 100%;

					.detail-info {
						width: 100%;
						height: auto;
						min-width: unset;

						.description-box,
						.info {
							width: 100%;
						}

						.info {
							margin-top: gREm(24);
						}

						.description {
							font-size: gREm(18);
						}
					}
				}
			}

			.buy-info {
				width: 100%;
				margin-top: gREm(40);
				border: 1px solid #ffffff;
				padding: gREm(30);
				border-radius: gREm(8);

				.buy-box {
					.buy-button {
						width: auto;
						padding: gREm(12) gREm(94.5);
						height: auto;
						font-size: gREm(16);
						line-height: gREm(24);
					}
				}
			}
		}

		.top-info {
			height: auto;
			border: 1px solid #ffffff;
			border-radius: gREm(6);

			.item-img {
				width: gREm(190);
				border-radius: gREm(6);
			}

			&[level='common'] {
				background-color: rgba(42, 41, 50, 0.7);
				opacity: 0.7;
			}
		}

		.item-info-wrap {
			height: auto;
			.item-info {
				width: 100%;

				.item-title-box {
					.item-navi-path {
						margin-top: gREm(40);
						height: auto;
						margin-bottom: gREm(24);
						.item-category {
							text-transform: capitalize;
							line-height: gREm(24);
							color: #a0a0a0;
						}

						.item-level {
							font-size: gREm(16);
						}
					}
				}

				.item-desc-box {
					.title-count-box {
						flex-direction: column;
						align-items: flex-start;

						.name {
							font-size: gREm(36);
							line-height: gREm(48);
							white-space: pre-wrap;
							height: auto;
							width: 100%;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.count-image {
							flex-direction: row;
							align-items: center;
							height: auto;
							width: auto;
							gap: gREm(8);
							margin-top: gREm(8);

							.owned,
							.owned-label {
								margin-top: 0;
								width: auto;
								height: auto;
							}
						}
					}

					.description-box {
						margin-top: gREm(40);

						.label {
							color: #a0a0a0;
							width: 100%;
							height: auto;
						}

						.description {
							width: 100%;
							height: auto;
							font-size: gREm(18);
							line-height: gREm(24);
						}
					}
				}

				.item-detail-box {
					width: 100%;
					margin-top: gREm(24);
					flex-direction: column;

					.detail-info {
						flex-direction: column;
						align-items: flex-start;
						height: auto;

						.info:not(:last-child) {
							margin-bottom: gREm(24);

							.header,
							.value {
								height: auto;
								width: 100%;
								font-size: gREm(16);
								line-height: gREm(24);
							}

							.header {
								color: #a0a0a0;
								margin-bottom: gREm(8);
							}

							.value {
								margin: 0;
							}
						}
					}

					.buy-info {
						padding-left: 0;
						width: 100%;
						margin-top: gREm(32);

						.count-box {
							margin-right: 0;
							width: gREm(136);
							.icon {
								width: gREm(32);
								height: gREm(32);
							}

							.buy-count {
								height: auto;
								padding: 0;
							}
						}

						.buy-box {
							.buy-button {
								font-size: gREm(14);
								line-height: gREm(22);
								width: auto;
								height: auto;
								padding: gREm(13) gREm(30);
							}
						}
					}
				}
			}
		}
	}
}
</style>
