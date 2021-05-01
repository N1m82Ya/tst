echo $onedir
cd $onedir/ssp-log
rm -f tclickbdslot.log
clicks=`find . -name "20160823*" | grep "click"`
for oneclick in $clicks
do
    echo $oneclick
    gzip -d -c $oneclick   | fgrep '"dspID":"bd"' | fgrep 2a78fcb7b25bf9dd7259 | wc -l >> tclickbdslot.log
done
cd /
