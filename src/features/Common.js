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
export const BSC_RPC_ENDPOINT = 'https://data-seed-prebsc-1-s1.binance.org:8545/'