import WalletLink from "walletlink"
import WalletConnectProvider from '@walletconnect/web3-provider'
import {
  BSC_RPC_ENDPOINT,
  ETH_RPC_ENDPOINT,
  MATIC_RPC_ENDPOINT,
  FORTMATIC_API_KEY,
  BRIDGE_WALLETCONNECT,
  BITSKI_CLIENT_ID,
  FORTMATIC,
  WALLETCONNECT,
  BITSKI
} from './Common'
import Fortmatic from 'fortmatic'
import { Bitski } from 'bitski'
import Web3 from 'web3'

export const walletLink = new WalletLink({
  appName: 'Division Network',
  appLogoUrl: 'https://dvision.app/img/NV-logo.ae27f28f.svg',
  darkMode: false,
  supportedChainIds: [1, 4, 56, 97, 80001]
})
export const coinbaseProvider = walletLink.makeWeb3Provider()
export const fortmaticProvider = new Fortmatic(FORTMATIC_API_KEY)

const bridge = BRIDGE_WALLETCONNECT
export const walletConnectProvider = new WalletConnectProvider({
  rpc: {
    1: 'https://mainnet.mycustomnode.com',
    3: 'https://ropsten.mycustomnode.com',
    97: BSC_RPC_ENDPOINT,
    4: ETH_RPC_ENDPOINT,
    80001: MATIC_RPC_ENDPOINT
  },
})
export const bitski = new Bitski(BITSKI_CLIENT_ID, `${window.location.origin}/callback.html`)


export function getContractConnect(loginBy, abi, address_ct, network, chainId) {
  let web3
  const networkOptions = {
    rpcUrl: network,
    chainId: chainId
  }
  switch (loginBy) {
    case FORTMATIC:
      const fm = new Fortmatic(FORTMATIC_API_KEY, networkOptions)
      web3 = new Web3(fm.getProvider())
      break;
    case WALLETCONNECT:
      walletConnectProvider.enable()
      web3 = new Web3(walletConnectProvider)
      break;
    case BITSKI:
      const bitskiProvider = bitski.getProvider({ network: networkOptions });
      web3 = new Web3(bitskiProvider)
      break;
    default: //Metamask | coinbase 
      web3 = new Web3(Web3.givenProvider)
      break;
  }
  const contractConn = new web3.eth.Contract(abi, address_ct)
  return contractConn
}