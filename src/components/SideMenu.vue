<template>
	<div v-if="sideMenu"
		class="sub-menu-1"
		v-for="(menu_1, idx_1) in sideMenu"
		:idx="idx_1"
		:active="getOnOff(idx_1)"
		:menu-name="menu_1.name"
		:is-all="menu_1.name=='all-assets' ? 'true': 'false'"
		:all-asset-selected="isAllAssetSelected"
	>
		<div class="menu-1" menu-level="1" :index="(idx_1)"
			@click="onMenuClick(idx_1)"
			:menu-type="getType(menu_1)"
		>
			<div class="title">{{$t('market.assets.'+menu_1.name)}}</div>
			<div v-if="menu_1.name!=='all-assets'" class="icon"></div>
		</div>
		<div v-if="menu_1.child && menu_1.child.length > 0"
			class="sub-menu-2 child"
			v-for="(menu_2, idx_2) in menu_1.child"
			:active="getOnOff(idx_1, idx_2)"
			:menu-name="menu_2.name"
			:is-selected="getSelected(idx_1, idx_2) ? 'on': 'off'"
		>
			<div class="menu-2" menu-level="2" :index="(idx_2)"
				@click="onMenuClick(idx_1, idx_2)"
				:menu-type="getType(menu_2)"
			>
				<div v-if="getType(menu_2)=='check-box'" class="icon"></div>
				<div class="title">{{$t('market.assets.'+menu_2.name)}}</div>
				<div v-if="getType(menu_2)!=='check-box'" class="icon"></div>
			</div>
			<div v-if="menu_2.child && menu_2.child.length > 0"
				class="sub-menu-3 child"
				v-for="(menu_3, idx_3) in menu_2.child"
				:index="idx_3"
				:active="getOnOff(idx_1, idx_2, idx_3)"
				:menu-name="menu_3.name"
			>
				<div class="menu-3" menu-level="3" :index="(idx_3)"
					@click="onMenuClick(idx_1, idx_2, idx_3)"
					:menu-type="getType(menu_3)"
				>
					<div class="icon"></div>
					<div class="title">{{$t('market.assets.'+menu_3.name)}}</div>
				</div>
			</div>
		</div>
	</div>
	<div v-else class="sub-menu-1">
		<div class="menu-1" menu-level="1" index="0">
			No Asset Mnus
		</div>
	</div>
</template>

