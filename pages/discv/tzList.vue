<template>
	<view class="content">
		<view class="block">
			<view class="block-title">
				<label class="icon-squre"></label>热门板块
				<view class="more" @click="toExpand">
					<label>&#xe634;</label>
				</view>
			</view>

			<view v-if="!expand">
				<view class="categry" v-if="columns.length < 6">
					<label class="item" v-for="(c, index) in columns" :key="index" :class="'c' + (index % 5)">{{c.zoneName}}</label>
				</view>
				<view v-else>
					<view class="categry">
						<label class="item" v-for="(c, index) in columns.slice(0, 6)" :key="index" :class="'c' + (index % 5)">{{c.zoneName}}</label>
					</view>
				</view>
			</view>
			<view v-else>
				<view class="categry">
					<label class="item" v-for="(c, index) in columns" :key="index" :class="'c' + (index % 5)">{{c.zoneName}}</label>
				</view>
			</view>

		</view>

		<!-- 帖子 -->
		<view class="block-title">
			<label class="icon-squre"></label>热门帖子
		</view>

		<view class="items">
			<navigator :url="'/pages/discv/tzDetail?id=' + item.id + '&title=' + item.title" class="item" v-for="(item, index) in list"
			 :key="index">
				<view class="create">
					<view v-if="item.thumbnail" class="image">
						<image :src="item.thumbnail" mode="widthFix"></image>
					</view>
					<view v-else class="image">
						<image src="../../static/default.png" mode="scaleToFill"></image>
					</view>
					<view class="text">
						<view class="user">
							<text>{{item.createUser}}</text>
							<label class="date">{{item.publishTime}}</label>
						</view>
						<view class="cat">【{{item.columnType}}】</view>
					</view>
				</view>
				<view class="name no-wrap clearfix">{{item.title}}</view>
				<view class="desc no-wrap clearfix">{{item.summary}}</view>
				<view class="view">
					<view class="ext">
						<label class="icon-ll"></label>{{item.watchCount}}
					</view>
					<view class="ext">
						<label class="icon-pl"></label>{{item.replyCount}}
					</view>
				</view>
			</navigator>
		</view>
		<uni-load-more :loadingType="loadingType"></uni-load-more>
		
	</view>
</template>

<script>
	import * as api from "../../common/api.js";
	import * as util from "../../common/util.js";
	import uniLoadMore from '../../components/uni-load-more.vue'

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				expand: false,
				columns: [],
				page: {
					current: 0,
					size: 10,
					total: 0
				},
				list: [],
				loadingType: 0
			}
		},
		onLoad() {
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});

			this.getColumns();
			this.getArticles();
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;

			this.getArticles();
		},
		onNavigationBarButtonTap(e) {
			if (e.text == '我的') {
				uni.navigateTo({
					url: '/pages/me/myTz',
				});
			}
		},
		methods: {
			getArticles() {
				this.page.current++;

				api.getArticlesHot(this.page, (error, data) => {
					uni.hideLoading();

					if (!error && data) {
						if (data.code === "0" && data.data &&
							data.data.records && data.data.records.length) {
							let list = data.data.records;
							list = list.map(item => {
								item.publishTime = util.dateFmt(item.publishTime);
								return item;
							});

							this.list = this.list.concat(list);
						}

						if (data.data.total) {
							this.page.total = data.data.total;
						}

						if (this.list.length == this.page.total) {
							this.loadingType = 2;
						} else {
							this.loadingType = 0;
						}
					}
				});
			},
			toExpand() {
				this.expand = !this.expand;
			},
			getColumns() {
				let params = {
					current: 1,
					size: 100
				};
				api.getArticlesColumns(params, (error, data) => {

					if (!error && data) {
						if (data.code === "0" && data.data &&
							data.data.records && data.data.records.length) {
							this.columns = data.data.records;
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
		background: #fff;
		margin: 10upx 0;

		.more {
			font-size: 50upx;
			margin-top: -10upx;
		}

		.categry {
			padding: 20upx 20upx 30upx 20upx;

			.item {
				display: inline-block;
				width: 100upx;
				height: 80upx;
				line-height: 80upx;
				vertical-align: middle;
				border-radius: 50%/50%;
				font-size: 28upx;
				color: #fff;
				text-align: center;
				margin: 12upx 20upx;
				box-shadow: 0 0 4upx 4upx #d7d7ac;
				overflow: hidden;

				&.c0 {
					background: #f6a881;
				}

				&.c1 {
					background: #f68181;
				}

				&.c2 {
					background: #90b65a;
				}

				&.c3 {
					background: #4f67c2;
				}

				&.c4 {
					background: #d0c249;
				}
			}
		}
	}

	.items {
		background: #fff;
		padding: 0 20upx;
	}

	.item {
		padding: 10upx 0;
		border-bottom: 1upx solid #ccc;
		height: 225upx;

		&:nth-last-of-type(1) {
			border-bottom: none;
		}

		.create {
			.image {
				height: 70upx;
				width: 70upx;
				border-radius: 5upx;
				overflow: hidden;
				float: left;
				border: 1upx solid #f3f3f3;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.text {
				.user {
					font-size: 30upx;
					color: #000;
					line-height: 40upx;
					padding: 0 10upx;

					text {
						margin-left: 20upx;
					}
				}

				.date {
					font-size: 20upx;
					color: #b2b2b2;
					float: right;
				}

				.cat {
					font-size: 24upx;
					color: #b2b2b2;
					line-height: 35upx;
				}
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
			line-height: 35upx;
		}

		.view {
			font-size: 24upx;
			color: #b2b2b2;
			text-align: right;
			padding: 10upx 0;

			.ext {
				margin-left: 20upx;
				display: inline-block;

				label {
					margin-right: 10upx;
					margin-bottom: -6upx;
				}
			}
		}
	}
</style>
