<template>
	<view class="content">
		<view class="section">

			<view class="items">
				<navigator :url="'/pages/me/msgDetail?id=' + item.id + '&title=' + item.msgTitle" class="item" v-for="(item, index) in list" :key="index">
					<view class="image">
						<label class="icon-msg"></label>
					</view>
					<view class="info">
						<view class="opt no-wrap">
							{{item.msgTitle}}
							<view class="add">
								{{item.sendTime}}
							</view>
						</view>
						<view class="desc no-wrap">{{item.msgContent}}</view>
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

			this.getMsgList();
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;

			this.getMsgList();
		},
		methods: {
			getMsgList() {
				this.page.current++;

				api.getMsgList(this.page, (error, data) => {
					uni.hideLoading();

					if (!error && data) {
						if (data.code === "0" && data.data &&
							data.data.records && data.data.records.length) {
								let list = data.data.records;
								
								list = list.map(item => {
									item.sendTime = util.dateFmt(item.sendTime, 'MM-dd hh:mm');
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

	.item {
		display: flex;
		padding: 10upx 0;
		border-bottom: 1upx solid #ccc;

		&:nth-last-of-type(1) {
			border-bottom: none;
		}

		.image {
			flex: 1;

			label {
				margin: 30upx;
			}
		}

		.info {
			flex: 5;
			min-width: 0;
			margin-left: 12upx;

			.opt {
				font-size: 30upx;
				color: #000;
				position: relative;
				line-height: 50upx;
				padding-right: 160upx;

				.add {
					position: absolute;
					top: 0;
					right: 0;
					color: #5c5c5c;
					font-size: 24upx;
				}
			}

			.desc {
				font-size: 28upx;
				color: #5c5c5c;
				line-height: 45upx;
			}
		}
	}
</style>
