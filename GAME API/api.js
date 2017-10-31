var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

var SerialPort = require('serialport');
var arduino = new SerialPort('COM3', { autoOpen: true });

myVar = setInterval(alertFunc, 500);
var mynick = 'mert4x4'

var score;
var score1; 
var score2;

var dies;
var dies1;
var dies2;

function alertFunc() {
	xhr.open("GET", "http://195.174.231.26:2000/info", false);
	xhr.send();
	var data = JSON.parse(xhr.responseText);
	for(i in data)
	{
		if(data[i].nickname == mynick)
			{
				score = data[i].points;			
				score1 = score;
				if(score1 != score2)
				{
					console.log(data[i]);
					arduino.write('M');
				}
				score2 = score;


				dies = data[i].dies;			
				dies1 = dies;
				if(dies1 != dies2)
				{
					console.log(data[i]);
					arduino.write('N');
				}
				dies2 = dies;
			}
	}
}
