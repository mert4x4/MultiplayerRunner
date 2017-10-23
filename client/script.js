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
	var colors = ["#00ff00","#0000ff","#bf00ff","#00ff00","#ff00bf","#ff0040","#ff0000","#ff8000","#ffbf00","#bf00ff","#ff0080"];
	socket.on('newPositions',function(data){playerdata = data;});

	socket.on('pointPositions',function(data){points = data;});

	socket.on('boxesPos',function(data){boxes = data;});

	function setName() {
		var name_,
		name_ = document.getElementById("name__").value;
		socket.emit('SetName',{name:name_});

		form = document.getElementById("nicknameform");
		form.style.visibility='hidden'; 

		game = document.getElementById("gameform");
		gameform.style.visibility = 'visible';

		chatdiv = document.getElementById("chatdiv");
		chatdiv.style.visibility = 'visible';
	}

	socket.on('addToChat',function(data){
		chatText.innerHTML += '<div style="">' + data + '</div>';
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
			if(playerdata[i].number == 1){ctx.fillStyle = colors[0];	document.getElementById("p"+i).style.color = colors[0];} 
			if(playerdata[i].number == 2){ctx.fillStyle = colors[1];	document.getElementById("p"+i).style.color = colors[1];} 
			if(playerdata[i].number == 3){ctx.fillStyle = colors[2];	document.getElementById("p"+i).style.color = colors[2];} 
			if(playerdata[i].number == 4){ctx.fillStyle = colors[3];	document.getElementById("p"+i).style.color = colors[3];} 
			if(playerdata[i].number == 5) {ctx.fillStyle = colors[4];	document.getElementById("p"+i).style.color = colors[4];} 
			if(playerdata[i].number == 6){ctx.fillStyle = colors[5];	document.getElementById("p"+i).style.color = colors[5];} 
			if(playerdata[i].number == 7) {ctx.fillStyle = colors[6];	document.getElementById("p"+i).style.color = colors[6];} 
			if(playerdata[i].number == 8) {ctx.fillStyle = colors[7];	document.getElementById("p"+i).style.color = colors[7];} 
			if(playerdata[i].number == 9) {ctx.fillStyle = colors[8];	document.getElementById("p"+i).style.color = colors[8];} 
			if(playerdata[i].number == 0) {ctx.fillStyle = colors[9];	document.getElementById("p"+i).style.color = colors[9];} 

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