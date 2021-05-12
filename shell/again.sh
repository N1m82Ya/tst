#! /bin/sh
alldir=`find / -maxdepth 1 -name "hdd*"`
for onedir in $alldir
do
    onedir=$onedir /bin/sh /hdd18/sts/shell/dofindxiaoyunapp.sh &
done