<script>
export default {
	name: 'SideMenu',
	props: {
		sideMenu: Object,
		isMobile: Boolean,
	},
	data() {
		return {
			cMIdx : { // current Menu Index
				"m-1": -1,
				"m-2": -1,
				"m-3": -1
			}
		}
	},
	computed: {
		isAllAssetSelected() {
			return this.sideMenu[0].all;
		},

		xxisSelected() {
			return true;
		}
	},
	mounted() {},
	methods: {
		isActive(o) {
			if(_U.getIfDefined(o,'active')==true) return true;
			return false;
		},
		getSelected(idx_1, idx_2) {
			var rv = false;
			if(_U.isDefined(this.sideMenu[idx_1],'child')) {
				if(_U.isDefined(this.sideMenu[idx_1].child[idx_2],'selected')) {
					rv = this.sideMenu[idx_1].child[idx_2].selected;
				}
			}
			return rv;
		},

		toggleActive(o) {
			if(_U.getIfDefined(o,'active')==true) {
				o['active'] = false;
			}else {
				o['active'] = true;
			}
		},
		setActive(o, pO) {
			if(o.name == 'all-assets') {
				o.all='on';
				this.unsetActiveAll();
				this.$emit('selection-changed');
			}else
			if(this.getType(o) == 'fold') {
				this.toggleActive(o);
			}else
			if(this.isItem(o)) {

				if(this.getType(o)=='check-box') {
					this.toggleActive(o);
				}else{

					this.unsetActiveAll();

					if(_U.getIfDefined(o,'active')!==true) {
						o['active'] = true;
						this.sideMenu[0].all='off';
						pO['selected'] = true;
						pO['active'] = true;
					}else {
						o['active'] = false;
						this.sideMenu[0].all='on';
					}

				}

				this.$emit('selection-changed');
			}
		},
		unsetActiveAll() {
			this.sideMenu.forEach((menu1)=>{
				if(menu1.name=='all-assets'){
					if(menu1.child) {
						menu1.child.forEach((menu2)=>{
							menu2['active']=false;
							menu2['selected']=false;
							if(menu2.child) {
								menu2.child.forEach( (menu3) => {
									menu3.active=false;
								});
							}
						});
					}
				}else {
					if(menu1.child) {
						menu1.active=false;
						menu1.child.forEach((menu2)=>{
							menu2.active=false;
						});
					}
				}
			});
		},
		getType(o) {
			var oTypes = _U.getIfDefined(o,'type');
			if(!oTypes || oTypes.length < 1) return null;
			var oType = oTypes.split(' ')[0];
			return oType;
		},
		isItem(o) {
			var oType = this.getType(o);
			if(oType == 'choice' || oType == 'check-box') {
				return true;
			}
			return false;
		},
		isCheckbox(o) {
			var oType = this.getType(o);
			if(oType == 'check-box') {
				return true;
			}
			return false;
		},
		getOnOff(dp1, dp2, dp3) {
			var rv = 'off';
			var sm = this.sideMenu;
			if(_U.isNumber(dp1)) {
				if(this.isActive(sm[dp1])) {
					if(_U.isNumber(dp2)) {
						if(sm[dp1].child && this.isActive(sm[dp1].child[dp2])) {
							if(_U.isNumber(dp3)) {
								if(sm[dp1].child[dp2].child && this.isActive(sm[dp1].child[dp2].child[dp3])) {
									rv = 'on';
								}
							}else{
								rv = 'on';
							}
						}
					}else{
						rv = 'on';
					}
				}
			}
			return rv;
		},
		onMenuClick(dp1, dp2, dp3) {
			var sm = this.sideMenu;
			// console.log("======== sm, dp1, dp2, dp3", sm, dp1, dp2, dp3);
			if(_U.isNumber(dp1)) {
				if(_U.isNumber(dp2) && sm[dp1].child) {
					if(_U.isNumber(dp3) && sm[dp1].child[dp2].child){
						this.setActive(sm[dp1].child[dp2].child[dp3], sm[dp1].child[dp2]);
					}else{
						this.setActive(sm[dp1].child[dp2]);
					}
				}else{
					this.setActive(sm[dp1]);
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>

.sub-menu-1 {
	width: 100%;
	height: auto;
	.menu-1{
		@include FLEX(space-between, center);
		width:100%;
		height: gREm(42);
		cursor: pointer;
		background-color: transparent;

		.title {
			padding-left: gREm(20);
			padding-right: gREm(20 + 18);
			width: auto;
			height: gREm(20);
			@include Set-Font($AppFont, gREm(17), gREm(20), #ffffff);
		}
		.icon {
			width: gREm(10);
			height: gREm(6);
			margin-right: gREm(18);
			@include SetBgImage(url('../assets/img/ic-arrow-sidemenu-d.svg'));
		}
		&:hover {
			background-color: rgba(255,255,255,0.08);
			border-radius:  gREm(8);
		}
	}
	&[active="on"][is-all="false"] .menu-1 {
		// background-color: rgba(255,255,255,0.08);
		border-radius:  gREm(8);
		.icon {
			@include SetBgImage(url('../assets/img/ic-arrow-sidemenu-u.svg'));
		}
	}
	&[active="on"][menu-name="all-assets"][all-asset-selected="on"] .menu-1 {
		background-color: rgba(255,255,255,0.08);
		border-radius:  gREm(8);
	}

	.sub-menu-2 {
		margin-top: gREm(7);
		// width: auto;
		width: 100%;
		// margin-left: gREm(18);
		// padding-left: gREm(18);
		height: auto;
		@include FLEXV(space-between, center);

		.menu-2 {
			@include FLEX(space-between, center);
			width:100%;
			height: gREm(42);
			padding-left: gREm(18);
			// padding-right: gREm(18);
			cursor: pointer;

			// .icon {
			// 	display: none;
			// }
			.title {
				width: auto;
				height: gREm(20);
				@include Set-Font($AppFont, gREm(16), gREm(20), #ffffff);
			}
			.icon {
				width: gREm(10);
				height: gREm(6);
				margin-right: gREm(18);
				@include SetBgImage(url('../assets/img/ic-arrow-sidemenu-d.svg'));
			}
			&[menu-type="check-box"] {
				padding-left: gREm(12);
				padding-right: gREm(12);
				@include FLEX(flex-start, center);
				.icon {
					display: block;
					width: gREm(16);
					height: gREm(16);
					margin-right: gREm(10);
					@include SetBgImage(url('../assets/img/ic-checkbox-n-sidemenu.svg'));
				}
				.title {
					width: auto;
					opacity: 0.5;
					height: gREm(19);
					@include Set-Font($AppFont, gREm(15), gREm(19), #ffffff);
				}
			}


		}
		&[active="on"] .menu-2 .icon {
			@include SetBgImage(url('../assets/img/ic-arrow-sidemenu-u.svg'));
		}

		.menu-2:hover {
			background-color: rgba(255,255,255,0.08);
			border-radius:  gREm(8);
		}
		&[is-selected="on"] .menu-2 {
			background-color: rgba(255,255,255,0.08);
			border-radius:  gREm(8);
		}
		&[active="on"] .menu-2 {
			// background-color: rgba(255,255,255,0.08);
			// border-radius:  gREm(8);
			.icon {
				@include SetBgImage(url('../assets/img/ic-arrow-sidemenu-u.svg'));
			}
			&[menu-type="check-box"] {
				background-color: transparent;
				.icon {
					@include SetBgImage(url('../assets/img/ic-checkbox-s-sidemenu.svg'));
				}
				.title {
					opacity: 1;
				}
			}
		}

		.sub-menu-3 {
			width:100%;
			height: gREm(19 + 19);
			padding-left: gREm(18);
			margin-top: gREm(0);
			@include FLEX(flex-start, center);
			.menu-3 {
				width:100%;
				padding-left: gREm(26 - 18);
				height: gREm(19 + 19);
				@include FLEX(flex-start, center);
				cursor: pointer;
				.icon {
					@include Transition( .5s ease-in-out);
					opacity: 0;
					margin-right: gREm(13);
					width: gREm(5);
					height: gREm(5);
					border-radius: 50%;
					background-color: #f6583e;
				}
				.title {
					@include Transition( .5s ease-in-out);
					opacity: 0.5;
					width: auto;
					height: gREm(19);
					@include Set-Font($AppFont, gREm(15), gREm(19), #ffffff);
				}
				&:hover {
					.title {
						opacity: 1;
					}
				}
			}
			&[index="0"] {
				margin-top: gREm(2);
			}
			&[active="on"] .menu-3 {
				.icon {
					opacity: 1;
				}
				.title {
					opacity: 1;
				}
			}
		}
	}

	&:after {
		display: block;
		content: "";
		margin-top: gREm(10);
		margin-bottom: gREm(10);
		width: 100%;
		height: 1px;
		background-color: #222031;
	}
	&:after:last-child {
		display: none;
	}
}

.sub-menu-1 * {
	@include Transition( all .35s ease-in-out);
}

.sub-menu-1[menu-name="level"], .sub-menu-1[menu-name="filter"] {
	.sub-menu-2 {
		margin-left: gREm(20);
	}
}


.sub-menu-1[active="off"] {
	.child {
		opacity: 0;
		margin-top: 0;
		.menu-2 {
			height:0px;
		}
		.child {
			opacity: 0;
			margin-top: 0px;
			height: 0px;
			.menu-3 {
				height: 0px;
			}
			&[index="0"] {
				margin-top: 0px;
			}
		}
	}
}

.sub-menu-1[active="on"] {
	.child {
		opacity: 1;
		margin-top: gREm(7);
		.menu-2 {
			height:gREm(42);
		}
		&[active="off"] {
			.child {
				opacity: 0;
				margin-top: 0px;
				height: 0px;
				.menu-3 {
					height: 0px;
				}
				&[index="0"] {
					margin-top: 0px;
				}
			}
		}
		&[active="on"] {
			.child {
				opacity: 1;
				margin-top: gREm(7);
				height: gREm(19 + 19);
				.menu-3 {
					height: gREm(19 + 19);
				}
				&[index="0"] {
					margin-top: gREm(2);
				}
			}
		}
	}
}
// .sub-menu-1[active="on"] {
// 	.child {
// 		opacity: 1;
// 		margin-top: gREm(7);
// 		.menu-2 {
// 			height:gREm(42);
// 		}
// 		&[active="off"] {
// 			.child {
// 				opacity: 0;
// 				margin-top: 0px;
// 				height: 0px;
// 				.menu-3 {
// 					height: 0px;
// 				}
// 				&[index="0"] {
// 					margin-top: 0px;
// 				}
// 			}
// 		}
// 		&[active="on"] {
// 			.child {
// 				opacity: 1;
// 				margin-top: gREm(7);
// 				height: gREm(19 + 19);
// 				.menu-3 {
// 					height: gREm(19 + 19);
// 				}
// 				&[index="0"] {
// 					margin-top: gREm(2);
// 				}
// 			}
// 		}
// 	}
// }

@include media-max($media_small) {
	// 768
	.sub-menu-1 {
		.menu-1 {
			height: auto;
			.title {
				font-size: gREm(16);
				font-weight: 700;
				padding: 0;
			}

			&:hover {
				background-color: unset;
				.title {
					color: #ffd041;
				}
			}
		}

		.sub-menu-2 {
			.menu-2 {
				padding: 0;
				.title {
					font-size: gREm(16);
					font-weight: 700;
				}
				&:hover {
					background-color: unset;
					.title {
						color: #ffd041;
					}
				}
			}

			.sub-menu-3 {
				padding-left: 0;
				.menu-3 {
					padding-left: 0;
				}
			}
			&:after {
				background-color: #ffffff;
				opacity: 0.2;
				margin: gREm(24) 0;
			}
		}

		&[active='on'][menu-name='all-assets'][all-asset-selected='on'] {
			.menu-1 {
				background-color: unset;
			}
		}

		&:after {
			background-color: #ffffff;
			opacity: 0.2;
			margin: gREm(24) 0;
		}
	}
}
</style>
