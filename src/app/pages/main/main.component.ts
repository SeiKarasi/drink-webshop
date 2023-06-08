import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  comingSoonImages: Array<any> = ['blue_cola_drink', 'extreme_cola_drink', 'orange_cola_drink2',
   'orange_cola_drink', 'snake_whisky_drink'];

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  navigateThisProduct(){}

}
