<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div>
						<div class="frm_auth frm_signin form">
							<BaseButton
								type="button"
								class="closebtn"
								@click="closePopup"
							>
							</BaseButton>

							<div class="welcome">SIGN UP</div>
							<div class="popup-title">Sigup with</div>

							<BaseButton
								type="button"
								class="connectbtn g-btn"
								@click="data.sinUpWith('sinUpWith-Metamask')"
							>
								Metamask
							</BaseButton>

							<BaseButton
								type="button"
								class="connectbtn g-btn"
								@click="
									data.sinUpWith('sinUpWith-walletConnect')
								"
							>
								WalletConnect
							</BaseButton>
							<BaseButton
								type="button"
								class="connectbtn g-btn"
								@click="
									data.sinUpWith('sinUpWith-coinbase')
								"
							>
								CoinBase
							</BaseButton>
							<BaseButton
								type="button"
								class="connectbtn g-btn"
								@click="
									data.sinUpWith('sinUpWith-fortmatic')
								"
							>
								Fortmatic
							</BaseButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	mounted() {},
	data() {},
	props: {
		data: Object,
	},
	methods: {
		closePopup() {
			this.$store.dispatch('showSelectWalletPopup', false)
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
			width: 520px;
			min-height: 300px;
			margin: 0px auto;
			background-color: #fff;
			border-radius: 20px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
			transition: all 0.3s ease;
			font-family: Helvetica, Arial, sans-serif;
		}
	}
}

.form {
	@include FLEXV(flex-start,center);
	width: 100%;
	height: gREm(450);
	.closebtn {
		@include SetBgImage(url('../assets/img/ic-closed-popup.svg'));
		width: gREm(40);
		height: gREm(40);
		margin-top: gREm(-51);
		margin-bottom: gREm(-18);
		cursor: pointer;
		@include OnOverTransition();
	}
	.welcome {
		height: gREm(18);
		width: 100%;
		margin-top: gREm(50);
		text-align: center;
		@include Set-Font($AppFont, gREm(14), gREm(24), #0d0c22);
	}
	.popup-title {
		height: gREm(29);
		width: 100%;
		margin-top: gREm(8);
		text-align: center;
		@include Set-Font($AppFont, gREm(24), gREm(24), #0d0c22, 600);
		white-space: break-spaces;
		height: auto;
	}
	.connectbtn {
		margin-top: gREm(30);
		width: gREm(300);
		height: gREm(60);
		border-radius: 6px;
		@include Set-Font($AppFont, gREm(18), gREm(22), #ffffff);
		@include OnOverTransition();
	}
}

@include media-max($media_small) {
	.modal-mask {
		.modal-wrapper {
			padding: 0 gREm(20);
			.modal-container {
				width: 100%;
			}
		}
	}
}
</style>
