<template>
	<div v-if="!isMobile" class="tab-wrap">
		<div class="tab-heading active">Campaigns</div>
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
		<div class="tab-heading">My NFTs</div>
	</div>
	<div v-else class="tab-wrap">
		<div class="select-wrap">
			<div class="tab-campain">
				<div class="tab-heading active" @click="showDropdown">
					Campaigns
					<img
						id="arrow"
						class="ic-filter"
						src="../assets/img/ic-arrow-down.svg"
					/>
				</div>
				<div v-if="isShowDropdown" id="list">
					<div
						class="tab"
						:class="{ active: poolDuration.id === 1 }"
						@click="setPool(1)"
					>
						30-day pool
					</div>
					<div
						class="tab"
						:class="{ active: poolDuration.id === 2 }"
						@click="setPool(2)"
					>
						90-day pool
					</div>
					<div
						class="tab"
						:class="{ active: poolDuration.id === 3 }"
						@click="setPool(3)"
					>
						180-day pool
					</div>
				</div>
			</div>
			<div class="tab-nft">
				<div class="tab-heading active">My NFTs</div>
			</div>
		</div>
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
			isShowDropdown: false,
		}
	},
	mounted() {
		this.checkMobile()
		window.addEventListener('mousedown', this.closeList)
	},
	beforeUnmount() {
		window.removeEventListener('mousedown', this.closeList)
	},
	methods: {
		setPoolDuration(value) {
			this.$emit('updatePoolId', value)
			// this.poolDuration.id = +value
		},
		checkMobile() {
			this.isMobile = window.matchMedia('(max-width: 768px)').matches
		},
		showDropdown() {
			this.isShowDropdown = !this.isShowDropdown
		},
		closeList(e) {
			if (this.isShowDropdown && !e.target.closest('#list')) {
				this.isShowDropdown = false
			}
		},
		setPool(id) {
			this.setPoolDuration(id)
			this.isShowDropdown = false
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
		display: flex;
		align-items: center;
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
				content: '';
				width: 4px;
				height: 42px;
				left: -4px;
				top: 0px;
				background: #2a2932;
			}
			&.active::before {
				background: #f6583e;
			}
		}
		& .tab + .tab {
			margin-top: gREm(4);
		}
	}
}

@include media-max($media_small) {
	.tab-wrap {
		width: initial;
		max-width: initial;
	}
	.select-wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: gREm(10);
		padding: 0 gREm(20) gREm(32);
		font-family: Montserrat, sans-serif;

		.tab-campain {
			position: relative;

			#list {
				position: absolute;
				top: 100%;
				right: 0;
				border-radius: 6px;
				z-index: 50;
				width: 100%;
				background: #2a2932;

				.tab {
					font-family: $AppFont;
					font-size: gREm(16);
					line-height: gREm(24);
					text-align: center;
					color: #fff;
					padding: 4px 8px;
					cursor: pointer;
					position: relative;

					&::before {
						position: absolute;
						content: '';
						width: 3px;
						height: 100%;
						left: 0px;
						top: 0px;
						background: transparent;
					}
					&.active::before {
						background: #f6583e;
					}
				}
			}
		}
		.tab-heading {
			border-radius: gREm(10);
			margin-bottom: gREm(4);
			padding: gREm(11) gREm(20);
			font-weight: bold;
			flex: 1;
			&.active {
				background: #2a2932;
			}
		}
	}
}
</style>
