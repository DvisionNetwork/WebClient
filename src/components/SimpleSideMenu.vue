<template>
	<div v-if="sideMenu"
		class="sub-menu-1"
		v-for="(menu_1, idx_1) in sideMenu"
		:idx="idx_1"
		:active="getOnOff(idx_1)"
		:menu-name="menu_1.mapId"
	>
		<div class="menu-1" menu-level="1" :index="(idx_1)"
			@click="onMenuClick(idx_1)"
		>
			<div class="title">{{menu_1.name}}</div>
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
	name: 'SimpleSideMenu',
	props: {
		sideMenu: Object,
	},
	data() {
		return {

		}
	},
	computed: {
	},
	mounted() {
	},
	methods: {
		isActive(o) {
			if(_U.getIfDefined(o,'active')==true) return true;
			return false;
		},

		inActiveAll(){
			var sm = this.sideMenu;
			for(var i=0; i<sm.length; i++){
				var o = sm[i];
				o.active=false;
			}
		},
		setActive(o) {
			this.inActiveAll();
			if(_U.getIfDefined(o,'active')==false) {
				o.active=true;
				this.$emit('selection-changed',o.mapId);
			}
		},
		getOnOff(dp1) {
			var rv = 'off';
			var sm = this.sideMenu;
			if(_U.isNumber(dp1)) {
				if(this.isActive(sm[dp1])) {
					rv = 'on';
				}
			}
			return rv;
		},
		onMenuClick(dp1) {
			var sm = this.sideMenu;
			// console.log("======== sm, dp1, dp2, dp3", sm, dp1, dp2, dp3);
			if(_U.isNumber(dp1)) {
				this.setActive(sm[dp1]);
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

		&:hover {
			background-color: rgba(255,255,255,0.08);
			border-radius:  gREm(8);
		}
	}
	&[active="on"] .menu-1 {
		background-color: rgba(255,255,255,0.08);
		border-radius:  gREm(8);
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

</style>
