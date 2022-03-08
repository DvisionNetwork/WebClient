import WalletLink from "walletlink"
import WalletConnectProvider from '@walletconnect/web3-provider'
import { BSC_RPC_ENDPOINT, ETH_RPC_ENDPOINT, MATIC_RPC_ENDPOINT } from './Common'

export const walletLink = new WalletLink({
  appName: 'Division Network',
  appLogoUrl: 'https://dvision.app/img/NV-logo.ae27f28f.svg',
  darkMode: false
})

export const walletConnectProvider = new WalletConnectProvider({
  rpc: {
    1: 'https://mainnet.mycustomnode.com',
    3: 'https://ropsten.mycustomnode.com',
    97: BSC_RPC_ENDPOINT,
    4: ETH_RPC_ENDPOINT,
    80001: MATIC_RPC_ENDPOINT
  },
})