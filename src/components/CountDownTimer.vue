<template>
	<span v-if="statusCampain === 1">Campaign is not started yet.</span>
	<span v-if="statusCampain === 2"
		>Staking campaign starts in:
		<span class="status green"
			>{{ days }}d:{{ hours }}h:{{ mins }}m:{{ secs }}s</span
		>
	</span>
	<span v-if="statusCampain === 3"
		>Staking campaign ends in:
		<span class="status red"
			>{{ days }}d:{{ hours }}h:{{ mins }}m:{{ secs }}s</span
		>
	</span>
</template>

<script>
import moment from 'moment'
import Web3 from 'web3'
import ABI_APPROVE_ADD_LISTING from '@/abi/DvisionStakingUpgradeable.json'
export default {
	name: 'CountDownTimer',
	components: {},
	data() {
		return {
			startTime: '',
			endTime: '',
			days: '00',
			hours: '00',
			mins: '00',
			secs: '00',
			interval_1: null,
			interval_2: null,
			interval_3: null,
		}
	},
	props: {
		statusCampain: Number,
		switchStatusCampain: Function,
		poolDuration: {
			type: Object,
		},
	},
	mounted() {
		this.getCampaignInfo(1) //default 30 days
	},
	watch: {
		'poolDuration.data': {
			handler(dur) {
				this.getCampaignInfo(this.getUint8(dur))
			},
		},
	},
	methods: {
		getUint8(val) {
			if (val === 90) {
				return 3
			} else if (val === 60) {
				return 2
			} else {
				return 1
			}
		},
		startInterVal_1(startValue, endValue) {
			console.log('startValue',startValue)
			console.log('endValue',endValue)
			clearInterval(this.interval_2)
			clearInterval(this.interval_3)
			this.interval_1 = setInterval(() => {
				this.countInterVal(startValue, endValue)
			}, 1000)
		},
		startInterVal_2(startValue, endValue) {
			clearInterval(this.interval_1)
			clearInterval(this.interval_3)
			this.interval_2 = setInterval(() => {
				this.countInterVal(startValue, endValue)
			}, 1000)
		},
		startInterVal_3(startValue, endValue) {
			clearInterval(this.interval_1)
			clearInterval(this.interval_2)
			this.interval_3 = setInterval(() => {
				this.countInterVal(startValue, endValue)
			}, 1000)
		},
		countInterVal(startValue, endValue) {
			const currentValue = moment(new Date()).valueOf()
			if (currentValue < startValue) {
				this.switchStatusCampain(2)
				this.countStart()
			}
			if (startValue <= currentValue && currentValue <= endValue) {
				this.switchStatusCampain(3)
				this.countEnd()
			}
			if (currentValue > endValue) {
				clearInterval(this.interval_1)
				clearInterval(this.interval_2)
				clearInterval(this.interval_3)
				this.switchStatusCampain(1)
			}
		},
		async getCampaignInfo(duration) {
			this.mxShowLoading()
			if (typeof window.ethereum !== 'undefined') {
				let web3 = new Web3(
					Web3.givenProvider ||
						'https://data-seed-prebsc-1-s1.binance.org:8545/'
				)
				const contractConn = await new web3.eth.Contract(
					ABI_APPROVE_ADD_LISTING.abi,
					'0x019D5b2B45fb01FbD77401bd1809EA121e222A23'
				)
				await contractConn.methods
					.campaignInfo(duration)
					.call()
					.then((data) => {
						//let end = 0
						// if (duration === 1) end = Number('1644483112')
						// if (duration === 2) end = Number('1644546637')
						// if (duration === 3) end = Number('1644590312')
						const end = Number(data.timestampFinish)
						//const start = end - Number('14400')
						const start = end - Number(data.duration)
						if (start > 0) {
							this.startTime = moment(start * 1000).format()
							this.endTime = moment(end * 1000).format()
							const startValue = moment(this.startTime).valueOf()
							const endValue = moment(this.endTime).valueOf()
							const currValue = moment(new Date()).valueOf()
							if (currValue > endValue) {
								console.log('currValue > endValue')
								this.switchStatusCampain(1)
							} else if (
								startValue <= currValue &&
								currValue <= endValue
							) {
								console.log('startValue <= currValue && currValue <= endValue')
								this.switchStatusCampain(3)
							} else if (currValue < startValue) {
								console.log('currValue < startValue')
								this.switchStatusCampain(2)
							}
							this.mxCloseLoading()

							if (duration === 1) {
								this.startInterVal_1(
									startValue,
									endValue
								)
							}
							if (duration === 2) {
								this.startInterVal_2(
									startValue,
									endValue
								)
							}
							if (duration === 3) {
								this.startInterVal_3(
									startValue,
									endValue
								)
							}
						}
					})
			}
		},
		countStart() {
			// this.switchStatusCampain(2)
			const currentTime = moment(new Date()).format()
			const diffDuration = moment.duration(
				moment(this.startTime).diff(currentTime)
			)
			this.days = diffDuration.days()
			this.hours = diffDuration.hours()
			this.mins = diffDuration.minutes()
			this.secs = diffDuration.seconds()
		},
		countEnd() {
			const currentTime = moment(new Date()).format()
			const diffDuration = moment.duration(
				moment(this.endTime).diff(currentTime)
			)
			this.days = diffDuration.days()
			this.hours = diffDuration.hours()
			this.mins = diffDuration.minutes()
			this.secs = diffDuration.seconds()
		},
	},
}
</script>

<style lang="scss" scoped>
.green {
	color: #47e269;
}
.red {
	color: #f6583e;
}
</style>
