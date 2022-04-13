<template>
	<div v-if="!isMobile" class="tab-wrap">
		<div class="tab-heading active">
			Campaigns
		</div>
		<div class="tab-menu">
			<div
				class="tab"
				:class="{ active: poolDuration.id === 1 }"
				@click="setPoolDuration(1)"
			>
				30-day pool
			</div>
			<div
				class="tab"
				:class="{ active: poolDuration.id === 2 }"
				@click="setPoolDuration(2)"
			>
				90-day pool
			</div>
			<div
				class="tab"
				:class="{ active: poolDuration.id === 3 }"
				@click="setPoolDuration(3)"
			>
				180-day pool
			</div>
		</div>
		<div class="tab-heading">
			My NFTs
		</div>
	</div>
	<div v-else class="select-tab">
		<select @change="setPoolDuration($event.target.value)" name="tab">
			<option v-for="item in listId" :value="item.id" :key="item.id">
				{{ item.name }}
			</option>
		</select>
		<img src="../assets/img/arrow-dropdown.svg" alt="dropdown">
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
					name: '30-day pool',
				},
				{
					id: 2,
					name: '90-day pool',
				},
				{
					id: 3,
					name: '180-day pool',
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
.tab-wrap {
	width: 100%;
	max-width: gREm(216);
	font-family: Montserrat, sans-serif;
	.tab-heading {
		border-radius: gREm(10);
		margin-bottom: gREm(4);
		padding: gREm(11) gREm(20);
		font-weight: bold;
		&.active {
			background: #2a2932;
		}
	}
	.tab-menu {
		width: 100%;
		max-width: gREm(186);
		margin-bottom: gREm(4);
		margin-left: auto;
		font-weight: 400;
		& .tab {
			border-radius: gREm(0) gREm(10) gREm(10) gREm(0);
			padding: gREm(11) gREm(20);
			height: 42px;
			cursor: pointer;
			position: relative;
			&.active,
			&:hover {
				background: #2a2932;
			}
			&::before {
				position: absolute;
				content: "";
				width: 4px;
				height: 42px;
				left: -4px;
				top: 0px;
				background: #2A2932;
			}
			&.active::before {
				background: #F6583E;
			}
		}
		& .tab + .tab {
			margin-top: gREm(4);
		}
	}
}

@include media-max($media_small) {
	.select-tab {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: gREm(10);
		padding: 0 gREm(20) gREm(32);
		select {
			font-size: gREm(16);
			line-height: gREm(24);
			color: #F6583E;
			font-family: $AppFont;
    	-webkit-appearance: none;
		}
	}
}
</style>
