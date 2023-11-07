import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/User';
import { UserService } from 'src/app/shared/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user?: User;

  constructor(private userService: UserService, private afAuth: AngularFireAuth) { }

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

  onUpdatePassword(newPassword: string) {
    this.afAuth.currentUser
      .then(user => {
        return user?.updatePassword(newPassword);
      })
      .then(() => {
        console.log('A jelszó sikeresen frissítve.');
      })
      .catch(error => {
        console.error('Jelszó frissítése sikertelen:', error);
      });
  }
}
