<template>
	<view class="content">
		<view class="section">

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

			this.getMyArticles();
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;

			this.getMyArticles();
		},
		methods: {
			getMyArticles() {
				this.page.current++;

				api.getMyArticles(this.page, (error, data) => {
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
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/common/app.scss";

	.section {
		padding: 0 20upx;
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
