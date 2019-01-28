<template>
	<view class="content">
		<form v-if="!loading" class="form">
			<view class="form-item" v-for="(item, key) in typeMap" :key="key">
				<view class="label">接收{{item.label}}消息</view>
				<view class="input">
					<switch :checked="item.type" @change="changeConf($event, key)" />
				</view>
			</view>
		</form>
	</view>
</template>

<script>
	import * as api from "../../common/api.js";

	export default {
		data() {
			return {
				loading: true,
				typeMap: {
					'weatherMsg': {
						label: '天气',
						type: true
					},
					'carMsg': {
						label: '汽车',
						type: true
					},
					'articleMsg': {
						label: '论坛',
						type: true
					},
					'activity': {
						label: '活动',
						type: true
					},
					'zoneMsg': {
						label: '圈子',
						type: true
					}
				}
			}
		},
		onLoad() {
			uni.showLoading({
				mask: true,
				title: '加载中...'
			});
			
			this.getUserConf();
		},
		methods: {
			changeConf(e, key) {
				let params = {
					msgType: key,
					type: e.target.value ? 'open' : 'close'
				};

				api.updateUserConf(params, (error, data) => {

					if (!error && data) {
						if (data.code === "0") {
							this.typeMap[key].type = e.target.value;
						}
					}
				});
			},
			getUserConf() {
				this.loading = true;
				api.getUserConf(null, (error, data) => {
					uni.hideLoading();
					this.loading = false;

					if (!error && data) {
						if (data.code === "0" && data.data && data.data.length) {
							data.data.forEach(item => {
								if (this.typeMap[item.configType]) {
									this.typeMap[item.configType].type = item.configValue == '1' ? true : false;
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

	.content {
		background: #fff;
	}

	.form {
		padding: 20upx 0;
	}

	.form-item {
		display: flex;
		margin: 0 20upx;
		font-size: 30upx;
		padding: 20upx;
		border-bottom: 1upx solid #ebedf0;

		.label {
			flex: 1;
			height: 80upx;
			line-height: 80upx;
			vertical-align: middle;
		}

		.input {
			flex: 1;
			text-align: right;
		}
	}
</style>
