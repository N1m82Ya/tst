#! /bin/sh
alldir=`find / -maxdepth 1 -name "hdd*"`
rm -f /hdd18/sts/shell/merge/v1015findip
rm -f /hdd18/sts/shell/merge/c1015findip
for onedir in $alldir
do
    cd $onedir/ssp-log
    cat v1015ip.log  >> /hdd18/sts/shell/merge/v1015findip
    cat c1015ip.log  >> /hdd18/sts/shell/merge/c1015findip
    cd /
done
