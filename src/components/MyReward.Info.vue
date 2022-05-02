<template>
	<div class="info">
		<div class="info-body">
			<div class="has-data" v-if="data.length > 0">
				<div class="list-card">
					<div class="land-card" v-for="(item, idx) in data" :key="idx">
						<div class="image">
							<img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" />
							<img v-else src="../assets/img/default.png" :alt="item.name" />
						</div>
						<div class="card-title">
							{{ getName(item.boxType) }}
						</div>
						<div class="line" />
						<div class="bottom">
							<span class="left">Quantity</span>
							<span>{{ item.amount }}</span>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="no-rewards-wrap">
				<div class="no-rewards" v-if="selectedIndex === 0">
					No rewards available.
					<br />
					You can stake your LANDs to see the corresponding rewards in this tab.
				</div>
				<div class="no-rewards" v-if="selectedIndex === 1">
					No rewards available. 
					<br />
					The rewards here will be available after the campaign ends.
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	components: {},
	mounted() {},
	computed: {},
	data() {
		return {
			isOnGoing: true,
		}
	},
	props: {
		data: Object,
		selectedIndex: Number
	},
	created() {},
	methods: {
		getName(boxType) {
			switch (boxType) {
				case 1: return 'Ramdom Box A'
				case 2: return 'Ramdom Box B'
				case 3: return 'Ramdom Box C'
				case 4: return 'Ramdom Box D'
				case 5: return 'Ramdom Box E'
				case 6: return 'Ramdom Box F'
				case 7: return 'Ramdom Box G'
				case 8: return 'Ramdom Building A'
				case 9: return 'Ramdom Building B'
				default: return ''
			}
		}
	},
}
</script>

<style lang="scss" scoped>
.info {
	&-body {
		overflow-y: auto;
		max-height: gREm(430);

		.list-card {
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			flex-wrap: wrap;
			gap: gREm(20) gREm(10);
			margin-bottom: gREm(20);

			.land-card {
				border-radius: gREm(10);
				border: 2px solid #d6d8dc;
				width: 100%;
				max-width: gREm(282);
				padding: gREm(15) gREm(20);
				position: relative;
					
				.image {
					width: gREm(240);
					height: gREm(285);
					position: relative;
					& img {
						width: 100%;
						height: 100%;
						object-fit: cover;
						border-radius: 3px;
					}
				}

				.card-title {
					font-family: Montserrat, sans-serif;
					font-weight: 400;
					font-size: gREm(16);
					line-height: gREm(25);
					color: #ffffff;
					text-overflow: ellipsis;
					-webkit-line-clamp: 2;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					overflow: hidden;
					text-overflow: ellipsis;
					margin-bottom: gREm(8);
					margin-top: gREm(8);
				}
				.line {
					background: #ffffff14;
					width: 100%;
					height: 1px;
					margin-bottom: gREm(3);
					margin-top: gREm(3);
				}

				.bottom {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: gREm(8);

					span {
						font-size: gREm(12);
						line-height: gREm(16);
						font-family: Montserrat, sans-serif;
						&.left {
							color: #ffffff66;
							line-height: gREm(17);
						}
					}
				}
			}
		}
		.no-rewards-wrap {
			display: flex;
			justify-content: center;
			align-items: center;
			height: gREm(400);
			
			.no-rewards {
				text-align: center;
			}
		}
	}
}

@include media-max($media_small) {
	.info {
		.info-body {
			.list-card {
				justify-content: center;
				gap: gREm(36);
			}
		}
	}
}
</style>
