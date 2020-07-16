
color = "black";
cookie = window.localStorage.getItem('cookie');
var addr = 'https://rtsketchserver-kbefbqorma-ue.a.run.app';
var clientaddr = 'https://rtsketch-kbefbqorma-ue.a.run.app/'
//addr = 'http://192.168.1.4:3030';
window.addEventListener("load", ()=> {
    console.log('local storage cookie: ' + window.localStorage.getItem('cookie'))         
    console.log('local storage username: ' + window.localStorage.getItem('username'))         

    //document.querySelector("#menu_game").addEventListener("mousedown", function(){ g_init();});
    //workaround para cargar partes especificas del codigo cuando es necesario.
//*
    try{
        g = document.querySelector("#gameCanvas");
        if (g!=null)
           g_init();
    }
    catch{}
//*/
    load_events_home();
    load_events_register();
    update_visuals();
    extra_events();
    
});

function extra_events(){
    try{
        document.querySelector("#menu_game").addEventListener("click", function(){g_init();});
        document.querySelector("#menu_home").addEventListener("click", function(){update_visuals();});
        document.querySelector("#btn_lets_play").addEventListener("click", function(){g_init();});
        //document.querySelector("#menu_game").addEventListener("click", function(){g_init();});btn_lets_play
    }
    catch{}
}



function load_events_register(){
    try {
        document.querySelector("#btn_register").addEventListener("mousedown", function(){register();});}
   catch{console.log('register event bind failure')}
}

function load_events_home(){
    try{
        document.querySelector("#btn_login").addEventListener("mousedown", function(){ login();});   
        
    }
    catch{}
}

