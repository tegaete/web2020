import { Component, OnInit } from '@angular/core';

//import { DynamicScriptLoader } from '../dynamic-script-loader.service';
import { start } from '../../assets/js/canvas.js';

declare var canvasjs:any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //this.loadScripts();
    start();
  }
  //private loadScripts() {
    // You can load multiple scripts by just providing the key as argument into load method of the service
    //DynamicScriptLoader.loadScript('chartjs').then(data => {
      // Script Loaded Successfully
   // }).catch(error => console.log(error));
  //}
}
