var _ = require('lodash');
var fs = require("fs");

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

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {
    var gooddata = _.trim(data.toString(), "\n");
    var score = 0.0;
    var xinfen = {}
    _.map(JSON.parse(gooddata), function(v, k) {
        var quan = scoreWeight[k] || 1.0;
        score = score + quan * v;
        xinfen[k] = quan * v;
    });
    xinfen['all'] = score;
    console.log(JSON.stringify(xinfen));
});