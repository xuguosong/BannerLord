var screenWidth=window.innerWidth;
var screenHeight=window.innerHeight;

var buttonSpace=(screenWidth-1.2*screenHeight)/7;
var buttonWidth=screenHeight/5;
var resourceBarWidth=screenWidth/6;

var pomelo=window.pomelo;
var serverIP="127.0.0.1";
var serverPort=3010;

var rid;
var username;

var base = 1000;
var increase = 25;

function showLoginView()
{
	$("#chatWindow").hide();
	$("#mainScene").hide();
	$("#hudBackground").hide();
	$("#resourceBackground").hide();
	$("#loginView").show();
}

function showCityView()
{
	$("#mainScene").show();
	$("#hudBackground").show();
	$("#resourceBackground").show();
	$("#loginView").hide();
}

//always view the most recent message when it is added
function scrollDown(base) {
	$("#chatMsgField").scrollTop(base);
};

// add message on board
function addMessage(from, text)
{
    if(text!="*")
    {
	var messageElement = $(document.createElement("table"));
	messageElement.addClass("message");
	//alert("asd");
	// sanitize
	//text = util.toStaticHTML(text);
	var content = '<tr>' + '  <td class="nick">' + from + ': ' + '</td>' + '  <td class="message">' + text + '</td>' + '</tr>';
	messageElement.html(content);
	//the log is the stream that we view
	$("#chatMsgField").append(messageElement);
	base += increase;
	scrollDown(base);
	}
};

// query connector
function queryEntry(uid, callback) 
{
	var route = 'gate.gateHandler.queryEntry';
	pomelo.init({host: window.location.hostname,port: 3014,log: true}, 
	function() 
	{
		pomelo.request(route, {uid: uid}, 
		function(data) 
		{
			pomelo.disconnect();
			if(data.code === 500) 
			{
			    alert(data.error);
				return;
			}
			callback(data.host, data.port);
		});
	});
};

$(document).ready(
function()
{
    //设置背景图片及样式
	var tButton=document.getElementById("chatButton");
	tButton.style.width=tButton.offsetHeight+"px";
	tButton.style.backgroundImage='url(Img/chat.png)';
	tButton.style.left=buttonSpace+"px";
	
	tButton=document.getElementById("mapButton");
	tButton.style.width=tButton.offsetHeight+"px";
	tButton.style.backgroundImage='url(Img/map.png)';
	tButton.style.left=buttonSpace*2+buttonWidth+"px";
	
	tButton=document.getElementById("rankButton");
	tButton.style.width=tButton.offsetHeight+"px";
	tButton.style.backgroundImage='url(Img/rank.png)';
	tButton.style.left=buttonSpace*3+buttonWidth*2+"px";
	
	tButton=document.getElementById("shopButton");
	tButton.style.width=tButton.offsetHeight+"px";
	tButton.style.backgroundImage='url(Img/shop.png)';
	tButton.style.left=buttonSpace*4+buttonWidth*3+"px";
	
	tButton=document.getElementById("mailButton");
	tButton.style.width=tButton.offsetHeight+"px";
	tButton.style.backgroundImage='url(Img/mail.png)';
	tButton.style.left=buttonSpace*5+buttonWidth*4+"px";
	
	tButton=document.getElementById("settingButton");
	tButton.style.width=tButton.offsetHeight+"px";
	tButton.style.backgroundImage='url(Img/setting.png)';
	tButton.style.left=buttonSpace*6+buttonWidth*5+"px";
	
	var resourceBar;
	resourceBar=document.getElementById("woodAmount");
	resourceBar.style.backgroundColor="#F00";
	resourceBar.style.left=resourceBarWidth*0+"px";

	resourceBar=document.getElementById("foodAmount");
	resourceBar.style.backgroundColor="#A0D";
	resourceBar.style.left=resourceBarWidth*1+"px";
	
	resourceBar=document.getElementById("ironAmount");
	resourceBar.style.backgroundColor="#DA0";
	resourceBar.style.left=resourceBarWidth*2+"px";
	
	resourceBar=document.getElementById("goldAmount");
	resourceBar.style.backgroundColor="#EE0";
	resourceBar.style.left=resourceBarWidth*3+"px";
	
	//隐藏不必要元素
	$("#chatWindow").hide();
	showLoginView();
	
	//regist pomelo event
	pomelo.on('onChat', function(data)
	{
		addMessage(data.from,data.msg);
	});
	pomelo.on('disconnect', function(reason){});
	
	//注册事件
	$("#chatButton").click(function(){
        $("#chatWindow").toggle(100);
    });
    
    $("#sendButton").click(function(){
        var route = "chat.chatHandler.send";
		var target = "*";
		//var msg = $("#chatMsgInput").attr("value").replace("\n", "");
		var msg="FUCK HTML";
		pomelo.request(route, {rid:rid,content: msg,from: username,target: target},
		function(data)
		{
		});
    });
	
	$("#loginButton").click(function()
	{
	    //username = $("#loginUser").attr("value");
	    username="AG3";
		rid = "world";
		
		//query entry of connection
		queryEntry(username, 
		function(host, port) 
		{
		alert("get real server");
			pomelo.init({host: host,port: port,log: true}, 
			function() 
			{
				var route = "connector.entryHandler.enter";
				pomelo.request(route, {username: username,rid: rid},
				function(data) 
				{
					if(data.error) 
					{
						return;
					}
					showCityView();
				});
			});
		});
	});
});

function drag(dargObj)
{
	var dragDiv = document.getElementById(dargObj.toString());
    var tagDiv = document.getElementById(dargObj.toString());
    var tagContainer = document;
    var e,offsetT,offsetL,downX,downY,moveX,moveY;
	var maxTop=-screenHeight*0.5,minTop=0,maxLeft=-screenWidth*0.5,minLeft=0;
    dragDiv.onmousedown = function(e){
        e = e||window.event;
        offsetT = tagDiv.offsetTop;
        offsetL = tagDiv.offsetLeft;
        downX = e.clientX;
        downY = e.clientY;
 
        dragDiv.onmouseup = function(e){
            tagContainer.onmousemove = function(){return false;}
        }
 
        tagContainer.onmousemove = function(e){
            e = e||window.event;
            moveX = e.clientX;
            moveY = e.clientY;
            tagDiv.style.top = Math.min(Math.max(offsetT + (moveY - downY),maxTop),minTop) + "px";
            tagDiv.style.left = Math.min(Math.max(offsetL + (moveX - downX),maxLeft),minLeft) + "px";
        }
    }
}
