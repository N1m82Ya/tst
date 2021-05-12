var _ = require('lodash'),
    async = require('async'),
    gaussian = require('gaussian'),
    fft_lib = require('fft'),
    models = require('./models');



var countKeys = _.pull(_.keys(models.count), '_id', '__v');
var distinctKeys = _.pull(_.keys(models.distinct), '_id', '__v');
var histogramKeys = _.pull(_.keys(models.histogram), '_id', '__v');
var actionKeys = _.pull(_.keys(models.action), '_id', '__v');




var scoreWeight = {
    'verify-diff-uid': 5,
    'view-hf-ip': 5,
    'click-diff-ip': 5,
    'click-diff-ua': 5,
    'click-diff-uid': 5,
    'click-hf-ip': 5,
    'ucts': 5,
    'view-hf-uid': 10,
    'click-hf-uid': 10,
    'click-gap': 10,
    'short-long': 10,
    'action-s2': 10,
    'action-s3': 10,
    'action-hv': 10,
};


function makeZeroObj(keys) {
    return _.zipObject(keys, _.range(0, _.size(keys), 0));
}

var hkey = _.map(_.range(24), function(ele) {
    return "" + ele
});

var result = {};
var fs = require("fs");

var data = fs.readFileSync('./log/count.log1');
result.count = JSON.parse(data.toString());

data = fs.readFileSync('./log/action.log1');
result.action = JSON.parse(data.toString());

data = fs.readFileSync('./log/distinct.log1');
result.distinct = JSON.parse(data.toString());

data = fs.readFileSync('./log/minicount.log1');
result.minicount = JSON.parse(data.toString());

data = fs.readFileSync('./log/histogram.log1');
result.histogram = JSON.parse(data.toString());

data = fs.readFileSync('./wantkeys');
wantkeys = _.trim(data.toString(), "\n");


function tidyData(result) {
    var dataSet = {};

    // 将 count 每个小时的数据合在一起
    _.forEach(result.count, function(value) {
        var pubid = value._id.split('::')[0];
        var _doc = _.omit(value, ['_id', 'id', 'hour', '__v', 'date']);
        dataSet[pubid] = dataSet[pubid] || {};
        dataSet[pubid]['count'] = dataSet[pubid]['count'] || makeZeroObj(countKeys);
        _.forEach(_doc, function(v, k) {
            dataSet[pubid]['count'][k] += v;
        });
    });
    _.forEach(result.distinct, function(value) {
        var pubid = value._id.split('::')[0];
        var _doc = _.omit(value, ['_id', '__v', 'date']);
        dataSet[pubid] = dataSet[pubid] || {};
        dataSet[pubid]['distinct'] = makeZeroObj(distinctKeys);
        _.forEach(_doc, function(v, k) {
            dataSet[pubid]['distinct'][k] += v['$numberLong']; // 单个超过20亿再处理
        });
    });
    _.forEach(result.histogram, function(value) {
        var pubid = value._id.split('::')[0];
        var _doc = _.omit(value, ['_id', '__v', 'date']);
        dataSet[pubid] = dataSet[pubid] || {};
        dataSet[pubid]['histogram'] = _doc;
    });
    _.forEach(result.action, function(value) {
        var pubid = value._id.split('::')[0];
        var _doc = _.omit(value, ['_id', '__v', 'date']);
        dataSet[pubid] = dataSet[pubid] || {};
        dataSet[pubid]['action'] = makeZeroObj(actionKeys);
        _.forEach(_doc, function(v, k) {
            dataSet[pubid]['action'][k] += v;
        });
    });
    _.forEach(result.minicount, function(value) {
        var pubid = value._id.split("::")[0];
        var _doc = _.omit(value, ['_id', 'date']);
        dataSet[pubid] = dataSet[pubid] || {};
        dataSet[pubid]["minicount"] = _doc;
    });

    return dataSet;
}

