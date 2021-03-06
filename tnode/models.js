module.exports = {
    count: {
        "_id": 1,
        "date": 1,
        "request": 1,
        "view": 1,
        "view-invalid-ip": 1,
        "view-high-frequency-ip": 1,
        "view-high-frequency-uid": 1,
        "verify-miss": 1,
        "verify-duplicated": 1,
        "verify-different-uid": 1,
        "click": 1,
        "click-miss": 1,
        "click-invalid-ip": 1,
        "click-different-ip": 1,
        "click-different-ua": 1,
        "click-different-uid": 1,
        "click-high-frequency-uid": 1,
        "click-high-frequency-ip": 1,
        "iclick": 1,
    },
    action: {
        "_id": 1,
        "date": 1,
        "short": 1,
        "long": 1,
        "s2": 1,
        "s3": 1,
        "hv": 1,
    },
    distinct: {
        "_id": 1,
        "date": 1,
        "ua": 1,
        "uid": 1,
        "top": 1,
        "ref": 1,
        "doc": 1,
        "ip": 1,
    },
    histogram: {
        "_id": 1,
        "date": 1,
        "ua": 1,
        "top": 1,
        "ref": 1,
        "doc": 1,
        "region": 1,
        "ucts": 1,
        "click-top": 1,
        "click-ua": 1,
        "click-ref": 1,
        "click-region": 1,
        "click-ucts": 1,
        "ip-new-uid": 1,
        "click-gap": 1,
    }

}