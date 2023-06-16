import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../shared/models/User';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  users: Array<User> = [];
  usersForm = this.createForm({
    email: '',
    password: '',
    name: {
      firstname: '',
      lastname: ''
    }
  });

  signUpForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    rePassword: new FormControl(''),
    name: new FormGroup({
      firstname: new FormControl(''),
      lastname: new FormControl('')
    })
  });

  constructor(private fBuilder: FormBuilder, private router: Router, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
  }

  // Arra kell, hogy garantálni tudjuk a User típust
  // simán az fBuilder.grouppal ez nem tehető meg!
  createForm(model: any) {
    let formGroup = this.fBuilder.group(model);
    // Validátorokat rendelünk az egyes elemekhez!
    formGroup.get('email')?.addValidators([Validators.required]);
    return formGroup;
  }

  registration(){
     // Ha a validátorok mindegyik helyes csak akkor fut le!
    /* if (this.usersForm.valid) {
      if (this.usersForm.get('email') && this.usersForm.get('password')) {
        // Spread operátor: Teljes másolatot hoz létre
        // Ennek segítségével új objektumot hozunk létre mindig
        this.users.push({ ...this.usersForm.value });
        console.log(this.users);
      }
    } */
    this.authService.registration(this.signUpForm.get('email')?.value, this.signUpForm.get('password')?.value)
    .then(credential => {
      console.log(credential);
      const user: User = {
        id: credential.user?.uid as string,
        email: this.signUpForm.get('email')?.value,
        // EZT MAJD CSERÉLJÜK RENDES USERNAME MEGADÁSRA
        username: this.signUpForm.get('email')?.value.split('@')[0],
        name: {
          firstname: this.signUpForm.get('name.firstname')?.value,
          lastname: this.signUpForm.get('name.lastname')?.value
        }
      };
      this.userService.create(user).then(_ => {
        console.log('Felhasználó hozzáadása sikeres')
      }).catch(error => {
        console.error(error);
      })
      //this.router.navigateByUrl('/main');
    }).catch(error => {
      console.error(error);
    })
  }

}
