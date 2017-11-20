	//oyunu hekleyene 100tl
	var ctx = document.getElementById("ctx").getContext("2d");

	var chatText = document.getElementById('chat-text');
	var chatInput = document.getElementById('chat-input');
	var chatForm = document.getElementById('chat-form');

	chatForm.onsubmit = function(e){
		e.preventDefault();
		if(chatInput.value != '')
			socket.emit('sendMsgToServer',chatInput.value);
		chatInput.value = '';
		chatInput.blur();      
	}

	var socket = io();
	var boxes;
	var boxesX;
	var boxesY;
	var points = {
		x : 550,
		y : 140,
		width :15,
		height :15,
	}
	var playerdata;
	
	socket.on('newPositions',function(data){playerdata = data;});

	socket.on('pointPositions',function(data){points = data;});

	socket.on('boxesPos',function(data){boxes = data;});

	function setName() {
		var name_,
		name_ = document.getElementById("name__").value;
		if(name_ == "")
			name_ = "idiot";
		
		socket.emit('SetName',{name:name_});

		form = document.getElementById("nicknameform");
		form.style.visibility='hidden'; 

		game = document.getElementById("gameform");
		gameform.style.visibility = 'visible';

		chatdiv = document.getElementById("chatdiv");
		chatdiv.style.visibility = 'visible';
	}

	socket.on('addToChat',function(data){
		chatText.innerHTML += '<div style=" ">' + data + '</div>';
	});

	setInterval(function(){
		for(var i=0;i<10;i++)
			document.getElementById("p"+i).innerHTML = "";
   		//background color
   		ctx.fillStyle = "#f2d4d4";
   		ctx.beginPath();
   		ctx.rect(0,0, 1000, 200);
   		ctx.fill();
		//background 
		for(i in playerdata) {
			ctx.fillStyle = playerdata[i].color; document.getElementById("p"+i).style.color = playerdata[i].color;
			ctx.beginPath();
			ctx.rect(playerdata[i].x,playerdata[i].y, 10, 10);
			ctx.fill();
			document.getElementById("p"+i).innerHTML = playerdata[i].nickname + "  " + "score :" +playerdata[i].points +" "+"deaths: "+playerdata[i].dies;
		}

		//draw boxes and points

		for(i in boxes){
			ctx.fillStyle = boxes[i].color;
			ctx.beginPath();
			ctx.rect(boxes[i].x,boxes[i].y,boxes[i].width,boxes[i].height );
			ctx.fill();
		}

		ctx.fillStyle = "#612e55";
		ctx.beginPath();
		ctx.rect(points.x,points.y, points.height, points.width);
		ctx.fill();
		//socket.emit('SetPlayer',{number:0,name:'suka',score:'0'});
	},1000/60);



	document.onkeydown = function(event){
		if(event.keyCode === 39) 
			socket.emit('keyPress',{inputId:'right',state:true});
		else if(event.keyCode === 37)
			socket.emit('keyPress',{inputId:'left',state:true});
		else if(event.keyCode === 38)
			socket.emit('keyPress',{inputId:'up',state:true});
		else if(event.keyCode === 17 || event.keyCode === 9 || event.keyCode === 32)
			chatInput.focus();


	}
	document.onkeyup = function(event){
		if(event.keyCode === 39)    
			socket.emit('keyPress',{inputId:'right',state:false});
		else if(event.keyCode === 37)
			socket.emit('keyPress',{inputId:'left',state:false});
		else if(event.keyCode === 38) 
			socket.emit('keyPress',{inputId:'up',state:false});
	}