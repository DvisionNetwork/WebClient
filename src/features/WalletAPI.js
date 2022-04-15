var lv_provider = null
var lv_signer = null

import AppConfig from '@/App.Config.js'
import {
	checkProviderWallet,
	METAMASK,
	COINBASE,
	FORTMATIC,
	BITSKI,
} from '../features/Common'
import { getContractConnect, getWeb3 } from './Connectors'
var gConfig = AppConfig()

export default function walletAPI() {
	return {
		/// Start

		async checkMetamask(provider = null) {
			var network = 'NONE'
			var addr = gConfig.wlt.getAddr()
			var ethAddr = gConfig.wlt.getEthAddr()
			var bscAddr = gConfig.wlt.getBscAddr()
			var polygonAddr = gConfig.wlt.getPolygonAddr()

			if (typeof window.ethereum !== 'undefined') {
				// console.log('[WalletAPI] checkMetamask() Wallet is installed!');
				try {
					const prov = provider
						? provider
						: checkProviderWallet(
								window.localStorage.getItem('loginBy')
						  )
					if (prov && window.ethereum.providers) {
						// ethereum.selectedProvider = prov
						window.ethereum.setSelectedProvider(prov)
					}
					const chainId = await window.ethereum.request({
						method: 'eth_chainId',
					})

					window.localStorage.setItem('currentNetwork', chainId)
					if (
						chainId === addr.Network ||
						chainId === ethAddr.Network
					) {
						// console.log("ETH network matched");
						network = 'ETH'
					} else if (chainId === bscAddr.Network) {
						// console.log("BSC Network matched");
						network = 'BSC'
					} else if (chainId === polygonAddr.Network) {
						// console.log("BSC Network matched");
						network = 'POL'
					}
				} catch (err) {
					console.error('Error] : ' + err.message)
					gConfig.setNetwork(network)
					return network
				}
			} else {
				console.error(
					'[WalletAPI] checkMetamask() MetaMask is not installed!'
				)
				return 'NO-METAMASK'
			}

			gConfig.setNetwork(network)
			return network
		},

		async Sign_Account(account, callback, provider = null, wallet) {
			console.log('[WalletAPI] Sign_Account ()')

			const msgToShow =
				'Welcome to Dvision World, please sign this message for the user verification. Then you can use market and connect to dvision world after verification.'

			try {
				const from = account
				const msg = `0x${Buffer.from(msgToShow, 'utf8').toString(
					'hex'
				)}`

				if (provider && window.ethereum.providers) {
					window.ethereum.setSelectedProvider(provider)
				}
				const sign = await ethereum.request({
					method: 'personal_sign',
					params: [msg, from, 'Example password'],
				})

				var data = {
					wallet_addr: account,
					wallet,
				}

				callback(data)
			} catch (err) {
				console.error(err, 'err')
			}
		},

		Request_Account(callback) {
			//특정 컴퓨터에서 처음 접속한다면 사이트에 대한 접속을 승인해주어야함.

			// console.log("[WalletAPI] Request_Account ()");
			lv_provider = new ethers.providers.Web3Provider(window.ethereum)
			lv_signer = lv_provider.getSigner()

			var sent = false
			var obj4 = setInterval(async () => {
				if (typeof window.ethereum !== 'undefined') {
					// console.log("[WalletAPI] Request_Account () -> window.ethereum OK ");
					clearInterval(obj4)

					try {
						var accounts = await ethereum.request({
							method: 'eth_requestAccounts',
						}) // eth_requestAccounts eth_requestAccounts

						if (accounts.length > 0) {
							// console.log("[WalletAPI] Request_Account Current Account: ", accounts[0]);
							if (!sent) {
								sent = true
								callback({
									res_code: 200,
									message: 'Success on requesting account',
									data: { account: accounts[0] },
								})
							}
						} else {
							// 등록된 등록된 계정이 없습니다  이 경우 메타마스크 창에서 등록하란 호출 창이 나타납니다 .
							if (!sent) {
								sent = true
								callback({
									res_code: 403,
									message: 'There is no Account',
								})
							}
							console.error(
								'[WalletAPI] No Request_Account ',
								accounts
							)
						}
					} catch (err) {
						// 유저가 등록을 거부한 경우에는 에러로 메시지가 표시됩니다 .
						// err.message 노출.
						if (!sent) {
							sent = true
							callback({
								res_code: 401,
								message: 'Error on ethereum request',
							})
							console.error('[WalletAPI] [Error] : ', err)
						}
					}
				} else {
					if (!sent) {
						sent = true
						callback({
							res_code: 400,
							message: 'Ethereum is not installed ',
						})
						// console.log("[WalletAPI] Request_Account () -> window.ethereum is not installed ");
					}
				}
			}, 10)
		},

		async getDviBalance(account, provider = null, network, callback) {
			const abi = [
				'function balanceOf(address owner) view returns (uint256)',
				'function decimals() view returns (uint8)',
			]
			lv_provider = new ethers.providers.Web3Provider(
				provider ? provider : window.ethereum
			)
			const loginBy = window.localStorage.getItem('loginBy')
			const rv =
				loginBy !== METAMASK && loginBy !== COINBASE
					? network
					: await this.checkMetamask()
			if (rv != 'NONE') {
				var contract = null
				var addr

				if (rv == 'ETH') {
					addr = gConfig.wlt.getAddr()
				} else if (rv == 'BSC') {
					addr = gConfig.wlt.getBscAddr()
				} else {
					return
				}

				try {
					contract = new ethers.Contract(
						addr.TokenAddress,
						abi,
						lv_provider
					)
					if (loginBy === BITSKI) {
						const networkRPC =
							window.localStorage.getItem('networkRPC')
						const currentNetwork =
							window.localStorage.getItem('currentNetwork')
						contract = getContractConnect(
							BITSKI,
							erc20_ABI,
							addr.TokenAddress,
							networkRPC,
							currentNetwork
						)
					}
				} catch (err) {
					callback({
						res_code: 401,
						message: 'Create Contract',
						balance: 0,
					})
				}
				console.log('result console', {
					account,
					contract,
					lv_provider,
					rv,
					addr,
				})
				if (!contract) return
				try {
					var ret
					if (loginBy === BITSKI) {
						ret = await contract.methods.balanceOf(account).call()
					} else {
						ret = await contract.balanceOf(account)
					}
					if (ret !== null) {
						if (loginBy === BITSKI) {
							var balance = (Number(ret) / 10 ** 18).toString()
						} else {
							var decimal = await contract.decimals()
							var balance = (ret / 10 ** decimal).toString()
							// console.log("[WalletAPI] getDviBalance() balance of dvi : " + balance);
						}
						callback({
							res_code: 200,
							message: 'Success on get DVI Balance',
							data: { balance: balance },
						})
					} else {
						// console.log("[WalletAPI] getDviBalance() ret == null, ==> balance of dvi : 0");
						callback({
							res_code: 401,
							message: 'Error on getting DVI Balance',
							balance: 0,
						})
					}
				} catch (error) {
					console.log('error on dvi balance', error)
				}
			} else {
				callback({
					res_code: 402,
					message: 'Error on checking MetaMask',
					balance: 0,
				})
			}
		},

		async getBalanceWallet(account, network, callback) {
			const decimals = ethers.BigNumber.from(18)

			const loginBy = window.localStorage.getItem('loginBy')
			const rv =
				loginBy !== METAMASK && loginBy !== COINBASE
					? network
					: await this.checkMetamask()

			if (rv != 'NONE') {
				try {
					const networkRPC = window.localStorage.getItem('networkRPC')
					const currentNetwork =
						window.localStorage.getItem('currentNetwork')
					const web3 = getWeb3(loginBy, networkRPC, currentNetwork)
					console.log('web3', web3)
					const ret = await web3.eth.getBalance(account)
					// const ret = await ethereum.request({
					// 	method: 'eth_getBalance',
					// 	params: [account, 'latest'],
					// })
					console.log('ret', ret)
					const balance = (ret / 10 ** decimals).toFixed(4)
					console.log('before balance', balance)

					callback({
						res_code: 200,
						message: 'Success on get Polygon Balance',
						data: { balance: balance },
					})
				} catch (err) {
					callback({
						res_code: 401,
						message: 'Error on getting Balance',
						balance: 0,
					})
				}
			} else {
				callback({
					res_code: 402,
					message: 'Error on checking MetaMask',
					balance: 0,
				})
			}
		},

		// J = { account, itemId, ownerId, amount, price, callback} // account : accountEth
		prependData(J) {
			var data = {
				item_id: J.itemId,
				seller: J.ownerId,
				buyer: J.account,
				amount: J.amount,
				price: J.price,
			}
			// console.log("[WalletAPI] prependData() data:", data);

			_U.callPost({
				url: gConfig.market_prepending_create,
				data: data,
				callback: (resp) => {
					J.callback(resp)
				},
			})
		},

		buyLandItem(J) {
			var data = {
				account: J.account,
				itemId: J.itemId,
				ownerId: J.ownerId,
				price: J.price,
				land_code: J.land_code,
				network: J.network,
			}
			console.log('[WalletAPI] buyLandItem() data:', data)

			_U.callPost({
				url: gConfig.market_land_buy_item,
				data: data,
				callback: (resp) => {
					J.callback(resp)
				},
			})
		},

		getContAddr(nft, network) {
			console.log('network', network)
			const addr = gConfig.wlt.getNetworkAddr(network)

			var contAddr = null
			if (nft == '721') {
				contAddr = addr.Contract721Address
			} else if (nft == '1155') {
				contAddr = addr.Contract1155Address
			}
			console.log(addr, contAddr, 'address123')
			return contAddr
		},
		getMarketAddr(network) {
			var addr = gConfig.wlt.getNetworkAddr(network)

			var contAddr = addr.ContractMarketAddress

			return contAddr
		},
		getContract(type, network, nft, loginBy) {
			const addr = gConfig.wlt.getNetworkAddr(network)
			const networkRPC = window.localStorage.getItem('networkRPC')
			const currentNetwork = window.localStorage.getItem('currentNetwork')
			let contract = null
			if (type == 'Approval') {
				if (loginBy === FORTMATIC || loginBy === BITSKI) {
					contract = getContractConnect(
						loginBy,
						erc20_ABI,
						addr.TokenAddress,
						networkRPC,
						currentNetwork
					)
				} else {
					contract = new ethers.Contract(
						addr.TokenAddress,
						erc20_ABI,
						lv_signer
					)
				}
			} else if (type == 'Trade' && network == 'POL') {
				if (loginBy === FORTMATIC || loginBy === BITSKI) {
					contract = getContractConnect(
						loginBy,
						polmarket_ABI,
						addr.ContractMarketAddress,
						networkRPC,
						currentNetwork
					)
				} else {
					contract = new ethers.Contract(
						addr.ContractMarketAddress,
						polmarket_ABI,
						lv_signer
					)
				}
			} else if (type == 'Trade' && network != 'POL') {
				if (loginBy === FORTMATIC || loginBy === BITSKI) {
					contract = getContractConnect(
						loginBy,
						market_ABI,
						addr.ContractMarketAddress,
						networkRPC,
						currentNetwork
					)
				} else {
					contract = new ethers.Contract(
						addr.ContractMarketAddress,
						market_ABI,
						lv_signer
					)
				}
			} else if (type == 'Sell' && nft == '721') {
				if (network == 'POL') {
					contract =
						loginBy === FORTMATIC || loginBy === BITSKI
							? (contract = getContractConnect(
									loginBy,
									pol721_ABI,
									addr.Contract721Address,
									networkRPC,
									currentNetwork
							  ))
							: new ethers.Contract(
									addr.Contract721Address,
									pol721_ABI,
									lv_signer
							  )
				} else {
					contract =
						loginBy === FORTMATIC || loginBy === BITSKI
							? (contract = getContractConnect(
									loginBy,
									erc721_ABI,
									addr.Contract721Address,
									networkRPC,
									currentNetwork
							  ))
							: new ethers.Contract(
									addr.Contract721Address,
									erc721_ABI,
									lv_signer
							  )
				}
			} else if (type == 'Sell' && nft == '1155') {
				contract =
					loginBy === FORTMATIC || loginBy === BITSKI
						? (contract = getContractConnect(
								loginBy,
								erc1155_ABI,
								addr.Contract1155Address,
								networkRPC,
								currentNetwork
						  ))
						: new ethers.Contract(
								addr.Contract1155Address,
								erc1155_ABI,
								lv_signer
						  )
			}
			return contract
		},

		// J = { type:Approval/Trade, nft, price, [tokenId,] [ownerId, amount,] callback } // tokenId for trade, ownerId & amount trade-1155
		async ContractDvi(J) {
			console.log('[WalletAPI] =========== ContractDvi() J:', J)
			const loginBy = window.localStorage.getItem('loginBy')
			const contAddr = this.getContAddr(J.category, J.network)
			if (!contAddr) {
				J.callback({
					res_code: 401,
					msg: 'Unsupported NFT type [' + J.category + ']',
					data: {
						trHash: null,
					},
				})
				return
			}

			lv_provider = new ethers.providers.Web3Provider(
				J.provider ? J.provider : window.ethereum
			)

			lv_signer = lv_provider.getSigner()

			console.log(lv_provider, lv_signer, 'provider, signer')

			let contract = this.getContract(
				J.type,
				J.network,
				J.category,
				loginBy
			)
			if (!contract) {
				J.callback({
					res_code: 401,
					msg: 'Unsupported type of contractDvi [' + J.type + ']',
					data: {
						trHash: null,
					},
				})
				return
			}

			const decimals = ethers.BigNumber.from(18)
			const vAmout = ethers.BigNumber.from(parseInt(J.price * 1000000))
			const value = vAmout
				.mul(ethers.BigNumber.from(10).pow(decimals))
				.div(1000000)
			let ret = null
			let msg = 'failed'

			const rv =
				loginBy !== METAMASK && loginBy !== COINBASE
					? J.network
					: await this.checkMetamask()

			if (rv != 'NONE') {
				try {
					J.fToast(
						`${J.type} ${
							J.type !== 'Approval' ? `- ${J.category}` : ''
						} of DVI transaction is being processed.`
					)
					let sendTransactionPromise = null
					if (J.type == 'Approval') {
						console.log('account', J.accountAddress)
						sendTransactionPromise = await (loginBy === FORTMATIC ||
						loginBy === BITSKI
							? contract.methods.approve(contAddr, value).send({
									from: J.accountAddress,
									chain: 'rinkedby',
							  })
							: contract.approve(contAddr, value, {
									gasLimit: 6000000,
							  }))
					} else if (J.type == 'Trade') {
						if (J.category == '721') {
							if (J.tokenType == 0) {
								console.log(
									'[WalletAPI] ContractDvi call  contract.Trade_721eth("' +
										J.tokenId +
										'", ' +
										value +
										' );'
								)
								const overrides = {
									value: value,
								}
								console.log(
									'contract',
									contract,
									lv_provider,
									lv_signer
								)
								sendTransactionPromise = await (loginBy ===
									FORTMATIC || loginBy === BITSKI
									? contract.methods
											.trade721ETH(J.tokenId.toString())
											.send({
												from: J.accountAddress,
												value: overrides.value,
											})
									: contract.trade721ETH(
											J.tokenId.toString(),
											overrides,
											{
												gasLimit: 6000000,
											}
									  )) // function check
							} else {
								console.log(
									'[WalletAPI] ContractDvi call  contract.Trade_721dvi("' +
										J.tokenId +
										'", ' +
										value +
										' );'
								)
								sendTransactionPromise = await (loginBy ===
									FORTMATIC || loginBy === BITSKI
									? contract.methods
											.Trade_721dvi(
												J.tokenId.toString(),
												value
											)
											.send({
												from: J.accountAddress,
												gas: 6000000,
											})
									: contract.Trade_721dvi(
											J.tokenId.toString(),
											value,
											{
												gasLimit: 6000000,
											}
									  ))
							}
						} else if (J.category == '1155') {
							console.log(
								'[WalletAPI] ContractDvi call  contract.Trade_1155dvi("' +
									J.ownerId +
									'", "' +
									J.tokenId +
									'", ' +
									value +
									', ' +
									J.amount +
									' );'
							)
							console.log('contract', contract)
							sendTransactionPromise = await (loginBy ===
								FORTMATIC || loginBy === BITSKI
								? contract.methods
										.Trade_1155dvi(
											J.ownerId.toString(),
											J.tokenId.toString(),
											value,
											J.amount
										)
										.send({
											from: J.accountAddress,
										})
								: contract.Trade_1155dvi(
										J.ownerId.toString(),
										J.tokenId.toString(),
										value,
										J.amount,
										{
											gasLimit: 6000000,
										}
								  ))
						}
					} else if (J.type == 'Sell') {
						if (J.category == '721') {
							const marketContract = this.getMarketAddr(J.network)

							if (J.tokenType == 0) {
								console.log(
									'[WalletAPI] ContractDvi call  contract.sellItem721 token 0("' +
										marketContract +
										'", "' +
										J.tokenId +
										'", ' +
										J.tokenType +
										', ' +
										value +
										' );'
								)
								sendTransactionPromise = await (loginBy ===
									FORTMATIC || loginBy === BITSKI
									? contract.methods
											.sellItem(
												marketContract,
												J.tokenId.toString(),
												value,
												J.tokenType
											)
											.send({
												from: J.accountAddress,
											})
									: contract.sellItem(
											marketContract,
											J.tokenId.toString(),
											value,
											J.tokenType,
											{
												gasLimit: 6000000,
											}
									  ))
							} else {
								console.log(
									'[WalletAPI] ContractDvi call  contract.Sell_Item 721 token !== 0("' +
										marketContract +
										'", "' +
										J.tokenId +
										'", ' +
										J.tokenType +
										', ' +
										value +
										' );'
								)
								console.log('contract', contract)
								const tokenType = J.tokenType
									? J.tokenType
									: '1'
								sendTransactionPromise = await (loginBy ===
									FORTMATIC || loginBy === BITSKI
									? contract.methods
											.Sell_Item(
												marketContract,
												J.tokenId.toString(),
												value,
												tokenType
											)
											.send({
												from: J.accountAddress,
											})
									: contract.Sell_Item(
											marketContract,
											J.tokenId.toString(),
											value,
											tokenType,
											{
												gasLimit: 6000000,
											}
									  ))
							}
						} else if (J.category == '1155') {
							const marketContract = this.getMarketAddr(J.network)
							console.log(
								'[WalletAPI] ContractDvi call  contract.Sell_Item("' +
									marketContract +
									'", "' +
									J.tokenId +
									'", ' +
									value +
									', ' +
									J.amount +
									' );'
							)

							console.log('contract 1155', contract)

							sendTransactionPromise = await (loginBy ===
								FORTMATIC || loginBy === BITSKI
								? contract.methods
										.Sell_Item(
											marketContract,
											J.tokenId.toString(),
											value,
											1,
											J.amount
										)
										.send({
											from: J.accountAddress,
										})
								: contract.Sell_Item(
										marketContract,
										J.tokenId.toString(),
										value,
										1,
										J.amount,
										{
											gasLimit: 6000000,
										}
								  ))
						}
					}
					if (!sendTransactionPromise) {
						J.callback({
							res_code: 401,
							msg:
								'[' +
								J.type +
								'-' +
								J.category +
								'] Unsupported type of sendTransactionPromise ',
							data: {
								trHash: null,
							},
						})
						return
					}
					console.log(sendTransactionPromise, 'sendTransaction')
					const txReceipt = await (loginBy === FORTMATIC ||
					loginBy === BITSKI
						? sendTransactionPromise
						: sendTransactionPromise.wait())
					if (typeof txReceipt !== 'undefined') {
						if (txReceipt.status == 1) {
							// console.log('[WalletAPI] ('+J.type+'-'+J.category+') txReceipt.transactionHash:',txReceipt.transactionHash);
							// if(J.type == 'Approval') {
							// 	J.fToast(J.type+" of DVI transaction is succeeded.");
							// }else{
							// 	J.fToast(J.type+"-"+J.category+" of DVI transaction is succeeded.");
							// }
							ret = txReceipt.transactionHash
							msg = 'success'
						} else {
							if (J.type == 'Approval') {
								msg =
									'[' +
									J.type +
									'-' +
									J.category +
									'] is failed'
							} else {
								msg =
									'[' +
									J.type +
									'-' +
									J.category +
									'] is Reverted'
							}
							J.fToast(msg)
						}
					} else {
						msg =
							'[' +
							J.type +
							'-' +
							J.category +
							'] Error on sendTransactionPromise() <br> with no receipt'
						console.error(msg)
					}
				} catch (err) {
					msg =
						'[' +
						J.type +
						'-' +
						J.category +
						'] Error catched on <br> sendTransactionPromise() <br>' +
						err.code
					console.error(err, msg)
					// console.log("===========================================");
					// console.log(err);
					// console.log("===========================================");
					// console.log(err.code);
					// console.log(err.data);
					// console.log(err.message);
					var m = err.message
					var mm = m.substring(m.indexOf('{'), m.lastIndexOf('}') + 1)
					// console.log(mm);
				}
			} else {
				msg =
					'[' +
					J.type +
					'-' +
					J.category +
					'] Error on checking MetaMask '
				console.error(msg)
			}

			J.callback({
				res_code: ret ? 200 : 401,
				msg: msg,
				data: {
					trHash: ret,
				},
			})
		},

		// J = { prependingId, callback }
		CompleteData(J) {
			var data = {
				prepending_id: J.prependingId,
				hash_addr: J.hash_addr,
			}
			// console.log("[WalletAPI] CompleteData() data:", data);

			_U.callPost({
				url: gConfig.market_item_trade,
				data: data,
				callback: (resp) => {
					J.callback(resp)
				},
			})
		},

		//////////////////////////////////////////////////
		// J = {nft, account, tokenId, fToast }
		async getOwnAmount(J) {
			// console.log("[WalletAPI] getOwnAmount()",J);

			if (J.category == '1155') {
				if (!lv_provider) {
					lv_provider = new ethers.providers.Web3Provider(
						window.ethereum
					)
				}

				var contAddr = this.getContAddr(J.category, J.network)
				var contract = new ethers.Contract(
					contAddr,
					erc1155_ABI,
					lv_provider
				)

				// console.log("[WalletAPI] call caheckMetamask" );

				this.checkMetamask().then(async (rv) => {
					if (rv != 'NONE') {
						// console.log("[WalletAPI] call contract balanceOf()");

						var result = await contract.balanceOf(
							J.account,
							J.tokenId
						)
						try {
							var amount = parseInt(result._hex)
							// console.log(amount);
							// console.log("[WalletAPI] result of balanceOf amount : ", amount);

							return amount
						} catch (err) {
							console.error('[Error] : ' + err.message)
							J.fToast(
								'Error on contract balance!<br>' + err.message
							)
						}
					} else {
						J.fToast('Error on checkMetamask!')
						return -1
					}
				})
			} else {
				return 1
			}
		},

		//// END ////
	}
}
