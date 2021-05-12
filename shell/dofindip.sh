#! /bin/sh
echo $onedir
cd $onedir/ssp-log
views=`find . -name "20161015*" | grep "view"`
rm -f v1015ip.log
rm -f c1015ip.log
for oneview in $views
do
    echo $oneview
    gzip -d -c $oneview   | fgrep '"123.119.156.117"' >> v1015ip.log
done
clicks=`find . -name "20161015*" | grep "click"`
for oneclick in $clicks
do
    echo $oneclick
    gzip -d -c $oneclick   | fgrep '"123.119.156.117"'  >> c1015ip.log
done
