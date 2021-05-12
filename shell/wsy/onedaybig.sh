allfiles=`find / -regextype posix-egrep -regex .*20160901.*`

for afile in $allfiles
do
	du -h $afile  | awk '{print $1}'
done
