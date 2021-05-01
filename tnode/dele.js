var deleteTopic = require('nsq-delete-topic');

deleteTopic('http://nsq-adpro-uba-0:4161', 'action#ephemeral', function(err){
    console.log(err)
  // ...
});

