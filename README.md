# dvw

## DVW dev
	- 설치시 명령어
	  npm install
	  npm install --save vue-cryptojs
	  npm install --save vue3-cookies 

### v.0.8.5
	- Add wallet integration : coinbase, wallet connect, fortmatic, bitski
	- Block : coinbase, bitski (for sequential update)

### v.0.8.4
	- Add bsc bridge for binance NFT market

### v.0.8.3
	- Fix the bug : function for buying lands in BSC

### v.0.8.2
	- Add polygon token (MATIC)
	- 2nd Land sale on polygon

### v.0.8.1
	- Add selling functions
	- Move item page via inventory
	- Ending dots for logn text in name

### v.0.8.04
	- Apply Land API
	- Apply Land Inventory

### v.0.8.03
	- Add paging for market
	- Add "selling" function for owned item
	- Add link to Curvegrid bridge

### v.0.8.02
	- Login network check bug fixed
	- Check empty id of userInfo for world start
	- News type(=3) added
	- CSS Style (Register Mobile Page)
	- Update map data (remove monster area image)

### v.0.8.01
	- Add register page for B2B world (temp) --> Social Login, Guest Login Should be added
	- Change image for game start screen.
	- Add 'metamask sign' process : to be updated more
	- DWorld Open
	- Separate "BSC" market tab
	- (Temp) Set max 10 pages (to be updated)
	- Add "forgot ID, PWD"

### v.0.7.06
	- Product View modified (price, remaining, owned)
	- Move "For Sale" to toggle button.
	- Open Dvision World for BSC Anniversary

### v.0.7.13
	- Market Land 2차 - land_list , land_item API 추가

### v.0.7.12
	- Market Land 1차 완료 land-map, land-list.

### v.0.7.11
	- Market Land, list 작업중.
	- Dvision Source (0.7.06) 적용 
	- v.0.7.06
		. Product View modified (price, remaining, owned)
		. Move "For Sale" to toggle button.

	- v.0.7.05
		. metamask account check logic added (change event should be fixed to add)
		. set wallet address from cookie.
		. store and load network name. (ETH, BSC)

	- v.0.7.04	
		. check network item registered.
		. Add metamask install page.
		. Remove wallet list APIs

	- v.0.7.03
		. add bsc network to signup/login
		. Add bsc event popupt (to dvision.events)
		. Add hash address


### v.0.7.10 
	- Market Land vue Canvas :: Monster 추가

### v.0.7.09
	- Market Land vue Canvas bug fixed

### v.0.7.08
	- Market Land vue Canvas revised

### v.0.7.07
	- Market Land vue Canvas 1차

### v.0.7.06
	- Market Land vue Canvas 기능 작업

### v.0.7.05
	- Market Land vue 추가, 작업중

### v.0.7.04
	- Market Land 추가, 작업중

### v.0.7.03
	- Apply Dvision Source to JNJT.
	- Market.vue, paging 초기화

### v.0.7.02
	- change order >> [approve] > [prepend] > [trade] > [complete]
	- add wallet address login

### v.0.7.01
	- change signin/signup (no phone/email verification, just metamask connection, no phone information)

### v.0.6.04
	- remove OBT Reward DVI
	- add "for sale" filter
	- reset all side menu for "All Asset"
	- Get owner name in market detail page

### v.0.6.03
	- add BSC contract env(testnet, mainnet)
	- apply html tag for market item detail
	- close server download / app launch
	- event 보상 DVI 마이페이지 추가
	- wallet API error message 정리
	- referral code 입력 (회원가입 UI 추가, 회원가입 API 추가)
	- SMS 인증 -> EMail 인증 변경 (해외 전송 Issue)
	- Bug Fix (Scroll, Wallet account)

### v.0.6.02 
	- env.dev/production 추가 
	- Mobile UI 적용

### v.0.6.01 
	- download app 수정
	- login remember id 수정

### v.0.6.0 : merge with yd.cha v.0.5.5
	= v.0.5.5
		- mypage: edit profile-changepassword popup UI 조정
		- market-place : no found for this search 추가
	= v.0.5.4 
		- market-place : count box width 변경, sub 아이콘 opacity값 추가 
		- guide : arrow 위치 변경 진행중 
		- login : password hover 추가 
		- app : #content 추가  

### v.0.5.5 
	- Scroll 변경
	- 각 페이지 View Height 적용

### v.0.5.4 : merge with yd.cha v.0.5.3
	- MyPage EditProfile : changePwd height 수정
	- login : 삭제 아이콘 hover , focus 수정
	- guide : arrow transition 추가 
	- market-place : buy button margin-bottom 추가

