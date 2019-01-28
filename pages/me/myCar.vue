<template>
	<view class="content">
		<form @submit="submit" class="form">
			<view class="form-item">
				<view class="label">汽车品牌：</view>
				<view class="input">
					<input :value="form.brand" class="uni-input" placeholder="请输入汽车品牌" />
				</view>
			</view>
			<view class="form-item">
				<view class="label">汽车型号：</view>
				<view class="input">
					<input :value="form.type" class="uni-input" placeholder="请输入汽车型号" />
				</view>
			</view>
			<view class="form-item">
				<view class="label">车牌号：</view>
				<view class="input">
					<input :value="form.carId" class="uni-input" placeholder="请输入车牌号" />
				</view>
			</view>
			<view class="button">
				<button formType="submit" type="primary">保存</button>
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					brand: '',
					type: '',
					carId: ''
				}
			}
		},
		onLoad() {

		},
		methods: {
			submit() {}
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
			position: relative;

			&:before {
				content: "*";
				position: absolute;
				left: -20upx;
				font-size: 28upx;
				color: #f44;
			}
		}

		.input {
			flex: 3;
		}
	}
	
	.button {
		margin: 20upx 40upx;
		
		button {
			height: 80upx;
			font-size: 36upx;
		}
	}
</style>
