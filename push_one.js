var OneSignal = require('onesignal-node');

let client = new OneSignal.Client({
	userAuthKey: 'OTU2NzNlODctOTEzMi00YWFiLTkxOTMtY2RkYzYwNmVjYmI4',
	// note that "app" must have "appAuthKey" and "appId" keys
	app: { appAuthKey: 'YjJhMzZhOTAtMzIwYy00YmJhLWIxMDctODg3OTlkNzViMGI3', appId: '008b6d6b-a74e-460c-80b6-ad481099fcc2' }
});

let firstNotification = new OneSignal.Notification({
    contents: {
        en: 'Test'
    }
});

firstNotification.setIncludedSegments(['All']);

client.sendNotification(firstNotification, function (err, httpResponse,data) {
   if (err) {
       console.log('Something went wrong...');
   } else {
       console.log(data, httpResponse.statusCode);
   }
});
