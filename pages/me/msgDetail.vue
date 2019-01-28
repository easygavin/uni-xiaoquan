<template>
	<view class="content">
		<view class="section">
			<view class="title">{{detail.msgTitle}}</view>
			<view class="date">{{detail.sendTime}}</view>
			<rich-text class="desc" :nodes="detail.msgContent"></rich-text>
		</view>
	</view>
</template>

<script>
	import * as api from "../../common/api.js";
	import * as util from "../../common/util.js";

	export default {
		data() {
			return {
				detail: {
					id: null,
					title: ''
				}
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
		methods: {
			getDetail() {
				let params = {
					id: this.detail.id
				};

				uni.showLoading({
					mask: true,
					title: '加载中...'
				});
				api.getMsgDetail(params, (error, data) => {
					uni.hideLoading();

					if (!error && data) {
						if (data.code === "0" && data.data) {
							this.detail = { ...this.detail,
								...data.data,
								sendTime: util.dateFmt(data.data.sendTime, 'MM-dd hh:mm')
							};
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
		margin: 10upx 0;
		padding: 0 20upx;

		.title {
			font-size: 30upx;
			color: #000;
			line-height: 40upx;
			padding: 20upx 0;
			text-align: center;
		}

		.date {
			font-size: 20upx;
			color: #b2b2b2;
			text-align: right;
		}

		.desc {
			font-size: 24upx;
			line-height: 35upx;
			color: #5c5c5c;
			padding-top: 40upx;
		}
	}
</style>
