var _ = require('lodash'),
    async = require('async'),
    util = require('./util'),
    rp = require('request-promise-native');
// gycrDao = util.getDao('gycr');

// var create = gycrDao.create;


var query = {
    "query": {
        "bool": {
            "must": [{
                "exists": {
                    "field": "zpp_info"
                }
            }, {
                "exists": {
                    "field": "conversions"
                }
            }],
            "must_not": {
                "regexp": {
                    "zpp_info.z_purchase_group_id": ".+"
                }
            }
        }
    }
};

var queryStr = JSON.stringify(query);

var guanggaozhu = [
    '06f34da4b6f07150aed4',
    '231d540579d186b9cd47',
    '54b31ecd6bed05c2c7b6',
    '715c0d4c5c5cab356f8e',
    '7a8bc21601482140d4ff',
    '9ac1d4d9a7ed34cf298e',
    'c248c1a5214790c09609',
    'fdd4b7aeeee9055e37c6',
    'e8d0097a014ddd319989',
    '964e6e5e714c4a2e15e2',
    '902f7771c14ddb7624a6',
    '1da59ac8d14de176a53b',
    '6a6f3195114d99bb304b',
    '0c083135d14ac358bd4f',
    'e59d7906314dff7a5922',
    '01fc6478c14e002f09e9',
    'a3010487f14e049bd5bb',
    '90581536214e0b8ac6a8',
    '39cfe7bc014e52d58ebc',
    'ad4d6c16114e86a4c7c0',
    'a96f696f314ebeab79f9',
    'f9ed91e7714ecf17e1fd',
    '5ee46534b14ed7ee338e',
    'ba66d5f3c14ee320c784',
    '54a64de6b14ef82ee89a',
    'eae5eae7514efc74014f',
    'a571d7a1814efd360b0b',
    'c326f66db14f072ea1a2',
    'b38c46ecc14f075336b3',
    '62a4e5c0d14f0755f5ec',
    '239335ff714f20f490d1',
    'd3fac4d2914f3a3ebf8b',
    'cefed691314f458bb3ac',
    '46396b13014f63240e38',
    'e8752b9e014f69b9a89b',
    'f09d7e66314f6e0a5fab',
    '146140ffe14f72e8c1c8',
    'a003b3f4014f8385c214',
    '265fc066f14fcee0dd53',
    '7afd9b64f14fe01695aa',
    '72ac8a3e814ff81347c4',
    '9542f05671504c1de961',
    '49664100e1505aaf9248',
    '589e1a5481505b09fce1',
    '26b5239961505fd47643',
    '464c031c4150608d755e',
    'fab7953701506e7a7188',
    '6375f5bd11506e7d0e81',
    'e1119275f1506ead916f',
    '2ee61c15f1506eaef187',
    'da7bf238d1506fb46d5e',
    '4effb65e71507f239c00',
    'ec7f2727c15084f52202',
    'c696974c615084fa25f3',
    '8d99651ed1508568fac0',
    '08556928e95184f4d1e3',
    'b6801d38a1508eb418a2',
    '7fcfdce9e15092c064cb',
    '7d8004946150935c6c4e',
    '03fae7361150944c3c4a',
    '5da9e0c61150a203c13c',
    '77a1ee527150a22719f7',
    '718d87891150a2646284',
    '21ce01599150a2d3efee',
    '53a6abb7c150a71f5893',
    'd18a52988150a755423f',
    '07a87369c150a75f995e',
    '1a7a0a669150a763d6ab',
    'ca64436be150a866a32c',
    'd05e5fea8150a86f4556',
    'ef4fb4f40150a873d2d3',
    '374e641ed150a89293bb',
    '9da3e51be150ad52e3ec',
    '17f4af118150ae0778d4',
    '51eb45d53150b34a78ce',
    '28f30e3ce150b7e11f9e',
    'e8c255ea3150b802dc49',
    'e196f5ab8150b82beb69',
    '1ef517ca8150c7da2167',
    '45d6233f9150cc1e6248',
    '00d5025f7150cce1af81',
    'cb5289d00150cda06a96',
    '25a52c813150d60379b8',
    '9d2f25a58150d72b8e02',
    'edfec826b150db44bbde',
    '87c655859150e7778ecd',
    '3a2fbaae3150ebc5652e',
    '9ee274a6a150f0ab605b',
    'c31c62f08150f1473136',
    '611576c11150f168174d',
    'ecb1553ea150fff89a6c',
    'fd09dbf9b1510043596d',
    'b2033180c1510e761e52',
    'dc81ef75115114a05688',
    '47da39ae715114ad6259',
    'c596890c81511dadc5e0',
    '20f69da0f151239cfad5',
    '3a5c06a771513d42afbb',
    '63cdf04191513d49730d',
    '28ed718e21513dda2523',
    '61f1e78cd151419b7454',
    '21453d1a915143ddfd76',
    'f6d10d3e215147b44ecb',
    '431a145c5151485ed77d',
    '5176b2a731514899abe5',
    '94203074e151575e364e',
    '9d03f9b84151577a4d9f',
    'a78b6869115157b9a78e',
    '85b081e6b1515c5bc4ab',
    'cb7ad7b7315160bd5563',
    '1b605e351151621ce9d2',
    'f7b6e64cf15167449dcd',
    'ea23a7af71517b1c0c7f',
    '30b1e958f1517ba60a56',
    '386f715a61517bacf22e',
    'd25b150911517f565557',
    '40af1af271518589d8e0',
    '396db604e15185911982',
    '942fa3ac01518594d295',
    '81cb143ef1518616f557',
    'dcd0f38ed1518b02afbd',
    '4ac6c74f31518c4fde26',
    '056b7e29c1519f62c2e9',
    '561c3bb981519f93f219',
    '91ac0948e151a89e6f66',
    '04eac73ef151a8b2190a',
    '21b800796151a9b844ec',
    '9a68f506a151ae14c61d',
    '4bb6ba8c0151ae2722aa',
    '326be4b4b151ae93c82a',
    '92d0d3e7c151af31f02c',
    'a4bf47844151b01cdada',
    '257970c8a151c3afe860',
    'db4290ac9151d2047e5a',
    '35d16838c151e77c422e',
    '3cb668a9e151ef2bcac9',
    '10674fb0f151f6e71fc5',
    '8ea7e31891520bdc5786',
    '09a9572e81520bdf8c30',
    'ebb5053f71521f56db72',
    'c28fc8145152207d6650',
    'a371b226f152390b671d',
    'bf2b7cae615243e62e10',
    'd69fb7ffc15253f5820d',
    '5ecc68db715253fbb10a',
    '5a36eac5515254060764',
    'c1cae83a4152586699a3',
    'ffcda843e1525db4bf91',
    '3b1bbf2e315261f7a2d1',
    '7d64ec92d1526760a104',
    '1e9417bf81528b3c6613',
    '30c7adc9f152a03c4561',
    'c04ef7a1b152ddba6b9e',
    'ff200ac59152decf389c',
    'e80ac5465152f392fb1d',
    'afbd29ea0152f40e1c43',
    '2d37ce0fe152f89135f4',
    '7945c268215307aad53d',
    '96f2f37221530857fd08',
    '9eafd2781153165189ac',
    '8a68e6fa01531c77b080',
    'b47864cd31531c7f61e1',
    '13f59eca21533623a4e2',
    '7705d5a5115363a80a61',
    '3957efe48153644f482d',
    'adc41f815153653eaf12',
    'ba896c6861537321c3df',
    '70d2c90681537e21d9aa',
    '8d596006f1537f24ba81',
    'bf30a6d461538356426c',
    '7f7148e611539c46be8c',
    '0ed0f01a5153a14fe784',
    '5680d1e00153ac7126d6',
    '9c5bb91a7153ad590aa7',
    '6fed119d7153d0bbeb54',
    '11aa4c9fb153eb77fc0c',
    '919b0f46b153f046b47f',
    '77db65eb9153f386c166',
    'ad00d6495154036f516d',
    '8c1df7f2a154037c137b',
    '81829dfa815404e29263',
    '43e32f69d154090a3ded',
    'aca9509501541ddf2f4a',
    'a44b7665f1542004e1d5',
    '3862148d7154200808b5',
    'e672fd56c15438556582',
    '5eb3527ee15438f8d346',
    'f840230821543c909632',
    '1860341dc1543ce41328',
    '6b78f7d291543d349f9e',
    'cf19ad06815460c509c1',
    'e9c973de2154610b6374',
    'bdb2d13b515474950022',
    '0c788e9231547567eb68',
    '39187e6c7154756824bb',
    '9c3e63b3715475d70033',
    '57ac237281547a612296',
    'cfd79719e1547a67fa3f',
    '6c4f2f1fa1547a7124a0',
    '827d4f60a1547b36f013',
    '4ad27d1a01547b3a9e04',
    'a0b666bbc1547ec2d164',
    'e8f2030431547f5537cd',
    'bd5694b4f154801ad757',
    '09745f86a1549451e4dd',
    '5cfe88b2c154947465f4',
    'de64dc1b11549a06b48d',
    'bede928fe1549a08c9ec',
    'd301ca4d01549ea03680',
    '2c4a0acca154a4418970',
    '254f9a7a1154a44f1022',
    '402c90a46154a47b2eb7',
    '64cd19b8c154a8bb85e8',
    'bb85a14c0154b34f9639',
    'd05a5a459154b820cd08',
    '37ffd149c154db7d01c5',
    '85e538e33154dc7f0bf4',
    '26c7a5dcf154e0a1fbed',
    '8a2881ada154e739494e',
    '5c15d6116154eae23bdd',
    'a2f526341154f0303bf4',
    '37de809bf154f16efeff',
    'ebe76d0d315500334c73',
    '83a93668f15500c966e4',
    'f426270ed155010e2134',
    'ae0f56b9f1550a1835f9',
    'c2c7e2d811550a954ade',
    '2553ddae91550fb79539',
    'cc8ca0ded15515260cec',
    'f86b7012715529c00629',
    '4fff49dc015529f7cd66',
    'cf4e10fd115548d460fd',
    '04c15d2ce15552ee90be',
    '874f87e9115556dbfffe',
    '8b657b4141555d3bfeb0',
    '759c354e11555df3ae3f',
    'cb854676c1556bd13348',
    '906f6c9f71556ca1a4d9',
    '53ff436291556cb41a7c',
    'd12708ebe155764a8963',
    '73463107015580cbd18c',
    'c408b6dec15580f2ae91',
    '19cf51ca61559286302b',
    '3a1d1ac9115596218d45',
    'c3af2499715596261c55',
    '1977cbb0a1559b4a5c62',
    '196a8f8c9155a4fb07b7',
    '931b865af155a55e556b',
    'c9f34adb5155a5d437cf',
    '3f991e4f1155a65554a8',
    'e7f304e90155b5322cd3',
    'ac75db1c0155ba06edd3',
    'bbaa72542155ba618274',
    'd7bf88b10155ba9ac437',
    'bd94c5b5e155c427efae',
    'eb0c7b3f3155d895b565',
    '88f3807a6155d96e329f',
    '1c27ef6be155dd39f56d',
    'a883c321e155de638b0d',
    'bd1125033155ed116b55',
    '6b1791b11155ed155bfa',
    '06a7517a3155ed17e7ce',
    'dbe1ae356155ed28abd7',
    '32e66af19155ed670554',
    '4ed898e1d155ed7c5acc',
    'd70bf74111561172a344',
    'bf22c6a3b1561182cda4',
    'a5ea002b5156211bcf02',
    '4c331673015626a6ff98',
    'e2d0543bb15626b8d745',
    'fa4340f4c1562afcb54e',
    '66e20a4801562bb912d0',
    '096dbf73a1562c4f4bde',
    'b1d19dc281562c5e69d0',
    '696651f9915630d78b56',
    '420f4cacb15630e098d8',
    'e92d4659c15630ed3f95',
    '33340ad8f15634666df9',
    '92a523e6d15635c97cbd',
    '39fa9012615644a48748',
    'd043d743415644a770b6',
    '30569cb4e15649c2d458',
    'c7df6e67f15649f46244',
    '21b2bd60b1564a62a823',
    '83d8963981564a67dbb3',
    '246a51b641564a7bba9f'
];

