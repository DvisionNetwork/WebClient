<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
					<div class="modal-container">
						<div>
							<form
								class="frm_auth frm_signin form"
							>
								<BaseButton
									type="button"
									class="closebtn"
									@click="closePopup"
								>
								</BaseButton>

								<BaseButton
									type="button"
									class="imgbtn"
									@click="moveTo"
								>
								</BaseButton>

							</form>
						</div>
					</div>
			</div>
		</div>
	</transition>
</template>

<script>

export default {
	data() {
		return {
		}
	},
	props: {
	},
	methods: {
		closePopup() {
			this.$store.dispatch('showEventPopup',false);
		},

		moveTo() {
			window.open('http://www.dvision.events/');
		},
	}
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
			width: 960px;
			height: 600px;
			margin: 0px auto;
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
	height: gREm(507);
	.closebtn {
		@include SetBgImage(url('../assets/img/ic-closed-popup.svg'));
		width : gREm(40);
		height: gREm(40);
		margin-top:gREm(-51);
		margin-bottom:gREm(10);
		cursor: pointer;
		@include OnOverTransition();
	}
	.imgbtn {
		@include SetBgImage(url('../assets/img/popup/bsc_poster.png'));			
		width : gREm(960);
		height: gREm(507);
		border-radius: 20px;
		cursor: pointer;
	}
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.5s ease;
}

// .modal-enter {
//   opacity: 0;
// }

.modal-leave-active {
	opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}
</style>
