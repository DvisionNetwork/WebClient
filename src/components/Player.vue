<template>
	<div class="wrapper">
		<video
			src="/assets/video/dworld_trailer.mp4"
			id="player"
			class="player"
			autoplay=""
			muted=""
			loop=""
			preload="auto"
			playsinline=""
		></video>
		<div class="cover"></div>
	</div>
</template>

<script>
export default {}
</script>
<style lang="scss" scoped>
.wrapper {
	position: absolute;
	display: block;
	@include Full-Size;
	background-color: rgba(0, 0, 0, 0.1);
}

.cover {
	position: absolute;
	bottom:0px;
	width: gW(1920);
	height:gRH(275);
	background-image: linear-gradient(to bottom, rgba(32, 19, 96, 0) 35%, #201360 92%);
}

.player {
	opacity: 0.55;
	position: absolute;
	@include Full-Size;
	object-fit: fill;
}

@media (max-width: 1400px) {
	.FOOT {
		width: 100%;
	}
}

@media (max-width: 790px) {
	.FOOT {
		width: 100%;
	}
}
</style>
