<template>
	<view class="content">
		<swiper v-if="images.length > 0" class="swipe" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
		 :circular="circular" :duration="duration" indicator-active-color="#ffffff">
			<swiper-item v-for="(image, index) in images" :key="index" class="swipe-item">
				<image :src="serverUrl + image" mode="widthFix"></image>
			</swiper-item>
		</swiper>

		<view class="plus"></view>

		<view class="section">
			<view class="item" v-for="(block, index) in blocks" :key="index">
				<image :src="serverUrl + block.img" mode="widthFix"></image>
				<text>{{block.name}}</text>
			</view>
		</view>

		<view class="block-title">
			<label class="icon-squre"></label>热门景区
		</view>

		<view class="scenic" v-for="(item, index) in hots" :key="index">
			<view class="info">
				<view class="name no-wrap">{{item.name}}</view>
				<view class="desc no-wrap">{{item.placeDesc}}</view>
				<view class="follow">
					<label @click="like(item)" class="icon-fine" :class="{'on': item.on}"></label>{{item.likes}}
				</view>
			</view>
			<view v-if="item.fileRecordDtoList && item.fileRecordDtoList.length > 0" class="image">
				<image :src="item.fileRecordDtoList[0].filePath" mode="widthFix"></image>
			</view>
			<view v-else class="image">
				<image src="../../static/default.png" mode="scaleToFill"></image>
			</view>
		</view>
		<uni-load-more :loadingType="loadingType"></uni-load-more>

	</view>
</template>

<script>
	import {
		serverUrl
	} from '../../common/constants.js';
	import * as api from "../../common/api.js";
	import uniLoadMore from '../../components/uni-load-more.vue'

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				serverUrl,
				hots: [],
				page: {
					current: 0,
					size: 5,
					total: 0
				},
				loadingType: 0,
				indicatorDots: true,
				autoplay: true,
				circular: true,
				interval: 2000,
				duration: 500,
				images: [
					"images/banner.png",
					"images/banner.png",
					"images/banner.png"
				],
				blocks: [{
						key: 'play',
						name: '个性玩法',
						img: 'images/block-0.png'
					},
					{
						key: 'reserve',
						name: '场地预约',
						img: 'images/block-1.png'
					},
					{
						key: 'moment',
						name: '精彩瞬间',
						img: 'images/block-2.png'
					},
					{
						key: 'consult',
						name: '景区咨询',
						img: 'images/block-3.png'
					}
				]
			}
		},
		onLoad() {
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});

			this.getHotPlaces();
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;

			this.getHotPlaces();
		},
		methods: {
			like(item) {
				let params = {
					id: item.id
				};
				api.likePlace(params, (error, data) => {

					if (!error && data) {
						if (data.code === "0" && data.data) {
							let {
								likes
							} = data.data;
							if (likes) {
								this.$set(item, 'likes', likes);
								this.$set(item, 'on', true);
							}
						}
					}
				});
			},
			getHotPlaces() {
				this.page.current++;
				let params = {
					...this.page,
					orderBy: "hot"
				};

				api.getPlaceList(params, (error, data) => {
					uni.hideLoading();

					if (!error && data) {
						if (data.code === "0" && data.data &&
							data.data.records && data.data.records.length) {
							this.hots = this.hots.concat(data.data.records);

							if (data.data.total) {
								this.page.total = data.data.total;
							}

							if (this.hots.length == this.page.total) {
								this.loadingType = 2;
							} else {
								this.loadingType = 0;
							}
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/common/app.scss";

	.swipe {
		flex: 1;
		width: 750upx;
		height: 350upx;
		background-color: #000;
		display: flex;
		flex-direction: column;

		.swipe-item {
			display: flex;
			align-items: center;
		}

		image {
			width: 750upx;
		}
	}

	.plus {
		width: 750upx;
		height: 100upx;
		background: #142039;
		background: linear-gradient(to bottom, #14233e, #142039);
	}

	.section {
		height: 180upx;
		margin: 0 20upx;
		margin-top: -100upx;
		padding: 20upx 0;
		background: #fff;
		display: flex;
		flex-direction: row;
		border-radius: 20upx;
		box-shadow: 0 15upx 10upx 0 #DDD;
		z-index: 100;

		.item {
			flex: 1;
			text-align: center;
			margin-left: 20upx;

			&:first-child {
				margin-left: 0;
			}

			image {
				width: 100%;
				height: 123upx;
			}

			text {
				width: 100%;
				font-size: 28upx;
				text-align: center;
				color: #333;
			}
		}

	}

	.scenic {
		display: flex;
		background: #fff;
		padding: 10upx 20upx;

		&:nth-last-of-type(2) .info {
			border-bottom: none;
		}

		.info {
			flex: 2;
			border-bottom: 1upx solid #ccc;
			min-width: 0;
			line-height: 60upx;

			.name {
				font-size: 30upx;
				color: #000;
			}

			.desc {
				font-size: 28upx;
				color: #5c5c5c;
			}

			.follow {
				font-size: 24upx;
				color: #ccc;
				line-height: 50upx;
			}
		}

		.image {
			flex: 1;
			margin-left: 10upx;
			margin-bottom: 10upx;
			border: 1upx solid #f3f3f3;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