function tidyDataSingle(result) {
    var dataSet = {};
    var pubid;
    _.forEach(result.count, function(value) {
        pubid = value._id.split('::')[0];
        var _doc = _.omit(value, ['_id', 'id', 'hour', '__v', 'date']);
        dataSet[pubid] = dataSet[pubid] || {};
        dataSet[pubid]['count'] = dataSet[pubid]['count'] || makeZeroObj(countKeys);
        _.forEach(_doc, function(v, k) {
            dataSet[pubid]['count'][k] += v;
        });
    });

    (function tidyDistinct(result) {
        var value = result.distinct;
        var pubid = value._id.split('::')[0];
        var _doc = _.omit(value, ['_id', '__v', 'date']);
        dataSet[pubid] = dataSet[pubid] || {};
        dataSet[pubid]['distinct'] = makeZeroObj(distinctKeys);
        _.forEach(_doc, function(v, k) {
            dataSet[pubid]['distinct'][k] += v['$numberLong']; // 单个超过20亿再处理
        });
    })(result);

    (function tidyHistogram(result) {
        var value = result.histogram;
        var pubid = value._id.split('::')[0];
        var _doc = _.omit(value, ['_id', '__v', 'date']);
        dataSet[pubid] = dataSet[pubid] || {};
        dataSet[pubid]['histogram'] = _doc;
    })(result);


    (function tidyAction(result) {
        var value = result.action;
        var pubid = value._id.split('::')[0];
        var _doc = _.omit(value, ['_id', '__v', 'date']);
        dataSet[pubid] = dataSet[pubid] || {};
        dataSet[pubid]['action'] = makeZeroObj(actionKeys);
        _.forEach(_doc, function(v, k) {
            dataSet[pubid]['action'][k] += v;
        });
    })(result);


    (function tidyMinicount(result) {
        var value = result.minicount;
        var _doc = _.omit(value, ['_id', 'date']);
        dataSet[pubid] = dataSet[pubid] || {};
        dataSet[pubid]["minicount"] = _doc;
    })(result);


    return dataSet;
}

