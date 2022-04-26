<template>
	<span v-if="statusCampain === 1" class="wrap-status">The campaign has not started yet.</span>
	<span v-if="statusCampain === 2" class="wrap-status"
		>The campaign will start in:
		<span class="status yellow"
			>{{ days }}d:{{ hours }}h:{{ mins }}m:{{ secs }}s</span
		>
	</span>
	<span v-if="statusCampain === 3" class="wrap-status"
		>The campaign will end in:
		<span class="status green"
			>{{ days }}d:{{ hours }}h:{{ mins }}m:{{ secs }}s</span
		>
	</span>
</template>

<script>
import moment from 'moment'

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
		timeCount: {
			type: Object,
		},
	},
	watch: {
		'timeCount.endValue': {
			handler() {
				const startValue = this.timeCount.startValue
				const endValue = this.timeCount.endValue
				this.startTime = moment(startValue * 1000).format()
				this.endTime = moment(endValue * 1000).format()
				if (this.poolDuration.id === 1) {
					this.startInterVal_1(startValue, endValue)
				}
				if (this.poolDuration.id === 2) {
					this.startInterVal_2(startValue, endValue)
				}
				if (this.poolDuration.id === 3) {
					this.startInterVal_3(startValue, endValue)
				}
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
			const currentValue = moment().unix()
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
		countStart() {
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
			this.days = Math.floor(diffDuration.asDays())
			this.hours = diffDuration.hours()
			this.mins = diffDuration.minutes()
			this.secs = diffDuration.seconds()
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap-status {
	display: flex;
	.status {
		font-family: Montserrat, sans-serif;
		font-style: normal;
		font-weight: 700;
		font-size: gREm(20);
		line-height: gREm(22);
		&.green {
			color: #47e269;
		}
		&.red {
			color: #f6583e;
		}
		&.yellow {
			color: #FFD041;
		}
	}
}

@include media-max($media_small) {
	.wrap-status {
		display: block;
	}
}
</style>
