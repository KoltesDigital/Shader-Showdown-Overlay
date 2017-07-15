import 'bootstrap/css/bootstrap.css!';

import socket from './socket.js';

let currentName1 = '';
let currentName2 = '';
let currentTime = 0;
let currentEndTime = 0;
let currentStarted = false;

function now() {
	return Date.now() * .001;
}

function getCurrentTime() {
	return currentStarted ? (currentEndTime - now()) : currentTime;
}

function formatTime(time) {
	var minutes = Math.floor(time / 60);
	var seconds = Math.floor(time - (minutes * 60));

	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}
	return minutes+':'+seconds;
}

setInterval(function() {
	const time = Math.max(getCurrentTime(), 0);
	document.getElementById('current-time').textContent = formatTime(time);
}, 200);

socket.on('current', function(state) {
	currentName1 = state.name1;
	currentName2 = state.name2;
	currentTime = state.time;
	currentStarted = state.started;

	if (currentStarted) {
		currentEndTime = now() + currentTime;
	}

	document.getElementById('current-name1').textContent = currentName1;
	document.getElementById('current-name2').textContent = currentName2;
	document.getElementById('current-time').textContent = formatTime(getCurrentTime());
});

document.getElementById('current-start').addEventListener('click', function(event) {
	event.preventDefault();
	socket.emit('current-start');
});

document.getElementById('current-pause').addEventListener('click', function(event) {
	event.preventDefault();
	socket.emit('current-pause');
});

document.getElementById('current-reset').addEventListener('click', function(event) {
	event.preventDefault();
	socket.emit('current-reset');
});

document.getElementById('new-form').addEventListener('submit', function(event) {
	event.preventDefault();
	socket.emit('new-round', {
		name1: document.getElementById('new-name1').value,
		name2: document.getElementById('new-name2').value,
		duration: document.getElementById('new-duration').value,
	});
});
