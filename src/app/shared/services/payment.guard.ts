import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PaymentGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const stripeRedirectUrl = localStorage.getItem('stripeRedirectUrl');

    if (stripeRedirectUrl !== null) {
      localStorage.removeItem('stripeRedirectUrl');
      return true;
    } else {
      return this.router.parseUrl('/main');
    }
  }
}