<template>
	<div class="tab-menu">
		<div
			class="tab"
			:class="{ active: poolDuration.data === 30 }"
			@click="setPoolDuration(30)"
		>
			30 days
		</div>
		<div
			class="tab"
			:class="{ active: poolDuration.data === 60 }"
			@click="setPoolDuration(60)"
		>
			60 days
		</div>
		<div
			class="tab"
			:class="{ active: poolDuration.data === 90 }"
			@click="setPoolDuration(90)"
		>
			90 days
		</div>
	</div>
</template>

<script>
export default {
	name: 'StakingTab',
	
	props: {
		poolDuration:{
			type: Object
		}
	},
	data() {
		return{
			// duration: this.poolDuration
		}
	},
	
	methods: {
		setPoolDuration: function (value) {
			this.poolDuration.data = value
		},
	},
}
</script>

<style lang="scss" scoped>
.tab-menu {
	width: 100%;
	max-width: gREm(216);
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
</style>
