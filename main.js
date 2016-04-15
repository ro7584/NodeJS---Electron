// Include module
var menubar = require('menubar')
,	request = require('request');

// Init
var mb = menubar({
	"always-on-top": true,
	"width": 1200,
	"transparent": true,
	"frame": false,
	"height": 500
});


// Ready event
mb.on('ready', function() {
	console.log('app is ready');

	console.log(mb.window);
	mb.showWindow();
	// In main process.
	const ipcMain = require('electron').ipcMain;

	// asynchronous event
	ipcMain.on('asynchronous-message', function(event, arg) {
		console.log('asynchronous: ' + arg);  // prints "ping"

		// Start prepare post request
		var now = new Date()
		,	payload = "{day:'{date}',time:'{time}'}"
		,	fDate = now.toLocaleDateString().split('/').map(function(val) {
				return Format_dateTime(val);
			}).join('-');


		payload = payload
			.replace('{date}', fDate)
			.replace('{time}', now.toTimeString().split(' ').shift());

		var opt = {
			uri: "https://www.esunbank.com.tw/bank/Layouts/esunbank/Deposit/DpService.aspx/GetForeignExchageRate",
			method: 'POST',
			body: payload,
			encoding: 'UTF-8',
			gzip: true,
			headers: {
				"Accept": "application/json, text/javascript, */*; q=0.01",
				"Accept-Encoding": "gzip, deflate",
				"Accept-Language":"zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4",
				"Cache-Control":"no-cache",
				"Connection":"keep-alive",
				"Content-Length":"34",
				"Content-Type":"application/json; charset=UTF-8",
				"Host":"www.esunbank.com.tw",
				"Origin":"https://www.esunbank.com.tw",
				"Pragma":"no-cache",
				"Referer":"https://www.esunbank.com.tw/bank/personal/deposit/rate/forex/foreign-exchange-rates",
				"User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36",
				"X-Requested-With":"XMLHttpRequest"
			}
		};


		request(
			opt,
			function(err, httpResponse, body) {
				if (err) {
					return console.error('error');
				}

				// calling renderer process
				event.sender.send('asynchronous-reply', body);
			}
		)
	});

	// synchronous event
	ipcMain.on('synchronous-message', function(event, arg) {
		console.log('synchronous: ' + arg);  // prints "ping"


		// The dialog module provides APIs to show native system dialogs, such as opening files or alerting, so web applications can deliver the same user experience as native applications.
		const dialog = require('electron').dialog;
		dialog.showMessageBox({
			type: 'info',
			title: '玉山匯率監控 App',
			message: '已達設定值',
			buttons: ['ok']
		});

		// return value
		event.returnValue = 'pong';
	});
});


mb.on('after-create-window', function() {
	// open chrome dev tools
	mb.window.openDevTools();
});



function Format_dateTime(num) {
	if ( !isNaN(num) && num.length < 2) {
		num = '0' + num;
	}

	return num;
}

