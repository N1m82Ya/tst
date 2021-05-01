alldir=`find . -maxdepth 1 -name "hdd*"`
for onedir in $alldir
do
    source /doclick.sh &
    cd /
done
