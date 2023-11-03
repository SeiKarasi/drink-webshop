import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private toastr: ToastrService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const user = JSON.parse(localStorage.getItem('user') as string);
      if (user){
        return true;
      } else {
        this.router.navigateByUrl('/login').then(() => {
          this.toastr.info("Jelentkezz be a játékkal szerzett akciókért és a blogbejegyzésekért!", "Játék és Blog");
        }).catch(error => {
          console.error(error);
        });
        return false;
      }
  }
  
}
