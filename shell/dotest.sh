#! /bin/sh
echo $onedir
cd $onedir/ssp-log
views=`find . -name "20161015*" | grep "view"`
rm -f v1015xiaoyunapp.log
rm -f c1015xiaoyunapp.log
for oneview in $views
do
    echo $oneview
    gzip -d -c $oneview   | fgrep '"d1873b2dfea8539ba5eb"' | jq '.|{ip,upvID}' >> v1015xiaoyunapp.log
done
clicks=`find . -name "20161015*" | grep "click"`
for oneclick in $clicks
do
    echo $oneclick
    gzip -d -c $oneclick   | fgrep '"d1873b2dfea8539ba5eb"' | jq '.|{ip,upvID}'  >> c1015xiaoyunapp.log
done
