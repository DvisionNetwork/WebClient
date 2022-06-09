import { gConfig } from "@/App.Config";
import Market from "./Market";
import NFT from "./NFT";

interface WalletData {
    Network: string,
    TokenAddress: string,
    Contract721Address: string,
    Contract1155Address: string,
    ContractMarketAddress: string,
    type: string,
    stakingAddress: string,
    addrs : string[]
}

export default class Wallet {
    private NFTMap: Map<string, NFT> = new Map<string, NFT>();
    private integrateMarket: Market;

    constructor(data: { [key: string] : WalletData }) {
        var ethKey: string = gConfig.isProd? 'addrProd' : 'addrDev';
        var ethData: WalletData = data[ethKey];
        this.NFTMap.set('ETH', new NFT(ethData.Network, ethData.TokenAddress, ethData.Contract721Address, ethData.Contract1155Address, ethData.ContractMarketAddress, ethData.stakingAddress));

        var bscKey: string = gConfig.isProd? 'addrBscProd' : 'addrBscDev';
        var bscData: WalletData = data[bscKey];
        this.NFTMap.set('BSC', new NFT(bscData.Network, bscData.TokenAddress, bscData.Contract721Address, bscData.Contract1155Address, bscData.ContractMarketAddress, bscData.stakingAddress));

        var polKey: string = gConfig.isProd? 'addrPolygonProd' : 'addrPolygonDev';
        var polData: WalletData = data[polKey];
        this.NFTMap.set('POL', new NFT(polData.Network, polData.TokenAddress, polData.Contract721Address, polData.Contract1155Address, polData.ContractMarketAddress, polData.stakingAddress));

        var bsc3rdKey: string = gConfig.isProd? 'addr3rdLandBscProd' : 'addr3rdLandBscDev';
        var bsc3rdData: WalletData = data[bsc3rdKey];
        this.NFTMap.set('BSC3', new NFT(bsc3rdData.Network, bsc3rdData.TokenAddress, bsc3rdData.Contract721Address, bsc3rdData.Contract1155Address, bsc3rdData.ContractMarketAddress, bsc3rdData.stakingAddress));

        var pol3rdKey: string = gConfig.isProd? 'addr3rdLandPolProd' : 'addr3rdLandPolDev';
        var pol3rdData: WalletData = data[pol3rdKey];
        this.NFTMap.set('POL3', new NFT(pol3rdData.Network, pol3rdData.TokenAddress, pol3rdData.Contract721Address, pol3rdData.Contract1155Address, pol3rdData.ContractMarketAddress, pol3rdData.stakingAddress));

        var integratedKey: string = gConfig.isProd? 'addrMarketBscProd' : 'addrMarketBscDev';
        var integratedData: WalletData = data[integratedKey];
        this.integrateMarket = new Market(integratedData.ContractMarketAddress, integratedData.addrs);
    }

    public getAddr(network: string, market_index?: string) {
        if(market_index != undefined && market_index != "-1") {
            return this.integrateMarket.getAddr(market_index);
        }
        else {
            var nft = this.NFTMap.get(network);

            if(nft != undefined) { return nft.getAddr(); }
        }
        
        return '';
    }

    public getContAddr(nft: string, network: string) {
        var NFT = this.NFTMap.get(network);

        if(NFT != undefined) {            
            return NFT.getContractAddress(nft);
        }

        return '';
    }
}