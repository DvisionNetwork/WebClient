export default class NFT {
    private network: string;
    private tokenAddress: string;
    private contract721Address: string;
    private contract1155Address: string;
    private contractMarketAddress: string;

    constructor(network: string, token: string, contract721: string, contract1155: string, contractMarket: string) {        
        this.network = network;
        this.tokenAddress = token;
        this.contract721Address = contract721 = contract721;
        this.contract1155Address = contract1155;
        this.contractMarketAddress = contractMarket;
    }

    public getAddr() {
        return {
            Network: this.network,
            TokenAddress: this.tokenAddress,
            Contract721Address: this.contract721Address,
            Contract1155Address: this.contract1155Address,
            ContractMarketAddress: this.contractMarketAddress,
        };
    }

    public getNetwork() {
        return this.network;
    }

    public getContractAddress(type: string) {
        if (type == "token") {
            return this.tokenAddress;
        }
        else if (type == "721") {
            return this.contract721Address;
        }
        else if (type == "1155") {
            return this.contract1155Address;
        }
        else if (type == "market") {
            return this.contractMarketAddress;
        }
        return '';
    }
}