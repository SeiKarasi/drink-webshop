import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UntypedFormBuilder, AbstractControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommentService } from '../../shared/services/comment.service';
import { RatingService } from '../../shared/services/rating.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user?: User;
  imageFile?: any;
  imageFilePath?: string;

  loadedImage?: string;

  passwordForm= this.createForm({
    newPassword: '',
    newRePassword: ''
  });

  passwordChange = false;

  usernameInput = false;
  lastnameInput = false;
  firstnameInput = false;

  oldUsername?: string;

  constructor(
    private fBuilder: UntypedFormBuilder,
    private toastr: ToastrService, 
    private userService: UserService,
    private commentService: CommentService,
    private ratingService: RatingService,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    if (user != null) {
        this.userService.getById(user.uid).subscribe(data => {
        this.user = data;
        this.userService.loadImage(this.user!.photo_url).subscribe(profilPicture => {
          this.loadedImage = profilPicture;
        }, error => {
          console.error(error);
        });
      });
    }
  }

  async onFileSelected(event: any) {
    if (this.user?.email) {
      this.imageFile = event.target.files[0];
    } else {
      this.toastr.error("Sikertelen kép választás! A felhasználónév szükséges hogy kitöltött legyen!", "Kép");
      event.target.value = '';
    }
  }

  async addProfilePicture(){
    if(this.imageFile){
      this.imageFilePath = 'profilePictures/' + this.user?.email + '.png';
      const task = this.storage.upload(this.imageFilePath, this.imageFile);
      try {
        await task;
      } catch (error) {
        console.log('Hiba történt a feltöltés során:', error);
      }
    } else {
      this.toastr.error("Sikertelen képfeltöltés! Adj meg egy képet, amit fel szeretnél tölteni!", "Kép");
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

  updateUsername(){
    if(!this.usernameInput){
      this.usernameInput = true;
      this.oldUsername = this.user?.username;
    } else {
      if(confirm("Biztos, hogy módosítani szeretnéd a felhasználónevedet?") && this.user){
        this.usernameInput = false;
        this.commentService.getAllByUsername(this.oldUsername!).subscribe(comments => {
          comments.forEach(comment => {
            this.commentService.updateUsername(comment.id, this.user!.username);
          });
        });
        this.ratingService.getAllByUsername(this.oldUsername!).subscribe(ratings => {
          ratings.forEach(rating => {
            this.ratingService.updateUsername(rating.id, this.user!.username);
          });
        });
        
        this.userService.create(this.user);
      }
    }
  }

  updateLastname(){
    if(!this.lastnameInput){
      this.lastnameInput = true;
    } else {
      if(confirm("Biztos, hogy módosítani szeretnéd a vezetékneved?") && this.user){
        this.lastnameInput = false;  
        this.userService.create(this.user);
      }
    }
  }

  updateFirstname(){
    if(!this.firstnameInput){
      this.firstnameInput = true;
    } else {
      if(confirm("Biztos, hogy módosítani szeretnéd a keresztneved?") && this.user){
        this.firstnameInput = false;  
        this.userService.create(this.user);
      }
    }
  }

  cancelUpdate(){
    this.usernameInput = false;
    this.lastnameInput = false;
    this.firstnameInput = false;
  }
}
