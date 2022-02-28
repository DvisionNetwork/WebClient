<template>
	<div v-if="!isMobile" class="tab-menu">
		<div
			class="tab"
			:class="{ active: poolDuration.id === 1 }"
			@click="setPoolDuration(1)"
		>
			30 days
		</div>
		<div
			class="tab"
			:class="{ active: poolDuration.id === 2 }"
			@click="setPoolDuration(2)"
		>
			60 days
		</div>
		<div
			class="tab"
			:class="{ active: poolDuration.id === 3 }"
			@click="setPoolDuration(3)"
		>
			90 days
		</div>
	</div>
	<div v-else class="select-tab">
		<select @change="setPoolDuration($event.target.value)" name="tab">
			<option v-for="item in listId" :value="item.id" :key="item.id">
				{{ item.name }}
			</option>
		</select>
	</div>
</template>

<script>
export default {
	name: 'StakingTab',

	props: {
		poolDuration: {
			type: Object,
		},
	},
	data() {
		return {
			// duration: this.poolDuration
			isMobile: false,
			listId: [
				{
					id: 1,
					name: '30 days',
				},
				{
					id: 2,
					name: '60 days',
				},
				{
					id: 3,
					name: '90 days',
				},
			],
		}
	},
	mounted() {
		this.checkMobile()
	},
	methods: {
		setPoolDuration: function (value) {
			this.poolDuration.id = +value;
		},
		checkMobile() {
			this.isMobile = window.matchMedia('(max-width: 768px)').matches
		},
	},
}
</script>

<style lang="scss" scoped>
.tab-menu {
	width: 100%;
	max-width: gREm(216);
	font-family: Montserrat, sans-serif;
	& .tab {
		border-radius: gREm(10);
		margin-bottom: gREm(9);
		padding: gREm(11) gREm(20);
		cursor: pointer;
		&.active,
		&:hover {
			background: #2a2932;
		}
	}
}

@include media-max($media_small) {
	.select-tab {
		text-align: right;
		padding: 0 gREm(20) gREm(32);
		select {
			font-size: gREm(16);
			line-height: gREm(24);
			color: #F6583E;
			font-family: $AppFont;
		}
	}
}
</style>
