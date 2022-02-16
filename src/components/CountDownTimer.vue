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
import ABI_STAKING from '@/abi/DvisionStakingUpgradeable.json'
import { STAKING_ADDRESS, BSC_RPC_ENDPOINT } from '@/features/Common.js'

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
		'poolDuration.id': {
			handler(id) {
				this.getCampaignInfo(id)
			},
		},
	},
	methods: {
		startInterVal_1(startValue, endValue) {
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
				if (this.statusCampain !== 2) this.switchStatusCampain(2)
				this.countStart()
			}
			if (startValue <= currentValue && currentValue <= endValue) {
				if (this.statusCampain !== 3) this.switchStatusCampain(3)
				this.countEnd()
			}
			if (currentValue > endValue) {
				if (this.statusCampain !== 1) this.switchStatusCampain(1)
				clearInterval(this.interval_1)
				clearInterval(this.interval_2)
				clearInterval(this.interval_3)
			}
		},
		async getCampaignInfo(duration) {
			try {
				this.mxShowLoading()
				if (typeof window.ethereum !== 'undefined') {
					let web3 = new Web3(Web3.givenProvider || BSC_RPC_ENDPOINT)
					const contractConn = await new web3.eth.Contract(
						ABI_STAKING,
						STAKING_ADDRESS
					)
					await contractConn.methods
						.campaignInfo(duration)
						.call()
						.then((data) => {
							console.log('dataaa',data)
							const end = Number(data.timestampFinish)
							const start = end - Number(data.duration)
							if (start > 0) {
								this.startTime = moment(start * 1000).format()
								this.endTime = moment(end * 1000).format()
								const startValue = moment(
									this.startTime
								).valueOf()
								const endValue = moment(this.endTime).valueOf()
								const currValue = moment(new Date()).valueOf()
								if (currValue > endValue) {
									this.switchStatusCampain(1)
								} else if (
									startValue <= currValue &&
									currValue <= endValue
								) {
									this.switchStatusCampain(3)
								} else if (currValue < startValue) {
									this.switchStatusCampain(2)
								}
								this.mxCloseLoading()
								if (duration === 1) {
									this.startInterVal_1(startValue, endValue)
								}
								if (duration === 2) {
									this.startInterVal_2(startValue, endValue)
								}
								if (duration === 3) {
									this.startInterVal_3(startValue, endValue)
								}
							}
						})
				}
			} catch (err) {
				this.mxCloseLoading()
				console.log('catch', err)
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