var adx = [
    '1a1fb0de6d92171c539e0f7cd87e7a4a',
    '79feaf3aa686cfcf874c4002bf1d85df',
    '4a040337d7b600088fcbc55387182d0c'
];

function genCR() {

    var docs = [];
    var tmp = {};


    function commonDeal(hits) {
        _.forEach(hits, function(ele) {
            if (!_.includes(adx, ele["_source"]["zpp_info"]["traffic_id"])) {
                return
            }
            var pubid = ele["_source"]["zpp_info"]["media_id"];
            var eletime = ele["_source"]["zpp_info"]["timestamp"];
            var date = new Date(parseInt(eletime + "000"));
            var dateStamp = util.getTimestamp(date)
            if (dateStamp >= util.getTimestamp(util.getStartTime())) {
                return
            }
            var _id = pubid + "::" + util.dateFormat(date)
            if (tmp[_id]) {
                tmp[_id]++
            } else {
                tmp[_id] = 1
            }
            // if (ele["_source"]["zpp_info"]["ad"] == "f609bda9a155724b2e50") {
            //     console.log("f609bda9a155724b2e50 -> ", eletime);
            // }
            console.log(ele["_source"]["zpp_info"]["ad"], eletime, pubid);
        });
    }

    function pageDeal(data) {
        if (data.rejected == true) {
            return
        }
        var hits = data.hits.hits;
        commonDeal(hits);
    }

    function normalDeal(data) {
        if (data[1].rejected == true) {
            return;
        }
        var hits = data[1].hits.hits;
        commonDeal(hits)
    }

    function rawDeal(data) {
        var returnPromise = [];
        if (data[1].rejected == true) {
            return returnPromise;
        }
        var count = data[1].hits.total;
        normalDeal(data);
        if (count > 20) {
            for (var i = 0; i < count - 20; i += 20) {
                var options = {
                    method: "GET",
                    uri: "http://es-adpro-dsp-1:9200/arrive_log_" + data[0] + "_main/20160903/_search?size=20&from=" + (i + 20),
                    body: queryStr,
                }
                returnPromise.push(rp(options));
            }
        }
        return returnPromise;
    }

    var promises = _.map(guanggaozhu, function(ele) {
        var options = {
            method: "GET",
            uri: "http://es-adpro-dsp-1:9200/arrive_log_" + ele + "_main/20160903/_search?size=20&from=0",
            body: queryStr,
        }
        return rp(options)
    });

    promises = _.map(promises, function(ele) {
        return ele.then(function(val) {
            return JSON.parse(val);
        }).catch(function(reason) {
            return { "rejected": true };
        });
    });

    Promise.all(promises).then(function(datas) {
        var idx = 0;
        var packedDatas = _.map(datas, function(ele) {
            var packed = [guanggaozhu[idx], ele];
            idx++;
            return packed;
        });
        var rawpromises = _.map(packedDatas, rawDeal);
        var normalpromises = _.flatten(rawpromises);

        normalpromises = _.map(normalpromises, function(ele) {
            return ele.then(function(val) {
                return JSON.parse(val);
            }).catch(function(reason) {
                return { "rejected": true };
            });
        });
        Promise.all(normalpromises).then(function(datas) {
            _.forEach(datas, pageDeal);
            _.forEach(tmp, function(v, k) {
                var adoc = {}
                adoc._id = k;
                adoc.cnum = v;
                docs.push(adoc)
            });
            // create(docs, function(err) {});
        });
    });
}

function getCR(req, res) {
    var pubID = req.query.pubID
    async.auto({
            count: function(cb) {
                gycrDao.findOne({ _id: pubID }, cb);
            }
        },
        function(err, result) {
            var re = '0';
            if (result.count) {
                re = "" + result.count.cnum;
            }
            res.success(re);
        }
    );
}
module.exports = {
    genCR: genCR,
    get: getCR
}

genCR()