function doone(result) {
    var score = {};
    // var dataSet = tidyDataSingle(result);
    var dataSet = tidyData(result)

    // 计算分数
    _.forEach(dataSet, function(data, pubid) {
        var pubScore = {};
        var histogram = data.histogram;
        var distinct = data.distinct;
        var count = data.count;
        var action = data.action;
        var minicount = data.minicount;
        if (count) {

            pubScore['verify-miss'] = invPstScore(count['verify-miss'], count['verify-miss'] + count['view']);
            pubScore['verify-diff-uid'] = invPstScore(count['verify-different-uid'], count['view']);
            pubScore['view-hf-ip'] = invPstScore(count['view-high-frequency-ip'], count['view']);
            pubScore['view-hf-uid'] = invPstScore(count['view-high-frequency-uid'], count['view']);
            if (count['click'] > 100) {
                pubScore['iclick'] = invPstScore(count['iclick'], count['click'] + count['iclick']);
                pubScore['click-miss'] = invPstScore(count['click-miss'], count['click-miss'] + count['click']);
                pubScore['click-diff-ip'] = invPstScore(count['click-different-ip'], count['click']);
                pubScore['click-diff-ua'] = invPstScore(count['click-different-ua'], count['click']);
                pubScore['click-diff-uid'] = invPstScore(count['click-different-uid'], count['click']);
                pubScore['click-hf-ip'] = invPstScore(count['click-high-frequency-ip'], count['click']);
                pubScore['click-hf-uid'] = invPstScore(count['click-high-frequency-uid'], count['click']);
            }
        }

        if (distinct) {

            if (distinct['uid'] > 0) {
                var dstb = gaussian(1, 2); // mean, var
                pubScore['uid-ip'] = dstb.pdf(distinct['uid'] / (distinct['ip'] + 0.01))
            }
            if (count['view'] > 0) {
                var dstb = gaussian(1, 2.5); // mean, var
                pubScore['view-uid'] = dstb.pdf(count['view'] / (distinct['uid'] + 0.01))
            }
        }

        if (count && count['click'] > 100) {
            var dstb = gaussian(0.007, 0.00002); // mean, var
            // log10(pdf + 1)
            pubScore['ctr'] = Math.log10(dstb.pdf(count['click'] / (count['view'] + 0.01)) + 1)
        }

        if (histogram) {

            if (count['view'] > 100000 && count['click'] > 100) {
                pubScore['top-cos'] = cosSimi(histogram['top'], histogram['click-top']);
                pubScore['doc-cos'] = cosSimi(histogram['doc'], histogram['click-doc']);
                pubScore['ref-cos'] = cosSimi(histogram['ref'], histogram['click-ref']);
                pubScore['ua-cos'] = cosSimi(histogram['ua'], histogram['click-ua']);
                pubScore['city-cos'] = cosSimi(histogram['city'], histogram['click-city']);
                pubScore['region-cos'] = cosSimi(histogram['region'], histogram['click-region']);
                pubScore['ucts-cos'] = cosSimi(histogram['ucts'], histogram['click-ucts']);

                pubScore['top-kl'] = KL(histogram['top'], histogram['click-top']);
                pubScore['doc-kl'] = KL(histogram['doc'], histogram['click-doc']);
                pubScore['ref-kl'] = KL(histogram['ref'], histogram['click-ref']);
                pubScore['ua-kl'] = KL(histogram['ua'], histogram['click-ua']);
                pubScore['city-kl'] = KL(histogram['city'], histogram['click-city']);
                pubScore['region-kl'] = KL(histogram['region'], histogram['click-region']);
                pubScore['ucts-kl'] = KL(histogram['ucts'], histogram['click-ucts']);
            }
            if (histogram['ip-new-uid']) {
                delete histogram['ip-new-uid']['*other*'];
                pubScore['ip-new-uid-comentropy'] = comentropy(histogram['ip-new-uid'])
            }
            if (histogram['click-gap']) {
                pubScore['click-gap'] = gapScore(histogram['click-gap'])
            }
            if (histogram['ucts'] && histogram['click-ucts']) {
                pubScore['ucts'] = (uctsScore(histogram['ucts']) + uctsScore(histogram['click-ucts']))
            }
        }

        if (action) {

            if (action['short'] > 100) {
                pubScore['short-long'] = pstScore(action['long'], action['short'] + action['long'])
            }
            if (action['long'] > 100) {
                if (action['s2'] && action['hv']) {
                    pubScore['action-s2'] = Math.pow(Math.E, (action['s2'] / action['hv']))
                }
                if (action['s3'] && action['hv']) {
                    pubScore['action-s3'] = Math.pow(Math.E, (action['s3'] / action['hv']))
                }
                if (action['hv']) {
                    pubScore['action-hv'] = pstScore(action['hv'], action['long'])
                }
            }
        }

        if (minicount) {
            var viewNum = []
            var clickNum = []
            _.map(hkey, function(ele) {
                if (minicount[ele] && minicount[ele].length != 0) {
                    var jj = 0
                    for (; jj < 60; jj++) {
                        viewNum.push(minicount[ele][jj])
                        clickNum.push(minicount[ele][jj + 60])
                    }
                } else {
                    var jj = 0
                    for (; jj < 60; jj++) {
                        viewNum.push(0)
                        clickNum.push(0)
                    }
                }
            });
            pubScore['cycle'] = fftScore(viewNum) + fftScore(clickNum)
        }

        score[pubid] = pubScore;
    });

    // 获取所有评分的 key
    var scoreKeys = [];
    _.forEach(score, function(data) {
        scoreKeys = _.union(scoreKeys, _.keys(data));
    });

    // 求得每种评分的平均值和方差
    var scoreMean = {};
    var scoreVar = {};
    _.forEach(scoreKeys, function(scoreKey) {
        var arr = _.chain(score).values().map(scoreKey).reject(_.isUndefined);
        var mean = arr.mean().value();
        var variance = arr.map(function(x) {
            return Math.pow(x - mean, 2);
        }).mean().value();
        scoreMean[scoreKey] = mean;
        scoreVar[scoreKey] = variance;
    });
    var uniScore = {}; // 归一化以后的分数
    _.forEach(score, function(pubScore, pubid) {
        uniScore[pubid] = {};
        _.forEach(pubScore, function(value, key) {
            if (scoreVar[key] != 0) {
                uniScore[pubid][key] = (value - scoreMean[key]) / Math.sqrt(scoreVar[key]);
            } else {
                uniScore[pubid][key] = 0;
            }
        });
    });


    _.forEach(uniScore, function(pubScore, pubid) {
        score[pubid]['all'] = score[pubid]['all'] || 0;
        _.forEach(pubScore, function(value, key) {
            if (value) {
                score[pubid]['all'] += (scoreWeight[key] || 1) * value;
            }
        });
    });
    // 将分数 scale 到 0-100
    var maxScore = _.chain(score).values().map('all').max().value();
    var minScore = _.chain(score).values().map('all').min().value();
    var interval = maxScore - minScore;
    _.forEach(score, function(data, pubid) {
        score[pubid]['final'] = (score[pubid]['all'] - minScore) / interval * 100;
    });
    console.log(JSON.stringify(uniScore[wantkeys]));
    // console.log(uniScore);
    // console.log(score[ele]);
}

doone(result);






function square(n) {
    return n * n;
}

function length(arr) {
    return Math.sqrt(_.sum(_.map(arr, square)))
}

