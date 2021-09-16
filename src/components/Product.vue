<template>
	<div class="product-card"
		:page-from="callFrom"
		@click="onClickItem(product)"
		:level="mxGetLevelCssType(product.rarity)
	">
		<div class="regularimage">
		<div :functional="product.functional=='true' ? 'on' :'off'" class="R-image"></div>
		</div>
		<div class="image" :style="mxGetBgImageStyle(product.thumbnail_url)" ></div>
		<div class="desc-box">
			<span class="desc-name">{{ product.name }} </span>
			<div v-if="callFrom=='market'" class="price-box">
				<div class="marketimage"></div>
				<span class="desc-price">{{ product.price }}</span>
			</div>
		</div>
		<div class="level-box">
			<div class="leveltag">{{ product.rarity }}</div>
			<div v-if="callFrom=='market'" class="amount-level">Remaining : {{ product.sell_amount }}</div>
			<div v-if="callFrom=='mypage'" class="amount-level">Owned : {{ product.own_amount }}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ProductCard',
	props: {
		product: {
			type: Object,
			default: () => ({}),
		},
		callFrom:{
			type: String,
		}
	},
	methods: {
		onClickItem(item) {
			this.$emit('click-item',item)
		}
	}
}
</script>

<style lang="scss" scoped>
.product-card {

	width: gREm(282);
	height: gREm(338);
	margin: gREm(30);
	margin-left:0;
	border-radius: gREm(10);
	transition: all 0.2s linear;
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
	float: left;
	border: solid 2px transparent;
	background-image: none;
	background-origin: border-box;
	background-clip: content-box, border-box;

	@include FLEXV(center, center);
	&[page-from="market"] {
		@include OnOverTransition();
		cursor: pointer;
	}

	.regularimage{
		width: 100%;
		@include FLEX(flex-start,center);
		.R-image{
			opacity: 0;
			width: gREm(26);
			height: gREm(30);
			@include SetBgImage(url('../assets/img/ic-function-market.svg'));
			margin-left:gREm(16);
			margin-top: gREm(16);
			&[functional="on"]{
				opacity: 1;
			}
		}
	}

	.level-box {

		width: 100%;
		padding-left:gREm(20);
		padding-top: gREm(10);
		margin-bottom: gREm(20);
		@include FLEX(flex-start,center);

		.leveltag {
			width: auto;
			height: gREm(24);
			border-radius: gREm(4);
			padding: gREm(4) gREm(6) gREm(4) gREm(6);
			background: #72767f;
			@include Set-Font($AppFont, gREm(13), gREm(16), #ffffff);
		}
		
		.amount-level {
			width: auto;
			height: gREm(24);
			border-radius: gREm(4);
			padding: gREm(4) gREm(6) gREm(4) gREm(6);
			@include Set-Font($AppFont, gREm(13), gREm(16), #ffffff);
		}
	}

	&[level="common"] {
		border: solid 2px #72767f;
		.leveltag {
			background: #72767f;
		}
	}
	&[level="advance"] {
		border: solid 2px #f2f4f8;
		.level-box .leveltag {
			background: #f2f4f8;
			color:#181721;
		}
	}
	&[level="rare"] {
		background-image: linear-gradient(#181721, #181721), linear-gradient(to right, #3dd3bc, #22e073);
		.leveltag {
			background-image: linear-gradient(to right, #3dd3bc, #22e073);
		}
	}
	&[level="unique"] {
		background-image: linear-gradient(#181721, #181721), linear-gradient(to right, #dc8dff, #b953e6);
		.leveltag {
			background-image: linear-gradient(to right, #dc8dff, #b953e6);
		}
	}
	&[level="unique+alpha"]{
		background-image: linear-gradient(#181721, #181721), linear-gradient(to right, #85cee5, #61e5d1 47%, #489afa);
		.leveltag{
			background-image: linear-gradient(to right, #85cee5, #61e5d1 47%, #489afa);
		}
	}
	&[level="legend"] {
		background-image: linear-gradient(#181721, #181721), linear-gradient(to right, #ffcc88 -5%, #feaad6 41%, #c3c3f2 63%, #51f8f2 109%);
		.leveltag{
			background-image: linear-gradient(to right, #ffcc88 -5%, #feaad6 41%, #c3c3f2 63%, #51f8f2 109%);
		}
	}

	.image {
		// @include FLEXV(center, center);
		width: gREm(160);
		height: gREm(160);
	}
	.desc-box {
		width: 100%;
		padding-left: gREm(20);
		padding-right: gREm(20);
		height: gREm(16);
		margin-top: gREm(54);
		@include FLEX(space-between,center);
		.desc-name{
			width: auto;
			height: gREm(19);
			@include Set-Font($AppFont, gREm(16), gREm(19), #ffffff);
		}
		.price-box{
			@include FLEX(flex-end,center);
			.marketimage{
				width: gREm(14);
				height: gREm(16);
				@include SetBgImage(url('../assets/img/ic-dvi-market.svg'));
				margin-right: gREm(8);
			}
			.desc-price{
				width: auto;
				height: gREm(19);
				@include Set-Font($AppFont, gREm(16), gREm(19), #febf37);
			}
		}
	}
}
// .product-card:hover {
// 	transform: scale(1.01);
// 	box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2),
// 		0 1px 15px 0 rgba(0, 0, 0, 0.19);
// }
</style>
