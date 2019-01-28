<template>
	<view class="content">

		<!-- 模块 -->
		<view class="block">
			<navigator url="/pages/discv/tzList" class="which">
				<label class="icon-lt"></label>
				<text>论坛</text>
			</navigator>
			<view class="which">
				<label class="icon-hd"></label>
				<text>活动</text>
			</view>
			<navigator url="/pages/discv/qzList" class="which">
				<label class="icon-qz"></label>
				<text>圈子</text>
			</navigator>
		</view>
		<!-- /模块 -->

		<!-- 帖子 -->
		<view class="block-title">
			<label class="icon-squre"></label>热门帖子
			<navigator url="/pages/discv/tzList" class="more">
				更多<label>&#xe62e;</label>
			</navigator>
		</view>

		<view class="items">
			<navigator :url="'/pages/discv/tzDetail?id=' + article.id + '&title=' + article.title" 
				class="item tz-item" v-for="(article, index) in articles" :key="index">
				<view v-if="article.thumbnail" class="image">
					<image :src="article.thumbnail" mode="widthFix"></image>
				</view>
				<view v-else class="image">
					<image src="../../static/default.png" mode="scaleToFill"></image>
				</view>
				<view class="info">
					<view class="user">
						<label class="icon-user"></label>{{article.createUser}}
					</view>
					<view class="name no-wrap">{{article.title}}</view>
					<view class="desc no-wrap">{{article.summary}}</view>
					<view class="ext">
						<view class="time">{{article.publishTime}}</view>
						<view class="view">{{article.watchCount}}浏览&nbsp;&nbsp;&nbsp;&nbsp;{{article.replyCount}}评论</view>
					</view>
				</view>
			</navigator>
		</view>
		<!-- 帖子 -->

		<!-- 活动 -->
		<view class="block-title">
			<label class="icon-squre"></label>最新活动
			<view class="more">
				更多<label>&#xe62e;</label>
			</view>
		</view>

		<view class="items">
			<view class="item hd-item">
				<image class="image" src="http://www.aboutdt.com/images/hd-1.png" mode="widthFix"></image>
				<view class="name no-wrap">智能机器时代来临，他们都亲临现场啦！</view>
				<view class="desc no-wrap">用户体验调查！</view>
				<view class="ext">
					<view class="time">12分钟前</view>
					<view class="view">838浏览&nbsp;&nbsp;&nbsp;&nbsp;136回复</view>
				</view>
			</view>
			<view class="item hd-item">
				<image class="image" src="http://www.aboutdt.com/images/hd-2.png"></image>
				<view class="name no-wrap">智能机器时代来临，他们都亲临现场啦！</view>
				<view class="desc no-wrap">用户体验调查！</view>
				<view class="ext">
					<view class="time">12分钟前</view>
					<view class="view">838浏览&nbsp;&nbsp;&nbsp;&nbsp;136回复</view>
				</view>
			</view>
		</view>
		<!-- /活动 -->

		<!-- 圈子 -->
		<view class="block-title">
			<label class="icon-squre"></label>最热圈子
			<navigator url="/pages/discv/qzList" class="more">
				更多<label>&#xe62e;</label>
			</navigator>
		</view>

		<view class="items">
			<view class="item qz-item" v-for="(zone, index) in zones" :key="index">
				<view v-if="zone.fileRecordDtoList && zone.fileRecordDtoList.length > 0" class="image">
					<image :src="zone.fileRecordDtoList[0].filePath" mode="widthFix"></image>
				</view>
				<view v-else class="image">
					<image src="../../static/default.png" mode="scaleToFill"></image>
				</view>
				<view class="info">
					<view class="opt">
						<label class="icon-xb"></label>
						{{zone.zoneName}}
						<view @click="takeZone(zone)" class="add">
							<view v-if="zone.join">
								取消加入
								<label class="icon icon-cancel"></label>
							</view>
							<view v-else>
								加入
								<label class="icon icon-add"></label>
							</view>
						</view>
					</view>
					<view class="desc no-wrap">{{zone.slogan}}</view>
					<view class="ext">{{zone.createTime}}</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import * as api from "../../common/api.js";
	import * as util from "../../common/util.js";

	export default {
		data() {
			return {
				articles: [],
				zones: []
			}
		},
		onLoad() {
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});

			this.getArticles();
			this.getZones();
		},
		onNavigationBarButtonTap(e) {
			console.log(JSON.stringify(e));
		},
		methods: {
			takeZone(item) {
				let params = {
					zoneId: item.id
				};

				if (!item.join) {
					api.joinZone(params, (error, data) => {
						if (!error && data) {
							if (data.code === "0") {
								this.$set(item, 'join', !!!item.join);
							} else {
								uni.showToast({
									icon: 'none',
									title: data.msg,
									mask: false,
									duration: 1500
								});
							}
						}
					});
				} else {
					api.leaveZone(params, (error, data) => {
						if (!error && data) {
							if (data.code === "0") {
								this.$set(item, 'join', !!!item.join);
							} else {
								uni.showToast({
									icon: 'none',
									title: data.msg,
									mask: false,
									duration: 1500
								});
							}
						}
					});
				}

			},
			getArticles() {
				let params = {
					current: 1,
					size: 2
				};
				api.getArticlesHot(params, (error, data) => {
					uni.hideLoading();

					if (!error && data) {
						if (data.code === "0" && data.data &&
							data.data.records && data.data.records.length) {
								let list = data.data.records;
								list = list.map(item => {
									item.publishTime = util.dateFmt(item.publishTime);
									return item;
								});
								
								this.articles = list;
						}
					}
				});
			},
			getZones() {
				let params = {
					current: 1,
					size: 2
				};
				api.getQzHotList(params, (error, data) => {

					if (!error && data) {
						if (data.code === "0" && data.data &&
							data.data.records && data.data.records.length) {
								let list = data.data.records;
								list = list.map(item => {
									item.createTime = util.dateFmt(item.createTime, 'MM-dd hh:mm');
									return item;
								});
								
								this.zones = list;
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/common/app.scss";

	.block {
		margin: 10upx 0;
		height: 235upx;
		display: flex;
		background: #fff;

		.which {
			flex: 1;
			text-align: center;
			font-size: 28upx;
			color: #000;
			padding: 30upx 0;

			label {
				width: 130upx;
				height: 130upx;
				display: inline-block;
			}

			text {
				display: block;
				width: 100%;
				text-align: center;
			}
		}

	}

	.icon-lt {
		background: url('../../static/lt.png') no-repeat center center;
		background-size: contain;
	}

	.icon-hd {
		background: url('../../static/hd.png') no-repeat center center;
		background-size: contain;
	}

	.icon-qz {
		background: url('../../static/qz.png') no-repeat center center;
		background-size: contain;
	}

	.items {
		background: #fff;
		padding: 0 20upx;
	}

	.item {
		padding: 20upx 0;
		border-bottom: 1upx solid #ccc;

		&:last-child {
			border-bottom: none;
		}
	}

	/* 帖子 */
	.tz-item {
		display: flex;

		.image {
			flex: 1;
			border: 1upx solid #f3f3f3;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.info {
			flex: 4;
			min-width: 0;
			margin-left: 12upx;

			.user {
				font-size: 30upx;
				color: #000;
				position: relative;
				padding-left: 40upx;
				line-height: 45upx;

				label {
					position: absolute;
					top: 6upx;
					left: 0;
				}
			}

			.name {
				font-size: 28upx;
				color: #5c5c5c;
				line-height: 40upx;
			}

			.desc {
				font-size: 24upx;
				color: #5c5c5c;
				line-height: 36upx;
			}

			.ext {
				font-size: 20upx;
				color: #b2b2b2;

				.time {
					float: left;
				}

				.view {
					float: right;
				}
			}
		}
	}

	/** 活动 **/
	.hd-item {
		.image {
			width: 100%;
			height: 256upx;
			border: 1upx solid #f3f3f3;
		}

		.name {
			font-size: 30upx;
			line-height: 50upx;
			color: #000;
		}

		.desc {
			font-size: 28upx;
			color: #5c5c5c;
			line-height: 35upx;
		}

		.ext {
			font-size: 20upx;
			color: #b2b2b2;
			height: 35upx;

			.time {
				float: left;
			}

			.view {
				float: right;
			}
		}
	}

	.qz-item {
		display: flex;

		.image {
			flex: 1;
			border: 1upx solid #f3f3f3;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.info {
			flex: 4;
			min-width: 0;
			margin-left: 12upx;

			.opt {
				font-size: 30upx;
				color: #000;
				position: relative;
				padding-left: 40upx;
				line-height: 50upx;

				.icon-xb {
					position: absolute;
					top: 10upx;
					left: 0;
				}

				.add {
					position: absolute;
					top: 0;
					right: 0;
					color: #5c5c5c;
					padding-right: 40upx;
					
					.icon {
						position: absolute;
						right: 0;
						top: 10upx;
					}
				}
			}

			.desc {
				font-size: 28upx;
				color: #5c5c5c;
				line-height: 45upx;
			}

			.ext {
				font-size: 20upx;
				color: #b2b2b2;

				.time {
					float: left;
				}

				.view {
					float: right;
				}
			}
		}
	}
</style>
