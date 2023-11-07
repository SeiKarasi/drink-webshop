import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/User';
import { UserService } from 'src/app/shared/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UntypedFormBuilder, AbstractControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user?: User;
  passwordForm= this.createForm({
    newPassword: '',
    newRePassword: ''
  });

  passwordChange = false;

  constructor(
    private fBuilder: UntypedFormBuilder,
    private toastr: ToastrService, 
    private userService: UserService,
    private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    if (user != null) {
        this.userService.getById(user.uid).subscribe(data => {
        this.user = data;
      }, error => {
        console.error(error);
      });
    }
  }

  createForm(model: any) {
    let formGroup = this.fBuilder.group(model);
    // Validátorokat rendelünk az egyes elemekhez!
    formGroup.get('newPassword')?.addValidators([Validators.required]);
    formGroup.get('newRePassword')?.addValidators([Validators.required, this.passwordMatchValidator(formGroup)]);
    return formGroup;
  }

  passwordMatchValidator(formGroup: UntypedFormGroup) {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('newPassword')?.value;
      const rePassword = formGroup.get('newRePassword')?.value;
      if (password !== rePassword) {
        return { mismatch: true };
      } else {
        return null;
      }
    }
  }

  onUpdatePassword() {
    if(this.passwordChange){
      if(this.passwordForm.get("newPassword")?.value === this.passwordForm.get('newRePassword')?.value
      && this.passwordForm.get("newPassword")?.value !== ''){
        this.afAuth.currentUser
        .then(user => {
          return user?.updatePassword(this.passwordForm.get("newPassword")?.value);
        })
        .then(() => {
          this.passwordForm.get('newPassword')?.reset();
          this.passwordForm.get('newRePassword')?.reset();
          this.toastr.success("A jelszó sikeresen frissítve!", "Jelszó változtatás");
          this.passwordChange = false; 
        })
        .catch((error) => {
          this.toastr.error("A jelszó frissítése meghiúsult (Legalább 6 karakter hossz meg van követelve)!", "Jelszó változtatás");
        });
      } else {
        this.toastr.error("A jelszó és a jelszó ismét nem egyezik meg vagy üres!", "Jelszó változtatás");
      }
    } else {
      this.passwordChange = true;
    } 
  }

  onCancelUpdatePassword(){
    this.passwordChange = false;
  }
}
