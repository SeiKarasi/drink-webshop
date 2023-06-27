import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'drink-webshop';
  page = '';

  loggedInUser?: firebase.default.User | null;

  activeLink?: string;

  // a constructor paraméterei: paraméter adattagok
  // (egyenlő azzal, mint ha létrehoztunk volna egy adattagot
  // és a paraméterben érkezőt adtuk volna neki értékül)
  constructor(private router: Router, private authService: AuthService){
  }

  setActiveLink(link: string) {
    this.activeLink = link;
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

    this.authService.isUserLoggedIn().subscribe(user => {
      console.log(user);
      this.loggedInUser = user;
      localStorage.setItem('user', JSON.stringify(this.loggedInUser));
    }, error => {
      console.log(error);
      localStorage.setItem('user', JSON.stringify('null'));
    })
  }

  // Cseréli a page adattag értékét a selectedPage által!
  switchPage(selectedPage: string){
    this.page = selectedPage;
    this.router.navigateByUrl(selectedPage);
  }

  onToggleSidenav(sidenav: MatSidenav){
    sidenav.toggle();
  }

  onCloseSidenav(event: any, sidenav: MatSidenav){
    if (event == true){
      sidenav.close();
    }
  }

  logout(_?: boolean){
    this.authService.logout().then(() => {
      console.log('Sikeres kijelentkezés!');
    }).catch(error => {
      console.error(error);
    });
  }
}
