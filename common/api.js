import * as request from './request.js';

/**
 * 景点
 * @param data 
 */
export function getPlaceList(data, callback) {
	request.get({
		url: `app/place`,
		data
	}, callback);
}

export function likePlace(data, callback) {
	request.put({
		url: `app/place/${data.id}`,
		data
	}, callback);
}

/**
 * 帖子版块
 * @param data 
 */
export function getQzHotList(data, callback) {
	request.get({
		url: `app/zone/hot`,
		data
	}, callback);
}

export function getQzList(data, callback) {
	request.get({
		url: `app/zone`,
		data
	}, callback);
}

export function getMyQzList(data, callback) {
	request.get({
		url: `app/zone/query-my`,
		data
	}, callback);
}

export function joinZone(data, callback) {
	request.post({
		url: `app/zone`,
		data
	}, callback);
}

export function leaveZone(data, callback) {
	request.del({
		url: `app/zone?zoneId=${data.zoneId}`,
		data,
	}, callback);
}

/**
 * 论坛版块
 * @param data 
 */
export function getArticlesHot(data, callback) {
	request.get({
		url: `app/articles-info/hot`,
		data
	}, callback);
}

export function getArticlesColumns(data, callback) {
	request.get({
		url: `app/articles-info/column`,
		data
	}, callback);
}

export function getMyArticles(data, callback) {
	request.get({
		url: `app/articles-info/query-my`,
		data
	}, callback);
}

export function getArticleDetail(data, callback) {
	request.get({
		url: `app/articles-info/${data.id}`,
		data
	}, callback);
}

export function getReplyList(data, callback) {
	request.get({
		url: `app/articles-info/reply-list`,
		data
	}, callback);
}

export function articleLike(data, callback) {
	request.get({
		url: `app/articles-info/like/${data.id}`,
		data
	}, callback);
}

export function articleReply(data, callback) {
	request.post({
		url: `app/articles-info/reply`,
		data
	}, callback);
}


/**
 * 我的
 * @param data 
 */
export function getUserConf(data, callback) {
	request.get({
		url: `app/userConf/my`,
		data
	}, callback);
}

export function updateUserConf(data, callback) {
	request.put({
		url: `app/userConf/change`,
		data
	}, callback);
}

export function getMsgList(data, callback) {
	request.get({
		url: `app/msg`,
		data
	}, callback);
}

export function getMsgDetail(data, callback) {
	request.get({
		url: `app/msg/${data.id}`,
		data
	}, callback);
}
