<template>
	<div class="MyPage">

		<div class="title-box"></div>

		<div class="content-body-wrap">

			<div class="tabs remove-highlight">
				<div class="item"
					v-for="(item, idx) in mypageList" :key="idx"
					:selected="page==item.id ? true : false"
					@click="onTabClick(item.id)"
				>
					{{ item.name }}
				</div>
			</div>

			<div class="tab-line"></div>

			<div class="content-box">
				<Profile v-if="page=='profile'" />
				<Inventory v-if="page=='inventory'" />
				<MyPageStaking v-if="page=='staking'" />
				<Land v-if="page=='land'" />
			</div>
		</div>
	</div>

	<FOOT :theme="'black'" />
</template>

<script>

import Profile from '@/views/MyPage.Profile.vue'
import Inventory from '@/views/MyPage.Inventory.vue'
import Land from '@/views/MyPage.Land.vue'
import MyPageStaking from '@/views/MyPage.Staking.vue'
import FOOT from '@/components/FOOT.vue'

export default {
	name: "MyPage",
	components: {
		Profile,
		Inventory,
		Land,
		MyPageStaking,
		FOOT
	},
	props: {
		page: {
			type: String,
			default: 'profile',
		},
		wIdx: {
			type: Number,
			default: 0,
		},
	},
	beforeMount () {
		// console.log("[MyPage.vue] beforeMout(), route : ", this.$route)
	},
	mounted () {
		// console.log("[MyPage.vue] mounted(), route : ", this.$route)
	},
	beforeUpdate () {
		// console.log("[MyPage.vue] beforeUpdate(), route : ", this.$route);
	},
	updated() {
		// console.log("[MyPage.vue] updated(), route : ", this.$route)
	},
	data () {
		return {
			mypageList: [
				{name:'Profile', id:'profile'},
				{name:'Inventory', id:'inventory'},
				{name:'Land', id:'land'},
				{name: 'Staking (LAND) ', id:'staking'},
			],
			currTabIdx: 'profile',
		}
	},
	computed: {
		getTitleDesc() {
			return  this.$t('mypage.title');
		}
	},
	methods : {
		onTabClick (itemName) {
			this.currTabIdx = itemName;
			console.log('onclick', itemName);
			this.$router.push({name:"MyPage-Page", params:{'page': itemName}});
		},
	}
}

</script>

<style lang="scss" scoped>
.MyPage {
	@include FLEXV(flex-start, center);
	width: 100%;
	height: auto;
	background-color: #181721;

	min-height: calc(100vh - 176px); // Foot 176px

	& * {
		color: black;
	}

	// .title-box {
	// 	@include FLEXV(flex-start, center);
	// 	width: 100%;
	// 	height: gREm(370);
	// 	// background-image: linear-gradient(to bottom, #6c38ef, #6c38ef);
	// 	.title {
	// 		height: auto;
	// 		width: auto;
	// 		margin-top: gREm(213);
	// 		@include Set-Font($AppFont, gREm(34), gREm(55), #ffffff, 600);
	// 		text-align: center;
	// 	}
	// }
	.content-body-wrap{
		@include FLEXV(flex-start, flex-start);
		width: gREm(1400 - 139);
		margin-top: gREm(142);
		.tabs {
			width: 100%;
			height: gREm(24 + 20 + 3);
			margin-top: gREm(80);
			@include FLEX(flex-start, flex-start);
			.item {
				height: gREm(24);
				width: auto;
				margin-right: gREm(49);
				@include Set-Font($AppFont, gREm(20), gREm(24), #ffffff, 500);
				opacity: 0.4;
				@include Transition( .5s ease-in-out);
				cursor: pointer;

				&[selected=true] {
					opacity: 1;
				}

				&:after {
					@include Transition( .25s ease-in-out);
					position: absolute;
					bottom: gREm(-23);
					content: "";
					display: block;
					height: gREm(3);
					left: 50%;
					width: 0px;
				}

				&[selected='true']:after {
					width: 100%;
					left: 0;
					background-color: #f6583e;
				}
			}
		}
		.tab-line {
			width: 100%;
			height: 1px;
			background-color: #34304b;
		}
		.content-box {
			@include FLEX(center,flex-start);
			width: 100%;
			height: auto;
			padding-bottom: gREm(137);
			margin-top: gREm(15);
			margin-bottom: gREm(15);
			// @include FLEX(flex-start, cent
		}
	}
}


@include media-max($media_large) { // 1200

.MyPage .content-body-wrap {
	@include FLEXV(flex-start, center);
	width: gREm(1200 - 200) ;

}}

@include media-max($media_medium) { // 1024

.MyPage .content-body-wrap {
	@include FLEXV(flex-start, center);
	width: gREm(700) ;
	.content-box .contents .content-menu-box {
		.search-box {
			width: gREm(130);
		}
		.order-by-box {
			width: gREm(130);
		}
	}
}}

@include media-max($media_small) {
	.MyPage {
		min-height: unset;
		.content-body-wrap {
			width: 100%;
			margin-top: 0;

			.tabs {
				width: 100%;
				margin-top: 0;
				align-items: center;
				overflow-x: auto;
				overscroll-behavior: contain;
				overflow-y: hidden;
				height: 100%;
				padding-top: gREm(20);
				&::-webkit-scrollbar {
					display: none;
				}
				.item {
					@include Set-Font($AppFont, gREm(18), gREm(26), #ffffff, 500);
					display: flex;
					align-items: center;
					margin-right: gREm(16);
					border: 1px solid #777682;
					border-radius: gREm(8);
					padding: gREm(25) gREm(30);

					&[selected='true'] {
						border: 2px solid #f6583e;

						&:after {
							background: none;
						}
					}

					&:first-child {
						margin-left: gREm(20);
					}

					&:last-child {
						margin-right: gREm(20);
					}
				}

			}
			.tab-line {
				display: none;
			}
			.content-box {
				.Profile {
					.content-box-wrap {
						.content-box {
							margin-top: gREm(40);
							flex-direction: column;
						}
					}
				}
			}
		}
	}
}
</style>
