import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { User } from '../../shared/models/User';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

// EZT KELL FOLYTATNI MERT MÉG MINDIG NEM MEGFELELŐ HOGY UGYANZ LEGYEN A KÉT JELSZÓ
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
    })
  });

  constructor(
    private fBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService) { }

  ngOnInit(): void {
  }

  passwordMatchValidator(formGroup: FormGroup) {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const rePassword = formGroup.get('rePassword')?.value;
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
    formGroup.get('rePassword')?.addValidators([Validators.required, this.passwordMatchValidator(formGroup)]);
    return formGroup;
  }



  registration() {
    // Ha a validátorok mindegyik helyes csak akkor fut le!
    /* if (this.usersForm.valid) {
      if (this.usersForm.get('email') && this.usersForm.get('password')) {
        // Spread operátor: Teljes másolatot hoz létre
        // Ennek segítségével új objektumot hozunk létre mindig
        this.users.push({ ...this.usersForm.value });
        console.log(this.users);
      }
    } */
    if(this.usersForm.get('password')?.value == this.usersForm.get('rePassword')?.value){
      this.authService.registration(this.usersForm.get('email')?.value, this.usersForm.get('password')?.value)
      .then(credential => {
        console.log(credential);
        const user: User = {
          id: credential.user?.uid as string,
          email: this.usersForm.get('email')?.value,
          username: this.usersForm.get('username')?.value,
          name: {
            firstname: this.usersForm.get('name.firstname')?.value,
            lastname: this.usersForm.get('name.lastname')?.value
          }
        };
        this.userService.create(user).then(_ => {
          console.log('Felhasználó hozzáadása sikeres');
          this.router.navigateByUrl('/main');
        }).catch(error => {
          console.error(error);
        });
      }).catch(error => {
        console.error(error);
      });
    } else {
      console.error('A két jelszó nem egyezik meg!');
    }
  }
}
