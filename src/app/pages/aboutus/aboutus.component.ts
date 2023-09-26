import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/User';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent implements OnInit {
  user?: User

  constructor(private userService: UserService, private toastr: ToastrService, private router: Router) { }

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

  Discount() {
    if (this.user) {
      this.userService.updateDiscountToLink(this.user.id, true)
      this.router.navigate(['/main']).then(() => {
        this.toastr.success("Gratulálunk! Minden termékre 5% kedvezményt kaptál!", "Kedvezmény")
      });
    }
  }

  LoginToDiscount() {
    this.router.navigate(['/login']).then(() => {
      this.toastr.info("Jelentkezz be, hogy megkapd a kedvezményt!", "Kedvezmény")
    });
  }
}
