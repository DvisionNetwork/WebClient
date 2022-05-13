<template>
	<span v-if="statusCampain === 1" class="wrap-status"
		>The campaign has not started yet.</span
	>
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
				console.log('in timecount')
				const { startValue, endValue } = this.timeCount
				this.startTime = moment(startValue * 1000).format()
				this.endTime = moment(endValue * 1000).format()
				this.startInterVal_1(startValue, endValue)
			},
		},
	},
	methods: {
		startInterVal_1(startValue, endValue) {
			clearInterval(this.interval_1)
			this.interval_1 = setInterval(() => {
				this.countInterVal(startValue, endValue)
			}, 1000)
		},
		countInterVal(startValue, endValue) {
			console.log('count interval')
			const currentValue = moment().unix()
			if (currentValue < startValue) {
				if (this.statusCampain !== 2) this.switchStatusCampain(2)
				this.count()
			}
			if (startValue <= currentValue && currentValue <= endValue) {
				if (this.statusCampain !== 3) this.switchStatusCampain(3)
				this.count()
			}
			if (currentValue > endValue) {
				if (this.statusCampain !== 1) this.switchStatusCampain(1)
				clearInterval(this.interval_1)
			}
		},
		count(isStart) {
			const currentTime = moment(new Date()).format()
			const diffDuration = moment.duration(
				moment(isStart ? this.startTime : this.endTime).diff(
					currentTime
				)
			)
			this.days = isStart
				? diffDuration.days()
				: Math.floor(diffDuration.asDays())
			this.hours = diffDuration.hours()
			this.mins = diffDuration.minutes()
			this.secs = diffDuration.seconds()
		},
		// countStart() {
		// 	const currentTime = moment(new Date()).format()
		// 	const diffDuration = moment.duration(
		// 		moment(this.startTime).diff(currentTime)
		// 	)
		// 	this.days = diffDuration.days()
		// 	this.hours = diffDuration.hours()
		// 	this.mins = diffDuration.minutes()
		// 	this.secs = diffDuration.seconds()
		// },
		// countEnd() {
		// 	const currentTime = moment(new Date()).format()
		// 	const diffDuration = moment.duration(
		// 		moment(this.endTime).diff(currentTime)
		// 	)
		// 	this.days = Math.floor(diffDuration.asDays())
		// 	this.hours = diffDuration.hours()
		// 	this.mins = diffDuration.minutes()
		// 	this.secs = diffDuration.seconds()
		// },
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
			color: #ffd041;
		}
	}
}

@include media-max($media_small) {
	.wrap-status {
		display: block;
	}
}
</style>
