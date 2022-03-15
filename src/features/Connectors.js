import WalletLink from "walletlink"
import WalletConnectProvider from '@walletconnect/web3-provider'
import { BSC_RPC_ENDPOINT, ETH_RPC_ENDPOINT, MATIC_RPC_ENDPOINT, FORTMATIC_API_KEY, BRIDGE_WALLETCONNECT } from './Common'
import Fortmatic from 'fortmatic'
import QRCodeModal from '@walletconnect/qrcode-modal'
import WalletConnect from '@walletconnect/client'

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
  bridge,
  qrcodeModal: QRCodeModal,
  rpc: {
    1: 'https://mainnet.mycustomnode.com',
    3: 'https://ropsten.mycustomnode.com',
    97: BSC_RPC_ENDPOINT,
    4: ETH_RPC_ENDPOINT,
    80001: MATIC_RPC_ENDPOINT
  },
})
export const walletConnectConnector = new WalletConnect({
  bridge,
  qrcodeModal: QRCodeModal,
})