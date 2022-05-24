<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div class="modal-header">
						<div class="modal-title">Reward table ({{ data.day }}-day pool)
						</div>
					</div>
					<div class="modal-description">
						Staking a LAND (or multiple LANDs) will yield rewards
						corresponding to that LAND type as described in the
						table below. The more LANDs you stake, the more rewards
						you will receive.
					</div>
					<div class="modal-body">
						<table cellspacing="0" class="table">
							<thead>
								<tr>
									<th>Pool</th>
									<th>LAND type</th>
									<th>Reward</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="ele in data.info" :key="ele.reward">
									<td
										class="first-td"
										:rowspan="data.info.length"
									>
										{{ data.day }}-day
									</td>
									<td>{{ ele.land }}</td>
									<td>{{ ele.reward }}</td>
								</tr>
							</tbody>
						</table>
						<div class="btn-wrapper">
							<button
								@click="mxCloseRewardTable"
								class="btn btn-primary"
							>
								OK
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	components: {},
	computed: {},
	props: {
		data: Object,
	},
	methods: {},
}
</script>

<style lang="scss" scoped>
.modal-mask {
	position: absolute;
	z-index: $Z-INDEX-LOGIN-POPUP;
	// margin-top: 224px;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: table;
	transition: opacity 0.5s ease;

	.modal-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;

		.modal-container {
			background: #181721;
			border-radius: gREm(10);
			margin: 0px auto;
			padding: gREm(32) gREm(28);
			transition: all 0.3s ease;
			font-family: Montserrat, sans-serif;
			position: absolute;
			width: 100%;
			max-height: 100vh;
			overflow-y: auto;
			max-width: gREm(801);

			.modal-header {
				display: flex;
				justify-content: space-between;
				margin-bottom: gREm(24);

				.modal-title {
					@include Set-Font($AppFont, gEm(28), auto, #ffffff, 600);
					white-space: pre-wrap;
				}
			}

			.modal-description {
				margin-bottom: gREm(19);
			}

			.modal-body {
				.table {
					width: 100%;
					box-sizing: border-box;

					td,
					th {
						border: 1px solid #d6d8dc;
						text-align: center;
						padding: gREm(10) 0;
					}
					tbody {
						tr {
							.first-td {
								display: none;
							}
							&:first-child {
								.first-td {
									display: table-cell;
								}
							}
						}
					}
				}
			}

			.btn-wrapper {
				margin-top: gREm(24);
				text-align: right;
				.btn {
					background-color: #f6583e;
					border-radius: gREm(13.2258);
					padding: gREm(6) 0;
					max-width: gREm(180);
					width: 100%;
					font-family: $AppFont;
					font-size: gREm(16);
					line-height: gREm(29.63);
				}
			}

			& .title {
				font-size: gREm(28);
				line-height: gREm(19);
				font-weight: 800;
				margin-bottom: gREm(30);
			}
		}
	}
}
</style>
