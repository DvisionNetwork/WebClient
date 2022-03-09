
export const INFURA_ID = '14ff3a7ed1484486aac3e5573bcae20d'
export const DEFAULT_ETH_JSONRPC_URL = `https://mainnet.infura.io/v3/${INFURA_ID}`

export function toFixedDecimal(val, decimals = 18) {
  val = String(val);
  const split = val.split('.');
  if (split.length > 1) {
    if (decimals) {
      return split[0] + '.' + split[1].substr(0, decimals);
    } else {
      return split[0];
    }
  } else {
    return val;
  }
}
export function formatChainId(chanId) {
  let network = ''
  switch (chanId) {
    case ETH_CHAIN_ID :
      network = '0x4' //testnet
      break
    case BSC_CHAIN_ID :
      network = '0x61' //testnet
      break
    case MATIC_CHAIN_ID :
      network = '0x13881' //testnet
      break
  }
  return network
}


export const BSC_STAKING_ADDRESS = '0x450505Ba81Bea37cbeD2D58FdF65868A1Dd720c5'
export const ETH_STAKING_ADDRESS = '0x58f22dE77E00fd3836dD6877fdAE8462CC5Ebefc'
export const MATIC_STAKING_ADDRESS = '0x205012ba1B41EDA6aE588864edBCBABC81DfD1cf'
export const BSC_RPC_ENDPOINT = 'https://data-seed-prebsc-1-s1.binance.org:8545/'
export const ETH_RPC_ENDPOINT = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
export const MATIC_RPC_ENDPOINT = 'https://rpc-mumbai.maticvigil.com/'
export const BSC_ADDRESS_721 = '0xD41eddEdB1891B626FADD17B328e14077c8248Cb'
export const BSC_ADDRESS_1155 = '0x3a0792d301a40eBcd9199431b00AD26603b7cdc4'
export const ETH_ADDRESS_721 = '0x13b03495467f7CfB7237cbC5784faDA36bf23848'
export const ETH_ADDRESS_1155 = '0x94d0D2FFE6d5Ab4eDd1d13Ca748cBC13210936dA'
export const MATIC_ADDRESS_721 = '0x9A42796215D1220381988DA2f1Ccc5456399b51d'
export const MATIC_ADDRESS_1155 = '0xc03c9c5385bEe279fE5b485985c7e92a1AfbaBEd'
export const BRIDGE_WALLETCONNECT = 'https://bridge.walletconnect.org'
export const BSC_CHAIN_ID = 97
export const ETH_CHAIN_ID = 4
export const MATIC_CHAIN_ID = 80001
export const FORTMATIC_API_KEY = 'pk_test_EE86F66A6FFF9D3B'
export const VALUE_LOGIN = '7cad118dfd6aade5cac88ab0656d82855fdc9028f4247e12430952d1b8085ed5';
export const METAMASK = 'METAMASK';
export const COINBASE = 'COINBASE';