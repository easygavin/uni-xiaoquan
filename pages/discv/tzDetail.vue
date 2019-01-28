<template>
	<view class="content">
		<view class="section">
			<view class="block">
				<view class="create">
					<view v-if="detail.thumbnail" class="image">
						<image :src="detail.thumbnail" mode="widthFix"></image>
					</view>
					<view v-else class="image">
						<image src="../../static/default.png" mode="scaleToFill"></image>
					</view>
					<view class="text">
						<view class="user">
							<text>{{detail.createUser}}</text>
							<label class="date">{{detail.publishTime}}</label>
						</view>
						<view class="cat">【{{detail.columnType}}】</view>
					</view>
				</view>

				<view class="desc">{{detail.summary}}</view>
				<rich-text :nodes="detail.content"></rich-text>

				<!-- <view class="poster">
          <image v-for="(img, index) in detail.poster" :key="index" :src="img" mode="widthFix"></image>
        </view> -->

				<view class="view">
					<view class="ext">
						<label class="icon-ll"></label>
						{{detail.watchCount}}
					</view>
					<view class="ext">
						<label class="icon-pl"></label>
						{{detail.replyCount}}
					</view>
				</view>

				<view class="comment">
					<view class="title">全部评论（{{page.total}}）</view>

					<!-- 评论列表 -->
					<view class="items">
						<view class="item" v-for="(item, index) in comments" :key="index">
							<view v-if="item.thumbnail" class="image">
								<image :src="item.thumbnail" mode="widthFix"></image>
							</view>
							<view v-else class="image">
								<image src="../../static/default.png" mode="scaleToFill"></image>
							</view>
							<view class="text">
								<view class="user">
									<text>{{item.createUser}}</text>
									<label @click="like(item)" class="count" :class="{'on': item.on}">赞({{item.likes}})</label>
									<label class="count">回复({{item.replyCount}})</label>
								</view>
								<view class="date">{{index + 1}}楼 &nbsp;&nbsp; {{item.publishTime}}</view>
							</view>
							<rich-text class="desc" :nodes="item.content"></rich-text>
						</view>

						<uni-load-more :loadingType="loadingType"></uni-load-more>
					</view>
					<!-- /评论列表 -->
				</view>

			</view>
		</view>

		<view class="input">
			<input class="enter" type="text" v-model="content" placeholder="说点什么吧~"></input>
			<view class="button" @click="sendReply">
				<label class="send">&#xe734;</label>
			</view>
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
				detail: {
					id: null,
					title: ''
				},
				page: {
					current: 0,
					size: 5,
					total: 0
				},
				comments: [],
				loadingType: 0,
				content: ''
			}
		},
		onLoad(params) {
			this.detail = { ...params
			};
			uni.setNavigationBarTitle({
				title: params.title
			});

			if (this.detail.id) {
				this.getDetail();
			}
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;

			this.getReplyList();
		},
		methods: {
			onRefresh() {
				this.loadingType = 0;
				this.page.current = 0;
				this.page.total = 0;
				this.comments = [];
				this.getReplyList();
			},
			sendReply() {
				let params = {
					replyId: this.detail.id,
					columnType: this.detail.columnType,
					content: this.content
				};

				api.articleReply(params, (error, data) => {
					if (!error && data) {
						if (data.code === "0") {
							this.content = '';
							uni.showToast({
								title: '发送成功！',
								mask: false,
								duration: 1500
							});
							this.onRefresh();
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
			},
			getReplyList() {
				this.page.current++;

				api.getReplyList({ ...this.page,
					id: this.detail.id
				}, (error, data) => {
					uni.hideLoading();

					if (!error && data) {
						if (data.code === "0" && data.data &&
							data.data.records && data.data.records.length) {
							let list = data.data.records;
							list = list.map(item => {
								item.publishTime = util.dateFmt(item.publishTime, 'MM-dd-yyyy');
								return item;
							});

							this.comments = this.comments.concat(list);
						}

						if (data.data.total) {
							this.page.total = data.data.total;
						}

						if (this.comments.length == this.page.total) {
							this.loadingType = 2;
						} else {
							this.loadingType = 0;
						}
					}
				});
			},
			getDetail() {
				let params = {
					id: this.detail.id
				};

				uni.showLoading({
					mask: true,
					title: '加载中...'
				});
				api.getArticleDetail(params, (error, data) => {
					uni.hideLoading();

					if (!error && data) {
						if (data.code === "0" && data.data) {
							this.detail = { ...this.detail,
								...data.data,
								publishTime: util.dateFmt(data.data.publishTime)
							};
							this.getReplyList();
						}
					}
				});
			},
			like(item) {
				let params = {
					id: item.id
				};
				api.articleLike(params, (error, data) => {
					if (!error && data && data.code === "0") {
						this.$set(item, 'likes', item.likes + 1);
						this.$set(item, 'on', true);
						uni.showToast({
							title: '赞',
							mask: false,
							duration: 1500
						});
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/common/app.scss";

	.section {
		background: #fff;
		margin: 10upx 0;
		padding: 0 20upx;
		width: 710upx;
		overflow: hidden;
	}

	.block {
		border-bottom: 1upx solid #ccc;
		padding-top: 25upx;

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

		.desc {
			font-size: 24upx;
			line-height: 35upx;
			color: #5c5c5c;
			text-indent: 40upx;
		}

		.poster {
			image {
				display: inline-block;
				height: 180upx;
				width: 49%;
				padding: 10upx 0;

				&:nth-of-type(even) {
					margin-left: 2%;
				}
			}
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

	.comment {
		padding-bottom: 100upx;

		.title {
			font-size: 30upx;
			color: #000;
			line-height: 40upx;
			padding: 0 10upx;
			margin: 20upx 0;
		}

		.item {
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
						margin-left: 10upx;
					}
				}

				.count {
					font-size: 20upx;
					color: #b2b2b2;
					float: right;
					padding-left: 20upx;

					&.on {
						color: #E00202;
					}
				}

				.date {
					font-size: 24upx;
					color: #b2b2b2;
					line-height: 35upx;
					margin-left: 80upx;
				}
			}

			.desc {
				font-size: 24upx;
				line-height: 35upx;
				color: #5c5c5c;
				margin-left: 80upx;
				padding-bottom: 20upx;
			}
		}
	}

	.input {
		position: fixed;
		bottom: 0;
		height: 90upx;
		width: 100%;
		background: #fff;
		border-top: 1upx solid #e1e1e1;

		.enter {
			background: #f3f3f3;
			border-radius: 30px;
			width: 80%;
			height: 50upx;
			float: left;
			margin: 10upx 2%;
			font-size: 24upx;
			padding: 10upx 20upx;
			border: 1upx solid #ccc;
			color: #222;
		}

		.button {
			width: 10%;
			float: right;
			cursor: pointer;
			margin-top: 20upx;

			label {
				font-family: iconfont;
				font-size: 50upx;
			}
		}
	}
</style>
