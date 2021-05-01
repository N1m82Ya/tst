#!/bin/sh
if [ ! -n "$1" ];then
echo "We need a date such as 20160808 to continue" 
exit
fi

date=$1
echo "date:--> "$date
echo "mongo export ---ing "

mongoexport --host mongo-ssp-traffic-review-1:1302 --username user1 --password ApuCRv2HuLMGgg8NNjPZ --db traffic-review-test --collection count  --query "{"_id":/$date/}" --out ./count.json
mongoexport --host mongo-ssp-traffic-review-1:1302 --username user1 --password ApuCRv2HuLMGgg8NNjPZ --db traffic-review-test --collection minicount  --query "{"_id":/$date/}" --out ./minicount.json
mongoexport --host mongo-ssp-traffic-review-1:1302 --username user1 --password ApuCRv2HuLMGgg8NNjPZ --db traffic-review-test --collection distinct  --query "{"_id":/$date/}" --out ./distinct.json
mongoexport --host mongo-ssp-traffic-review-1:1302 --username user1 --password ApuCRv2HuLMGgg8NNjPZ --db traffic-review-test --collection histogram  --query "{"_id":/$date/}" --out ./histogram.json
mongoexport --host mongo-ssp-traffic-review-1:1302 --username user1 --password ApuCRv2HuLMGgg8NNjPZ --db traffic-review-test --collection action  --query "{"_id":/$date/}" --out ./action.json
mongoexport --host mongo-ssp-traffic-review-1:1302 --username user1 --password ApuCRv2HuLMGgg8NNjPZ --db traffic-review-test --collection histogram-dsp --query "{"_id":/$date/}" --out ./histogram-dsp.json
echo "mongo export 100% ok"

echo "dealing this logs to json format ---ing "

whole=`wc -l count.json |  awk '{print $1}'` ;cat count.json | awk -vwhole=$whole '{if(NR==1){print "["$0","}else if(NR==whole){print $0"]"}else{print $0","}}' >> count.log1
whole=`wc -l action.json |  awk '{print $1}'` ;cat action.json | awk -vwhole=$whole '{if(NR==1){print "["$0","}else if(NR==whole){print $0"]"}else{print $0","}}' >> action.log1
whole=`wc -l distinct.json |  awk '{print $1}'` ;cat distinct.json | awk -vwhole=$whole '{if(NR==1){print "["$0","}else if(NR==whole){print $0"]"}else{print $0","}}' >> distinct.log1
whole=`wc -l minicount.json |  awk '{print $1}'` ;cat minicount.json | awk -vwhole=$whole '{if(NR==1){print "["$0","}else if(NR==whole){print $0"]"}else{print $0","}}' >> minicount.log1
whole=`wc -l histogram.json |  awk '{print $1}'` ;cat histogram.json | awk -vwhole=$whole '{if(NR==1){print "["$0","}else if(NR==whole){print $0"]"}else{print $0","}}' >> histogram.log1
whole=`wc -l histogram-dsp.json |  awk '{print $1}'` ;cat histogram-dsp.json | awk -vwhole=$whole '{if(NR==1){print "["$0","}else if(NR==whole){print $0"]"}else{print $0","}}' >> histogram-dsp.log1
echo "dealing this logs to json format 100% ok"

echo "rm raw logs ---ing"

rm -fr *.json
echo "rm raw logs 100% ok"
