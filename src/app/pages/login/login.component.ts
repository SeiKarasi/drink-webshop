import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, Observable} from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  usersForm = new UntypedFormGroup ({
    email: new UntypedFormControl(''),
    password:new UntypedFormControl(''),
  });
  

  loadingSubscription?: Subscription;
  loadingObservation?: Observable<boolean>;

  loginLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  login() {
    this.loginLoading = true;
    this.authService.login(this.usersForm.get('email')?.value, this.usersForm.get('password')?.value)
    .then(credential => {
      console.log(credential);
      this.router.navigateByUrl('/main');
      this.toastr.success("Sikeres bejelentkezés!", "Bejelentkezés");
      this.loginLoading = false;
      location.reload();
    }).catch(error => {
      console.error(error);
      this.toastr.error("Sikertelen bejelentkezés!", "Bejelentkezés");
      this.loginLoading = false;
    })
  }

  // leiratkozunk róla amikor a komponens megszűnik
  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
  }
}
