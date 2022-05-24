import { createApp } from "vue";
import App from "./App.vue";
import Utils from "./features/Utils";
import router from "./router";
import store from "./store";
import Mixin from '@/features/Mixin.js'
import VueCookies from 'vue3-cookies';

// language file
import i18n from './i18n.js'
import Wallet from "./features/blockchain/Wallet";
import { gConfig } from "./App.Config";

globalThis._U = new Utils;

var walletInfo = new Wallet(gConfig.wlt);
store.dispatch('setNFTWallet', walletInfo);

let app = createApp(App);

app.mixin(Mixin).use(i18n).use(store).use(router).use(VueCookies).mount("#app");
