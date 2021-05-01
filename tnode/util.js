var moment = require('moment')

    // 获取某个日期的时间戳, 精确到秒, 单位为秒
var getTimestamp = function(date) {
    return Date.parse(date) / 1000
}

var getStartTime = function(date) {
    date = Number(date) || (new Date()).getTime();
    return moment(date).startOf('day').clone().toDate();
};

var getUTC = function(date) {
    return moment(date).utcOffset(8);
}

var dateFormat = function(date) {
    return getUTC(date).format("YYYYMMDD");
};


module.exports = {
    getTimestamp: getTimestamp,
    getStartTime: getStartTime,
    dateFormat: dateFormat,
}