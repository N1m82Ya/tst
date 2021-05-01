echo $onedir
cd $onedir/ssp-log
views=`find . -name "20160823*" | grep "view"`
rm -f tbdslot.log
rm -f tclickbdslot.log
for oneview in $views
do
    echo $oneview
    gzip -d -c $oneview   | fgrep '"dsp":"bd"' | fgrep '"slotID":"2a78fcb7b25bf9dd7259"' | wc -l >> tbdslot.log
done
clicks=`find . -name "20160823*" | grep "click"`
for oneclick in $clicks
do
    echo $oneclick
    gzip -d -c $oneclick   | fgrep '"dsp":"bd"' | fgrep '"slotID":"2a78fcb7b25bf9dd7259"' | wc -l >> tclickbdslot.log
done
cd /
