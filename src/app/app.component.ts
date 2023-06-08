import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'drink-webshop';
  page = '';

  // a constructor paraméterei: paraméter adattagok
  // (egyenlő azzal, mint ha létrehoztunk volna egy adattagot
  // és a paraméterben érkezőt adtuk volna neki értékül)
  constructor(private router: Router){
  }

  ngOnInit(){
    // rxjs - reaktív programozás
    // Observable = adatfolyam, ami folyamatosan nyitva van
    // subscribe (feliratkozunk bizonyos eseményekre)
    // filterezzük az events-et, tehát csak a filternek
    // megfelelő események maradnak!
    this.router.events.
    pipe(filter(event => event instanceof NavigationEnd)).subscribe((evts: any) => {
      this.page = (evts.urlAfterRedirects as string).split('/')[1] as string;
    });
  }

  // Cseréli a page adattag értékét a selectedPage által!
  switchPage(selectedPage: string){
    this.page = selectedPage;
    this.router.navigateByUrl(selectedPage);
  }
}
