interface Address {
    token: string;
    contract721: string;
    contract1155: string;
}

export default class Market {
    private contractMarketAddress: string;
    private addressList: Address[];
    
    constructor(marketAddress: string, addressList: any[]) {
        this.contractMarketAddress = marketAddress;
        this.addressList = addressList;
    }

    public getMarketIndexAddr(marketIndex: string) {
        var index = Number(marketIndex);
        return this.addressList[index];
    }

    public getAddr(marketIndex: string) {
        var address = this.getMarketIndexAddr(marketIndex);

        return {
            ContractMarketAddress: this.contractMarketAddress,
            ... address
        };
    }
}