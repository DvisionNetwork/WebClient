<template>
	<div class="tab-menu">
		<div
			class="tab"
			:class="{ active: tab_left === 1 }"
			@click="tab_left = 1"
		>
			30 days
		</div>
		<div
			class="tab"
			:class="{ active: tab_left === 2 }"
			@click="tab_left = 2"
		>
			60 days
		</div>
		<div
			class="tab"
			:class="{ active: tab_left === 3 }"
			@click="tab_left = 3"
		>
			90 days
		</div>
	</div>
</template>

<script>
export default {
	name: 'StakingTab',
	props: {

	},
	data() {
		return {
			tab_left: 1,
		}
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
