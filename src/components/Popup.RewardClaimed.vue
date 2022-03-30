<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div class="modal-content">
						<div class="modal-title">Rewards have been claimed</div>
						<span class="modal-noti">
							The listed rewards/boxes have been transferred to your wallet. 
							<br />
							<br />
							You can check your rewards and use them or reveal their content in the “My NFTs” section.
						</span>
					</div>
					<div class="btn" @click="mxCloseRewardClaimed">OK</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.modal-mask {
	position: absolute;
	z-index: $Z-INDEX-CLAIMED-POPUP;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	transition: opacity 0.5s ease;

	.modal-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;

		.modal-container {
			background: #181721;
			border-radius: gREm(10);
			padding: gREm(30) gREm(30) gREm(24.21) gREm(30);
			transition: all 0.3s ease;
			font-family: Montserrat, sans-serif;
			width: 100%;
			overflow-y: auto;
			max-width: gREm(712);

			.modal-content {
				padding: gREm(5);
				margin-bottom: gREm(30);

				.modal-title {
					@include Set-Font($AppFont, gEm(28), auto, #ffffff, 600);
					white-space: pre-wrap;
					margin-bottom: gREm(30);
					line-height: gREm(20);
				}
				.modal-noti {
					font-size: 16px;
					line-height: 24px;
				}
			}

			.btn {
				background-color: #f6583e;
				border-radius: gREm(13.2258);
				padding: gREm(6) 0;
				width: 100%;
				font-family: $AppFont;
				font-size: gREm(21.16);
				line-height: gREm(29.63);
				text-align: center;
				cursor: pointer;
			}
		}
	}
}
</style>
