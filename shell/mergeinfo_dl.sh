#! /bin/sh
alldir=`find / -maxdepth 1 -name "hdd*"`
rm -f /hdd18/sts/shell/merge/vtest_dl
rm -f /hdd18/sts/shell/merge/ctest_dl
for onedir in $alldir
do
    cd $onedir/ssp-log
    cat vtest_dl.log  >> /hdd18/sts/shell/merge/vtest_dl
    cat ctest_dl.log  >> /hdd18/sts/shell/merge/ctest_dl
    cd /
done
