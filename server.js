
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.use('/',express.static(__dirname + '/client'));


app.get('/info', function(req, res) {
	res.json(infodata);
});

serv.listen(2000);
console.log("\x1b[42m","Server started.");

time = new Date();

var hh = time.getHours();
var mm = time.getMinutes();
var ss = time.getSeconds() 

var SOCKET_LIST = {};
var PLAYER_LIST = {};

var width = 1000,
height = 200,
friction = 0.8,
gravity = 0.2;

var boxesY = [];
var boxesX = [];
var boxes = [];

var score = {
	x : 550,
	y : 140,
	width :15,
	height :15,
}

boxesX.push({
	x: 250,
	y: 180,
	width: 20,
	height: 20,
	velX: -5,
	from:480,
	to:260,
});

boxesY.push({
	x: 150,
	y: 180,
	width: 20,
	height: 20,
	velY: -6,
});

boxesY.push({
	x: 360,
	y: 180,
	width: 20,
	height: 20,
	velY: -5,
});

boxes.push({
	x: 130,
	y: 140,
	width: 20,
	height: 60,
});

boxes.push({
	x: 500,
	y: 160,
	width: 20,
	height: 40,
});

boxesY.push({
	x: 520,
	y: 180,
	width: 20,
	height: 20,
	velY: -6,
});

boxesY.push({
	x: 240,
	y: 180,
	width: 20,
	height: 20,
	velY: -4,
});

boxes.push({
	x: 200,
	y: 180,
	width: 20,
	height: 20,
});

boxes.push({
	x: 220,
	y: 140,
	width: 20,
	height: 60,
});

var colors = ["#00ff00","#0000ff","#bf00ff","#00ff00","#ff00bf","#ff0040","#ff0000","#ff8000","#ffbf00","#bf00ff","#ff0080"];

