import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) {

  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  registration(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  // Visszaadja a usert aki be van lépve
  isUserLoggedIn() {
    return this.auth.user;
  }

  logout() {
    return this.auth.signOut();
  }
}
