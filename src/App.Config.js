

// https://www.multiverse.so/m/api/cert_sms_ex

var _api_domain = 'https://www.multiverse.so/m/api'
function getApiUrl(name) {
	return _api_domain+'/'+name;
}

export default function AppConfig() {
	return {

		isProd: process.env.VUE_APP_BUILD_MODE == 'DEV' ? false : true, // true, // 개발에서 false, 운영에서 true
		use_domain: process.env.VUE_APP_BUILD_MODE == 'DEV' ? "false" : "true", // "true", // 개발에서 "false", 운영에서 "true"
		network: '',

		defaultCountryCode: '82',

		xhr_key: "0",
		xhr_value: "7cad118dfd6aade5cac88ab0656d82855fdc9028f4247e12430952d1b8085ed5",
		xhr_options: {
			headers: { "Content-Type": "application/x-www-form-urlencoded"}
		},
		homeNews_count_per_page : 6, // 한페이지에서의 item 수
		news_count_per_page : 4, // 한페이지에서의 item 수
		marketItem_count_per_page : 12,

		marketItem_pages_in_group : 10, // 10 페이지
		news_pages_in_group : 10, // 10 페이지

		myItem_count_per_page: 12,
		myItem_pages_in_group : 10, // 10 페이지

		maxLoadingTimeLimit: 10*1000,

		getREm(px) {
			var browserFontSize = 16; // global_mixin.scss 참고
			return px / browserFontSize;
		},

		getPostKeyData() {
			return {
					key: gConfig.xhr_key,
					value: gConfig.xhr_value,
					usedomain: gConfig.use_domain
			};
		},
		getPostData(J) {
			var data = gConfig.getPostKeyData();
			for(var key in J) {
				data[key] = J[key];
			}
			return data;
		},
		getNetwork() {
			return gConfig.network;
		},
		setNetwork(network) {
			gConfig.network = network;
		},
		getUserInfoCookieExpireTime() {
			return 60 * 60 * 24 * 30; // 1month // 60*10; // 10 min : UserInfo 저장 시간, Page reload 등으로 발생하는 logout 막기 위함
		},
		getCountryCodeNoCookieExpireTime() {
			return 12 * 60 * 60 * 24 * 30; // 12month
		},
		// gConfig.wlt.getAddr();
		wlt : {
			addrDev: {
				TokenAddress :             "0x000f62331d4bBA5622E854dEB882cd635fF7E031",
				Contract721Address :       "0x250fd9192CCbBCF458b6402ec8512c1b8F3fB0bd",
				Contract1155Address :      "0x4640F5F179A536b470fF554B874af96398257e74",
				ContractMarketAddress :    "0x48e39178b72A0cb5e215A32aEA0F8465E9E8E844",
				// Mainnet: "0x1", Testnet: "0x3"
				Network : "0x3"
			},
			addrProd: {
				// token contract for rel
				TokenAddress :             "0x10633216e7e8281e33c86f02bf8e565a635d9770",
				Contract721Address :       "0xB6584FefBbc3071C608Aa9f55B9A3FE0DE405DB5",
				Contract1155Address :      "0xC12F68adF0A5EA2F7B5585E3583656817a00Fb43",
				ContractMarketAddress :    "0xfCc1D2B47b2BF7Ad768c4Cb42d5259914Fc98349",
				// Mainnet: "0x1", Testnet: "0x3"
				Network : "0x1"
			},
			addrBscDev: {
				// token contract for dev
				TokenAddress :             "0x0C9eA0E7cD659e3d45c4d70E8825011Eb31fCc45",
				Contract721Address :       "0x29075B7CBc8d16552fF55ce5010573ff3dd0c506",
				Contract1155Address :      "0x6a6917c409f5e0cabC72EA1E45C23C8C66f19863",
				ContractMarketAddress :    "0x7C9D3bEA537Aa576103Bd9B1dAAa2baAf8642adF",
				// Mainnet: "0x38", Testnet: "0x61"
				Network : "0x61"
			},
			addrBscProd: {
				// token contract for rel
				TokenAddress :             "0x758fb037a375f17c7e195cc634d77da4f554255b",
				Contract721Address :       "0xCC3898A8da424426A2c0d6fa1ec6c6Cdd66Be113",
				Contract1155Address :      "0xF97ae57C1c4d8fbb5B8E13f5C324B8fbA425BF19",
				ContractMarketAddress :    "0x58D81494ff2D0c0FeB6090b4cd8B7AB65791B216",
				// Mainnet: "0x38", Testnet: "0x61"
				Network : "0x38"
			},
			getAddr () {
				if(gConfig.isProd) {
					return gConfig.wlt.addrProd;
				}
				return gConfig.wlt.addrDev;
			},
			getBscAddr () {
				if(gConfig.isProd) {
					return gConfig.wlt.addrBscProd;
				}
				return gConfig.wlt.addrBscDev;
			}
		},

		assetMenu: [
			{	name: 'all-assets',
				type: 'fold async',
				ct_idx: 0,
				active: true,
				all: 'on', // initial all select
				child: [
					{	name: 'avatar',
						type: 'fold sync',
						ct_idx: 2,
						child: [
							{	name: 'type',
								type: 'choice group-01',
								ct_idx:1,
							},
							{	name: 'skin',
								type: 'choice group-01',
								ct_idx:2,
							},
							{	name: 'eyebrows',
								type: 'choice group-01',
								ct_idx:3,
							},
							{	name: 'eye',
								type: 'choice group-01',
								ct_idx:4,
							},
							{	name: 'nose',
								type: 'choice group-01',
								ct_idx:5,
							},
							{	name: 'mouth',
								type: 'choice group-01',
								ct_idx:6,
							},
						]
					},
					{	name: 'clothes',
						type: 'fold sync',
						ct_idx: 4,
						child: [
							{	name: 'hair',
								type: 'choice group-01',
								ct_idx:1,
							},
							{	name: 'top',
								type: 'choice group-01',
								ct_idx:2,
							},
							{	name: 'bottom',
								type: 'choice group-01',
								ct_idx:3,
							},
							{	name: 'feet',
								type: 'choice group-01',
								ct_idx:4,
							},
							{	name: 'costume',
								type: 'choice group-01',
								ct_idx:5,
							},
						]
					},
					{	name: 'accessories',
						type: 'fold sync',
						ct_idx: 5,
						child: [
							{	name: 'head',
								type: 'choice group-01',
								ct_idx:1,
							},
							{	name: 'face',
								type: 'choice group-01',
								ct_idx:2,
							},
							{	name: 'neck',
								type: 'choice group-01',
								ct_idx:3,
							},
							{	name: 'hand',
								type: 'choice group-01',
								ct_idx:4,
							},
							{	name: 'back',
								type: 'choice group-01',
								ct_idx:5,
							},
							{	name: 'jewelry',
								type: 'choice group-01',
								ct_idx:6,
							},
						]
					},
					{	name: 'space',
						type: 'fold sync',
						ct_idx: 6,
						child: [
							{	name: 'architecture',
								type: 'choice group-01',
								ct_idx:1,
							},
							{	name: 'material',
								type: 'choice group-01',
								ct_idx:2,
							},
							{	name: 'interial',
								type: 'choice group-01',
								ct_idx:3,
							},
							{	name: 'outdoor',
								type: 'choice group-01',
								ct_idx:4,
							},
							{	name: 'ride',
								type: 'choice group-01',
								ct_idx:5,
							},
							{	name: 'background',
								type: 'choice group-01',
								ct_idx:6,
							},
						]
					},
				]
			},
			{	name: 'filter',
				type: 'fold',
				active: false,
				child: [
					{	name: 'functional',
						type: 'check-box',
						active: false,
					},
				]
			},
			{	name: 'level',
				type: 'fold',
				active: false,
				child: [
					{	name: 'common',
						type: 'check-box',
						active: true,
					},
					{	name: 'advance',
						type: 'check-box',
						active: true,
					},
					{	name: 'rare',
						type: 'check-box',
						active: true,
					},
					{	name: 'unique',
						type: 'check-box',
						active: true,
					},
					{	name: 'unique+α',
						type: 'check-box',
						active: true,
					},
					{	name: 'legend',
						type: 'check-box',
						active: true,
					},
				]
			}
		],

		login_url: getApiUrl("login_ex"),

		member_wallet_create: getApiUrl("member_wallet_create"),
		member_wallet_list: getApiUrl("member_wallet_list"),

		email_url: getApiUrl("cert_mail_ex"),
		market_url: getApiUrl("market_item_list"),
		join_url: getApiUrl("join_ex"),
		check_cert: getApiUrl("check_cert_ex"),
		check_account: getApiUrl("check_account_ex"), // ID 중복 체크
		account_find: getApiUrl("account_find_ex"), // ID 찾기
		reset_password: getApiUrl("password_tmp_ex"), // 임시 PWD 문자 발송
		change_password: getApiUrl("password_reset_ex"), // 비번 변경
		event_dvi_url: getApiUrl("dvi_reward_search"),

		member_update: getApiUrl("member_update_ex"),

		terms_list: getApiUrl("terms_list_ex"), // 이용약관 받기

		news_get_list: getApiUrl("post_get_list_ex"),
		news_get_item: getApiUrl("post_get_by_id_ex"),

		market_item_list: getApiUrl("market_item_list"),
		market_prepending_create: getApiUrl("market_prepending_create"),
		market_item_trade: getApiUrl("market_item_trade"),
		market_item_list_with_owner: getApiUrl("market_item_list_with_owner"),
		market_item_list_search_name: getApiUrl("market_item_list_search_name"),

		enter_lobby_ex: getApiUrl("enter_lobby_ex"),
		enter_binance_002_ex: getApiUrl("enter_binance_002_ex"),
		get_download_url: getApiUrl("get_download_exe_ex"),
		geojs_url: 'https://get.geojs.io/v1/ip/country.json', // -> gDVWorldAppDownloadUrl

		test_url: "https://www.multiverse.so/m/api/terms_list_ex",

	}
}

var gConfig = AppConfig();

