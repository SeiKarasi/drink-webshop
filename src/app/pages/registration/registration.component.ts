import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/User';


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

  constructor(private fBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  // Arra kell, hogy garantálni tudjuk a User típust
  // simán az fBuilder.grouppal ez nem tehető meg!
  createForm(model: User) {
    let formGroup = this.fBuilder.group(model);
    // Validátorokat rendelünk az egyes elemekhez!
    formGroup.get('email')?.addValidators([Validators.required]);
    return formGroup;
  }

  registration(){
     // Ha a validátorok mindegyik helyes csak akkor fut le!
     if (this.usersForm.valid) {
      if (this.usersForm.get('email') && this.usersForm.get('password')) {
        // Spread operátor: Teljes másolatot hoz létre
        // Ennek segítségével új objektumot hozunk létre mindig
        this.users.push({ ...this.usersForm.value });
        console.log(this.users);
      }
    }
  }

}
