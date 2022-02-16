<template>
	<div class="tab-menu">
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
			this.poolDuration.id = value
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
</style>
