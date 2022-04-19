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

							<div class="welcome">Sign Up</div>
							<div class="popup-title">Signup with</div>

							<BaseButton
								type="button"
								class="connectbtn metamask-btn"
								@click="data.sinUpWith('sinUpWith-Metamask')"
							>
								<img src="../assets/img/ic-metamask.svg" alt="" class="ic-image">
								Metamask
							</BaseButton>

							<BaseButton
								type="button"
								class="connectbtn walletconnect-btn"
								@click="
									data.sinUpWith('sinUpWith-walletConnect')
								"
							>
								<img src="../assets/img/ic-walletconnect.svg" alt="" class="ic-image">
								WalletConnect
							</BaseButton>
							<!-- <BaseButton
								type="button"
								class="connectbtn coinbase-btn"
								@click="
									data.sinUpWith('sinUpWith-coinbase')
								"
							>
								<img src="../assets/img/ic-coinbase.svg" alt="" class="ic-image">
								CoinBase
							</BaseButton> -->
							<BaseButton
								type="button"
								class="connectbtn fortmatic-btn"
								@click="
									data.sinUpWith('sinUpWith-fortmatic')
								"
							>
								<img src="../assets/img/ic-fortmatic.svg" alt="" class="ic-image">
								Fortmatic
							</BaseButton>
							<BaseButton
								type="button"
								class="connectbtn bitski-btn"
								@click="
									data.sinUpWith('sinUpWith-bitski')
								"
							>
								<img src="../assets/img/ic-bitski.png" alt="" class="ic-image">
								Bitski
							</BaseButton>
							<div class="signup-box">
								<div class="signup-box-wrap">
									<div class="notamember" >{{$t('login.popup.already-have-account')}}</div>
									<div
										class="signup-msg"
										@click="login"
									>
										{{$t('login.popup.login')}}
									</div>
								</div>
							</div>
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
		login() {
			this.isShowNavbar = false
			this.$store.dispatch('showSelectWalletPopup', false)
			this.$store.dispatch('showLoginPopup',true);
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
	@include FLEXV(flex-start, center);
	width: 100%;
	height: auto;
	.closebtn {
		@include SetBgImage(url('../assets/img/close-popup.svg'));
		width: gREm(18);
		height: gREm(18);
		cursor: pointer;
		@include OnOverTransition();
		position: absolute;
		top: gREm(27);
		right: gREm(29);
	}

	.signup-box {
		margin-top: gREm(16);
		margin-bottom: gREm(50);
		width: 100%;
		max-width: gREm(324);
		text-align: left;
		.signup-box-wrap {
			width: 100%;
			height: auto;
			@include FLEX(flex-start,center);

			.notamember {
				width: auto;
				@include Set-Font($AppFont, gREm(14), gREm(22), #6a6a6a);
			}

			.signup-msg {
				width: auto;
				margin-left: gREm(7);
				cursor: pointer;
				@include Set-Font($AppFont, gREm(14), gREm(22), #6C38EF, 500);
				&:hover {
					text-decoration-line: underline;
				}
			}

		}
	}

	.login-btn {
		width: 100%;
		max-width: gREm(324);
		padding: gREm(17) 0;
		height: auto;
		background: linear-gradient(85.48deg, #9f52ff 0%, #3504ff 99.18%);
		border-radius: 10px;
		font-family: $AppFont;
		font-size: gREm(14);
		line-height: gREm(22);
		font-weight: 700;
		text-align: center;
		cursor: pointer;
	}

	.agree-policy {
		margin-top: gREm(17);
		margin-bottom: gREm(24);
		width: 100%;
		max-width: gREm(324);
		display: flex;
		align-items: center;

		.label {
			display: block;
			position: relative;
			cursor: pointer;
			padding-left: gREm(30);
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
			@include Set-Font($AppFont, gREm(14), gREm(22), #0d0c22);

			input {
				position: absolute;
				opacity: 0;
				cursor: pointer;
				height: 0;
				width: 0;
			}

			.checkmark {
				position: absolute;
				top: 0;
				left: 0;
				height: gREm(22);
				width: gREm(22);
				border-radius: gREm(5);
				border: 1px solid #000;

				&::after {
					content: '';
					position: absolute;
					display: none;
					left: gREm(8);
					top: gREm(4);
					width: gREm(4);
					height: gREm(9);
					border: solid white;
					border-width: 0 gREm(2) gREm(2) 0;
					-webkit-transform: rotate(45deg);
					-ms-transform: rotate(45deg);
					transform: rotate(45deg);
				}
			}
		}

		input:checked ~ .checkmark {
			background-color: #6C38EF;
			border: none;
		}

		input:checked ~ .checkmark:after {
			display: block;
		}
	}
	.welcome {
		height: auto;
		width: 100%;
		margin-top: gREm(50);
		text-align: center;
		@include Set-Font($AppFont, gREm(14), gREm(24), #0d0c22);
	}
	.popup-title {
		height: gREm(29);
		width: 100%;
		margin-bottom: gREm(12);
		text-align: center;
		@include Set-Font($AppFont, gREm(28), gREm(38), #181721, 600);
		white-space: break-spaces;
		height: auto;
	}
	.connectbtn {
		padding-left: gREm(75);
		margin-top: gREm(10);
		width: gREm(324);
		height: gREm(64);
		@include Set-Font($AppFont, gREm(18), gREm(26), none);
		@include OnOverTransition();
		border-radius: gREm(6);

		& .ic-image {
			margin-right: gREm(15);
			max-width: 28px;
			max-height: 28px;
		}
		&:hover {
			transform: translateY(-2px);
		}
	}
}

@include media-max($media_small) {
	.modal-mask {
		.modal-wrapper {
			padding: 0 gREm(20);
			.modal-container {
				width: 90vw;
				padding: 0 gREm(20);

				.form {

					.connectbtn {
						width: 100%;
						max-width: gREm(324);
					}
				}
			}
		}
	}
}
</style>
