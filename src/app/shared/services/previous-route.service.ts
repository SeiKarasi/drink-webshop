import { Injectable } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import {filter, pairwise } from 'rxjs/operators';

@Injectable()
export class PreviousRouteService {

 private previousUrl?: string;

 constructor(private router: Router) {

this.router.events
  .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
  .subscribe((events: RoutesRecognized[]) => {
    this.previousUrl = events[0].urlAfterRedirects;
    localStorage.setItem('previous_url', this.previousUrl);
  });
 }
 public getPreviousUrl() {
  console.log(this.previousUrl);
  if(this.previousUrl === undefined){
    let test = localStorage.getItem('previous_url');
    if(test !== null){
      this.previousUrl = test;
    } 
  }
  return this.previousUrl;
 }
 } 