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
      //load_events_register();
    

    /* 
      var can_stay = true;
      if(!can_stay){
        this._router.navigate(['/home']);
        console.log('cant stay in game component')
      }else{
        
      }
  // */
  }

  onRegister(){
    //Ya no se compara, por un problema de rutas.
    if (register() || true){
      this._router.navigate(['/home']);
      console.log('success in registry')
    }else{
      console.log('fail in registry')
    }
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

function register():boolean{
  var un = document.querySelector<HTMLInputElement>("#inputUsername").value;
  var lang =  document.querySelector<HTMLInputElement>("#inputLanguage").value;
  var email =  document.querySelector<HTMLInputElement>("#inputEmail").value;
  var pass =  document.querySelector<HTMLInputElement>("#inputPassword").value;
  var passconf = document.querySelector<HTMLInputElement>("#inputPasswordConfirmation").value;
  if (pass == passconf){
      var flag = send_registry(un, lang, email, pass);
      alert("registro enviado");
      return flag;
  }
  else{
      console.log('register error: pass != passconf');
      return false;
    }
}

var foobar = false;

function send_registry(un, lang, email, pass):boolean{
  var request = new XMLHttpRequest()
  request.open('POST', addr + '/api/v1/users?game=1'+
  '&username='+ un +
  '&lang=' + lang +
  '&email=' + email +
  '&password=' + pass,
      true)
      foobar = false;
 request.onload = function () {
          var data = JSON.parse(this.response)  
          if (data.data == 'ok'){
              //reemplazado por router
              //window.location.assign('/home')
              console.log('registro correcto en servidor')
              flagger();
          }else{
              console.log('error de registro')
              alert("Error de registro en servidor, intente de nuevo.");
          }
      }
  request.send()

  console.log('foobar is: ' + foobar)
  return foobar;
}

function flagger(){
  foobar = true;
}