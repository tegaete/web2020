import { Component, OnInit } from '@angular/core';
import { register } from '../../assets/js/canvas.js';
import{Router} from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
      //register();
      load_events_register();
    

    /* 
      var can_stay = true;
      if(!can_stay){
        this._router.navigate(['/home']);
        console.log('cant stay in game component')
      }else{
        
      }
  // */
  }
}


var addr = 'https://rtsketchserver-kbefbqorma-ue.a.run.app';

function load_events_register(){
  console.log('entered function on component!!! ---------')
  try {
      document.querySelector("#btn_register").addEventListener("mousedown", function(){register();});
   }
 catch{console.log('register event bind failure')}
}

function register(){
  var un = document.querySelector<HTMLInputElement>("#inputUsername").value;
  var lang =  document.querySelector<HTMLInputElement>("#inputLanguage").value;
  var email =  document.querySelector<HTMLInputElement>("#inputEmail").value;
  var pass =  document.querySelector<HTMLInputElement>("#inputPassword").value;
  var passconf = document.querySelector<HTMLInputElement>("#inputPasswordConfirmation").value;
  if (pass == passconf){
      send_registry(un, lang, email, pass);
      alert("registro enviado");
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
              window.location.assign('/home')
          }else{
              console.log('error de registro')
          }
          console.log(data)    
      }
  request.send()
}