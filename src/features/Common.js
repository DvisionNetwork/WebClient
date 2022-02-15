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

export const STAKING_ADDRESS = '0x36ca44FC054F1d135CF655f739540611E58E760b'
export const BSC_RPC_ENDPOINT = 'https://data-seed-prebsc-2-s2.binance.org:8545/'
export const ADDRESS_721 = '0xD41eddEdB1891B626FADD17B328e14077c8248Cb'
export const ADDRESS_1155 = '0x3a0792d301a40eBcd9199431b00AD26603b7cdc4'