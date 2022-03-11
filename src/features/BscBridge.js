var lv_provider = null;
var lv_signer = null;
var bscNftAddr = '0xB316F735AEBEeCA01a8B9B97CCbB52acd897167B';
var bridgeAddr = '0x8457F71dCbE04CD1b69B733212D4C8DEb186E97e';

const abi =
[
    "function balanceOf(address owner) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function setApprovalForAll(address operator, bool approved)",

    "function lock(address collection, uint256[] tokenIds, uint256[] amounts)"
];

import AppConfig from '@/App.Config.js'
var gConfig = AppConfig();

export default function BscBridge() {
return {
/// Start

async checkMetamask() {

    var network = 'NONE';   
    var bscAddr = gConfig.wlt.getBscAddr(); 

    if (typeof window.ethereum !== 'undefined') {
        try {
            var chainId = await ethereum.request({method :'eth_chainId'});
            console.log("chain Id : " + chainId);

            if(chainId === bscAddr.Network) {
                network = 'BSC';
            }
        }
        catch(err) {
            console.error("Error] : " + err.message);
            gConfig.setNetwork(network);
            return network;
        }
    } else {
        console.error('[WalletAPI] checkMetamask() MetaMask is not installed!');
    }

    gConfig.setNetwork(network);
    return network;
},

async getBinanceNftBalance(ownerAddress, callback) {

    if(!lv_provider) {
		lv_provider = new ethers.providers.Web3Provider(window.ethereum);
	}
    
    this.checkMetamask().then(async (rv)=>{
		if(rv!='NONE') {
			var contract = null;
			var addr;
     		if(rv == 'BSC') {
				addr = gConfig.wlt.getBscAddr();
			} else {
				return;
			}
     		try {
				contract = new ethers.Contract(bscNftAddr, abi, lv_provider);
			}
			catch(err) {
				callback({res_code:401, message:'Create Contract', balance: 0})
			}
			if(!contract) return ;

			var ret = await contract.balanceOf(ownerAddress);
            var balance = ret.toString();

            if(ret !== null) {
                console.log("[BscBridge] getBinanceNftInfo, owner address : ", ownerAddress);
                callback({res_code:200, message:'Success on get Binance NFT Balance', data:{balance: balance}})
            }
            else {
                console.log("[BscBridge] getBinanceNftInfo() ret == null, ==> balance of dvi : 0");
                callback({res_code:401, message:'Error on getting Binance NFT Balance'})
            }
        }else{
            console.log("checkMetamask error");
            callback({res_code:402, message:'Error on checking MetaMask'})
        }
	});

},

async getOwnedNftId(ownerAddress, index, callback) {

    if(!lv_provider) {
		lv_provider = new ethers.providers.Web3Provider(window.ethereum);
	}

    this.checkMetamask().then(async (rv)=>{
		if(rv!='NONE') {
			var contract = null;
			var addr;

			if(rv == 'BSC') {
				addr = gConfig.wlt.getBscAddr();
			} else {
				return;
			}

			try {
				contract = new ethers.Contract(bscNftAddr, abi, lv_provider);
			}
			catch(err) {
				callback({res_code:401, message:'Create Contract'})
			}
			if(!contract) return ;

			var ret = await contract.tokenOfOwnerByIndex(ownerAddress, index);

            var nftId = ret.toString();

			if(ret !== null) {
				console.log("[BscBridge] owner address: ", ownerAddress, ", index : ", index, ", NFT ID : ", nftId);
				callback({res_code:200, message:'Success on get DVI Balance', data:{index:index, id: nftId}})
			}
			else {
				console.log("[BscBridge] getDviBalance() ret == null, ==> balance of dvi : 0");
				callback({res_code:401, message:'Error on getting DVI Balance'})
			}
		}else{
            console.log("checkMetamask error");
			callback({res_code:402, message:'Error on checking MetaMask'})
		}
	});
},

async lockBianceNft(tokenIds, amounts, callback) {
    if(!lv_provider || !lv_signer) {
		lv_provider = new ethers.providers.Web3Provider(window.ethereum);
        lv_signer = lv_provider.getSigner();
	}

    this.checkMetamask().then(async (rv)=>{
		if(rv!='NONE') {
			var contract = null;
			var addr;

			if(rv == 'BSC') {
				addr = gConfig.wlt.getBscAddr();
			} else {
				return;
			}

			try {
				contract = new ethers.Contract(bridgeAddr, abi, lv_signer);
			}
			catch(err) {
				callback({res_code:401, message:'Create Contract'})
			}
			if(!contract) return ;

            console.log("tokenIds : ", tokenIds);
            console.log("amounts : ", amounts);

			await contract.lock(bscNftAddr, tokenIds, amounts);
		}else{
            console.log("checkMetamask error");
			callback({res_code:402, message:'Error on checking MetaMask'})
		}
	});
},

async setApproveAll(callback) {
    if(!lv_provider || !lv_signer) {
		lv_provider = new ethers.providers.Web3Provider(window.ethereum);
        lv_signer = lv_provider.getSigner();
	}

    this.checkMetamask().then(async (rv)=>{
		if(rv!='NONE') {
			var contract = null;
			var addr;

			if(rv == 'BSC') {
				addr = gConfig.wlt.getBscAddr();
			} else {
				return;
			}

			try {
				contract = new ethers.Contract(bscNftAddr, abi, lv_signer);
			}
			catch(err) {
				callback({res_code:401, message:'Create Contract'})
			}

            var sendTransactionPromise = null;
            sendTransactionPromise = await contract.setApprovalForAll(bridgeAddr, true);

            if(!sendTransactionPromise) {
                callback({res_code:402, message:'Unsupported type of sendTransactionPromise'})
                return;
            }

            var txReceipt = await sendTransactionPromise.wait();

            if (typeof txReceipt !== 'undefined') {
                if (txReceipt.status == 1) {
                    callback({res_code:200, message:'Success on approval.'});
                } else {
                    callback({res_code:402, message:'Error. Tx status is not completed.'})
                }
            } else {
                callback({res_code:402, message:'Error on sendTransactionPromise() <br> with no receipt'})
            }
		}else{
            console.log("checkMetamask error");
			callback({res_code:402, message:'Error on checking MetaMask'})
		}
	});
}

//// END ////
}}