### v.0.5.2
	- MyPage Inventory 수정

### v.0.5.1
	- Signup ID/비번 찾기, user 정보 수정 완료

### v.0.5.0
	- merge with ydcha ::
	- sign up idphone,idemail,pwdphone,resetpwd : btn width,폰트 사이즈 변경 
	- sign up resister : country code - select box UI 작업 
	- sign up IdResult 페이지 추가 
	- signup register : country code width 변경, h-bar width 변경, input focus값 추가
	- signup , mypage : password icon 특수문자 추가

### v.0.4.04
	- Market SideMenu 수정

### v.0.4.03
	- gConfig 위치 옮김.

### v.0.4.02
	- news paging, news detail 수정

### v.0.4.01
	- code merge with ydcha
		. news : detail UI 작업 
		. mypage : edit profile icon popup 위치 조정
		. signup : id, password icon popup 추가 
		. market-place : Filter 체크박스 값 false 로 적용 ==> JC 다시 적용 예정 
		. news : detail 진행중 
		. mypage : edit profile icon popup 추가 
		. home : game start margin-left 수정, 클릭 이벤트 (signed on,off) 삽입 
		. signup : 폰트 size, line height 수정
		. guide : 폰트 size, line height 수정
		. login popup UI 수정
		. market-place : Newest 위치변경, sidemenu menu2 위치 조정 
		. news : title width 수정
		. foot : 로고 클릭시 home 이동, right-box content hover 적용
		. mypage : gamestart 테마값 적용 


### v.0.3.08
	- Update Changes from DVision v.0.3.07-01
		. SignupInput.vue : mobile reg 11 -> 12,  label fonts, field fonts, placeholder color
		. locale en.js: Sing up -> Sign up
		. App.vue : setDownloadUrl() 호출 위치 변경

### v.0.3.07
	- Update Changes from DVision
		. Prodect.vue : functional 비교 문자열 비교로 수정 functional == 'true' 추가
		. Mixin.js : mxGameStart -> this.userInfo ==> userInfo : 버그 수정
		. Market.vue : 검색 추가, Filter / Level 수정
		. App.Config.js : isProd, use_domain,  wlt, getAddr() 수정
		. Public : index.html favicon.png , png 로 수정
	- Update SigninInput.vue component : 마우스 오버 등 수정...

### v.0.3.06
	-  GNB  Start Now 버튼 초록색

### v.0.3.05
	-  Login Forgot Pwd 막음, ethereum on change event 넣음, login type password

### v.0.3.04 
	-  UI/Lang 수정

### v.0.3.03 : merge with ydcha
	-  UI 수정

### v.0.3.02 
	- MyProfile Wallet Edit 추가. WalletAPI 수정
	- GUIDE Download

### v.0.3.05 : 
	- news : detail UI 작업 
	- mypage : edit profile icon popup 위치 조정 

### v.0.3.04 : 
	- signup : id, password icon popup 추가 
	- market-place : Filter 체크박스 값 false 로 적용 
	- news : detail 진행중 
	- mypage : edit profile icon popup 추가 


### v.0.3.03 : 
	- home : game start margin-left 수정, 클릭 이벤트 (signed on,off) 삽입 
	- signup : 폰트 size, line height 수정
	- guide : 폰트 size, line height 수정
	- login popup UI 수정
	- market-place : Newest 위치변경, sidemenu menu2 위치 조정 
	- news : title width 수정
	- foot : 로고 클릭시 home 이동, right-box content hover 적용
	- mypage : gamestart 테마값 적용 

### v.0.3.02 : 
	- home : dvision start 팝업 background 이미지 적용 
	- signup :  버튼 border 삭제 , 팝업 background 이미지 적용 , 폰트 size/weight 수정 
	- login popup UI 수정
	- market-detail : subicon opacity값 적용 
	- news : 데이터 출력 4개로 적용 , 페이지 ui 수정
	- foot : right-box content hover 적용 (blue만)

### v.0.3.01 : merge with ydcha
	- merge with yd
	- v.0.2.05 
	  . News 페이지 수정
	  . 기타

	- v.0.2.04 
	  . My Page Inventory, Game Start ...

	- v.0.2.03 
	  . 마켓 구매 완료

	- v.0.2.03 
	  . Mixin, Store, Home News API 적용, GNB UI 수정 및 Language, Login 적용

	- v.0.2.02 
	  . login 추가
	  . wallet 가져오기 store 기능 추가

