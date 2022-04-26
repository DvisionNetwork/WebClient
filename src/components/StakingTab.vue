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
		<div class="select-wrap" @click="showDropdown">
			<div class="selected" v-if="poolDuration.id === 1">30-day pool</div>
			<div class="selected" v-if="poolDuration.id === 2">90-day pool</div>
			<div class="selected" v-if="poolDuration.id === 3">180-day pool</div>
			<div v-if="isShowDropdown" id="list">
				<div class="item"
					v-for="item in listId"
					:key="item.id"
					@click="setPoolDuration(item.id)"
				>
					{{ item.name }}
				</div>
			</div>
		</div>
		<img src="../assets/img/arrow-dropdown.svg" alt="dropdown" class="icon">
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
			isShowDropdown: false
		}
	},
	mounted() {
		this.checkMobile()
		window.addEventListener('mousedown', this.closeList)
	},
	beforeDestroy() {
		 window.removeEventListener('mousedown', this.closeList)
	},
	methods: {
		setPoolDuration: function (value) {
			this.poolDuration.id = +value;
		},
		checkMobile() {
			this.isMobile = window.matchMedia('(max-width: 768px)').matches
		},
		showDropdown() {
			this.isShowDropdown = !this.isShowDropdown
		},
		closeList(e) {
			if(this.isShowDropdown && !e.target.closest('#list')) {
				this.isShowDropdown = false
			}
		}
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
		

		.select-wrap {
			position: relative;

			.selected {
				font-size: gREm(16);
				line-height: gREm(24);
				color: #F6583E;
				font-family: $AppFont;
				-webkit-appearance: none;
				cursor: pointer;
				padding: 4px 20px;
			}
			#list {
				position: absolute;
				top: 100%;
				right: 0;
				border-radius: 6px;
				background: #fff;
				z-index: 50;
				width: 100%;

				.item {
					font-family: $AppFont;
					font-size: gREm(16);
					line-height: gREm(24);
					text-align: center;
					color: #191721;
					padding: 4px 8px;
					cursor: pointer;
				}
			}
		}
		.icon {
			margin-left: -15px;
		}
	}
}
</style>
