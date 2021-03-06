// Requiring external modules
var blessed = require('blessed');

// Requiring custom modules
var CONST = require('./constants.js');

// Array storing packet logs in the form of objects
var packet_logs = [];
var packet_headers = [];

// Current ID of log
var id = 0;

// Acquiring the screen
var screen = blessed.screen();

// The outer box
var outer_box = blessed.box({
	fg: '#999999',
	bg: 'default',
	border: {
		type: 'line',
		fg: '#ffffff'
	},
		tags: true,
	content: '{center}' + CONST.NAME.toUpperCase() + '{/center}\n\n{center}' + CONST.DESCRIPTION + '{/center}',
	width: '90%',
	height: '95%',
	top: 'center',
	left: 'center'
});

// A list consisting of the logs
var logs = blessed.list({
	parent: outer_box,
	width: '90%',
	height: '40%',
	top: '15%',
	left: 'center',
	fg: 'blue',
	border: {
		type: 'line',
	},
	scrollbar: {
    	fg: 'blue',
    	ch: '|'
  	},
	selectedBg: '#222222',
	mouse: true,
	keys: true,
	vi: true
});

// Adding heading to the logs list
logs.prepend(new blessed.Text({
	left: '5%',
	content: ' Logs '
}));

// The header details of the requests
var details = blessed.list({
	parent: outer_box,
	width: '55%',
	height: '40%',
	top: '55%',
	left: '5%',
	fg: 'blue',
	border: {
		type: 'line'
	},
	scrollbar: {
		fg: 'blue',
		ch: '|'
	},
	selectedBg: '#222222',
	mouse: true,
	keys: true,
	vi: true
});

// Adding heading to the details
details.prepend(new blessed.Text({
	left: '5%',
	content: ' Header details '
}));

// ScrollableText to show full text
var display = blessed.scrollabletext({
	parent: outer_box,
	width: '30%',
	height: '40%',
	top: '55%',
	left: '65%',
	fg: 'blue',
	border: {
		type: 'line'
	},
	tags: true
});

// Appending the outer box to the screen
screen.append(outer_box);

// Adding key handler to escape the application
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	process.exit(0);
});

// Rendering the screen to the terminal
screen.render();

/****************************************************************************************************************/
/** 
 * Event Handlers start
 */

logs.on('mouseover', function() {
	logs.focus();
});

details.on('mouseover', function() {
	details.focus();
});

logs.on('scroll', function() {
	var value = logs.value;
	var id = parseInt(value.substring(1, value.indexOf(' ')));
	showHeaders(packet_headers[id]);
	showDisplay(value, 'Log');
	screen.render();
});

details.on('scroll', function() {
	var value = details.value;
	showDisplay(value, 'Header-detail');
});

/**
 * Event handlers stop
 */
/****************************************************************************************************************/

// Function to pad `str` with leading 'z'
function padLeft(str, width, z) {
	z = z || '0';
	str = str + '';
	return str.length>=width?str:(new Array(width - str.length + 1).join(z) + str);
}

// Function to pad `str` with `z` on right
function padRight(str, width, z) {
	z = z || ' ';
	str = str + '';
	return str.length>=width?str:(str + new Array(width - str.length + 1).join(z));
}

// Function to display the headers
function showHeaders(headers) {
	details.clearItems();
	for(var field in headers) {
		details.add(field + ' : ' + headers[field]);
	}
}

// Function to show content in `display`
function showDisplay(content, caller) {
	display.setContent('{center}{bold}' + caller + '{/bold}{/center}\n\n' + content);
}

var displayLog = function(log, headers, timestamp) {

	log = '#' + padLeft(id, 4, 0) + ' : [' + timestamp.format('DD/MMM/YYYY:HH:mm:ss ZZ') + '] ' + padRight(headers.Host, 30, ' ') + ' ' + log;
	id++;

	// Adding log to packet_logs
	packet_logs.push(log);

	// Adding header to packet_headers
	packet_headers.push(headers);

	// Displaying the result
	logs.add(log);
	logs.select(id-1);
};

// Exporting variables
exports.displayLog = displayLog;