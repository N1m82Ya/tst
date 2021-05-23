var fs = require("fs");

var data = fs.readFileSync('./log/histogram.log1');
var result = JSON.parse(data.toString());
for (var idx in result) {
    var top = result[idx]["top"];
    for (var idxx in top) {
        var good = idxx.replace(/\\x2e/g, ".");
        if (good.length == 0) {
            continue;
        }
        console.log(idxx.replace(/\\x2e/g, "."));
    }
}