var Player = function(id){
	var self = {
		x:0,
		y:200,
		id:id,
		number:"" + Math.floor(10 * Math.random()),
		pressingRight:false,
		pressingLeft:false,
		pressingUp:false,
		pressingDown:false,
		width : 10,
		height : 10,
		speed: 3,
		velX: 0,
		velY: 0,
		jumping: false,
		points: 0,
		dies: 0,
		nickname: 'UnknownSoldier',
        color: colors[Math.floor(10 * Math.random())],
	}
    
	self.updatePosition = function(){
		        if (self.x >= width-self.width) {
        	self.velX = 0;
        	self.x = width-self.width;
        } else if (self.x < 0) {   
        	self.velX = 0;      
        	self.x = 0;     
        }   
		self.velY += gravity;
		self.y += self.velY;

		if(self.y >= height-self.height){
			self.y = height - self.height;
			self.jumping = false;
		}
        //kutu çarpma
        for(var i=0;i<boxesY.length;i++){
        	if(self.y+self.width >=boxesY[i].y && self.y-self.width <= boxesY[i].y+boxesY[i].height && self.x+self.width >= boxesY[i].x && self.x <= boxesY[i].x+boxesY[i].width)
        		{self.x = 0; self.y = 120; self.dies++;}
        }

        for(var i=0;i<boxes.length;i++){
        	if(self.y+self.width >=boxes[i].y && self.y-self.width <= boxes[i].y+boxes[i].height && self.x+self.width >= boxes[i].x && self.x <= boxes[i].x+boxes[i].width)
        		{self.x = 0; self.y = 120; self.dies++;}
        }

        // kutu çarpma
        for(var i=0;i<boxesX.length;i++){
        	if(self.y+self.width >=boxesX[i].y && self.y-self.width <= boxesX[i].y+boxesX[i].height && self.x+self.width >= boxesX[i].x && self.x <= boxesX[i].x+boxesX[i].width)
        		{self.x = 0; self.y = 120; self.dies++;}
        }

        if(self.y+self.width >= score.y && self.y-self.width <= score.y+score.height && self.x+self.width >= score.x && self.x <= score.x+score.width)
        	{self.x = 0; self.y = 120; self.points++;}



        self.velX *= friction;
        self.x += self.velX;
        if(self.pressingRight)
        {
        	if (self.velX < self.speed) {             
        		self.velX++;         
        	}     
        }
        if(self.pressingLeft)
        	if (self.velX > -self.speed) {
        		self.velX--;
        	}
        	if(self.pressingUp)
        	{
        		if(!self.jumping){
        			self.jumping = true;
        			self.velY = -self.speed*2;
        		}
        	}
        }
        
        return self;
    }

    var io = require('socket.io')(serv,{});
    io.sockets.on('connection', function(socket){
    	console.log('\x1b[33m%s\x1b[0m',hh + ":" + mm + ":" + ss +"  " + socket.handshake.address);
    	socket.id = Math.random();
    	SOCKET_LIST[socket.id] = socket;

    	var player = Player(socket.id);
    	PLAYER_LIST[socket.id] = player;

    	socket.on('disconnect',function(){
    		delete SOCKET_LIST[socket.id];
    		delete PLAYER_LIST[socket.id];
    	});

    	socket.on('SetName',function(data){
    		player.nickname = data.name;
    	});

    	socket.on('keyPress',function(data){
    		if(data.inputId === 'left')
    			player.pressingLeft = data.state;
    		else if(data.inputId === 'right')
    			player.pressingRight = data.state;
    		else if(data.inputId === 'up')
    			player.pressingUp = data.state;
    	});

    	socket.on('sendMsgToServer',function(data){
    		var playerName = player.nickname;
    		for(var i in SOCKET_LIST){
    			SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data);
    		}
    	});

    	//commands
    	socket.on('SetPlayer',function(data){
    		for(var i in PLAYER_LIST)
    		{
    			if(player.number == data.number){
    				if(data.name != null)
    					player.nickname = data.name;
    				if(data.score != null)
    					player.points = data.score;
    			}

    		}
    	});
    });

    setInterval(function(){
    	time = new Date();
    	hh = time.getHours();
    	mm = time.getMinutes();
    	ss = time.getSeconds() 

    	var pack = [];
    	var pack_boxes = [];

    	infodata = pack;
    	for(var i in PLAYER_LIST){
    		var player = PLAYER_LIST[i];
    		player.updatePosition();
    		pack.push({
    			x:player.x,
    			y:player.y,
    			number:player.number,
    			points:player.points,
    			dies:player.dies,
    			nickname:player.nickname,
                color:player.color,
    		});    
    	}
    	for(var i in SOCKET_LIST){
    		var socket = SOCKET_LIST[i];
    		socket.emit('newPositions',pack);
    	}

    	for(var i = 0; i<boxesY.length;i++){
    		if(boxesY[i].y < 0)
    			boxesY[i].velY *=-1;
    		if(boxesY[i].y > 200-boxesY[i].height)
    			boxesY[i].velY *=-1;

    		boxesY[i].y += boxesY[i].velY;
    	}

    	for(var i = 0; i<boxesX.length;i++){
    		if(boxesX[i].x < boxesX[i].from)
    			boxesX[i].velX *=-1;
    		if(boxesX[i].x > boxesX[i].to-boxesX[i].width)
    			boxesX[i].velX *=-1;

    		boxesX[i].x += boxesX[i].velX;
    	}

    	for(var i in boxes){
    		pack_boxes.push({
    			x:boxes[i].x,
    			y:boxes[i].y,
    			height:boxes[i].height,
    			width:boxes[i].width,
    			color:"#4a0e1c",
    		});
    	} 
    	for(var i in boxesX){
    		pack_boxes.push({
    			x:boxesX[i].x,
    			y:boxesX[i].y,
    			height:boxesX[i].height,
    			width:boxesX[i].width,
    			color:"#e35760",
    		});
    	} 
    	for(var i in boxesY){
    		pack_boxes.push({
    			x:boxesY[i].x,
    			y:boxesY[i].y,
    			height:boxesY[i].height,
    			width:boxesY[i].width,
    			color:"#88d5d2",
    		});
    	} 


    	for(var i in SOCKET_LIST){
    		var socket = SOCKET_LIST[i];
    		socket.emit('boxesPos',pack_boxes);
    	}



    },1000/60);
