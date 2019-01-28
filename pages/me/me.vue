<template>
	<view class="content">
		<view class="header">
			<image :src="serverUrl + coverUrl" class="cover" mode="widthFix"></image>
			<image src="../../static/my-p.png" class="icon" mode="widthFix"></image>
			<view class="cicle"></view>

			<view class="name no-wrap">会飞的鱼</view>
			<view class="intro no-wrap">当童话变成真的，鱼也是可以飞的。</view>
		</view>

		<view class="items">
			<view class="item switch">
				<label class="icon icon-ai"></label>AI智能机器人
				<switch :checked="checked" @change="changeConf"/>
			</view>
			<navigator url="/pages/me/myCar" class="item">
				<label class="icon icon-mycar"></label>我的车辆
				<label class="arrow">&#xe664;</label>
			</navigator>
			<navigator url="/pages/me/myMsg" class="item">
				<label class="icon icon-xx"></label>我的消息
				<label class="arrow">&#xe664;</label>
			</navigator>
			<view class="item">
				<label class="icon icon-yuyue"></label>我的预约
				<label class="arrow">&#xe664;</label>
			</view>
			<navigator url="/pages/me/myTz" class="item">
				<label class="icon icon-tiezi"></label>我的帖子
				<label class="arrow">&#xe664;</label>
			</navigator>
			<navigator url="/pages/me/myQz" class="item">
				<label class="icon icon-quanzi"></label>我的圈子
				<label class="arrow">&#xe664;</label>
			</navigator>
			<view class="item">
				<label class="icon icon-fankui"></label>意见反馈
				<label class="arrow">&#xe664;</label>
			</view>
			<navigator url="/pages/me/userConf" class="item">
				<label class="icon icon-shezhi"></label>设置
				<label class="arrow">&#xe664;</label>
			</navigator>
		</view>
	</view>
</template>

<script>
	import {
		serverUrl
	} from '../../common/constants.js';
	import * as api from "../../common/api.js";

	export default {
		data() {
			return {
				serverUrl,
				coverUrl: "images/my-bg.png",
				iconUrl: "images/my-p.png",
				checked: true
			}
		},
		onLoad() {
			this.getUserConf();
		},
		methods: {
			changeConf(e) {
				let params = {
					msgType: 'aiMsg',
					type: e.target.value ? 'open' : 'close'
				};
				
				api.updateUserConf(params, (error, data) => {

					if (!error && data) {
						if (data.code === "0") {
							console.log('设置成功！');
							this.checked = e.target.value;
						}
					}
				});
			},
			getUserConf() {
				api.getUserConf(null, (error, data) => {
					uni.hideLoading();

					if (!error && data) {
						if (data.code === "0" && data.data && data.data.length) {
							data.data.forEach(item => {
								if (item.configType == 'aiMsg') {
									this.checked = item.configValue == '1' ? true : false;
								}
							});
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/common/app.scss";

	.header {
		width: 750upx;
		height: 400upx;
		background: #fff;
		position: relative;

		.cover {
			height: 300upx;
			width: 100%;
			position: absolute;
			left: 0;
			top: 0;
		}

		.icon {
			position: absolute;
			bottom: 30upx;
			right: 40upx;
			width: 130upx;
			height: 130upx;
			border-radius: 100%;
			z-index: 10;
		}

		.cicle {
			width: 150upx;
			height: 75upx;
			border-radius: 170upx 170upx 0 0;
			background: rgba(255, 255, 255, 0.5);
			position: absolute;
			right: 30upx;
			bottom: 95upx;
			z-index: 1;
		}

		.name {
			position: absolute;
			bottom: 50upx;
			font-size: 30upx;
			color: #000;
			line-height: 50upx;
			text-align: right;
			width: 550upx;
		}

		.intro {
			position: absolute;
			bottom: 10upx;
			font-size: 22upx;
			color: #5c5c5c;
			line-height: 36upx;
			text-align: right;
			width: 550upx;
		}
	}

	.items {
		background: #fff;
		margin-top: 20upx;
		padding: 20upx;

		.item {
			background: #f3f3f3;
			font-size: 30upx;
			color: #5c5c5c;
			padding: 15upx;
			margin-top: 10upx;

			.icon {
				width: 44upx;
				height: 44upx;
				margin-bottom: -10upx;
				margin-right: 20upx;
				display: inline-block;
			}

			.arrow {
				font-family: iconfont;
				float: right;
				font-size: 36upx;
				color: #5c5c5c;
			}

			switch {
				position: absolute;
				right: 15upx;
				top: 20upx;
			}

			&.switch {
				padding: 30upx 15upx;
				position: relative;
			}
		}

		.icon-ai {
			background: url('../../static/ai.png') no-repeat center center;
			background-size: contain;
		}

		.icon-mycar {
			background: url('../../static/mycar.png') no-repeat center center;
			background-size: contain;
		}

		.icon-xx {
			background: url('../../static/xx.png') no-repeat center center;
			background-size: contain;
		}

		.icon-yuyue {
			background: url('../../static/yuyue.png') no-repeat center center;
			background-size: contain;
		}

		.icon-tiezi {
			background: url('../../static/tiezi.png') no-repeat center center;
			background-size: contain;
		}

		.icon-quanzi {
			background: url('../../static/quanzi.png') no-repeat center center;
			background-size: contain;
		}

		.icon-fankui {
			background: url('../../static/fankui.png') no-repeat center center;
			background-size: contain;
		}

		.icon-shezhi {
			background: url('../../static/shezhi.png') no-repeat center center;
			background-size: contain;
		}

	}
</style>