function g_init(){
    log_flag = is_logged_in();
    if(!log_flag)
    {
        console.log('no cookie');
        //window.location.replace('/home')
        //test of alternative method to replace:
        window.location = clientaddr + 'home';
        
        return;
    }
    window.localStorage.setItem('interval_id',  window.setInterval(function(){request();}, 1000))
    console.log('interval id: ' + window.localStorage.getItem('interval_id'))
    clearInterval(window.localStorage.getItem('interval_id'))

    get_current_users();
    const canvas = document.querySelector("#gameCanvas");
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
l0 = 0;
l1 = 0;
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
            }else if(l.line[2] == "clear_canvas"){
                ctx2.clearRect(0, 0, canvas2.width, canvas2.height); 
            }
            else{
                ctx2.strokeStyle = l.line[2];
                ctx2.lineWidth = 5;
                ctx2.globalApha = 1;
                //elimina algunos artifacts generados al escribir el dibujo en el servidor
                if((l0 != 0  && l1 != 0) && Math.abs(l0 - l.line[0]) + Math.abs(l1 - l.line[1]) > 80){
                    ctx2.strokeStyle = "magenta";
                    ctx2.globalApha = 0.1;
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

    function login_prep(){
  //form-signin
        u = document.querySelector("#inputUsername").value;
        p =  document.querySelector("#inputPassword").value;
    }
  
    function login(){
        login_prep();
        var request = new XMLHttpRequest()
        request.open('POST', addr + '/api/v1/login?username='+u+ '&password=' +p , true)
        request.onload = function () {
                var data = JSON.parse(this.response)
                if (data.data == 'ok'){
                    window.localStorage.setItem('username', u);
                    cookie = data.cookie;
                    window.localStorage.setItem('cookie', data.cookie);
                    console.log('logged in')

                    console.log('local storage: cookie ' + window.localStorage.getItem('cookie'))      
                    update_visuals();
                    window.location.replace('/user')
                }else{
                    console.log('error?')
                }
                console.log(data)    
                    
            }
        request.send()
    }

    function logout(){
        c =  window.localStorage.getItem('cookie');
        var request = new XMLHttpRequest()
        request.open('POST', addr + '/api/v1/logout?session_cookie='+c, true)
        request.onload = function () {
            window.localStorage.setItem('cookie', null);
            window.localStorage.setItem('username', null);
            var data = JSON.parse(this.response)
            if (data.data == 'ok'){   
                window.localStorage.setItem('cookie', null);
                window.localStorage.setItem('username', null);
                update_visuals();
                window.location.replace('/home')
            }else{
                console.log('error de logout ' + data)
            }
            console.log(data)    
                
        }
            
        request.send()
    }
        

        //register
        //btn_register
        //document.querySelector("#btn_register").addEventListener("mousedown", function(){request();});
        //form = document.querySelector(".form-register");
        //form.addEventListener("submit", function(){request();});
    function register(){
        un = document.querySelector("#inputUsername").value;
        lang =  document.querySelector("#inputLanguage").value;
        email =  document.querySelector("#inputEmail").value;
        pass =  document.querySelector("#inputPassword").value;
        passconf = document.querySelector("#inputPasswordConfirmation").value;
        if (pass == passconf){
            send_registry(un, lang, email, pass);
            alert("registro creado");
        }
        else{
            console.log('register error: pass != passconf');
        }
    }

    function send_registry(un, lang, email, pass){
        var request = new XMLHttpRequest()
        request.open('POST', addr + '/api/v1/users?game=1'+
        '&username='+ un +
        '&lang=' + lang +
        '&email=' + email +
        '&password=' + pass,
            true)
        request.onload = function () {
                var data = JSON.parse(this.response)  
                if (data.data == 'ok'){
                    window.location.replace('/home')
                }else{
                    console.log('error de registro')
                }
                console.log(data)    
                    
            


            }
        request.send()
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

    function is_logged_in(){
        if(window.localStorage.getItem('cookie') == "null"){
            console.log('no cookie 2');
            return false;
        }else{
            return true;
        }
    }

    //creates a tag to show the user is logged in
    function show_username(un){
        var tag = document.createElement("p");
        tag.setAttribute("id", "menu_username_text");

        var text = document.createTextNode("Welcome " + un);
        tag.appendChild(text);
        var element = document.getElementById('menu_user');
        element.appendChild(tag);
    }

    function show_logout(){
        var tag = document.createElement("p");
        tag.setAttribute("id", "menu_logout_text");

        var text = document.createTextNode("Log out here");      
        tag.appendChild(text);
        var element = document.getElementById('menu_logout');
        element.appendChild(tag);
        document.querySelector("#menu_logout").addEventListener("mousedown", function(){logout();});
        
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

    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    function replace_login(){
        try{
        var elmnt = document.getElementById("login-card");
        removeAllChildNodes(elmnt);
        var elmnt = document.getElementById("guest-card");
        removeAllChildNodes(elmnt);

        var elmnt = document.getElementById("login-card-f");
        removeAllChildNodes(elmnt);
        
        //var tag0 = document.createElement("div");
        //tag0.setAttribute("class", "col-lg-6 col-md-6 align-middle");

        var tag = document.createElement("button");
        var text = document.createTextNode("let's play!");
        tag.setAttribute("class", "btn btn-lg btn-primary btn-block");
        tag.setAttribute("id", "btn_lets_play");
        tag.style.display = 'block';
        tag.style.padding = '10px';
        tag.appendChild(text);
        var element = document.getElementById('login-card');
        element.appendChild(tag);
        document.querySelector("#btn_lets_play").addEventListener("mousedown", function(){  window.location.replace('/game');});  
        document.querySelector("#btn_lets_play").addEventListener("mousedown", function(){  extra_events();});  
    }
    catch{}
    }

    function update_visuals(){
        try{var elmnt = document.getElementById("menu_username_text");
        elmnt.remove();
        var elmnt = document.getElementById("menu_logout_text");
        elmnt.remove();
        }
        catch{}

        var un = window.localStorage.getItem('username');
        if(un == "null"){
            console.log('no used dependant buttons');
            return;
        }else{
        
            show_logout();
            show_username(un);
            replace_login();
        }
        
    }



    function log_as_guest(){
        //inputName btn_play_as_guest

    }
