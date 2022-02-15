<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div
					class="modal-container"
					:style="{ width: data.width }"
				>
					<div class="title">{{ data.title }}</div>
					<div class="desc" v-html="data.content"></div>
					<div class="btn-bottom">
						<div class="btn-confirm" @click="data.onClick">
							{{ data.buttonTxt }}
						</div>
						<div class="btn-cancel" @click="closePopup">
							Cancel
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import AppConfig from '@/App.Config.js'
var gConfig = AppConfig()

export default {
	components: {},
	mounted() {
		// this.popType = authInfo.type;
	},
	computed: {},
	data() {},
	props: {
		data: Object,
	},
	created() {
		console.log('obj', this.obj)
	},
	methods: {
		closePopup() {
			this.mxCloseConfirmModal()
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
			background: #181721;
			border-radius: 10px;
			max-width: 90vw;
			margin: 0px auto;
			padding: 35px 30px 24px;
			transition: all 0.3s ease;
			font-family: Montserrat, sans-serif;
			& .title {
				font-size: gREm(28);
				line-height: gREm(19);
				font-weight: 800;
				margin-bottom: gREm(30);
			}
			& .desc {
				font-family: Montserrat, sans-serif;
				font-size: gREm(16);
				font-style: normal;
				font-weight: 400;
				line-height: gREm(22);
				letter-spacing: 0em;
				text-align: left;
			}
			& .btn-bottom {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 10px;
				margin-top: gREm(34);
				& .btn-confirm {
					width: 50%;
					height: gREm(41);
					font-family: Montserrat, sans-serif;
					font-size: gREm(16);
					font-style: normal;
					font-weight: 400;
					line-height: gREm(30);
					letter-spacing: 0em;
					text-align: center;
					color: #f6583e;
					border:1px solid #f6583e;
					border-radius: gREm(10);
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					&:hover {
						background: #db4028;
						color: #ffffff;
					}
				}
				& .btn-cancel {
					width: 50%;
					height: gREm(41);
					font-family: Montserrat, sans-serif;
					font-size: gREm(16);
					font-style: normal;
					font-weight: 400;
					line-height: gREm(30);
					letter-spacing: 0em;
					text-align: center;
					background: #f6583e;
					border-radius: gREm(10);
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					&:hover {
						background: #db4028;
					}
				}
			}
		}
	}
}
</style>
