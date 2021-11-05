<template>
	<div class="card-box">
		<div class="img-box" :style="bgImageStyle"></div>
		<ul class="desc-box">
			<li class="title">
				{{ cardInfo.title }}
			</li>
			<li class="description">
				{{ cardInfo.description }}
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'Card',
	props: {
		cardInfo: Object,
	},
	computed: {
		bgImageStyle() {
			return {
				// 'background-image': `url(${BACKDROP_BASE}/${this.movie.backdrop_path})`,
				'background-image': `url(${this.cardInfo.image})`,
				'background-repeat': 'no-repeat',
				'background-size': 'cover',
			}
		},
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.card-box {
	position: relative;
	@include FLEX(center, center);
	// display: flex;
	// justify-content: space-between;
	// align-items: center;
	width: 100%;
	height: auto;
	margin: 20px 0px;
	border: solid 1px #2b2c2b;

	.img-box {
		display: relative;
		align-items: center;
		height: 400px;
		flex-basis: 100%;
		flex-grow: 1;
	}

	.desc-box {
		display: relative;
		align-items: center;
		margin: 10px 50px;
		height: auto;
		flex-basis: 400px;
		flex-grow: 1;
		.title {
			margin-bottom: 1em;
			font-size: 20px;
		}
	}
}
</style>
