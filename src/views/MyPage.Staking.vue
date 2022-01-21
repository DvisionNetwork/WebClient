<template>
	<div class="side-menu">
		<SimpleSideMenu
			:sideMenu="stakingMenu"
			@selection-changed="onChangeSideMenu"
		/>
	</div>

	<div class="contents">
		<h2 class="title">Reward Pool</h2>
		<RewardBox />
		<div class="staked-land">
			<h2 class="">Staked LANDs</h2>
			<div class="unlock-lands">Unlock all LANDs</div>
		</div>
	</div>
</template>

<script>
import AppConfig from '@/App.Config.js'
import SimpleSideMenu from '@/components/SimpleSideMenu.vue'
import MapLand from '@/components/MapLand.vue'
import MapItem from '@/components/MapItem.vue'
import RewardBox from '@/components/RewardBox.vue'

var gConfig = AppConfig()
export default {
	name: 'staking',
	components: {
		SimpleSideMenu,
		MapLand,
		MapItem,
		RewardBox,
	},
	props: {
		tab_page: {
			type: String,
			default: 'staking',
		},
	},

	beforeMount() {
		console.log(
			'[Market.Land.vue] beforeMount(), route : ',
			this.$route,
			this.tab_page
		)
	},
	mounted() {},
	beforeUpdate() {},
	updated() {},
	data() {
		return {
			pages: [1],
			currentPage: 1,
		}
	},
	computed: {
		stakingMenu() {
			return [
				{ name: '30 days', mapId: '30d' },
				{ name: '60 days', mapId: '60d' },
				{ name: '90 days', mapId: '90d' },
			]
		},
	},
	watch: {},
	methods: {},
}
</script>

<style lang="scss" scoped>
.side-menu {
	width: gREm(216);
	height: auto;
	min-width: gREm(216);
}
.contents {
	padding-left: gREm(82);
	width: 100%;
	@include FLEXV(space-between, flex-start);
	.title {
		font-weight: 600;
		font-family: 'Montserrat';
		font-size: gREm(24);
		line-height: gREm(29);
		margin-bottom: gREm(25);
	}
	.staked-land {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: gREm(45);
		width: 100%;
		margin-bottom: gREm(17);
		.staked-title {
			font-family: 'Montserrat';
			font-size: gREm(24);
			font-style: normal;
			font-weight: 600;
			line-height: gREm(29);
			letter-spacing: 0em;
			text-align: left;
		}
		.unlock-lands {
			border-radius: gREm(10);
			height: gREm(45);
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 gREm(11);
			font-size: gREm(16);
			line-height: gREm(22);
			font-family: 'Montserrat';
			background: #5f5f5f;
		}
	}
}

@include media-max($media_large) {
	// 1200
	.contents {
	}
}

@include media-max($media_medium) {
	// 1024
	.contents {
	}
}
</style>