### v.0.2.07
	- Loading Icon setTimeout, My Page Inventory pageing

### v.0.2.06
	- 마켓 구매 및 마켓 검색 추가

### v.0.2.05
	- 회원 정보 수정, 로딩아이콘 수정 ...

### v.0.2.04 
	- My Page Inventory, Game Start ...

### v.0.2.03 
	- 마켓 구매 완료

### v.0.2.03 
	- Mixin, Store, Home News API 적용, GNB UI 수정 및 Language, Login 적용

### v.0.2.02 
	- login 추가
	- wallet 가져오기 store 기능 추가

### v.0.2.01 : merge with ydcha
	- v.0.1.05
	  Sign up ID찾기, PWD 찾기 페이지 추가
	  GNB 버튼 수정
	  News 마진값 수정
	  Profile wallet-edit 버튼 수정 

	- v.0.1.04
	  Mypage 추가 

	- v.0.1.03-01 
	  준비


### v.0.1.04
	- Mobile : Start Now 제거, 상단 메뉴 제거
	- Login API 정리
	- npm install --save vue-cryptojs
	- 쿠키 설정: 브라우저 클로즈 후 10분 유지
	// https://www.npmjs.com/package/vue3-cookies
	- npm install --save vue3-cookies 

### v.0.1.03 
	- Add My Page Template

### v.0.1.02 머지 with ydcha 0.0.23
    - v.0.0.23 
	  Home : top btn 추가
	  foot : logo, right-box title 추가, 아이콘 색상변경, 테마별 색상 변경 적용 
	  News : UI 추가 
	  Studio : UI 추가
	  Market Place : market-detail item background color 별 추가
	  Guide : wallet 7페이지 누락된 이미지 추가  

### v.0.1.01 API 작업 시작: Signup API
	- Signup API
	- npm install --save axios

### v.0.0.23 머지 후 다시 시작

### v.0.0.22 머지 with 윤도
	- v.0.0.21 : Guide 추가
	- v.0.0.20 : Market Detail 추가
	- v.0.0.19 : Market 추가

### v.0.0.21
	- Signup 수정, wallet 작업중

### v.0.0.20
	- Home image 정리 : mixin.scss SetBgImage에 background-position center 추가

### v.0.0.19
	- Signup UI 추가

### v.0.0.18
	- Home image 추가

### v.0.0.17
	- Guide Wallet 센터 정렬, Loign Popup 버튼 animation 추가

### v.0.0.16
	- ydCha : Home Animation 적용, Login Popup 적용

### v.0.0.15
	- Market page, Guide page, News page 1차 적용

### v.0.0.14
	- GitLab version has CRLF, 
	--> remove CR, only LF by copy old dvw version(on linux server) into dvworld(gitlab exprorted)

### v.0.0.14
	- Update Market SideMenu .. 

### v.0.0.13
	- Update Foot for Mobile 

### v.0.0.12 
	- Home size 1200, 1024, 768 

### v.0.0.11 
	- size 1200, 1024, 768 

### v.0.0.10 
	- windowTop 제거
	- smooth scroll bar
		// https://vuejsexamples.com/smooth-scrollbar-for-vue-js-projects/
		npm install --save vue-smooth-scrollbar

	- smooth scroll -> 설치했다가 제거함. scroll to 에 사용되는듯.
		// npm install --save vue3-smooth-scroll
		// https://github.com/laineus/vue3-smooth-scroll
		// npm install --save @morioh/v-smooth-scrollbar 인스톨 했다가 제거함.

### v.0.0.9 
	// gallery 작업중, blueimp-gallery 아님
	// -- npm uninstall blueimp-gallery -> 제거했음, 안씀.
	npm install --save velocity-animate

	// object Intersection
	1. windowTop 이용하여 직접 계산
		App.vue
		onScroll(e) {
			this.windowTop = e.target.scrollTop /* window.top.scrollY */
			// console.log('[App.vuew] onScroll = ', this.windowTop);
		},
		Target.vue
		isDisplayed() {
			var o = this.$refs['cardBox'];
			console.log("===== ", this.windowTop, o);
			if(!o) return 'off';

			// var oTop = o.offsetTop;
			// var oBottom = o.offsetTop + o.offsetHeight;
			var oMiddle = o.offsetTop + o.offsetHeight/2;

			var screenH = window.innerHeight;
			// var osTop = oTop - this.windowTop;
			// var osBottom = oBottom - this.windowTop;
			var osMiddle = oMiddle - this.windowTop;
			// if(osBottom > 0 && osTop < screenH) {
			if(0 < osMiddle && osMiddle < screenH) {
				return 'on'
			}else{
				return 'off'
			}

		},
	2. IntersectionObserver 를 이용하여 사용

