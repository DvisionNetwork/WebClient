<template>
	<div class="info">
		<div class="info-body">
			<table class="table">
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
			</table>
		</div>
	</div>
</template>

<script>
export default {
	components: {},
	computed: {},
	data() {
		return {
			isOnGoing: true,
		}
	},
	props: {
		data: Object,
	},
	methods: {},
}
</script>

<style lang="scss" scoped>
.info {
	&-body {
		overflow-y: auto;
		max-height: gREm(400);
		.table {
			width: 100%;
			border-collapse: collapse;

			.no-rewards {
				text-align: center;
				height: gREm(400);
			}

			th,
			td {
				text-align: left;
				padding: gREm(14);
			}

			th {
				color: #825298;
				font-size: gREm(18);
				font-weight: 700;
				position: sticky;
				top: 0;
				z-index: 1;
				background-color: #181721;
			}
		}
	}
}
</style>
