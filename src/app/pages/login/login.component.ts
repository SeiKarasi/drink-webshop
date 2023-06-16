import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FakeLoadingService } from '../../shared/services/fake-loading.service';
import { Subscription, Observable} from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  usersForm = new FormGroup ({
    email: new FormControl(''),
    password:new FormControl(''),
  });
  

  loadingSubscription?: Subscription;
  loadingObservation?: Observable<boolean>;

  loginLoading: boolean = false;

  constructor(private router: Router, private loadingService: FakeLoadingService, private authService: AuthService) { }

  ngOnInit(): void {
  }

  async login() {
    this.loginLoading = true;
    // then akkor fut le, amikor a return ténylegesen lefut az adott Promiseban
    // catch akkor fut le, ha hiba van benne
    // finally mindig lefut
    // FONTOS: Amit ezen a kódrészleten belül végzünk az később fut le,
    // mint az esetleges későbbi sorok a függvényben 
    /* this.loadingService.loadingWithPromise(this.LoginForm.get('email')?.value, this.LoginForm.get('password')?.value).then((_: boolean) => {
      this.router.navigateByUrl('/main');
    }).catch(error => {
      console.error(error, 'Nem megfelelő bejelentkezési adatok!');
    }).finally(() => {
      console.log('This is executed finally.');
    }); */

    // async-await
    // async arra utal, hogy aszinkron a függvény és await szerepel
    // az await arra utal, hogy bevárunk egy Promiset
    // párhuzamos futást tesz lehetővé az aszinkron
    // az async-await technikával szinkron kódunk lesz, de aszinkron működés
    // sima try-catch alkalmazása
   /* try {
      // then
      const _ = await this.loadingService.loadingWithPromise(this.LoginForm.get('email')?.value, this.LoginForm.get('password')?.value);
      this.router.navigateByUrl('/main');
    } catch (error) {
      // catch
      console.error(error, 'Nem megfelelő bejelentkezési adatok!');
    }
    // finally
    console.log('this is executed finally'); */

    // Observable
    // Ha nem zárjuk be akkor memory leak
    // ezért le kell iratkozni ha már nem használjuk
   /* this.loadingObservation = this.loadingService.loadingWithObservable(this.usersForm.get('email')?.value, this.usersForm.get('password')?.value);
    this.loadingSubscription = this.loadingObservation.subscribe({
      next: (data: boolean) => {
      this.router.navigateByUrl('/main');
      }, error: (error) => {
        this.loginLoading = false;
        console.error(error);
      }, complete: () => {
        this.loginLoading = false;
        console.log('finally');
      }
    }); */
    this.authService.login(this.usersForm.get('email')?.value, this.usersForm.get('password')?.value)
    .then(credential => {
      console.log(credential);
      this.router.navigateByUrl('/main');
      this.loginLoading = false;
    }).catch(error => {
      console.error(error);
      this.loginLoading = false;
    })
  }

  // leiratkozunk róla amikor a komponens megszűnik
  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
  }
}
