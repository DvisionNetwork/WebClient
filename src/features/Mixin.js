var lv_LoadingTimerCount = 0
var lv_LoadingTimer = null

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig()

var Mixin = {
	created() {
		// console.log("Mixin created");
	},
	methods: {
		// mxScrollToTop() {
		// 	window.scrollTo(0,0);
		// },

		/// show popup ///
		mxShowToast(msg) {
			this.$store.dispatch('showToast', { show: true, msg: msg })
		},
		mxCloseToast() {
			this.$store.dispatch('showToast', { show: false, msg: '' })
		},

		mxShowLoading(inf) {
			// infinite for Wallet API

			lv_LoadingTimerCount += 1
			if (lv_LoadingTimerCount > 5) lv_LoadingTimerCount = 5 // max 5;

			this.$store.dispatch('showLoading', true)

			// console.log('**** showLoading call from ====== >>>>', lv_LoadingTimerCount, 'inf='+inf);
			var timeout = gConfig.maxLoadingTimeLimit

			if (typeof inf != 'undefined' && inf == 'inf') {
				timeout = 3 * 60 * 1000
			}

			if (lv_LoadingTimer) {
				clearTimeout(lv_LoadingTimer)
				lv_LoadingTimer = null
			}

			lv_LoadingTimer = setTimeout(() => {
				lv_LoadingTimerCount -= 1
				if (lv_LoadingTimerCount < 0) lv_LoadingTimerCount = 0
				console.error(
					'**** closeLoading by Timeout ====== >>>>',
					lv_LoadingTimerCount
				)
				this.$store.dispatch('showLoading', false)
			}, timeout)
		},
		mxCloseLoading() {
			lv_LoadingTimerCount -= 1
			if (lv_LoadingTimerCount < 0) lv_LoadingTimerCount = 0
			if (lv_LoadingTimerCount > 0) return

			// console.error('**** closeLoading call from ====== <<<<<', lv_LoadingTimerCount);
			if (lv_LoadingTimer) {
				clearTimeout(lv_LoadingTimer)
				lv_LoadingTimer = null
			}
			this.$store.dispatch('showLoading', false)
		},
		// J = msg,btn,callback
		mxShowAlert(J) {
			var param = {
				show: true,
				msg: J.msg,
				reward: J.reward,
				callback: typeof J.callback == 'function' ? J.callback : null,
			}
			if (J.btn) param.btn = J.btn
			this.$store.dispatch('showAlert', param)
		},
		mxCloseAlert(resp) {
			if (typeof this.$store.state.showAlert.callback == 'function') {
				var param = { result: false }
				if (resp) param.result = resp
				this.$store.state.showAlert.callback(param)
			}
			this.$store.dispatch('showAlert', {
				show: false,
				msg: '',
				btn: '',
				callback: null,
			})
		},
		mxShowGameStartLoading() {
			this.$store.dispatch('showGameStartLoading', true)
		},
		mxCloseGameStartLoading() {
			this.$store.dispatch('showGameStartLoading', false)
		},
		mxShowEditProfilePopup() {
			this.$store.dispatch('showEditProfilePopup', true)
		},
		mxCloseEditProfilePopup() {
			this.$store.dispatch('showEditProfilePopup', false)
		},

		mxShowAddWallet() {
			this.$store.dispatch('showAddWallet', true)
		},
		mxCloseAddWallet() {
			this.$store.dispatch('showAddWallet', false)
		},

		mxShowChangePasswordPopup() {
			this.$store.dispatch('showChangePasswordPopup', true)
		},
		mxCloseChangePasswordPopup() {
			this.$store.dispatch('showChangePasswordPopup', false)
		},

		mxShowEditProfile() {
			this.$store.dispatch('showEditProfile', true)
		},
		mxCloseEditProfile() {
			this.$store.dispatch('showEditProfile', false)
		},
		mxShowStakingModal(obj) {
			this.$store.dispatch('showStakingModal', obj)
		},
		mxCloseStakingModal() {
			this.$store.dispatch('showStakingModal', false)
		},
		mxShowSuccessModal(obj) {
			this.$store.dispatch('showSuccessModal', obj)
		},
		mxCloseSuccessModal() {
			this.$store.dispatch('showSuccessModal', false)
		},
		mxShowConfirmModal(obj) {
			this.$store.dispatch('showConfirmModal', obj)
		},
		mxCloseConfirmModal() {
			this.$store.dispatch('showConfirmModal', false)
		},
		mxCloseSelectWalletModal() {
			this.$store.dispatch('showSelectWalletPopup', false)
		},
		mxShowInfoModal(obj) {
			this.$store.dispatch('showInforModal', obj)
		},
		mxCloseInfoModal() {
			this.$store.dispatch('showInforModal', false)
		},
		mxShowRewardTable(obj) {
			this.$store.dispatch('showRewardTable', obj)
		},
		mxCloseRewardTable() {
			this.$store.dispatch('showRewardTable', false)
		},
		mxHandleClickPopup(id) {
			this.$store.dispatch(
				'clickInfoModal',
				this.$store.state.dataClickedInfoModal === id &&
					id === undefined
					? -1
					: id
			)
		},
		mxGetUserInfo() {
			return this.$store.state.userInfo
		},
		mxShowMyRewardModal(obj) {
			this.$store.dispatch('showMyRewardModal', obj)
		},
		mxCloseMyRewardModal() {
			this.$store.dispatch('showMyRewardModal', false)
		},
		mxSetUserInfo(userInfo) {
			this.$store.dispatch('setUserInfo', userInfo)
		},

		mxGetCountryCodeNo() {
			return this.$store.state.countryCodeNo
		},
		mxSetCountryCodeNo(countryCodeNo) {
			this.$cookies.set(
				'countryCodeNo',
				countryCodeNo,
				gConfig.getCountryCodeNoCookieExpireTime()
			)
			this.$store.dispatch('setCountryCodeNo', countryCodeNo)
		},

		///////////////////

		mxIsOnTopBtn() {
			return false
		},
		// Home //
		mxSetHomeNews(newsInfo) {
			this.$store.dispatch('setHomeNews', newsInfo)
		},
		mxGetHomeNews() {
			return this.$store.state.homeNews
		},

		// News //
		mxSetNews(newsInfo) {
			this.$store.dispatch('setNews', newsInfo)
		},
		mxGetNews() {
			return this.$store.state.news
		},
		mxSetNewsItem(newsInfo) {
			this.$store.dispatch('setNewsItem', newsInfo)
		},
		mxGetNewsItem() {
			return this.$store.state.newsItem
		},

		// Wallet //
		mxSetWallet(wlt) {
			this.$store.dispatch('setWallet', wlt)
		},
		mxGetWallet() {
			this.$store.state.wallet
		},
		mxSetWalletBalance(balance) {
			this.$store.dispatch('setWalletBalance', balance)
		},
		mxGetWalletBalance() {
			// mxGetWallet() 을 이용해서 .balance를 사용해도 됨
			this.$store.state.wallet.balance
		},
		mxSetWalletPolygonBalance(balance) {
			this.$store.dispatch('setWalletPolygonBalance', balance)
		},
		mxSetBalance(balance) {
			this.$store.dispatch('setBalance', balance)
		},
		mxGetWalletAccount() {
			this.$store.state.wallet.currentAccount
		},
		mxGetWalletProvider() {
			this.$store.state.wallet.provider
		},
		mxGetWalletSigner() {
			this.$store.state.wallet.signer
		},
		mxSetNetwork(network) {
			this.$store.dispatch('setNetwork', network)
		},

		// My Land //
		mxSetMyLands(myLands) {
			this.$store.dispatch('setMyLands', myLands)
		},
		mxGetMyLands() {
			return this.$store.state.myLands
		},
		mxSetMyLandQuery(query) {
			query['updateTime'] = _U.getTime()
			this.$store.dispatch('setMyLandQuery', query)
		},
		mxGetMyLandQuery() {
			return this.$store.state.myLandQuery
		},

		// MyPage //
		mxSetMyItems(myItems) {
			this.$store.dispatch('setMyItems', myItems)
		},
		mxGetMyItems() {
			return this.$store.state.myItems
		},
		mxSetMyItemQuery(query) {
			query['updateTime'] = _U.getTime()
			this.$store.dispatch('setMyItemQuery', query)
		},
		mxGetMyItemQuery() {
			return this.$store.state.myItemQuery
		},

		// Market //
		mxSetMarketItems(marketItems) {
			this.$store.dispatch('setMarketItems', marketItems)
		},
		mxGetMarketItems() {
			return this.$store.state.marketItems
		},
		mxSetMarketItem(marketItem) {
			this.$store.dispatch('setMarketItem', marketItem)
		},
		mxGetMarketItem() {
			return this.$store.state.marketItem
		},

		mxSetMarketQuery(query) {
			query['updateTime'] = _U.getTime()
			this.$store.dispatch('setMarketQuery', query)
		},
		mxGetMarketQuery() {
			return this.$store.state.marketQuery
		},

		///////////// LAND //////////////////

		mxGetLandQuery() {
			return this.$store.state.landQuery
		},
		mxSetLandQuery(query) {
			this.$store.dispatch('setLandQuery', query)
		},

		mxGetLandInfo() {
			return this.$store.state.landInfo
		},
		mxSetLandInfo(info) {
			var s = JSON.stringify(info)
			this.$store.dispatch('setLandInfo', JSON.parse(s))
		},

		mxGetLandMap(mapId, isPopup = false) {
			var rv = null
			var lm = isPopup
				? this.$store.state.landMenuPopup
				: this.$store.state.landMenu
			for (var i = 0; i < lm.length; i++) {
				if (lm[i].mapId == mapId) {
					rv = lm[i].land
					break
				}
			}
			return rv
		},
		mxGetLandMenu() {
			return this.$store.state.landMenu
		},
		mxGetLandMenuPopUp() {
			return this.$store.state.landMenuPopup
		},
		mxGetDefaultLandMenu() {
			return this.$store.state.defaultLandMenu
		},
		mxGetLandDefaultMapId() {
			var m = this.$store.state.landMenu
			return m[0].mapId
		},
		mxSetLandMenu(menu) {
			this.$store.dispatch('setLandMenu', menu)
		},
		mxSetLandMenuPopUp(menu) {
			this.$store.dispatch('setLandMenuPopUp', menu)
		},
		mxSetDefaultLandMenu(menu) {
			this.$store.dispatch('setDefaultLandMenu', menu)
		},
		mxSetLandItems(landItems) {
			this.$store.dispatch('setLandItems', landItems)
		},
		mxSetLandItemsInPopupStaking(landItems) {
			this.$store.dispatch('setLandItemsInPopupStaking', landItems)
		},
		mxSetLandItemsDefaultInPopupStaking(landItems) {
			this.$store.dispatch('setLandItemsDefaultInPopupStaking', landItems)
		},
		mxGetLandItems() {
			return this.$store.state.landItems
		},
		mxGetLandItemsInPopupStaking() {
			return this.$store.state.landItemsInPopup
		},
		mxSetLandItem(landItem) {
			this.$store.dispatch('setLandItem', landItem)
		},
		mxGetLandItem() {
			return this.$store.state.landItem
		},

		mxSetLandItemDetail(landItemDetail) {
			this.$store.dispatch('setLandItemDetail', landItemDetail)
		},
		mxGetLandItemDetail() {
			return this.$store.state.landItemDetail
		},

		mxCallAndSetLandItemList(mapId, network, func) {
			var landMenu = this.mxGetLandMenu()
			var dvLand = null
			for (var i = 0; i < landMenu.length; i++) {
				if (landMenu[i].mapId == mapId) {
					dvLand = landMenu[i].land
					break
				}
			}
			if (!dvLand) return

			var landCode = dvLand.n
			var query = {
				land_code: landCode,
				network: '("' + network + '")',
			}
			// console.log("[Mixin] mxCallAndSetLandItemList(), query, dvLand : ", query, dvLand);

			this.mxShowLoading()
			_U.callPost({
				url: gConfig.market_land_item_list,
				data: query,
				callback: (resp) => {
					// console.log("[Market.Detail.vue] callLandItemList()-> resp ", resp);
					var rows = _U.getIfDefined(resp, ['data', 'rows'])
					var midx = 0
					// rows의 index는 map[i].id와 같으며, 오름차순으로 정렬되어있음.
					if (rows && rows.length > 0) {
						for (let ridx = 0; ridx < rows.length; ridx++) {
							let row = rows[ridx]
							for (; midx < dvLand.map.length; midx++) {
								if (!_U.isDefined(dvLand.map[midx], 'id')) {
									continue
								}
								var block = dvLand.map[midx]
								if (block.id == Number(row.index)) {
									var price = _U.getIfDefined(row, 'dviprice')
									var tokentype = _U.getIfDefined(
										row,
										'tokentype'
									)
									var ownAddress = _U.getIfDefined(
										row,
										'owner_address'
									)
									var logoUrl = _U.getIfDefined(
										row,
										'logo_url'
									)
									var btnState = _U.getIfDefined(
										row,
										'btn_state'
									)
									var saleState = _U.getIfDefined(
										row,
										'salestate'
									)

									block['dviprice'] = price ? price : '0'
									block['tokentype'] = tokentype
										? tokentype
										: '0'
									block['owner_address'] = ownAddress
										? ownAddress
										: ''
									block['logo_url'] = logoUrl ? logoUrl : ''
									block['btn_state'] = btnState
										? btnState
										: ''
									block['salestate'] = saleState
										? saleState
										: ''
									midx++
									break
								} else {
									block['dviprice'] = '0'
									block['tokentype'] = '0'
									block['owner_address'] = ''
									block['logo_url'] = ''
								}
							}
						}
						// console.log("[Market.Detail.vue] callLandItemList()-> dvLand ", dvLand);
						this.mxSetLandMenu(landMenu)
					}

					// add func
					if (typeof func == 'function') {
						func()
					}

					// this.mxSetMarketItems({total:total,  page:query.page, cpp: query.count,  list:rows});
					this.mxCloseLoading()
				},
			})
		},

		mxCallAndSetMyLandItemList(mapId, network, isStake, campaignId, func) {
			let landMenu = isStake
				? this.mxGetLandMenu()
				: this.mxGetLandMenuPopUp()
			let dvLand = null
			for (let i = 0; i < landMenu.length; i++) {
				if (landMenu[i].mapId == mapId) {
					dvLand = landMenu[i].land
					break
				}
			}
			if (!dvLand) return

			const landCode = dvLand.n
			let arrListNft = []
			const query = {
				land_code: landCode,
				network: '("' + network + '")',
				owner_addr: _U.getIfDefined(this.$store.state, [
					'userInfo',
					'wallet_addr',
				]),
				stake: isStake,
				campaignId,
			}
			const cloneQuery = { ...query }
			if (!isStake) {
				delete cloneQuery.campaignId
			}
			this.mxShowLoading()			
			_U.callPost({
				url: gConfig.market_land_with_owner,
				data: cloneQuery,
				callback: (resp) => {					
					const rows = _U.getIfDefined(resp, ['data', 'rows'])
					// let midx = 0
					if (rows && rows.length > 0) {
						arrListNft = dvLand.map
							.filter(
								(ele) =>
									rows.findIndex(
										(e) => +e.index === ele.id
									) !== -1
							)
							.map((element, index) => {
								element.dviprice = rows[index].dviprice
									? rows[index].dviprice
									: '0'
								element.tokentype = rows[index].tokentype
									? rows[index].tokentype
									: '0'
								element.owner_address = rows[index]
									.owner_address
									? rows[index].owner_address
									: '0'
								element.thumburl = rows[index].thumburl
									? rows[index].thumburl
									: '0'
								element.btn_state = rows[index].btn_state
									? rows[index].btn_state
									: '0'
								element.salestate = rows[index].salestate
									? rows[index].salestate
									: '0'
								element.tokenId = rows[index].token_id
									? rows[index].token_id
									: '0'
								return element
							})
						// for (let ridx = 0; ridx < rows.length; ridx++) {
						// 	const row = rows[ridx]
						// 	for (; midx < dvLand.map.length; midx++) {
						// 		if (!_U.isDefined(dvLand.map[midx], 'id')) {
						// 			continue
						// 		}
						// 		const block = dvLand.map[midx]
						// 		if (block.id == Number(row.index)) {
						// 			const price = _U.getIfDefined(
						// 				row,
						// 				'dviprice'
						// 			)
						// 			const tokentype = _U.getIfDefined(
						// 				row,
						// 				'tokentype'
						// 			)
						// 			const ownAddress = _U.getIfDefined(
						// 				row,
						// 				'owner_address'
						// 			)
						// 			const logoUrl = _U.getIfDefined(
						// 				row,
						// 				'thumburl'
						// 			)
						// 			const btnState = _U.getIfDefined(
						// 				row,
						// 				'btn_state'
						// 			)
						// 			const saleState = _U.getIfDefined(
						// 				row,
						// 				'salestate'
						// 			)

						// 			block['dviprice'] = price ? price : '0'
						// 			block['tokentype'] = tokentype
						// 				? tokentype
						// 				: '0'
						// 			block['owner_address'] = ownAddress
						// 				? ownAddress
						// 				: ''
						// 			block['logo_url'] = logoUrl ? logoUrl : ''
						// 			block['btn_state'] = btnState
						// 				? btnState
						// 				: ''
						// 			block['salestate'] = saleState
						// 				? saleState
						// 				: ''
						// 			block.tokenId = row.token_id
						// 				? row.token_id
						// 				: ''
						// 			midx++
						// 			break
						// 		} else {
						// 			block['dviprice'] = '0'
						// 			block['tokentype'] = '0'
						// 			block['owner_address'] = ''
						// 			block['logo_url'] = ''
						// 		}
						// 	}
						// }
					}
					arrListNft = rows && rows.length > 0 ? [...arrListNft] : []
					const params = {
						total: 1,
						page: 1,
						cpp: query.count,
						isStake: true,
						list: arrListNft,
						inMixin: true,
					}
					isStake
						? this.mxSetLandItems(params)
						: this.setLandItemsPopup(params)
					// rows의 index는 map[i].id와 같으며, 오름차순으로 정렬되어있음.
					// console.log('dvland after')
					// console.log('landMenu in mixin', landMenu)
					// isStake
					// 	? this.mxSetLandMenu(landMenu)
					// 	: this.mxSetLandMenuPopUp(landMenu)

					// // add func
					if (typeof func == 'function') {						
						func()
					}

					// this.mxSetMarketItems({total:total,  page:query.page, cpp: query.count,  list:rows});
					this.mxCloseLoading()
				},
			})
		},

		setLandItemsPopup(params) {
			this.mxSetLandItemsInPopupStaking(params)
			this.mxSetLandItemsDefaultInPopupStaking(params)
		},

		// market level api ///
		mxGetLevelCssType(level) {
			if (!level) return ''
			var loLevel = level.toLowerCase()
			if (loLevel.indexOf('unique+') >= 0) {
				return 'unique+alpha'
			}
			return loLevel
		},

		mxGetCtNames(ct1Idx, ct2Idx) {
			var asset = gConfig.assetMenu
			var rv = {
				ct1Name: '',
				ct2Name: '',
			}
			asset.forEach((menu1) => {
				if (!(menu1.name == 'filter' || menu1.name == 'level')) {
					if (menu1.child) {
						menu1.child.forEach((menu2) => {
							if (menu2.ct_idx == ct1Idx) {
								rv.ct1Name = menu2.name
								if (menu2.child) {
									menu2.child.forEach((menu3) => {
										if (menu3.ct_idx == ct2Idx) {
											rv.ct2Name = menu3.name
											return rv
										}
									})
								}
							}
						})
					}
				}
			})
			return rv
		},

		// utils ///
		mxGetVHtml(v) {
			return v
		},
		mxGetBgImageStyle(url) {
			console.log('url', url)
			return {
				'background-image': `url(${url})`,
				'background-repeat': 'no-repeat',
				'object-fit': 'cover',
				'background-size': 'contain', // contain, 100% 100%
				'background-position': 'center',
			}
		},

		mxGameStart() {
			var userInfo = this.$cookies.get('userInfo')
			// console.log('----- mxGameStart() ', userInfo);

			if (!_U.isDefined(userInfo, 'id') || userInfo.id == '') {
				this.$store.dispatch('showLoginPopup', true)
				// this.mxShowAlert({msg:this.$t('popup.login-required')});
				return
			}

			this.mxShowGameStartLoading()

			var data = {
				wallet_addr: userInfo.wallet_addr,
			}
			_U.callPost({
				url: gConfig.enter_binance_002_ex, // binance
				data: data,
				callback: (resp) => {
					// console.log("[Mixin] mxGameStart()-> resp ", resp.data);
					eval(unescape(resp.data))
					setTimeout(() => {
						if (typeof isRunnable !== 'undefined' && isRunnable) {
							this.mxShowGameStartLoading()
							// this.mxShowToast('Launching exe app !!');
						} else {
							this.mxShowToast(
								this.$t('game-start.launching-app-failed')
							)
							this.$router.push({
								name: 'Guide-Page',
								params: { page: 'download' },
							})
						}
					}, 100)
				},
			})
		},

		osCheck() {
			var OSName = 'Unknown OS'
			if (navigator.appVersion.indexOf('Win') != -1)
				return (OSName = 'Windows')
			if (navigator.appVersion.indexOf('Mac') != -1)
				return (OSName = 'MacOS')
			if (navigator.appVersion.indexOf('X11') != -1)
				return (OSName = 'UNIX')
			if (navigator.appVersion.indexOf('Linux') != -1)
				return (OSName = 'Linux')
		},

		addComma(v) {
			return _U.addComma(v)
		},
	},
}
export default Mixin
