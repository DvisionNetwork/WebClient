<template>
	<div class="Wallet">
		<div :active="(wIdx!=0 ? 'on' : 'off')" class="arrow arrow-left" @click="onArrowClick('left')"></div>
		<div class="contents-wrap">
			<div class="contents" :pos="wIdx">
				<GuideWalletContent v-for="(item, idx) in items"
					:item="items[idx]"
					:idx="idx"
					:wIdx="wIdx"
				/>
			</div>
		</div>
		<div :active="(wIdx!=items.length -1 ? 'on' : 'off')" class="arrow arrow-right" @click="onArrowClick('right')"></div>
	</div>
</template>

<script>
import GuideWalletContent from '@/views/Guide.Wallet.Content.vue'
import wContents from '@/data/Guide.Wallet.Content.js'

export default {
	name: "Guide-Wallet",
	components: {
		GuideWalletContent,
	},
	props: {
		wIdx: {
			type: Number,
			default: 0,
		}
	},
	beforeMount () {
		console.log("[Guide.Wallet.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		console.log("[Guide.Wallet.vue] mounted(), route : =================== ", this.$route)
		if(_U.getIfDefined(this.$route,['params','page']) == 'wallet') {
			if(typeof gMainScrollbar != 'undefined') {
				console.log("[Guide.Wallet.vue] mounted(), addListener onScroll ")
				gMainScrollbar.addListener(this.onScroll);
			}
		}
	},

	beforeUnmount() {
		console.log("[Guide.Wallet.vue] beforeUnmount(), route : =================== ", this.$route);
		if(typeof gMainScrollbar != 'undefined') {
			console.log("[Guide.Wallet.vue] beforeUnmount(), removeListener onScroll ");
			gMainScrollbar.removeListener(this.onScroll);
		}
	},

	beforeUpdate () {
		console.log("[Guide.Wallet.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		console.log("[Guide.Wallet.vue] ============#####===== updated(), route : ", this.$route)
	},

	data () {
		var currLang = this.$route.params.lang;
		if(!currLang) currLang = 'en';
		return {
			scrollTimer: null,
			items:wContents[currLang].items
		}
	},
	computed: {
		computedvar() {
			return 1;
		}
	},
	methods : {
		onScroll(status) {
			// console.log("[Guide.Wallet.vue] onScroll() ======  : ", status);
			this.setArrowScroll();
		},
		setArrowScroll() {
			if(_U.getIfDefined(this.$route,['params','page']) !== 'wallet') {
				return;
			}
			var oArrR = _U.Q('.GUIDE .Wallet .arrow.arrow-right');
			var oArrL = _U.Q('.GUIDE .Wallet .arrow.arrow-left');
			if(oArrR && oArrL && typeof gMainScrollbar != 'undefined') {
				var h = gMainScrollbar.getSize().content.height;
				var t = gMainScrollbar.scrollTop;

				var o = _U.Q('.GUIDE .Wallet .contents .content-box .content .img-box .img');
				var rect = o.getBoundingClientRect();

				var defaultTop = rect.y ;
				// if(defaultTop < 0) defaultTop = 0;
				// console.log("==================================== ", t, defaultTop,  h - t, h);
				if(t==0){
					oArrR.style.top = defaultTop+"px";
					oArrL.style.top = defaultTop+"px";
				}else
				if(t >= defaultTop && h - t > 1200 ) {
					oArrR.style.top = t+"px";
					oArrL.style.top = t+"px";
				}
			}
		},
		onArrowClick (leftRight) {
			console.log("====== on Arrow Click : ", leftRight);
			if(leftRight=='right') {
				if(this.wIdx < this.items.length -1) {
					this.$router.push({name:"Guide-SubPage", params:{'page': 'wallet', wIdx: Number(this.wIdx) + 1}});
				}
			}else{
				if(this.wIdx > 0) {
					this.$router.push({name:"Guide-SubPage", params:{'page': 'wallet', wIdx: Number(this.wIdx) - 1}});
				}
			}
		},
	}
}

</script>

<style lang="scss" scoped>
.Wallet {

	$content-box-size: 908;

	margin-top: gREm(130 - 50);
	@include Transition(0.5s ease-in-out);
	height: auto;
	width: gREm(30 + $content-box-size + 30);

	& * {
		color: black;
	}
	@include FLEX(space-between, flex-start);
	.arrow {

		position: absolute;
		z-index: -1;
		opacity: 0;
		// margin-top: gREm(232 + 32 + 50);
		top: gREm(380);
		width: gREm(30);
		height: gREm(56);
		cursor: pointer;

		&[active='on'] {
			opacity: 1;
			z-index: $Z-INDEX-ARROW;
		}
	}
	.arrow-left {
		left:gREm(0);
		@include OnOverTransitionX-L();
		@include SetBgImage(url('../assets/img/guide/ic-arrow-Guide-left.svg'));
	}
	.arrow-right {
		right: gREm(60);
		@include OnOverTransitionX-R();
		@include SetBgImage(url('../assets/img/guide/ic-arrow-Guide-right.svg'));
	}

	.contents-wrap {
		width: gREm($content-box-size);
		height: auto;
		@include Transition(0.5s ease-in-out);

		.contents {
			position: relative;
			white-space: nowrap;
			@include Transition(0.5s ease-in-out);
			margin-left: 0px;
			height: auto;
			width: auto;
			&[pos="0"] {
				margin-left: gREm(0);
			}
			&[pos="1"] {
				margin-left: gREm(($content-box-size) * -1);
			}
			&[pos="2"] {
				margin-left: gREm(($content-box-size) * -2);
			}
			&[pos="3"] {
				margin-left: gREm(($content-box-size) * -3);
			}
			&[pos="4"] {
				margin-left: gREm(($content-box-size) * -4);
			}
			&[pos="5"] {
				margin-left: gREm(($content-box-size) * -5);
			}
			&[pos="6"] {
				margin-left: gREm(($content-box-size) * -6);
			}
			&[pos="7"] {
				margin-left: gREm(($content-box-size) * -7);
			}
		}
	}

}

@include media-max($media_medium) { // 1024
.Wallet {
	width: 100vw;

	.arrow {
	}
	.arrow-left {
		left: 5vw;
	}
	.arrow-right {
		right: 5vw;
	}


	.contents-wrap {
		width: 100vw;
		.contents {
			&[pos="0"] {
				margin-left: 0px;
			}
			&[pos="1"] {
				margin-left: calc(100vw * -1);
			}
			&[pos="2"] {
				margin-left: calc(100vw * -2);
			}
			&[pos="3"] {
				margin-left: calc(100vw * -3);
			}
			&[pos="4"] {
				margin-left: calc(100vw * -4);
			}
			&[pos="5"] {
				margin-left: calc(100vw * -5);
			}
			&[pos="6"] {
				margin-left: calc(100vw * -6);
			}
			&[pos="7"] {
				margin-left: calc(100vw * -7);
			}
		}
	}


}}

@include media-max($media_small) {
.Wallet {

}}

</style>
