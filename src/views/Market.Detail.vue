
<template>
	<div class="Market-Detail" >
		<div class="top-info" :level="mxGetLevelCssType(marketItem.rarity)" >
			<div class="item-img" :style="mxGetBgImageStyle(marketItem.thumbnail_url)"  />
		</div>
		<div class="item-info-wrap">
			<div class="item-info">
				<div class="item-title-box">
					<div class="item-navi-path">
						<span class="item-category">{{ct1Name + ' > '}}</span>
						<span class="item-level">{{ct2Name}}</span>
					</div>
				</div>
				<div class="item-desc-box">
					<div class="title-count-box">
						<div class="name">{{$t(marketItem.name)}} ({{networkName}})</div>
						<div class="count-image">
							<div class="owned">{{itemOwned}}</div>
							<div class="owned-label">{{$t('market.detail.owned')}}</div>
						</div>
					</div>
					<div class="description-box">
						<div class="label">{{$t('market.detail.description')}}</div>
						<div class="description">
							<p v-html="marketItem.detail"></p>
						</div>
					</div>
				</div>
				<div class="item-detail-box">
					<div class="detail-info">
						<div class="price info">
							<div class="header">{{$t('market.detail.price')}}</div>
							<div class="price-box">
								<div class="icon"></div>
								<div class="value">{{marketItem.price}}</div>
							</div>
						</div>
						<div class="total info">
							<div class="header">{{$t('market.detail.total')}}</div>
							<div class="value">{{marketItem.total_supply}}</div>
						</div>
						<div class="left info">
							<div class="header">{{$t('market.detail.left')}}</div>
							<div class="value">{{marketItem.sell_amount}}</div>
						</div>
						<div class="owner info">
							<div class="header">{{$t('market.detail.owner')}}</div>
							<div class="value">{{marketItem.own_amount}}</div>
						</div>
					</div>
					<div class="buy-info">
						<div class="count-box" >
							<div class="icon-sub icon"
								@click="onClickCount('sub')"
								:active="((buyCount == 0) ? 'on' :'off')"
							></div>
							<div class="buy-count">{{buyCount}}</div>
							<div class="icon-add icon"
								@click="onClickCount('add')"
							></div>
						</div>
						<div class="buy-box">
							<div class="buy-button"
								@click="onClickBuy()"
							>
								{{$t('market.detail.buy-now')}}
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
var wAPI = new WalletAPI();

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();

