var PushBullet = require('pushbullet');
var pusher = new PushBullet('o.CzrvkpYEMStWfRjHhde9wXSuyrxo0kwm');

/*pusher.devices(function(error, response) {
  console.log(error)
  console.log(response)
	// response is the JSON response from the API
});*/

pusher.note('ujyaht1Vqw0sjz4DyooA5A', 'Hubot Alarm', 'Test alarm !', function(error, response) {
  console.log(error);
  console.log(response)
});

/*pusher.note(deviceParams, noteTitle, noteBody, function(error, response) {
	// response is the JSON response from the API
});*/
