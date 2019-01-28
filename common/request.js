import {
	serverUrl
} from './constants.js';

// 请求前部
let prefix = `${serverUrl}api/`;

/**
 * AJAX请求
 */
function request(configs, callback) {
	configs.url = `${prefix}${configs.url}`;
	let params = {
		...configs,
		success: (res) => {
			callback(null, res.data);
		},
		fail: (error) => {
			console.log('error:', error);
			callback(error)
		}
	};

	console.log(JSON.stringify(params));
	
	try{
		uni.request(params);
	} catch(e){
		console.log('network error: ', e);
	}
}

/**
 * GET请求
 */
export function get(configs, callback) {
	configs.method = 'GET';
	request(configs, callback);
}

/**
 * POST请求
 */
export function post(configs, callback) {
	configs.method = 'POST';
	
	if (!configs.header) {
		configs.header = {
			'content-type': 'application/x-www-form-urlencoded',
		};
	} else if (!configs.header['content-type']) {
		configs.header['content-type'] = 'application/x-www-form-urlencoded';
	}
	
	request(configs, callback);
}

/**
 * PUT请求
 */
export function put(configs, callback) {
	configs.method = 'PUT';
	
	if (!configs.header) {
		configs.header = {
			'content-type': 'application/x-www-form-urlencoded',
		};
	} else if (!configs.header['content-type']) {
		configs.header['content-type'] = 'application/x-www-form-urlencoded';
	}
	
	request(configs, callback);
}

/**
 * DELETE请求
 */
export function del(configs, callback) {
	configs.method = 'DELETE';
	
	request(configs, callback);
}
