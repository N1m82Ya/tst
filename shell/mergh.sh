alldir=`find . -maxdepth 1 -name "hdd*"`
rm -f /v0925all
rm -f /v0926all
for onedir in $alldir
do
    cd $onedir/ssp-log
    pwd
    cat v0926ip.log | jq ".pubID" >> /v0926all
    cat v0925ip.log | jq ".pubID" >> /v0925all
    cd /
done
