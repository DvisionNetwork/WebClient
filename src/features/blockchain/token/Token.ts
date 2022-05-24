import NFT from "../NFT";

export default class Token extends NFT {
    public getAddr(): string {
        return this.address;
    }
}