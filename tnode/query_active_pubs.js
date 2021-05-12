const http = require('http');
const qs = require('querystring');

const STATS_URL = 'http://ssp.yoo.yunpro.cn/stats_api';

const startDate = getStartOfDay(process.argv[2] || new Date());
const endDate = getEndOfDay(process.argv[2]);

const params = {};
params.start = startDate.getTime();
if (endDate) params.end = endDate.getTime();
params.scale = 1000 * 60 * 60 * 24;
params.field = ['view', 'filter'];
params.groupBy = ['pubID'];
params.format = 'series';

query(params, (err, data) => {
    if (err) {
        return console.log(err.message);
    }
    var pubs = data.map(item => item.pubID);
    pubs.sort();
    for (var ele in pubs) {
        console.log(pubs[ele]);
    }
});

/* START utils */

function query(params, callback) {
    http.get(
        `${STATS_URL}?${qs.stringify(params)}`,
        (res) => {
            let result = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                result += chunk;
            });
            res.on('end', () => {
                let parsedResult;
                try {
                    parsedResult = JSON.parse(result);
                } catch (e) {
                    return callback(new Error(result));
                }
                callback(null, parsedResult);
            });
        }
    ).on('error', (err) => {
        console.log(err.stack);
        callback(err);
    });
}

function getStartOfDay(date) {
    if (typeof date === 'string') {
        return new Date(`${date} 00:00:00`);
    }
    const year = `${date.getFullYear()}`;
    const month = date.getMonth() >= 9 ? `${date.getMonth() + 1}` : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? `${date.getDate()}` : `0${date.getDate()}`;
    return new Date(`${year}-${month}-${day} 00:00:00`);
}

function getEndOfDay(date) {
    const now = Date.now();
    if (typeof date === 'string') {
        let d = new Date(`${date} 23:59:59`);
        if (d.getTime() >= now) {
            return null;
        }
        return d;
    }
    return null;
}

/* END utils */