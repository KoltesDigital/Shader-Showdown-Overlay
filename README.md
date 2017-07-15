# Shader-Showdown-Overlay

Countdown timer and participant names overlay for OBS.

## Installation

You need [Node.js](https://nodejs.org/) and JSPM:

	npm i -g jspm-cli

It is also advisable to have bunyan:

	npm i -g bunyan

Clone this repository, or download it as ZIP and unzip it.

Then, in the project folder:

	npm i
	jspm i

## Usage

Launch the server:

	node .                     (without bunyan)
	node . | bunyan -o short   (with bunyan)

The administration page is available on <http://localhost:3000/admin>.

In OBS, create a BrowerSource pointing to <http://localhost:3000#name1=left&name2=right&time=center>. You've already guessed how you can customize the displayed fields. Texts take all vertical space, this allows you to configure their size from OBS.
