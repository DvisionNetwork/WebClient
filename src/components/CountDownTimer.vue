<template>
	<span v-if="type === 1">Campaign not started yet.</span>
	<span v-if="type === 2"
		>Staking campaign starts in:
		<span class="status green"
			>{{ days }}d:{{ hours }}h:{{ mins }}m:{{ secs }}s</span
		>
	</span>
	<span v-if="type === 3"
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
			type: 1,
			startTime: '2022-02-08T16:49:11+07:00',
			endTime: '2022-02-08T16:50:11+07:00',
			days: '00',
			hours: '00',
			mins: '00',
			secs: '00',
		}
	},
	mounted() {
		this.getCampaignInfo()
		console.log('this.startTimethis.startTime', this.startTime)
		const startValue = moment(this.startTime).valueOf()
		const endValue = moment(this.endTime).valueOf()

		setInterval(() => {
			const currentValue = moment(new Date()).valueOf()
			if (currentValue < startValue) {
				this.type = 2
				this.countStart()
			} else if (currentValue >= startValue && currentValue < endValue) {
				this.type = 3
				this.countEnd()
			} else {
				this.type = 1
			}
		}, 1000)
	},
	props: {
		// endTime: String,
	},
	methods: {
		async getCampaignInfo() {
			if (typeof window.ethereum !== 'undefined') {
				let web3 = new Web3(
					Web3.givenProvider ||
						'https://data-seed-prebsc-1-s1.binance.org:8545/'
				)
				const contractConn = await new web3.eth.Contract(
					ABI_APPROVE_ADD_LISTING.abi,
					'0x0e403338cdEe8043D603eF895D987b74AD4603c6'
				)
				await contractConn.methods
					.campaignInfo(1)
					.call()
					.then((data) => {
						const end = Number(data.timestampFinish) * 1000
						const start = end - Number(data.duration)
						if (start > 0) {
							this.startTime = moment(start).format()
							this.endTime = moment(end).format()
						}
					})
			}
		},
		countStart() {
			const currentTime = moment(new Date()).format()
			const diffDuration = moment.duration(
				moment(this.startTime).diff(currentTime)
			)
			this.days = diffDuration.days()
			this.hours = diffDuration.hours()
			this.mins = diffDuration.minutes()
			this.secs = diffDuration.seconds()
			const startValue = moment(this.startTime).valueOf()
			const currentValue = moment(currentTime).valueOf()
			if (startValue <= currentValue) {
				this.type = 3
			}
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
			const endValue = moment(this.endTime).valueOf()
			const currentValue = moment(currentTime).valueOf()
			if (endValue <= currentValue) {
				this.type = 1
			}
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
