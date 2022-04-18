

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


		getLandSquare(idx) {
			var rv = '';
			switch(idx) {
				case '1x1' : rv = '324'; break;
				case '2x1' : rv = '756'; break;
				case '2x2' : rv = '1,764'; break;
				case '3x3' : rv = '4,356'; break;
			}
			return rv;
		},
		FORTMATIC_API_KEY_DEV : 'pk_test_67B7005189579543',
		FORTMATIC_API_KEY_PRODUCT : 'pk_live_27F4314B088C569C',
		BITSKI_CLIENT_ID_DEV : 'fa55e01d-4bad-4335-9069-315b2b9e5d17',
		BITSKI_CLIENT_ID_PRODUCT : 'fd70095e-9d43-4c01-92a9-2795bcc3942f',
		// gConfig.wlt.getAddr();
		wlt : {
			/* -----------------  Ethereum Network ----------------- */
			addrDev: {
				TokenAddress :             "0x9403F1E9b6AE54423924B571c65Eb1F8cb316080",
				Contract721Address :       "0x2a70B138c694E35E40f34c6404039F39AB39b119",
				Contract1155Address :      "0x91E9d6Ea945eaDE3f6E2239532E09eC62AfdE25B",
				ContractMarketAddress :    "0x50DF1a0Fd28337C06EB5E547825ED58d1ae04f53",
				// Mainnet: "0x1", Testnet: "0x4"
				Network : "0x4"
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
			addrEthDev: {
				Network : "0x4"
			},
			/* -----------------  Binance Smart Chain Network ----------------- */
			addrBscDev: {
				// token contract for dev
				TokenAddress :             "0x0C9eA0E7cD659e3d45c4d70E8825011Eb31fCc45",
				Contract721Address :       "0x448321d613E3A10Cde7435D285C199A995E2B242",
				Contract1155Address :      "0xCaD43aB53f628D931b8345C60BdF84D256D57752",
				ContractMarketAddress :    "0x435874C2D07965e0671e3bd0515c5D224FdDAff2",
				// Mainnet: "0x38", Testnet: "0x61"
				Network : "0x61"
			},
			addrBscProd: {
				// token contract for rel
				TokenAddress :             "0x758fb037a375f17c7e195cc634d77da4f554255b",
				Contract721Address :       "0xF36721581B3dB68408A7189840C79Ad47C719c71",
				Contract1155Address :      "0xD7191DDdF64D2Cf94Fe32e52ad3f9C6104926fb1",
				ContractMarketAddress :    "0x9cf04141E14C784302e111ECdB7B873FAf26A5F9",
				// Mainnet: "0x38", Testnet: "0x61"
				Network : "0x38"
			},

			/* -----------------  Polygon Network ----------------- */
			addrPolygonDev: {
				// token contract for dev
				TokenAddress :             "0xE966b6F7a7A4f2A02dd3455d4F391C68f2EAbF2B",
				Contract721Address :       "0xA8a9fF7e1597f00988ab643A95c07cc9D80fD979",
				Contract1155Address :      "0x0B162A4907127711342418b6a0e0bffD3Ef6532A",
				ContractMarketAddress :    "0xbd68B0A248028A4aAE60390DEB1AcD16684EB941",
				// Mainnet: "0x89", Testnet: "0x13881"
				Network : "0x13881"
			},
			addrPolygonProd: {
				// token contract for rel
				TokenAddress :             "0x0767777Fdc9F15a4B8c5762F988dcE4D8199A204",
				Contract721Address :       "0xBEDF7769720481f03a5B4927A1D51c738cf20FDf",
				Contract1155Address :      "0xdd2308914a006f32d4294A609eC1418080f1A26d",
				ContractMarketAddress :    "0x5737366c02f1E60B089a56215384F733Fb02CE61",
				// Mainnet: "0x89", Testnet: "0x13881"
				Network : "0x89"
			},

			/* -----------------  3rd Land Sale [BSC] ----------------- */
			addr3rdLandBscDev: {
				// token contract for dev
				TokenAddress :             "0xFDF82e690058eAFCc2EEbED66Eb2d3327aE93f38",
				Contract721Address :       "0x77a6891EC937f6442B1Cd30A99C4F386eaf5FFCe",
				Contract1155Address :      "0x0528943BD50427Db3953d7d715015325fBB616fE",
				ContractMarketAddress :    "0xC47F78100c3cefAdd8a71EfD440d22299B6538FF",
				Network : "0x61"
			},
			addr3rdLandBscProd: {
				// token contract for rel
				TokenAddress :             "0x758fb037a375f17c7e195cc634d77da4f554255b",
				Contract721Address :       "0x252af5B14184A877adFB77D4490be6A9e1E7068D",
				Contract1155Address :      "0xF64E100ecDb3b446ECCb26aBdB6017712fff09dA",
				ContractMarketAddress :    "0xeeF91f31F00Af45F9EEc2300483BB7Aa23111E36",
				Network : "0x38"
			},

			/* -----------------  3rd Land Sale [POL] ----------------- */
			addr3rdLandPolDev: {
				// token contract for dev
				TokenAddress :             "0xdC49590852E37419f49C02C5898C5411c5924675",
				Contract721Address :       "0x25749eB22DE42cb4B90Da71Bd132e7c353D78053",
				Contract1155Address :      "0x335C7D1D5c52605c8b67aD3258Dba6A3A94e941F",
				ContractMarketAddress :    "0xBd4188aAb3D900654E0e915B2Bcf177263BD0E2d",
				Network : "0x13881"
			},
			addr3rdLandPolProd: {
				// token contract for rel
				TokenAddress :             "0x0767777Fdc9F15a4B8c5762F988dcE4D8199A204",
				Contract721Address :       "0x252af5B14184A877adFB77D4490be6A9e1E7068D",
				Contract1155Address :      "",
				ContractMarketAddress :    "0x0528943BD50427Db3953d7d715015325fBB616fE",
				Network : "0x89"
			},

			addrBid: {
				Network : "opensea"
			},
			getAddr () {
				if(gConfig.isProd) {
					return gConfig.wlt.addrProd;
				}
				return gConfig.wlt.addrDev;
			},
			getEthAddr () {
				if(gConfig.isProd) {
					return gConfig.wlt.addrProd;
				}
				return gConfig.wlt.addrEthDev;
			},
			getBscAddr () {
				if(gConfig.isProd) {
					return gConfig.wlt.addrBscProd;
				}
				return gConfig.wlt.addrBscDev;
			},
			getPolygonAddr () {
				if(gConfig.isProd) {
					return gConfig.wlt.addrPolygonProd;
				}
				return gConfig.wlt.addrPolygonDev;
			},
			get3rdLandBscAddr () {
				if(gConfig.isProd) {
					return gConfig.wlt.addr3rdLandBscProd;
				}
				return gConfig.wlt.addr3rdLandBscDev;
			},
			get3rdLandPolAddr () {
				if(gConfig.isProd) {
					return gConfig.wlt.addr3rdLandPolProd;
				}
				return gConfig.wlt.addr3rdLandPolDev;
			},
			getBidAddr () {
				return gConfig.wlt.addrBid;
			},
			getNetworkAddr (network) {
				if(network == 'ETH') {
					return gConfig.wlt.getAddr();
				}else if(network == 'BSC') {
					return gConfig.wlt.getBscAddr();
				}else if(network == 'POL') {
					return gConfig.wlt.getPolygonAddr();
				}else if(network == 'BSC3') {
					return gConfig.wlt.get3rdLandBscAddr();
				}else if(network == 'POL3') {
					return gConfig.wlt.get3rdLandPolAddr();
				}else {
					return '';
				}
			}
		},

		canvas: {
			cvTypes: ['main','drawing'],
			imgScaleRate : 1.0, // 80% of canvas size.

			defaultColor : "rgba(233,0,0,1)",
			defaultLineWidth : 0,
			defaultFontSize : 10,

			blockSize: 12, // 1x1 -> 10px x 10px
			blockSizeMin: 8, // 1x1 -> 10px x 10px
			blockSizeMax: 24, // 1x1 -> 10px x 10px
			// center : x = w/2, y = h/2
			// lineColor: "#ff0000",
			defaultBlockColor: "rgba(0,0,0,0)",

			// background colors
			bg : {
				lineColor: '#0d0b0e',
				fillColor: '#24242b',
				lineWidth: 1
			},
			// bgLineColor: '#181721',
			// bgLineColor: '#FFFFFF',

			// bgFillColor_0: "#0d0b0e",
			// bgFillColor_1: "#100e14",
			// // bgFillColor_0: "#0dffff",
			// bgFillColor_1: "#ffff14",
			// bgFillColor_0: "#0000ff",
			// bgFillColor_1: "#00ff00",

			imgList: {
				'gangnam': {
					'centerLogoImg' : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='34' height='32' viewBox='0 0 34 32'%3E%3Cimage id='ic-blog' width='34' height='32' xlink:href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABgCAYAAADvhgd/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRGNjMwRjA4QzFCNzExRUI5NzkyQjZFNjUzOERDMzA3IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRGNjMwRjA3QzFCNzExRUI5NzkyQjZFNjUzOERDMzA3IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEFGOTA2MTRBOUJCMTFFQkI1OEREODgyNjcwQUVCMDAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEFGOTA2MTVBOUJCMTFFQkI1OEREODgyNjcwQUVCMDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6YMRLAAAAJ1UlEQVR42uxdaYwU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'/%3E%3C/svg%3E"
				},
				'newyork': {
					'centerLogoImg' : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='23' height='20' viewBox='0 0 23 20'%3E%3Cpath fill='%238483a7' d='M9.025 15.181l-.38 5.584a1.312 1.312 0 0 0 1.063-.537l2.552-2.545 5.288 4.041c.97.564 1.653.267 1.915-.931l3.47-16.972c.308-1.5-.518-2.081-1.463-1.714l-20.4 8.151C-.325 10.821-.3 11.631.831 12l5.216 1.693L18.164 5.78c.57-.394 1.089-.176.662.218z' transform='translate(0 -2)'/%3E%3C/svg%3E"
				},
				'tokyo': {
					'centerLogoImg' : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='23' height='20' viewBox='0 0 23 20'%3E%3Cpath fill='%238483a7' d='M9.025 15.181l-.38 5.584a1.312 1.312 0 0 0 1.063-.537l2.552-2.545 5.288 4.041c.97.564 1.653.267 1.915-.931l3.47-16.972c.308-1.5-.518-2.081-1.463-1.714l-20.4 8.151C-.325 10.821-.3 11.631.831 12l5.216 1.693L18.164 5.78c.57-.394 1.089-.176.662.218z' transform='translate(0 -2)'/%3E%3C/svg%3E"
				},
				'london': {
					'centerLogoImg' : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='23' height='20' viewBox='0 0 23 20'%3E%3Cpath fill='%238483a7' d='M9.025 15.181l-.38 5.584a1.312 1.312 0 0 0 1.063-.537l2.552-2.545 5.288 4.041c.97.564 1.653.267 1.915-.931l3.47-16.972c.308-1.5-.518-2.081-1.463-1.714l-20.4 8.151C-.325 10.821-.3 11.631.831 12l5.216 1.693L18.164 5.78c.57-.394 1.089-.176.662.218z' transform='translate(0 -2)'/%3E%3C/svg%3E"
				},
				'monster' : {
					"m_0" : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='20' viewBox='0 0 25 20'%3E%3Cg%3E%3Cpath fill='%238483a7' d='M25 50.368a10.817 10.817 0 0 1-2.953.8 5.033 5.033 0 0 0 2.253-2.793 10.34 10.34 0 0 1-3.25 1.222A5.174 5.174 0 0 0 17.308 48a5.1 5.1 0 0 0-5 6.2 14.583 14.583 0 0 1-10.567-5.28 5 5 0 0 0 1.575 6.745A5.122 5.122 0 0 1 1 55.043v.057a5.09 5.09 0 0 0 4.106 4.958 5.191 5.191 0 0 1-1.344.166 4.6 4.6 0 0 1-.97-.086 5.164 5.164 0 0 0 4.789 3.515A10.4 10.4 0 0 1 1.227 65.8 9.751 9.751 0 0 1 0 65.735 14.593 14.593 0 0 0 7.862 68 14.369 14.369 0 0 0 22.45 53.64c0-.223-.008-.438-.019-.652A10.139 10.139 0 0 0 25 50.368z' transform='translate(0 -48) translate(0 0)'/%3E%3C/g%3E%3C/svg%3E",
					"m_1" : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='28' height='26' viewBox='0 0 28 26'%3E%3Cdefs%3E%3Cpattern id='pattern' preserveAspectRatio='none' width='100%25' height='100%25' viewBox='0 0 102 96'%3E%3Cimage width='102' height='96' xlink:href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABgCAYAAADvhgd/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRGNjMwRjA0QzFCNzExRUI5NzkyQjZFNjUzOERDMzA3IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRGNjMwRjAzQzFCNzExRUI5NzkyQjZFNjUzOERDMzA3IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEQ5REVCMDhBOUJCMTFFQkI1RDU4RDc5QjU2M0VGMEYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEQ5REVCMDlBOUJCMTFFQkI1RDU4RDc5QjU2M0VGMEYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz77NnRKAAAIUUlEQVR42uxdaWwVVRS+nUIptGABC1RQlhbFBbUK4o7iEsSoQdE/GiNE1ETjEjUgweACiolRNJKAGiSuGBJINKAYURQRQQQVBVkECgi0uLBU1pZ6Tt83cBln3rvz3pvpvOn5ki+0fcvcme/ec75zZ+4lr6GhQQmiB0sugQgjEGFEGIEII8IIRBiBCCPCCEQYEUYgwghEGBFGIMKIMAIRRoQRRAYtJoyfEaTorYhlxHbEYmJ7YiExj3iAuJP4L3EX8U/87YjIQsJk+ftaE7sR+xDPIXYl9iZ2gEhtcEx+0KCeuJd4mFhDrCJuIf5EXEncTjwUkWtUjPZzm/eBOSFMd2I/4kBif2IPiFHg83tYiH+Ia4mLiQuJP0CksHECzulKYjnE4U60g7iM+Dlxc1SFqSBeRRyGkyjJ8PtYyM7gZcThxG+JHxMXEH8PSZQLiCOJ1xFPQujVweF3KfFd4mx0pkgIw+FqCAS5BCEqCJQSbyIOgkAzIVJNQMcrwDk9RqxM8r4ijCSODucSX0mz05Qh1K9Gvj2K/EGDhvlN6APR8PuJZxJbhtCDW2F0Xo68xcJsDeA4dxGfRY40FbI/wvYKmBhTsCEaTXwEn19ErEtnxBSi4fek6E1BgkPlCHSIycQPs2gQhhKfJJ6Shvu8nVhLfBxhzgQ3IlxyLusF0zPDbx3TDj3puSYURccA4kTiKJxYpjgd59c9g9KAO8y9PtzrCK3thRCp0I8wHYmTEL7aR8jqc1J+gjgeoSCTPPsURmGm4ZZD04UG770cnUvHpaCRMKUQZXhE6zDueQ8Qn8eoTgc3E2/NolkZC3OQDNe6GKYC5O+UwvBIeZp4Rw4Uypz3xkEoP+BzfMjFDmeC65GvknWmAR6vscNtm0wYHpYP4oRzBQ/DKfoBW/6LA2jL3UlqugoUrG44wzYfVhKHwieZn0PCWIjxg30YmqCiwUAUyG44m9jF47XOcGiuwpTD7XRUuQdu8xjUOqlwvh7TA8BQj45dkeJz5V7CPIpqNlfBPfU+g/ddg5AdFAZ7iNA7xef6slO0XNzCnSr3MTJJgrXd0+CA21Dmkr+4TumR4nMcyoosF+tZFANhOqPY85rZ6IeeGTSudrShxKAg5pqs0HIUOENUfHCDSswSe9nSFiG0odKR6DsZ5G4eaZ1sYdjHD8sxF5YKJxJv8ygFwppW6u7IKScncWR6mO1iC3NqzEaLnjPLHH/jaaXTQjp+G8exOhgWs61tYS5SiXsscQNbzytckmtpiG04zzFaTVBiIXwNUvFEgYswZ6nEbeKw0MsxWk3Q1ULMq1TxRV91/BxaNxXuY1s8OttqrswEjTmmp0HRk8uowCjRL5QKWRg7z7U1/EyjKysPuAJuapQ6irouIR+/WLPIps9GNIayPir+sHtsSxSfYcJSx56LKPIzYiqbgTD2LeN8H+EkW8hTx56vMx0xBZbDNcQVnfAvP34b9nZT+ZoLNH0AskEfZnGGPaPRFHuA6dc4z8+HBBEEC3O4GZxnvd8em0UcSecaszAbmoEw1U0oDHcK+yHAg6aGgYVZ0QyE2az13tqQj92gCWK6fOMQC7O6GQhjL+Owl1E0VSgzFaaahdnoY4jlIvgp+k3a7zUhH59H6F/azybYZueYdTEWZj3xV5d8ExZ4CeM2n8LstDC0l8dYmJWOEPKHCnedZ40miOkCpx0WXMMXMRXlkMu5/RKyAdAXNJmun9lqF5jfqcTC1DiGsa8df9ugHKu3AsaP2s8HDD+zyxaGF6POjaEwn6n/L6zlcPJbSMfnELrGcexU00L8+n5L+2WWViHHxY3NdPn7QUcvDhJV6PQ2thjYdTYL2/W5soUxGzW8iPZ7j9cWqXCmopxL4atx4ZMmftuV2dhPfE2FsLlACOCTm5rk4i9zWOigMN8RhXarxKYTqUbMPsslJk+PgTBvqsQ6/GRh7pOA27ANpko5kv+mFJ/bqOcYHS+FGIODAIfkKYbG4ECA7ZjnUbivMai76iwP3/2CNo2QS+AwMAFFZCosd7HS2QKbqdkeZirVRg2Nr3vdKOMvnZxjLu0IOtQ8w/fvIb4TUFu+wsj1GhFezqwadZanMGwpXyW+kUPCvAzz4gecZxYH0JZpSar8dSh83bAKFjvprWUOZeMC7FXZxOsqsYGC35zB5zhJZXfubC4ijhf2J7HxvF9ObSphGDwBx3udvBVRQWyLPxpWNB3M8ihE0y1qx6vUc3GfupQlHKW+tH+xDHsVr4V/UQWw/VOGdpQ3XhibYbt4Y51nslDX8IWdaBgaOf8scSl6F/kRRqEo4g1wxkTESvNJjcKF2J2F71uF89uU5ufrkVem+hjp07S2H0A+PxqK/WyLVYcpBp4A5GVyvFFAYciC8Mj4QCU2G5qb5dzA58UPTfCKbT8bB3Eb3keO8zNrzYUkPzLbHkX9FN0F+12HyP58AVwFD8dbVGLtZpuABdmDEMG54CMV3LT92+jNvKS+0jCSTIeBqPJ5rL0o5ueoxHMXx93eT3eB6FY4Ib4JxYueeNjxhmolWbxIDRCABQlr60W+sfYeLC0vSeflj/xAutvWi0vw3ky2XqxWHre6M125ux7koo6XaPN2T7xSuCeGaDqblf6NC8OCfKMSE45hb1a6FKGNN3bjLRZ7IezUwamy3Y30ZqU2qkCO+7wylxeE8p4pvHrLub1vvpYwayFGDRIv36/4WUVje18On/NRxRejk9Uj1OXM9r6621gLzlHHb4jNPa6jOrZIyhakFhehBnE2ahti1yl/e11mBXnyn2BHE/K0vwgjEGFEGIEII8IIRBiBCCPCCEQYEUYgwghEGBFGIMKIMAIRRoQRRAf/CTAANra0JXOthhYAAAAASUVORK5CYII='/%3E%3C/pattern%3E%3C/defs%3E%3Crect id='ic-medium' width='28' height='26' fill='url(%23pattern)'/%3E%3C/svg%3E"
				}
			},

			// // 0: Public Building 1: Building for sale, 2: Road, 3: Station, 4: forbidden
			drawSequence: ["2","3","0","1","5","6","4","-1","selected"],
			// drawSequence: ["1"],
			landBlock: {
				"-1": { // centerBlock
					fillColor: "rgba(99,35,181,1.0)",
					lineColor: '#9a4fff',
					lineWidth: 3
				},
				"0": { // public 판매불가
					fillColor: "rgba(60,213,136,0.3)",
					lineColor: "#0d0b0e",
					lineWidth: 1,
				},
				"1": { // for sale 경매
					fillColor: "rgba(255,217,113,0.3)",
					lineColor: "#0d0b0e",
					lineWidth: 1,
				},
				"2": { // road 도로
					fillColor: "rgba(114,118,127,1.0)",
					lineColor: "#72767f",
					lineWidth: 0,
				},
				"3": { // station
					// fillColor: "rgba(146,183,203,0.3)",
					fillColor: "rgba(159,29,247,1.0)",
					lineColor: "rgba(0,0,0,0)",
					lineWidth: 0,
				},
				//// 요기까지
				"4": {
					fillColor: "rgba(0,0,0,0)", // Forbidden
					lineColor: "rgba(0,0,0,0)",
					lineWidth: 0,
				},
				"5": { // Water
					fillColor: "rgba(175,245,247,1.0)",
					lineColor: "rgba(0,0,0,0)",
					lineWidth: 0,
				},
				"6": { // Landmark
					fillColor: "rgba(255,187,250,0.3)",
					lineColor: "rgba(0,0,0,0)",
					lineWidth: 0,
				},
				"7": {
					fillColor: "#92b7cb", // sidewalk 절반보도
				}
			},
			landBlockOnSale: {
				"-1": { // centerBlock
					fillColor: "rgba(99,35,181,1.0)",
					lineColor: '#9a4fff',
					lineWidth: 3
				},
				"0": { // public 판매불가
					fillColor: "rgba(60,213,136,1.0)",
					lineColor: "#0d0b0e",
					lineWidth: 1,
				},
				"1": { // for sale 경매
					fillColor: "rgba(255,217,113,1.0)",
					lineColor: "#0d0b0e",
					lineWidth: 1,
				},
				"2": { // road 도로
					fillColor: "rgba(114,118,127,1.0)",
					lineColor: "#72767f",
					lineWidth: 0,
				},
				"3": { // station
					// fillColor: "rgba(146,183,203,0.3)",
					fillColor: "rgba(159,29,247,1.0)",
					lineColor: "rgba(0,0,0,0)",
					lineWidth: 0,
				},
				//// 요기까지
				"4": {
					fillColor: "rgba(0,0,0,0)", // Forbidden
					lineColor: "rgba(0,0,0,0)",
					lineWidth: 0,
				},
				"5": {
					fillColor: "rgba(175,245,247,1.0)",
					lineColor: "rgba(0,0,0,0)",
					lineWidth: 0,
				},
				"6": { // Landmark
					fillColor: "rgba(255,187,250,1.0)",
					lineColor: "rgba(0,0,0,0)",
					lineWidth: 0,
				},
				"7": {
					fillColor: "#92b7cb", // sidewalk 절반보도
				}
			},
			monsterBlock: {
				fillColor: "rgba(255,0,0,0.5)",
				lineColor: "rgba(0,0,0,0)",
				lineWidth: 0,
			},

			myBlock: {
				fillColor: '#2792f6',
				lineColor: '#ffffff',
				lineWidth: 3
			},

			selectedBlock: {
				fillColor: "rgba(253,63,239,0.4)",
				lineColor: "#f63ecc",
				lineWidth: 2
			}
		},


		// market dvision side menu
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
							{	name: 'art',
								type: 'choice group-01',
								ct_idx:7,
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
					}
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
		market_item_sell: getApiUrl("market_item_sell"),
		market_item_list_with_owner: getApiUrl("market_item_list_with_owner"),
		market_item_list_search_name: getApiUrl("market_item_list_search_name"),

		enter_lobby_ex: getApiUrl("enter_lobby_ex"),
		enter_binance_002_ex: getApiUrl("enter_binance_002_ex"),
		get_download_url: getApiUrl("get_download_exe_ex"),
		geojs_url: 'https://get.geojs.io/v1/ip/country.json', // -> gDVWorldAppDownloadUrl

		market_land_item_list : getApiUrl("lgl0000_ex"),
		market_land_item : getApiUrl("lgl0001_ex"),
		market_land_buy_item : getApiUrl("lgl0002_ex"),
		market_land_with_owner : getApiUrl("lgl0003_ex"),
		market_land_sell : getApiUrl("lgl0004_ex"),

		test_url: "https://www.multiverse.so/m/api/terms_list_ex",
		public_api_sotatek: "https://division-api.sotatek.works",
		public_api_sotatek_2: "https://www.multiverse.so/m/api"

	}
}

var gConfig = AppConfig();

