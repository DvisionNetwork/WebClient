<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div class="title">Select quantity</div>
					<div class="desc">Quantity of the selected LAND: 5</div>
					<div class="box-image">
						<img src="../assets/img/image4.png" alt="" />
						<div>Dvision LAND: Gangnam-Daero Intersection 3x3</div>
					</div>
					<div class="box-math">
						<div class="min-max" @click="quantity = minQuantity">
							Min
						</div>
						<div class="input-box">
							<img
								class="icon-minus"
								src="../assets/img/ic-minus.svg"
								@click="handleMinus"
							/>

							<input type="text" :value="quantity" />
							<img
								class="icon-plus"
								src="../assets/img/ic-plus.svg"
								@click="handlePlus"
							/>
						</div>
						<div class="min-max" @click="quantity = maxQuantity">Max</div>
					</div>
					<div class="btn-bottom">
						<div class="btn-cancel" @click="onCancel">Cancel</div>
						<div class="btn-confirm" @click="onClick">Confirm</div>
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
	data() {
		return {
			quantity: 1,
			minQuantity: 1,
			maxQuantity: 5,
		}
	},
	props: {
		onClick: Function,
		onCancel: Function,
	},
	methods: {
		closePopup() {
			this.mxCloseSuccessModal()
		},
		handlePlus() {
			if (this.quantity >= this.maxQuantity) {
				this.quantity = this.maxQuantity
			} else {
				this.quantity = this.quantity + 1
			}
		},
		handleMinus() {
			if (this.quantity <= 1) {
				this.quantity = 1
			} else {
				this.quantity = this.quantity - 1
			}
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
			width: gREm(506);
			height: gREm(609);
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
			& .box-image {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				padding: gREm(15) 0 gREm(20);
				& img {
					width: gREm(240);
					height: gREm(285);
					margin-bottom: gREm(9);
				}
				& div {
					width: gREm(240);
					line-height: gREm(22.4);
					font-size: gREm(14);
				}
			}
			& .box-math {
				width: 100%;
				height: gREm(32);
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 10px;
				& .min-max {
					width: gREm(62);
					height: 100%;
					background: #f6583e;
					border-radius: 10px;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: 400;
					font-size: gREm(16);
					cursor: pointer;
				}
				& .input-box {
					width: gREm(168);
					height: gREm(32);
					display: flex;
					align-items: center;
					justify-content: space-between;
					& input {
						width: 92px;
						background: #ffffff;
						height: 100%;
						color: #000000;
						font-size: gREm(20);
						line-height: gREm(12);
						text-align: center;
						font-weight: 600;
					}
					& .icon-minus {
						background: #f6583e;
						width: 40px;
						height: 100%;
						border-top-left-radius: 10px;
						border-bottom-left-radius: 10px;
						cursor: pointer;
					}
					& .icon-plus {
						background: #f6583e;
						width: 40px;
						height: 100%;
						border-top-right-radius: 10px;
						border-bottom-right-radius: 10px;
						cursor: pointer;
					}
				}
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
					background: #f6583e;
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
					color: #f6583e;
					border: 1px solid #f6583e;
					text-align: center;
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
			}
		}
	}
}
</style>
