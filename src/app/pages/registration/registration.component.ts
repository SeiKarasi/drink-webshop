import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { User } from '../../shared/models/User';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  users: Array<User> = [];
  usersForm = this.createForm({
    email: '',
    username: '',
    password: '',
    rePassword: '',
    name: this.fBuilder.group({
      firstname: '',
      lastname: ''
    }),
    gameHealth: 0,
    discountToLink: false,
    discount: 0
  });
  loginLoading: boolean = false;

  constructor(
    private fBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  passwordMatchValidator(): ValidatorFn  {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = this.usersForm.get('password')?.value;
      const rePassword = this.usersForm.get('rePassword')?.value;
      if (password !== rePassword) {
        return { mismatch: true };
      } else {
        return null;
      }
    }
  }

  // Arra kell, hogy garantálni tudjuk a User típust
  // simán az fBuilder.grouppal ez nem tehető meg!
  createForm(model: any) {
    let formGroup = this.fBuilder.group(model);
    // Validátorokat rendelünk az egyes elemekhez!
    formGroup.get('email')?.addValidators([Validators.required, Validators.email]);
    formGroup.get('password')?.addValidators([Validators.required]);
    formGroup.get('rePassword')?.addValidators([Validators.required, this.passwordMatchValidator()]);
    return formGroup;
  }



  registration() {
    this.loginLoading = true;
    if(this.usersForm.valid){
      this.authService.registration(this.usersForm.get('email')?.value, this.usersForm.get('password')?.value)
      .then(credential => {
        console.log(credential);
        const user: User = {
          id: credential.user?.uid as string,
          email: this.usersForm.get('email')?.value,
          username: this.usersForm.get('username')?.value ? this.usersForm.get('username')?.value
          : this.usersForm.get('email')?.value?.split('@')[0] as string,
          name: {
            firstname: this.usersForm.get('name.firstname')?.value || 'undefined',
            lastname: this.usersForm.get('name.lastname')?.value || 'undefined'
          },
          gameHealth: 3,
          discountToLink: false,
          discount: 0,
          admin: false,
          photo_url: ""
        };
        this.userService.create(user).then(_ => {  
          console.log('Felhasználó hozzáadása sikeres');
          this.router.navigateByUrl('/main');
          this.toastr.success("Sikeres regisztráció!", "Regisztráció");
          this.loginLoading = false;
        }).catch(error => {
          this.toastr.error("Sikertelen regisztráció!", "Regisztráció");
          console.error(error);
          this.loginLoading = false;
        });
      }).catch(error => {
        this.toastr.error("Sikertelen regisztráció, mert a jelszónak legalább 6 karakter hosszúnak kell lennie!", "Regisztráció");
        console.error(error);
        this.loginLoading = false;
      });
    } else {
      setTimeout(() => {
        this.loginLoading = false;
      }, 3000);
      this.toastr.error("A jelszó és a jelszó ismét nem egyezik vagy a kötelező mezők valamelyike nincs kitöltve avagy nem megfelelő formátumú!", "Regisztráció");
      //console.error('A két jelszó nem egyezik meg!');
    }
  }
}