### v.0.0.8
	- 디자인 입히기
	- GNB 수정 : media option
	// slide gallery 추가
	- npm install --save blueimp-gallery 

### v.0.0.7
    - route lang 적용.
    - build dist Error : index.html
        __INTLIFY_PROD_DEVTOOLS__=false;
    - vue.config.js : dist 용 publicPaht 쓰면 안됨: router가 동작 못함
        // publicPath: './',

### v.0.0.6 
	- https://uxgjs.tistory.com/150 // Prettier 가 적용되었음. .prettierrc.js

	- i18n : language code
	// https://vue-i18n.intlify.dev/installation.html#es-modules-import
	- vue add i18n 
		Installing vue-cli-plugin-i18n...
		+ vue-cli-plugin-i18n@2.1.1
		added 29 packages from 15 contributors in 23.981s
		82 packages are looking for funding
		run `npm fund` for details
		✔  Successfully installed plugin: vue-cli-plugin-i18n
		? The locale of project localization. en
		? The fallback locale of project localization. en
		? The directory where store localization messages of project. It's stored under `src` directory. locales
		? Enable legacy API (compatible vue-i18n@v8.x) mode ? No
		Invoking generator for vue-cli-plugin-i18n...
	// 위 vue add i18n 하고 나서 안되서 vuejs 3용 으로 다시 설치, 설치를 먼저하고 vue add i18n을 해야 하는건지 모르겠지만...
	-- npm install vue-i18n@next --save


### v.0.0.5 : market place 1차
	- paging : https://pewww.tistory.com/5
	- image galery : https://github.com/akash-mitra/vue-image-browser/blob/master/src/vue-image-browser.vue
		https://vuejsexamples.com/an-image-browser-component-built-with-vuejs/

### v.0.0.4
	- login layout 맞추기

	// vue-js modal 사용하지 않음.
	// - npm install vue-js-modal --save // https://idlecomputer.tistory.com/162

	// Modal 
	- https://goddino.tistory.com/93
	- https://vuejs.org/v2/examples/modal.html
	- https://codesandbox.io/s/github/vuejs/vuejs.org/tree/master/src/v2/examples/vue-20-modal-component?from-embed=&file=/index.html
	

### v.0.0.3
	- lodash :: upperFirst, camelCase 문자 변환 
		npm install --save lodash   

	- setting.json : F1>Preferences:Open Settings (JSON)
	   ==> remove View 3 warning : The template root requires exactly one element.eslint-plugin-vue
	{
		"files.eol": "\n",
		"editor.detectIndentation": false,
		"vetur.validation.template": false,
		// "vetur.validation.script": false,
		// "vetur.validation.style": false,
		"workbench.colorCustomizations": {

			"tab.activeBackground": "#4b244dcc",
		}
	}

	- npm install --save sass-loader@10   
	- npm install node-sass --save

	- npm install vue3-touch-events
	  : https://www.npmjs.com/package/vue3-touch-events

	// - npm install --save @vue/composition-api
	- npm uninstall @vue/composition-api ==> 사용하지 않음.

	// https://github.com/antoniandre/vueper-slides/blob/master/src/components/vueperslides/
	// https://antoniandre.github.io/vueper-slides/?ref=madewithvuejs.com
	- npm i --save vueperslides@next //  슬라이드


### v 0.0.2

 - main.js : . 에 대해서 line 분리하니  에러가 남.
	createApp(App)
	.use(store)
	.use(router)
	.mount("#app");

	/home/jnjt/vuejs/dvision/dvw/src/main.js
	6:15  warning  Replace `⏎.use(store)⏎.use(router)⏎` with `.use(store).use(router)`  prettier/prettier
   
	--> vue.config.js 에 아래 추가함.
	chainWebpack: config => {
		config.module.rules.delete('eslint'); /// 
	},


### version 0.0.1 
- Create vue Project DVW
	Vue CLI v4.5.13
	? Please pick a preset: Manually select features --> Manual
	? Check the features needed for your project: Choose Vue version, Babel, Router, Vuex, Linter
	? Choose a version of Vue.js that you want to start the project with 3.x
	? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
	? Pick a linter / formatter config: Prettier
	? Pick additional lint features: Lint on save
	? Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
	? Save this as a preset for future projects? (y/N) N

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
