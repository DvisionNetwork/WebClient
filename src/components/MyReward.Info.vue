<template>
	<div class="info">
		<div class="info-body">
			<!-- <table class="table">
				<thead>
					<tr>
						<th width="16%">ID</th>
						<th>Name</th>
						<th width="19%">Quantity</th>
					</tr>
				</thead>
				<tbody class="has-data" v-if="data">
					<tr v-for="item in data" :key="item.id">
						<td>{{ item.id }}</td>
						<td>{{ item.name }}</td>
						<td>{{ item.quantity }}</td>
					</tr>
				</tbody>
				<tr v-else>
					<td colspan="3" class="no-rewards">
						No rewards available.
						<br />
						You can stake your LANDs to see the corresponding
						rewards in this tab.
					</td>
				</tr>
			</table> -->
			<div class="has-data" v-if="data">
				<div class="list-card">
					<div class="land-card" v-for="item in data" :key="item.id">
						<div class="image">
							<img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" />
							<img v-else src="../assets/img/default.png" :alt="item.name" />
						</div>
						<div class="card-title">
							{{ item.name }}
						</div>
						<div class="line" />
						<div class="bottom">
							<span class="left">Quantity</span>
							<span>{{ item.quantity }}</span>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="no-rewards">
				No rewards available.
				<br />
				You can stake your LANDs to see the corresponding
				rewards in this tab.
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
	},
	created() {},
	methods: {},
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
		// .table {
		// 	width: 100%;
		// 	border-collapse: collapse;

		// 	.no-rewards {
		// 		text-align: center;
		// 		height: gREm(400);
		// 	}

		// 	th,
		// 	td {
		// 		text-align: left;
		// 		padding: gREm(14);
		// 	}

		// 	th {
		// 		color: #825298;
		// 		font-size: gREm(18);
		// 		font-weight: 700;
		// 		position: sticky;
		// 		top: 0;
		// 		z-index: 1;
		// 		background-color: #181721;
		// 	}
		// }
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
