const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const bunyan = require('bunyan');
const log = bunyan.createLogger({
	name: 'shader-showdown',
});

const argv = require('yargs')
	.help('h')
	.option('address', {
		alias: 'a',
		default: 'localhost',
		description: 'Address to use',
	})
	.option('port', {
		alias: 'p',
		default: 3000,
		description: 'Port to use',
		type: 'number',
	})
	.argv;
let currentName1 = '';
let currentName2 = '';
let currentDuration = 0;
let currentTime = 0;
let currentEndTime = 0;
let currentStarted = false;

function now() {
	return Date.now() * .001;
}

function getCurrentTime() {
	return currentStarted ? (currentEndTime - now()) : currentTime;
}

function sendCurrentState(who) {
	who.emit('current', {
		name1: currentName1,
		name2: currentName2,
		time: getCurrentTime(),
		started: currentStarted,
	});
}

app.engine('pug', require('pug').__express);

app.use(express.static('static'));

app.get('/', function(req, res) {
	return res.render('interface.pug');
});

app.get('/admin', function(req, res) {
	return res.render('admin.pug');
});

io.on('connection', function(socket) {
	sendCurrentState(socket);

	socket.on('current-start', function(args) {
		currentEndTime = now() + getCurrentTime();
		currentStarted = true;

		sendCurrentState(io.sockets);

		log.info('Start');
	});

	socket.on('current-pause', function(args) {
		currentTime = getCurrentTime();
		currentStarted = false;

		sendCurrentState(io.sockets);

		log.info('Pause');
	});

	socket.on('current-reset', function(args) {
		currentTime = currentDuration;
		currentStarted = false;

		sendCurrentState(io.sockets);

		log.info('Reset');
	});

	socket.on('new-round', function(args) {
		currentName1 = args.name1;
		currentName2 = args.name2;
		currentDuration = currentTime = args.duration * 60;
		currentStarted = false;

		sendCurrentState(io.sockets);

		log.info(args, 'New round');
	});
});

http.listen(argv.port, argv.address, function() {
	log.info({
		address: argv.address,
		port: argv.port,
	}, 'Listening');
});
