import { Component, OnInit } from '@angular/core';
import{Router} from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void {
    document.querySelector("#btn_login").addEventListener("mousedown", function(){ login();});
    update_visuals();


  }

  onClick(){
      this._router.navigate(['/game']);
  }

}
var addr = 'https://rtsketchserver-kbefbqorma-ue.a.run.app';
  
    function login(){

        var u = document.querySelector<HTMLInputElement>("#inputUsername").value;
        var p =  document.querySelector<HTMLInputElement>("#inputPassword").value;
        var request = new XMLHttpRequest()
        request.open('POST', addr + '/api/v1/login?username='+u+ '&password=' +p , true)
        request.onload = function () {
                var data = JSON.parse(this.response)
                if (data.data == 'ok'){
                    window.localStorage.setItem('username', u);
                    window.localStorage.setItem('cookie', data.cookie);
                    console.log('logged in')

                    console.log('local storage: cookie ' + window.localStorage.getItem('cookie'))      
                    update_visuals();
                    //replaced by routerlink on element
                    //window.location.replace('/user')
                }else{
                    console.log('error?')
                }
                console.log(data)           
            }
        request.send()
    }


    //TODO: add to other components or in general.
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

  function logout(){
    var c =  window.localStorage.getItem('cookie');
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
            //replaced by routerlink in object
            //window.location.replace('/home')
        }else{
            console.log('error de logout ' + data)
        }
        console.log(data)    
            
    }
        
    request.send()
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
      
      var element = document.getElementById('btn_lets_play').style.display="block";
     // document.querySelector("#btn_lets_play").addEventListener("mousedown", function(){  window.location.replace('/game');});  
     // document.querySelector("#btn_lets_play").addEventListener("mousedown", function(){  extra_events();});  
  }
  catch{}
  }


