import { Component, OnInit } from '@angular/core';
import{Router} from '@angular/router';
//import { start } from '../../assets/js/canvas.js';

declare var canvasjs:any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']

})
export class GameComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
   
    var can_stay = is_logged_in();
    if(!can_stay){
       this._router.navigate(['/home']);
       console.log('cant stay in game component')
    }else{
      g_init();
    }
  }
}
var addr = 'https://rtsketchserver-kbefbqorma-ue.a.run.app';
var color = "black";
var cookie = window.localStorage.getItem('cookie');

function g_init(){

  var interval_id = window.setInterval(function(){request();}, 1000);
  window.localStorage.setItem('interval_id', String(interval_id) )
  console.log('interval id: ' + window.localStorage.getItem('interval_id'))
  clearInterval(interval_id)

  get_current_users();
  const canvas = <HTMLCanvasElement>document.querySelector("#gameCanvas");
  console.log("hello this is g_init in canvas.js");
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
      rect = canvas.getBoundingClientRect();
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
  add_colors(ctx, canvas);
}

function add_colors(ctx, canvas){
  var whiteblock = document.querySelector("#white");
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
}

function next_turn(){
  var request = new XMLHttpRequest()
  request.open('POST', addr + '/api/v1/games/1/next', true)
  request.send()
}

function active_turn(){
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
      var request = new XMLHttpRequest()
      var parameters = '?cookie=' + cookie + '&xcoord=' + x +'&ycoord=' + y + '&color=' + col;
      request.open('POST', addr + '/api/v1/games/1/draw'+ parameters, true)

      request.onload = function () {
          var data = JSON.parse(this.response)
          //if (data.data = "not allowed" || data.your_cookie != cookie){return;}
          //console.log(data)
      }
      request.send()
  }
 
  function request(){
          var request = new XMLHttpRequest()
          request.open('POST', addr + '/api/v1/games/1/request_drawing', true)
  
          request.onload = function () {
              var data = JSON.parse(this.response)
              console.log(data.length)
              draw_from_request(data)
          }
          // Send request
          request.send()
  }
var l0 = 0;
var l1 = 0;
  function draw_from_request(data){
      const canvas2 = <HTMLCanvasElement>document.querySelector("#gameCanvas");
      console.log("hello this is canvas request");
      const ctx2 = canvas2.getContext('2d');
  
      ctx2.lineWidth = 5;
      ctx2.lineCap = "round";
          
      var rect = canvas2.getBoundingClientRect();
      
      data.forEach((l) => {
          if(l.line[2] == "begin_path"){
              ctx2.beginPath();
          }else if(l.line[2] == "clear_canvas"){
              ctx2.clearRect(0, 0, canvas2.width, canvas2.height); 
          }
          else{
              ctx2.strokeStyle = l.line[2];
              ctx2.lineWidth = 5;
              //ctx2.globalApha = 1;
              //elimina algunos artifacts generados al escribir el dibujo en el servidor
              if((l0 != 0  && l1 != 0) && Math.abs(l0 - l.line[0]) + Math.abs(l1 - l.line[1]) > 90){
                  ctx2.strokeStyle = "magenta";
                  //ctx2.globalApha = 0.1;
                  ctx2.lineWidth = 0.00001;
              }
              
              l0 = l.line[0];
              l1 = l.line[1];
              ctx2.lineTo(l.line[0] - rect.left, l.line[1] - rect.top);
              ctx2.stroke();
              ctx2.beginPath();
              ctx2.moveTo(l.line[0] - rect.left, l.line[1] - rect.top);
          }
          //console.log(l)
      })
  }

  function clear_canvas(){
              var request = new XMLHttpRequest()
              request.open('POST', addr + '/api/v1/games/1/clear', true)
              
              request.send()
              send_drawing(0, 0, "clear_canvas")
  }
  function get_current_users(){
    var request = new XMLHttpRequest()
    request.open('POST', addr + '/api/v1/games/1/current', true)
    request.onload = function () {
            var data = JSON.parse(this.response)
            data.forEach(element => show_connected(element))
            console.log(data)                      
        }
    request.send()
}
function is_logged_in():boolean{
  if(window.localStorage.getItem('cookie') == "null"){
      console.log('no cookie 2');
      return false;
  }else{
      console.log('yes cookie 2');
      return true;
  }
}
function show_connected(username){
  var tag = document.createElement("div");
  var text = document.createTextNode("" + username);
  tag.setAttribute("class", "user");
  tag.style.margin = '4px';
  tag.style.height = '40px';
  tag.style.width = '100%';
  tag.style.display = 'block';
  tag.style.background = 'white';
  tag.style.padding = '10px';
  tag.appendChild(text);
  var element = document.getElementById('userlist');
  element.appendChild(tag);
}