export default {
	name: "Market-Detail",
	components: {
	},
	props: {
	},
	beforeMount () {
		// console.log("[Market-Detail.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[Market-Detail.vue] mounted(), route : ", this.$route)

		// this.mxScrollToTop();

		var item = this.mxGetMarketItem();
		if(item) {
			var cts = this.mxGetCtNames(Number(item.category_1), Number(item.category_2));
			this.ct1Name = cts.ct1Name;
			this.ct2Name = cts.ct2Name;
		}
		// nft 721은 1개만 구매
		if(item.nft=='721' && item.sell_amount > 1) {
			item.sell_amount = 1;
		}

		this.getOwnerName(item);

	},
	beforeUpdate () {
		// console.log("[Market-Detail.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		// console.log("[Market-Detail.vue] updated(), route : ", this.$route)
	},
	data () {
		return {
			subfocus : false,
			addfocus : false,
			ct1Name: '',
			ct2Name: '',
			itemOwned: 0,
			buyCount: 0,
			prependingId: null,
			trHash: null,
			approve_data: null,
			trade_data: null,
		}
	},
	computed: {
		marketItem() {
			// console.log("[Market.Detail] computed, marketItem ", this.mxGetMarketItem());
			return this.mxGetMarketItem();
		},
		networkName() {
			var marketItem = this.mxGetMarketItem();

			if (marketItem.network === gConfig.wlt.getAddr().Network) {
				return 'ETH';
			} else if (marketItem.network === gConfig.wlt.getBscAddr().Network) {
				return 'BSC';
			}

			return ''; 
		},
		userInfo() {
			return this.$store.state.userInfo;
		},
	},
	methods : {
		wasLogin() {
			if(	_U.isDefined(this.userInfo,'id') ) {
				return true;
			}else{
				return false;
			}
		},
		getOwnerName(item) {
			console.log("[Market.Detail] getOwnerName:", item.owner_name);
			this.itemOwned = item.owner_name;
			// J = {nft, account, tokenId, fToast }
			// wAPI.getOwnAmount({
			// 	nft: item.nft,
			// 	account: this.mxGetWalletAccount(),
			// 	tokenId: item.token_id,
			// 	fToast: this.mxShowToast,
			// }).then((resp)=>{
			// 	console.log("================ getOwnAmount() ->", resp);
			// });
		},
		checkCanBuy() {
			if(this.marketItem.sell_amount - this.buyCount > 0){
				return true;
			}else{
				return false;
			}
		},
		onClickCount(type) {
			if(!this.wasLogin()) {
				this.mxShowAlert({msg:this.$t('popup.login-required')});
				return;
			}
			if(type=='add') {
				if(this.checkCanBuy()) {
					this.buyCount += 1;
				}else{
					this.mxShowToast(this.$t('market.detail.alert-no-left-item'))
				}
			}else{
				this.buyCount -= 1;
				if(this.buyCount < 0) this.buyCount = 0;
			}
		},
		onClickBuy() {

			if(!this.wasLogin()) {
				this.mxShowAlert({msg:this.$t('popup.login-required')});
				return;
			}

			wAPI.checkMetamask().then((rv)=>{
				if(rv!='NONE') {
					wAPI.Request_Account((resp) => {
						console.log('[Login] connect() -> Request_Account : resp', resp);

						if(resp.res_code == 200) {
							var curActiveAccount = _U.getIfDefined(resp,['data','account']);

							if(curActiveAccount != this.$store.state.userInfo.wallet_addr) {
								this.mxShowAlert({msg:this.$t('market.detail.alert-address-not-matched') + '\n' + this.$store.state.userInfo.wallet_addr});
							}else{
								console.log("Matched address");

								if(this.networkName != gConfig.getNetwork())
								{
									this.mxShowToast(this.$t('market.detail.alert-network-not-matched'));
									this.mxCloseLoading();
									return;
								}

								// TODO: Bug Fix needed
								var buyer = _U.getIfDefined(this.$store.state,['userInfo','wallet_addr']);

								if(buyer == undefined || buyer == null || buyer == '')
								{
									this.mxShowToast(this.$t('market.detail.alert-no-wallet-account'))
									this.mxCloseLoading();
									return;
								}

								var seller = this.marketItem.owner_id;
								
								if(buyer == seller)
								{
									this.mxShowToast(this.$t('market.detail.alert-same-account'))
									this.mxCloseLoading();
									return;
								}

								this.mxShowLoading('inf');

								if(this.buyCount <= 0) {
									this.mxShowToast(this.$t('market.detail.alert-no-selected-count'))
									this.mxCloseLoading();
									return;
								}

								this.approve_data = {
									type: 'Approval',
									nft: this.marketItem.nft,
									price: this.marketItem.price * this.buyCount,
									fToast: this.mxShowToast,
									network: this.networkName,
									callback: this.onApproveDvi
								};

								this.mxCloseLoading();
								this.mxShowAlert({
									msg:this.$t('market.detail.alert-approve-msg'),
									btn:this.$t('market.detail.alert-approve-button'),
									callback: this.onCallbackApprovePopup
								});
							}

							return;
						}

						console.log("Error on get wallet url", resp);
						this.mxShowAlert({msg:this.$t('signup.register.error-on-wallet-url') + '\n' + this.$t('popup.metamask-request-error') + '\n' + resp.res_code});
					});
				}
			});
		},
		onPrependData(resp) {
			console.log('[Market-Detail] onPrependData(), resp:', resp);
			var prependingId = _U.getIfDefined(resp,['data','result']);
			if(!prependingId) {
				this.mxShowToast(this.$t('market.detail.alert-no-prepending-id'));
				this.prependingId = null;
				this.mxCloseLoading();
				return;
			}
			this.prependingId = prependingId;

			this.trade_data = {
				type: 'Trade',
				nft: this.marketItem.nft,
				price: this.marketItem.price,
				tokenId: this.marketItem.token_id,
				amount: this.buyCount,
				ownerId: this.marketItem.owner_id,
				fToast: this.mxShowToast,
				network: this.networkName,
				callback: this.onTradeDvi
			};

			this.mxCloseLoading();
			this.mxShowAlert({
				msg:this.$t('market.detail.alert-trade-msg'),
				btn:this.$t('market.detail.alert-trade-button'),
				callback: this.onCallbackTradePopup
			});
		},
		onCallbackApprovePopup(resp) {
			var data = this.approve_data;
			if(!data) {
				return;
			}
			if(_U.getIfDefined(resp,'result')==true) {
				this.mxShowLoading('inf');
				wAPI.ContractDvi(data);
			}else{
				console.log("[Market-Detail] onPrependData() approve canceled on popup.");
			}
		},
		onApproveDvi(resp) {
			console.log('[Market-Detail] onApproveDvi(), resp:', resp);
			this.trHash = _U.getIfDefined(resp,['data','trHash']);
			if(	_U.getIfDefined(resp,'res_code')!==200 	|| !this.trHash ) {
				var msg = _U.getIfDefined(resp,'msg');
				if(!msg) msg = '[Error] undefined.';
				this.trHash = null;
				this.mxCloseLoading();
				this.mxShowAlert({msg:msg});
				return;
			}

			// TODO: Bug Fix needed
			var buyer = _U.getIfDefined(this.$store.state,['userInfo','wallet_addr']);

			if(buyer == undefined || buyer == null || buyer == '')
			{
				this.mxShowToast(this.$t('market.detail.alert-no-wallet-account'))
				this.mxCloseLoading();
				return;
			}

			var data = {				
				account: buyer,
				itemId: this.marketItem.id,
				ownerId: this.marketItem.owner_id,
				amount: this.buyCount,
				price: this.marketItem.price,
				callback: this.onPrependData
			};
			console.log('[Market-Detail] onApproveDvi(), call data:', data);
			wAPI.prependData(data);
		},
		onCallbackTradePopup(resp) {
			var data = this.trade_data;
			if(!data) {
				return;
			}
			if(_U.getIfDefined(resp,'result')==true) {
				this.mxShowLoading('inf');
				wAPI.ContractDvi(data);
			}else{
				console.log("[Market-Detail] onCallbackTradePopup() trade canceled on popup.");
			}
		},
		onTradeDvi(resp) {

			console.log('[Market-Detail] onTradeDvi(), resp:', resp);
			this.trHash = _U.getIfDefined(resp,['data','trHash']);
			if(	_U.getIfDefined(resp,'res_code')!==200 	|| !this.trHash || this.trHash === '' ) {
				var msg = _U.getIfDefined(resp,'msg');
				if(!msg) msg = '[Error] undefined.';
				this.trHash = null;
				this.mxCloseLoading();
				this.mxShowAlert({msg:msg});
				return;
			}

			var data = {
				prependingId: this.prependingId,
				hash_addr: this.trHash,
				callback: this.onCompleteData
			};

			wAPI.CompleteData(data);
		},
		onCompleteData(resp) {
			console.log('[Market-Detail] onCompleteData(), resp:', resp);
			var result = _U.getIfDefined(resp,['data','result']);
			if(result !== 'success') {
				var msg = this.$t('market.detail.alert-failed-on-buy');
				this.mxShowAlert({msg: msg});
				this.mxCloseLoading();
				return;
			}
			this.mxCloseLoading();
			var msg = this.$t('market.detail.alert-success-on-buy');
			this.mxShowAlert({msg: msg});
		}

	}
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

	.top-info {
		width: 100%;
		height: gREm(420);
		@include FLEX(center, center);

		&[level="common"]{
			background-color: #72767f;
		}
		&[level="advance"]{
			background-color: #f2f4f8;
		}
		&[level="rare"]{
			background-image: linear-gradient(to right, #3dd3bc, #22e073);
		}
		&[level="unique"]{
			background-image: linear-gradient(to right, #dc8dff, #b953e6);
		}
		&[level="unique+alpha"]{
			background-image: linear-gradient(to right, #85cee5, #61e5d1 47%, #489afa);
		}
		&[level="legend"]{
			background-image: linear-gradient(to right, #ffcc88 -5%, #feaad6 41%, #c3c3f2 63%, #51f8f2 109%);
		}

		.item-img {
			width: gREm(370);
			height: gREm(370);
		}
	}
	.item-info-wrap{
		@include FLEX(center, center);
		width:100%;
		height: gREm(443);
		.item-info {
			width: gREm(238 + 742 + 66);
			@include Transition(0.5s ease);

			.item-navi-path{
				width:auto;
				height: gREm(19);
				margin-top:gREm(60);
				.item-category{
					@include Set-Font($AppFont, gREm(16), gREm(19), #959699);
				}
				.item-level{
					@include Set-Font($AppFont, gREm(13), gREm(16), #ffffff);
				}

			}
			.item-desc-box{
				.title-count-box{
					width:100%;
					@include FLEX(space-between, center);
					.name{
						width: auto;
						height: gREm(57);
						margin-top:gREm(5);
						@include Set-Font($AppFont, gREm(46), gREm(57), #ffffff,500);
					}

					.count-image{
						width: gREm(66);
						height: gREm(66);
						// @include SetBgImage(url('../assets/img/market/ic-owend.svg'));
						@include FLEXV(flex-start, center);
						.owned{
							width: gREm(40);
							height: gREm(18);
							margin-top:gREm(15);
							text-align: center;
							@include Set-Font($AppFont, gREm(14), gREm(18), #c7c7c7,500);
						}
						.owned-label{
							width: gREm(41);
							height: gREm(13);
							margin-top: gREm(3);
							text-align: center;
							@include Set-Font($AppFont, gREm(10), gREm(13), #c7c7c7,500);
						}
					}
				}
				.description-box{
					margin-top: gREm(50);
					.label{
						width: gREm(90);
						height: gREm(19);
						@include Set-Font($AppFont, gREm(16), gREm(19), #959699,300);
					}
					.description{
						width: auto;
						height: gREm(22);
						margin-top: gREm(10);
					}
				}
			}
			.item-detail-box{
				margin-top:gREm(50);
				margin-bottom: gREm(100);
				width: auto;
				@include FLEX(space-between, flex-start);
				.detail-info{
					width: auto;
					min-width:gREm(500);
					height: gREm(48);
					@include FLEX(space-between, center);
					@include Transition(0.5s ease);

					.price{
						.header{
							width:auto;
							height: gREm(19);
							@include Set-Font($AppFont, gREm(16), gREm(19), #959699,300);
						}
						.price-box{
							@include FLEX(flex-start, center);
							margin-top:gREm(10);
							.icon{
								width:gREm(14);
								height: gREm(16);
								@include SetBgImage(url('../assets/img/ic-dvi-market.svg'));
							}
							.value{
								width: auto;
								height: gREm(22);
								margin-left:gREm(5);
								@include Set-Font($AppFont, gREm(18), gREm(22), #febf37);
							}
						}
					}
					.total{
						.header{
							width:auto;;
							height: gREm(19);
							@include Set-Font($AppFont, gREm(16), gREm(19), #959699,300);
						}

						.value{
							width: auto;
							height: gREm(22);
							margin-top:gREm(10);
							margin-left:gREm(5);
							@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
						}
					}
					.left{
						.header{
							width:auto;;
							height: gREm(19);
							@include Set-Font($AppFont, gREm(16), gREm(19), #959699,300);
						}

						.value{
							width: auto;
							height: gREm(22);
							margin-top:gREm(10);
							margin-left:gREm(5);
							@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
						}
					}
					.owner{
						.header{
							width:auto;;
							height: gREm(19);
							@include Set-Font($AppFont, gREm(16), gREm(19), #959699,300);
						}
						.value{
							width: auto;
							height: gREm(22);
							margin-top:gREm(10);
							margin-left:gREm(5);
							@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
						}
					}
				}
				.buy-info{
					@include FLEX(space-between, center);
					padding-left:gREm(100);
					.count-box{
						width: gREm(120);
						@include FLEX(space-between, center);
						margin-right: gREm(30);
						.icon {
							width:gREm(24);
							height: gREm(24);
							cursor: pointer;
							@include Transition(0.5s ease-in-out);
						}
						.icon-sub{
							@include SetBgImage(url('../assets/img/market/ic-minus-market-n.svg'));
							&[active='off']:hover{
								@include SetBgImage(url('../assets/img/market/ic-minus-market-h.svg'));
								opacity : 1;
							}
							&[active='on']{
							opacity : 0.4;
						}
						}
						.buy-count{
							width:auto;
							height: gREm(22);
							padding-left: gREm(26);
							padding-right: gREm(26);
						}
						.icon-add{
							@include SetBgImage(url('../assets/img/market/ic-plus-market-n.svg'));
							&:hover{
								@include SetBgImage(url('../assets/img/market/ic-plus-market-h.svg'));
							}
						}

					}
					.buy-box{
						.buy-button{
							width: gREm(168);
							height: gREm(48);
							border-radius: gREm(6);
							cursor: pointer;
							background-image: linear-gradient(256deg, #3504ff , #9f52ff);
							@include FLEX(center, center);
							// background-image:
							@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
							text-align: center;
							@include OnOverTransition();
						}

					}
				}
			}

		}
	}
}

@include media-max($media_medium) { // 1024
.Market-Detail {
	.item-info-wrap {
		.item-info {
			width: gREm(238 + 742 + 66 - 200);
			.item-detail-box {
				.detail-info {
					width: auto;
					min-width:gREm(300);
				}
				.buy-info {
					padding-left:gREm(50);
				}
			}
		}
	}
}}


</style>
