<template>
    <div class="reward-box">
        <div class="reward-card" v-for="item in data" :key="item">
            <div class="image land1" v-if="item.itemCode == 'irln001'"></div>
            <div class="image land2" v-else-if="item.itemCode == 'irln002'"></div>
            <div class="image land3" v-else-if="item.itemCode == 'irln003'"></div>
            <div class="image land4" v-else-if="item.itemCode == 'irln004'"></div>
            <div class="desc-box">
                <span class="desc-name">{{ item.itemName }} </span>
            </div>
            <div class="level-box">
                <div class="amount-level">Count : {{ item.cnt }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
	name: 'VRFReward',
	components: {},
	props: {
		data: Array
	},
	methods: {
		
	},
}
</script>

<style lang="scss" scoped>
.reward-box {
    display: flex;
    max-width: 32.5rem;
    overflow-x: auto;    
    margin-bottom: gREm(30);
    .reward-card {
        width: gREm(282);
        height: gREm(338);
        margin: 0 gREm(10);
        border-radius: gREm(10);
        transition: all 0.2s linear;
        // box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
        float: left;
        border: solid 2px transparent;
        background-image: none;
        background-origin: border-box;
        background-clip: content-box, border-box;

        @include FLEXV(center, center);	

        .level-box {

            width: 100%;
            padding-left:gREm(20);
            padding-top: gREm(10);
            @include FLEX(flex-start,center);

            .leveltag {
                width: auto;
                height: gREm(24);
                border-radius: gREm(4);
                padding: gREm(4) gREm(6) gREm(4) gREm(6);
                background: #72767f;
                @include Set-Font($AppFont, gREm(13), gREm(16), #000000);
            }

            .amount-level {
                width: auto;
                height: gREm(24);
                border-radius: gREm(4);
                padding: gREm(4) gREm(6) gREm(4) gREm(6);
                @include Set-Font($AppFont, gREm(13), gREm(16), #000000);
            }
        }

        border: solid 2px #72767f;
        .leveltag {
            background: #72767f;
        }	

        .image {
            // @include FLEXV(center, center);
            width: gREm(200);
            height: gREm(200);            
            background-repeat: no-repeat;
            object-fit: cover;
            background-size: contain;
            background-position: center;            
        }
        .desc-box {
            width: 100%;
            padding-left: gREm(20);
            padding-right: gREm(20);
            height: gREm(16);
            margin-top: gREm(34);
            @include FLEX(space-between,center);
            .desc-name{
                width: gREm(185);
                height: gREm(19);
                text-overflow: ellipsis;
                overflow: hidden;
                @include Set-Font($AppFont, gREm(16), gREm(19), #000000);
            }
        }

        .land1 {
            background-image: url("../assets/img/randomBox/landbox_1.png");
        }
        .land2 {
            background-image: url("../assets/img/randomBox/landbox_2.png");
        }
        .land3 {
            background-image: url("../assets/img/randomBox/landbox_3.png");
        }
        .land4 {
            background-image: url("../assets/img/randomBox/landbox_4.png");
        }
    }
}

@include media-max($media_small) {
	.reward-card {
		height: auto;
		margin-top: gREm(24);
		margin-bottom: 0;
		.level-box {
			padding: 0 gREm(20);
			margin-top: gREm(15);

			.leveltag {
				padding: gREm(4) gREm(10);
				font-size: gREm(16);
				line-height: gREm(24);
				height: auto;
				margin-right: gREm(15);
			}
			.amount-level {
				font-size: gREm(14);
				line-height: gREm(22);
				height: auto;
			}
		}
		.image {
			width: gREm(190);
			height: gREm(190);
		}

		.desc-box {
			margin-top: gREm(57);
		}
	}
}
</style>
