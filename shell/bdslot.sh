alldir=`find . -maxdepth 1 -name "hdd*"`
for onedir in $alldir
do
    echo $onedir
    cd $onedir/ssp-log
    views=`find . -name "20160823*" | grep "view"`
    for oneview in $views
    do
        echo $oneview
        gzip -d -c $oneview   | awk '/"dsp":"bd".*"slotID":"2a78fcb7b25bf9dd7259"/{print}' | wc -l >> viewbdslot.log
    done
    clicks=`find . -name "20160823*" | grep "click"`
    for oneclick in $clicks
    do
        echo $oneclick
        gzip -d -c $oneclick   | awk '/"dsp":"bd".*"slotID":"2a78fcb7b25bf9dd7259"/{print}' | wc -l >> clickbdslot.log
    done
    cd /
done