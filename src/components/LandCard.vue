<template>
	<div class="land-card" :class="{ active: isActive }">
		<div class="image">
			<img src="../assets/img/image4.png" />
			<div v-if="isDisable" class="lock">
				<img
					v-if="isUnlock"
					src="../assets/img/ic-unlock.svg"
					class="unlock-img"
				/>
				<img
					v-if="!isUnlock"
					src="../assets/img/ic-lock.svg"
					class="lock-img"
				/>
				<span v-if="isUnlock" class="lock-desc"
					>Staking has ended.</span
				>
				<span v-if="!isUnlock" class="lock-desc"
					>Staking in progress</span
				>
				<div v-if="isUnlock" class="btn-unlock">Unlock</div>
			</div>
		</div>
		<div class="card-title">Dvision LAND: Gangnam-Daero Intersection</div>
		<div class="line" />
		<div class="bottom">
			<span class="left">Hash Rate</span>
			<span>4</span>
		</div>
		<div class="bottom">
			<span class="left">ID</span>
			<span>173656</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'LandCard',
	props: {
		name: String,
		hadHarvest: Boolean,
		value: String,
	},
	data() {
		return {
			isUnlock: false,
			isActive: false,
			isDisable: true,
		}
	},
	methods: {},
}
</script>

<style lang="scss" scoped>
.land-card {
	border-radius: gREm(10);
	border: 2px solid #d6d8dc;
	width: 100%;
	height: gREm(416);
	max-width: gREm(266);
	padding: gREm(15) gREm(20);
	&.active {
		background: #372e83;
	}
	.image {
		height: gREm(270);
		width: gREm(226);
		position: relative;
		& img {
			width: 100%;
			height: 100%;
			object-fit: cover;
      border-radius: 3px;
		}
		& .lock {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			background: #282727e5;
			z-index: 9;
			border-radius: gREm(3);
			width: 226px;
			& .unlock-img {
				width: 45px;
				height: 42px;
				position: absolute;
				top: gREm(90.5);
				left: 50%;
				transform: translate(-50%, -50%);
			}
			& .lock-img {
				width: 36px;
				height: 46px;
				position: absolute;
				top: gREm(90.5);
				left: 50%;
				transform: translate(-50%, -50%);
			}
			& .lock-desc {
				width: 100%;
				font-size: gREm(16);
				line-height: gREm(25);
				font-weight: 600;
				font-family: 'Montserrat';
				text-align: center;
				position: absolute;
				top: gREm(148);
				left: 50%;
				transform: translate(-50%, -50%);
			}
			& .btn-unlock {
				width: gREm(212);
				height: gREm(32);
				background: #f6583e;
				border-radius: gREm(10);
				padding: gREm(5);
				font-family: 'Montserrat';
				font-weight: 400;
				font-size: gREm(16);
				color: #ffffff;
				text-align: center;
				position: absolute;
				bottom: gREm(10);
				margin-left: gREm(7);
				cursor: pointer;
				&:hover {
					background: #ce351d;
				}
			}
		}
	}
	.card-title {
		font-family: 'Montserrat';
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
	}
	.line {
		background: #ffffff14;
		width: 100%;
		height: 1px;
		margin-bottom: gREm(3);
	}
	.bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: gREm(5);
		span {
			font-size: gREm(12);
			line-height: gREm(16);
			font-family: 'Montserrat';
			&.left {
				color: #ffffff66;
				line-height: gREm(17);
			}
		}
	}
}
</style>
