import {
	format
} from './formatDate';

/**
 * 日期格式化
 * @param timestamp
 * @param pattern 
 */
export function dateFmt(timestamp, pattern = 'yyyy-MM-dd hh:mm:ss') {
	if (!timestamp) {
		return '';
	}

	if (typeof timestamp == 'string' && timestamp.indexOf('.000+0000') > -1) {
		timestamp = timestamp.replace('.000+0000', '');
	}

	return format(new Date(timestamp), pattern);
}
