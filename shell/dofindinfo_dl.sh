#! /bin/sh
echo $onedir
cd $onedir/ssp-log
views=`find . -name "20161020*" | grep "view"`
rm -f vtest_dl.log
rm -f ctest_dl.log
for oneview in $views
do
    echo $oneview
    gzip -d -c $oneview   | fgrep '73.158.177.35' | jq .  >> vtest_dl.log
done
clicks=`find . -name "20161020*" | grep "click"`
for oneclick in $clicks
do
    echo $oneclick
    gzip -d -c $oneclick   | fgrep '73.158.177.35' | jq .  >> ctest_dl.log
done
