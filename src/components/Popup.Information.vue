<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div class="modal-header">
						<div class="modal-title">{{ data.title }}</div>
						<button class="modal-close-btn">
							<img
								src="../assets/img/Close.svg"
								alt="close"
								@click="closePopup"
							/>
						</button>
					</div>
					<component
						:sideMenu="data.dataComponent"
						:is="data.component"
					></component>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	components: {},
	mounted() {},
	computed: {},
	data() {},
	props: {
		data: Object,
	},
	created() {},
	methods: {
		closePopup() {
			this.mxCloseInfoModal()
		},
	},
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
		display: table-cell;
		vertical-align: middle;

		.modal-container {
			background: #1d175c;
			border-radius: gREm(20) gREm(20) 0px 0px;
			margin: 0px auto;
			padding: gREm(32) gREm(20);
			transition: all 0.3s ease;
			font-family: Montserrat, sans-serif;
			position: absolute;
			bottom: 0;
			width: 100%;

			.modal-header {
				display: flex;
				justify-content: space-between;
				margin-bottom: gREm(32);

				.modal-title {
					@include Set-Font($AppFont, gEm(22), 2, #ffffff, 600);
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
