color = "black";
cookie = "";


window.addEventListener("load", ()=> {
   
    const canvas = document.querySelector("#gameCanvas");
    console.log("hello this is canvas.js");
    const ctx = canvas.getContext('2d');
    canvas.style.width ='100%';
    canvas.style.height='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;


    //This should go on resize event:
    var rect = canvas.getBoundingClientRect();
    //console.log(rect.top, rect.right, rect.bottom, rect.left);
    //canvas.width  = parent.innerWidth;
    //canvas.height = parent.innerHeight;

    //variables
    let painting = false;

    function startPosition(e){
        painting = true;
        draw(e);
        console.log("start painting");
    }

    function finishedPosition(){
        painting = false;
        ctx.beginPath();
        send_drawing(0, 0, "begin_path")
        console.log("finish painting");
    }

    function draw(e){
        if (!painting) {return;} //&& (active_turn() == cookie)){ console.log('active turn:  ' + active_turn() +'  my cookie: '+ cookie); return;}
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        //console.log("draw");
        
       // console.log("draw" + "  e.X=" + e.clientX + "  e.Y=" + e.clientY);

       send_drawing(e.clientX, e.clientY, color)

    }
    //EventListeners
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);


//color functions
    whiteblock = document.querySelector("#white");
    whiteblock.addEventListener("mousedown", whiteColor);
    function whiteColor(){
        color = "white";
    }
    document.querySelector("#black").addEventListener("mousedown", function(){color = "black";});
    document.querySelector("#blue").addEventListener("mousedown", function(){color = "blue";});
    document.querySelector("#red").addEventListener("mousedown", function(){color = "red";});
    document.querySelector("#darkgrey").addEventListener("mousedown", function(){color = "grey";});
    document.querySelector("#yellow").addEventListener("mousedown", function(){color = "yellow";});
    document.querySelector("#orange").addEventListener("mousedown", function(){color = "orange";});
    document.querySelector("#green").addEventListener("mousedown", function(){color = "green";});
    document.querySelector("#purple").addEventListener("mousedown", function(){color = "purple";});
    document.querySelector("#pink").addEventListener("mousedown", function(){color = "pink";});
    document.querySelector("#darkbrown").addEventListener("mousedown", function(){color = "#613613";});
    document.querySelector("#brown").addEventListener("mousedown", function(){color = "#7e481c";});
    
    document.querySelector("#button_Pass").addEventListener("mousedown", function(){active_turn()});
    document.querySelector("#button_next").addEventListener("mousedown", function(){next_turn();});
    document.querySelector("#btn_request").addEventListener("mousedown", function(){request();});
    
    document.querySelector("#clearCanvas").addEventListener("mousedown", function(){ctx.clearRect(0, 0, canvas.width, canvas.height); });
    document.querySelector("#clearServer").addEventListener("mousedown", function(){ctx.clearRect(0, 0, canvas.width, canvas.height); clear_canvas();});
   
});

var millisecondsToWait = 500;
setTimeout(function() {
    // Whatever you want to do after the wait
}, millisecondsToWait);


function next_turn(){
    //http://192.168.1.4:3030/api/v1/games/1/next
        var addr = 'http://192.168.1.4:3030';
            var request = new XMLHttpRequest()
            request.open('POST', addr + '/api/v1/games/1/next', true)
            request.send()
}

function active_turn(){
    //http://192.168.1.4:3030/api/v1/games/1/next
        var addr = 'http://192.168.1.4:3030';
            var request = new XMLHttpRequest()
            request.open('POST', addr + '/api/v1/games/1/active', true)
            request.onload = function () {
                var data = JSON.parse(this.response)
                //console.log(data.cookie)
                return data.cookie;
            }
            request.send()
}
function send_drawing( x,  y,  col){
    //http://192.168.1.4:3030/api/v1/games/1/next
        var addr = 'http://192.168.1.4:3030';
            var request = new XMLHttpRequest()
            var parameters = '?cookie=' + cookie + '&xcoord=' + x +'&ycoord=' + y + '&color=' + col;
            request.open('POST', addr + '/api/v1/games/1/draw'+ parameters, true)
    
            request.onload = function () {
                var data = JSON.parse(this.response)
                //if (data.data = "not allowed" || data.your_cookie != cookie){return;}
                console.log(data)
            }
            request.send()
    }

    function request(){
        //http://192.168.1.4:3030/api/v1/games/1/next
            var addr = 'http://192.168.1.4:3030';
                var request = new XMLHttpRequest()
                request.open('POST', addr + '/api/v1/games/1/request_drawing', true)
        
                request.onload = function () {
                    var data = JSON.parse(this.response)
                    console.log(data)
                    draw_from_request(data)
                }
                // Send request
                request.send()
        }

        function draw_from_request(data){
            const canvas2 = document.querySelector("#gameCanvas");
            console.log("hello this is canvas request");
            const ctx2 = canvas2.getContext('2d');
        
            ctx2.lineWidth = 5;
            ctx2.lineCap = "round";
              
            var rect = canvas2.getBoundingClientRect();
           
            data.forEach((l) => {
                if(l.line[2] == "begin_path"){
                    ctx2.beginPath();
                }else{
                    ctx2.strokeStyle = l.line[2];
                
                    ctx2.lineTo(l.line[0] - rect.left, l.line[1] - rect.top);
                    ctx2.stroke();
                    ctx2.beginPath();
                    ctx2.moveTo(l.line[0] - rect.left, l.line[1] - rect.top);
                }
                //console.log(l)
            })
                
        }

        function clear_canvas(){
            //http://192.168.1.4:3030/api/v1/games/1/next
                var addr = 'http://192.168.1.4:3030';
                    var request = new XMLHttpRequest()
                    request.open('POST', addr + '/api/v1/games/1/clear', true)
                    request.send()
        }

        function create_session(){
            //http://192.168.1.4:3030/api/v1/games/1/next
                var addr = 'http://192.168.1.4:3030';
                // Create a request variable and assign a new XMLHttpRequest object to it.
                    var request = new XMLHttpRequest()
                    // Open a new connection, using the GET request on the URL endpoint
                    request.open('POST', addr + '/api/v1/users?game=1', true)
                    // Send request
                    request.onload = function () {
                        // Begin accessing JSON data here
                            var data = JSON.parse(this.response)
                            cookie = data.cookie;
                            console.log("cookie " + cookie)
                            console.log(data)                      
                        }
                    request.send()
        }

        
