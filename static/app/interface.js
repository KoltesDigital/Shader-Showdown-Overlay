import './interface.css!';

import socket from './socket.js';

const slotLocations = location.hash
	.substr(1)
	.split("&")
	.map(el => el.split('='))
	.reduce((pre, cur) => {
		pre[cur[0]] = cur[1];
		return pre;
	}, {});

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

function display(slot, value) {
	const id = slotLocations[slot];
	if (id) {
		const element = document.getElementById(id);
		if (element) {
			element.textContent = value;
		}
	}
}

setInterval(function() {
	const time = Math.max(getCurrentTime(), 0);
	display('time', formatTime(time));
}, 200);

socket.on('current', function(state) {
	currentName1 = state.name1;
	currentName2 = state.name2;
	currentTime = state.time;
	currentStarted = state.started;

	if (currentStarted) {
		currentEndTime = now() + currentTime;
	}

	display('name1', currentName1);
	display('name2', currentName2);
	display('time', formatTime(getCurrentTime()));
});
