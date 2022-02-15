export function renderUnlockContent() {
  return `
  <p>All staked LANDs will be unlocked and returned to your account. Are you sure you want to unlock all staked LANDs?</p><br />
  <p>(You can:</p>
  <p>- leave the staked LANDs in the pool until the next campaign starts to continue staking them</p>
  <p>- or, unlock them now if you want to use them)</p>
  `
}
export function renderCampainNotYetContent() {
  return `
  <p>This Staking campaign has not started yet.</p><br />
  <p>You can only stake your LANDs during the campaign. Please wait until the campaign starts to stake your LANDs.</p>
  `
}
export function renderNotLoginContent() {
  return `
  <p>You must connect your wallet before taking part in the Staking campaign.</p>
  <p>Please connect your wallet to continue.</p>
  `
}
export function renderSuccessContent() {
  return `
  <p>You have staked your LAND(s) successfully. The staked LANDs will be shown under “Staked LANDs” section.</p><br />
  <p>Please note that you will be unable to unlock your LAND(s) during the Staking period. You can harvest the accumulated DVG reward at any time during the Staking period (up until the Harvest time).</p>
  `
}
export function renderOnClickHarvestContent(data){
  return `
  <p>You got ${data} DVG from the staking campaign!</p>
  <br />
    <p>
      The earned DVG has been transferred to your Dvision
      WORLD DVG balance.
    </p>
  `
}
export function renderOnUnStakeAllNftsSuccessContent() {
  return 'All of your staked LANDs have been unlocked and returned to your account.'
}
export function renderOnUnStakeNftsSuccessContent() {
  return 'The selected LAND has been unlocked and returned to your account.'
}
export function renderOnCheckItemUnStakeModalConfirmContent() {
  return 'The selected LAND will be unlocked and returned to your account. Are you sure you want to unlock Dvision LAND: Gangnam-Daero Intersection 3x3?'
}
export function renderSwitchNftContent(){
  return 'All changes made and all of your selections in the current screen will be lost if you switch to another LAND type. Proceed?'
}