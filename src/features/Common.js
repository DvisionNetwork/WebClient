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

export const STAKING_ADDRESS = '0x019D5b2B45fb01FbD77401bd1809EA121e222A23'
export const BSC_RPC_ENDPOINT = 'https://data-seed-prebsc-1-s1.binance.org:8545/'