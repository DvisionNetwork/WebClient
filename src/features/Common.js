import { MSG_METAMASK_3 } from './Messages'
export const INFURA_ID = '14ff3a7ed1484486aac3e5573bcae20d'
export const DEFAULT_ETH_JSONRPC_URL = `https://mainnet.infura.io/v3/${INFURA_ID}`

export function toFixedDecimal(val, decimals = 18) {
	val = String(val)
	const split = val.split('.')
	if (split.length > 1) {
		if (decimals) {
			return split[0] + '.' + split[1].substr(0, decimals)
		} else {
			return split[0]
		}
	} else {
		return val
	}
}
export function checkErrorMessage(error) {
	const errCodes = [4001, -32603, -32602, 3001, DENIED_TRANSACTION]
	if (errCodes.includes(error.code) || errCodes.includes(error.message)) {
		return error.message
	}
}
export function checkProviderWallet(name) {
	if (!window.ethereum?.providers) {
		return
	}
	let provider = ''
	switch (name) {
		case METAMASK:
			provider = window.ethereum.providers.find(
				({ isMetaMask }) => isMetaMask
			)
			break
		case COINBASE:
			provider = window.ethereum.providers.find(
				({ isCoinbaseWallet }) => isCoinbaseWallet
			)
			break
	}

	if (provider) {
		window.ethereum.setSelectedProvider(provider)
		return provider
	}
}
export function formatChainId(chainId) {
	let network = chainId.toString()
	switch (chainId) {
		case ETH_CHAIN_ID:
		case ETH_CHAIN_ID.toString():
			network = '0x4' //testnet
			break
		case BSC_CHAIN_ID:
		case BSC_CHAIN_ID.toString():
			network = '0x61' //testnet
			break
		case MATIC_CHAIN_ID:
		case MATIC_CHAIN_ID.toString():
			network = '0x13881' //testnet
			break
	}
	return network
}
export function fromHexToChainId(network) {
	let chainId = network
	switch (network) {
		case '0x4':
			chainId = 4 //testnet
			break
		case '0x61':
			chainId = 97 //testnet
			break
		case '0x13881':
			chainId = 80001 //testnet
			break
	}
	return Number(chainId)
}

export function renderNetworkName(chainId) {
	console.log('chainId', chainId)
	let network = ''
	if (chainId) {
		switch (chainId.toString()) {
			case '0x4':
			case '4':
			case '0x3':
			case '3':
				network = 'ETH'
				break
			case '0x61':
			case '97':
				network = 'BSC'
				break
			case '0x13881':
			case '80001':
				network = 'POL'
				break
		}
	}
	return network
}

export const BSC_STAKING_ADDRESS = '0xCdb37c98691afDbF27D0cea390e5cBD0D1F9CB69'
export const ETH_STAKING_ADDRESS = '0x58f22dE77E00fd3836dD6877fdAE8462CC5Ebefc'
export const MATIC_STAKING_ADDRESS =
	'0x1B20cA105A99CBb3A5FC112BebDD56fCE5d08A78'
export const BSC_RPC_ENDPOINT =
	'https://data-seed-prebsc-1-s1.binance.org:8545/'
export const ETH_RPC_ENDPOINT =
	'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
export const MATIC_RPC_ENDPOINT = 'https://rpc-mumbai.maticvigil.com/'

export const BSC_RPC_ENDPOINT_PROD =
	'https://bsc-dataseed.binance.org/'
export const ETH_RPC_ENDPOINT_PROD =
	'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
export const MATIC_RPC_ENDPOINT_PROD = 'https://polygon-rpc.com/'

export const BSC_ADDRESS_721 = '0xD41eddEdB1891B626FADD17B328e14077c8248Cb'
export const BSC_ADDRESS_1155 = '0x3a0792d301a40eBcd9199431b00AD26603b7cdc4'
export const ETH_ADDRESS_721 = '0x13b03495467f7CfB7237cbC5784faDA36bf23848'
export const ETH_ADDRESS_1155 = '0x94d0D2FFE6d5Ab4eDd1d13Ca748cBC13210936dA'
export const MATIC_ADDRESS_721 = '0x9A42796215D1220381988DA2f1Ccc5456399b51d'
export const MATIC_ADDRESS_1155 = '0xc03c9c5385bEe279fE5b485985c7e92a1AfbaBEd'
export const BSC_PROXY_ADDRESS = '0xA412481A32c6cAE838Cc70A0E5F091a663E8f938'
export const BRIDGE_WALLETCONNECT = 'https://bridge.walletconnect.org'
export const BSC_CHAIN_ID = 97
export const ETH_CHAIN_ID = 4
export const MATIC_CHAIN_ID = 80001
export const VALUE_LOGIN =
	'7cad118dfd6aade5cac88ab0656d82855fdc9028f4247e12430952d1b8085ed5'
export const METAMASK = 'METAMASK'
export const COINBASE = 'COINBASE'
export const FORTMATIC = 'FORTMATIC'
export const WALLETCONNECT = 'WALLETCONNECT'
export const BITSKI = 'BITSKI'
export const DENIED_TRANSACTION = 'User rejected the transaction'
export const USER_DECLINED = 'The user has declined this request'

export const REWARD_TABLE_1 = [
	{
		land: '1x1',
		reward: 'Random Box A * 10',
	},
	{
		land: '1x1P',
		reward: 'Random Box B * 15',
	},
	{
		land: '2x1',
		reward: 'Random Box C * 10',
	},
	{
		land: '2x1P',
		reward: 'Random Box D * 15',
	},
	{
		land: '2x2',
		reward: 'Random Box E * 10',
	},
	{
		land: '2x2P',
		reward: 'Random Box F * 15',
	},
	{
		land: '3x3',
		reward: 'Random Box G * 10',
	},
]
export const REWARD_TABLE_2 = [
	{
		land: '1x1',
		reward: 'Random Box A * 10, Building Box A * 1',
	},
	{
		land: '1x1P',
		reward: 'Random Box B * 15, Building Box A * 1',
	},
	{
		land: '2x1',
		reward: 'Random Box C * 10, Building Box A * 1',
	},
	{
		land: '2x1P',
		reward: 'Random Box D * 15, Building Box A * 1',
	},
	{
		land: '2x2',
		reward: 'Random Box E * 10, Building Box A * 1',
	},
	{
		land: '2x2P',
		reward: 'Random Box F * 15, Building Box A * 1',
	},
	{
		land: '3x3',
		reward: 'Random Box G * 10, Building Box A * 1',
	},
];
export const REWARD_TABLE_3 = [
	{
		land: '1x1',
		reward: 'Random Box A * 10, Building Box B * 1',
	},
	{
		land: '1x1P',
		reward: 'Random Box B * 15, Building Box B * 1',
	},
	{
		land: '2x1',
		reward: 'Random Box C * 10, Building Box B * 1',
	},
	{
		land: '2x1P',
		reward: 'Random Box D * 15, Building Box B * 1',
	},
	{
		land: '2x2',
		reward: 'Random Box E * 10, Building Box B * 1',
	},
	{
		land: '2x2P',
		reward: 'Random Box F * 15, Building Box B * 1',
	},
	{
		land: '3x3',
		reward: 'Random Box G * 10, Building Box B * 1',
	},
]

export const LAND_CODE = {
	SEOUL:'SeoulA',
	NEWYORK: 'Newyork',
	LONDON: 'London',
	TOKYO: 'Tokyo'
}