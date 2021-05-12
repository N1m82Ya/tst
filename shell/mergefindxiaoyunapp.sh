#! /bin/sh
alldir=`find / -maxdepth 1 -name "hdd*"`
rm -f /hdd18/sts/shell/merge/v1015findxiaoyunapp
rm -f /hdd18/sts/shell/merge/c1015findxiaoyunapp
for onedir in $alldir
do
    cd $onedir/ssp-log
    cat v1015xiaoyunapp.log  >> /hdd18/sts/shell/merge/v1015findxiaoyunapp
    cat c1015xiaoyunapp.log  >> /hdd18/sts/shell/merge/c1015findxiaoyunapp
    cd /
done
