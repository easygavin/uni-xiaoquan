<template>
	<view class="content">
		<view class="section">
		
			<view class="items">
				<view class="item qz-item" v-for="(item, index) in list" :key="index">
					<view v-if="item.fileRecordDtoList && item.fileRecordDtoList.length > 0" class="image">
						<image :src="item.fileRecordDtoList[0].filePath"></image>
					</view>
					<view v-else class="image">
						<image src="../../static/default.png" mode="scaleToFill"></image>
					</view>
					<view class="info">
						<view class="opt">
							<label class="icon-xb"></label>
							{{item.zoneName}}
							<view @click="takeZone(item)" class="add">
								<view v-if="item.join">
									取消加入
									<label class="icon icon-cancel"></label>
								</view>
								<view v-else>
									加入
									<label class="icon icon-add"></label>
								</view>
							</view>
						</view>
						<view class="desc no-wrap">{{item.slogan}}</view>
						<view class="ext">{{item.createTime}}</view>
					</view>
				</view>
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

			this.getZones();
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;

			this.getZones();
		},
		methods: {
			onRefresh() {
				this.loadingType = 0;
				this.page.current = 0;
				this.page.total = 0;
				this.list = [];
				this.getZones();
			},
			takeZone(item) {
				let params = {
					zoneId: item.id
				};
			
				if (!item.join) {
					api.joinZone(params, (error, data) => {
						if (!error && data) {
							if (data.code === "0") {
								this.$set(item, 'join', !!!item.join);
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
				} else {
					api.leaveZone(params, (error, data) => {
						if (!error && data) {
							if (data.code === "0") {
								this.$set(item, 'join', !!!item.join);
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
				}
			
			},
			getZones() {
				this.page.current++;

				api.getMyQzList(this.page, (error, data) => {
					uni.hideLoading();

					if (!error && data) {
						if (data.code === "0" && data.data &&
							data.data.records && data.data.records.length) {
							let list = data.data.records;

							list = list.map(item => {
								item.createTime = util.dateFmt(item.createTime, 'MM-dd hh:mm');
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
		background: #fff;
		padding: 0 20upx;

		.item {
			display: flex;
			padding: 20upx 0;
			border-bottom: 1upx solid #ccc;

			&:nth-last-of-type(1) {
				border-bottom: none;
			}

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
	}
</style>
