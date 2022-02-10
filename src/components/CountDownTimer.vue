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
			startTime: '2022-02-10T15:15:11+07:00',
			endTime: '2022-02-10T16:16:11+07:00',
			days: '00',
			hours: '00',
			mins: '00',
			secs: '00',
		}
	},
	props: {
		statusCampain: Number,
		switchStatusCampain: Function,
	},
	mounted() {
		this.getCampaignInfo()
		const startValue = moment(this.startTime).valueOf()
		const endValue = moment(this.endTime).valueOf()
		setInterval(() => {
			const currentValue = moment(new Date()).valueOf()
			if (currentValue < startValue) {
				if (this.statusCampain !== 2) {
					this.switchStatusCampain(2)
				}
				this.countStart()
			} else if (currentValue >= startValue && currentValue < endValue) {
				if (this.statusCampain !== 3) {
					this.switchStatusCampain(3)
				}
				this.countEnd()
			} else {
				if (this.statusCampain !== 1) {
					this.switchStatusCampain(1)
				}
			}
		}, 1000)
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
					'0x019D5b2B45fb01FbD77401bd1809EA121e222A23'
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
				this.switchStatusCampain(3)
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
				this.switchStatusCampain(1)
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