function cosSimi(obj1, obj2) {
    obj1 = obj1 || {};
    obj2 = obj2 || {};
    var keys = _.union(_.keys(obj1), _.keys(obj2));
    var dotSum = 0;
    _.forEach(keys, function(key) {
        dotSum += (obj1[key] || 0) * (obj2[key] || 0)
    });
    return (0.0 + dotSum) / (length(_.values(obj1)) * length(_.values(obj2)) + 0.00001)
}

function KL(obj1, obj2) {
    if (!obj1 && !obj2) return 0;
    // P 表示数据的真实分布，Q 表示数据的理论分布
    obj1 = obj1 || {};
    obj2 = obj2 || {};
    var sum1 = _.sum(_.values(obj1));
    var sum2 = _.sum(_.values(obj2));
    var keys = _.union(_.keys(obj1), _.keys(obj2));
    var kl = 0;
    _.forEach(keys, function(key) {
        var p = ((obj2[key] || 0.0) / sum2);
        var q = ((obj1[key] || 0.0) / sum1);

        if (p && q) {
            kl += p * Math.log2(p / q)
        }
    });
    return 1 - Math.tanh(0.5 * kl)
}

function comentropy(obj) {
    var arr = _.values(obj);
    var sum = _.sum(arr);
    if (!sum) return 0;
    var h = 0;
    _.forEach(arr, function(v) {
        if (!v) return;
        var p = (0.0 + v) / sum;
        h -= p * Math.log2(p);
    });
    // return h - Math.log2(arr.length)
    return h
}

function gapScore(obj) {
    var sum = _.sum(_.values(obj));
    var score = 0;
    _.forEach(obj, function(v, k) {
        var gap = Number(k);
        if (gap <= 11) {
            score -= (Math.log2(12 - gap) * v / sum)
        }
    });
    return score;
}

function pstScore(num1, num2) {
    return (num1 / (num2 + 0.001));
}

function invPstScore(num1, num2) {
    return (1 - (num1 / (num2 + 0.001)));
}


function uctsScore(obj) {
    if (!obj) return 0
    var sum = _.sum(_.values(obj));

    var score = 0.0;
    score += ((obj['day'] || 0) / sum);
    score += 2 * ((obj['week'] || 0) / sum);
    score += 3 * ((obj['month'] || 0) / sum);
    score += 4 * ((obj['twoq'] || 0) / sum);
    score += 5 * ((obj['overtwoq'] || 0) / sum);
    return score;
}

function round_to_6dp(val) {
    return Math.round(val * 1000000) / 1000000;
}

function FFT(data_array) {
    var data_len = data_array.length;

    /* Check we have a suitable number of data_len */
    if (data_len < 1) {
        throw new Error("Array to fast fourier transform must have 1 or more datapoints.");
    }

    /* Prepare an output buffer for the fft */
    var fft_output = new Array(data_len);

    /* Do the FFT */
    var fft = new fft_lib.complex(data_len, false);
    fft.simple(fft_output, data_array, 'real');

    /* Process the fft output */
    for (i = 0; i < (data_len / 2) + 1; i++) { /* We only get back half the number of bins as we do samples */
        var real = fft_output[(i * 2) + 0]; /* Even indexes are the real values */
        var imag = fft_output[(i * 2) + 1]; /* Odd indexes are the imaginary values */
        fft_output[i] = round_to_6dp(Math.sqrt((real * real) + (imag * imag)));
    }

    /* Return the output of the FFT, only returning as many bins as we have */
    return fft_output.slice(0, (data_len / 2) + 1);
}

function sum(data) {
    return _.reduce(data, function(su, n) {
        return su + n
    }, 0)
}

function return1(data) {
    HE = sum(data)
    ndata = data
    if (HE != 0) {
        ndata = _.map(ndata, function(ele) {
            return ele / HE
        })
    }
    return ndata

}

function fftScore(data) {
    // 去直流分量
    datasum = sum(data)
    data = _.map(data, function(ele) {
        return ele - datasum / data.length
    })

    // 求fft的幅度谱
    fdp = FFT(data)

    // 归一化
    nfdp = return1(fdp)

    // 滤波 留 24 到 110
    nfdp = _.slice(nfdp, 24, 111)

    // 从大到小排序
    nfdp = _.sortBy(nfdp, function(ele) {
        return -ele
    })

    // 取 top5 做求和为还原度
    huanyuandu = sum(_.slice(nfdp, 0, 5))

    // 还原度的倒数为分数，还原度越高，周期性越好，分数越低
    return (-25) * huanyuandu + 2.5;
}