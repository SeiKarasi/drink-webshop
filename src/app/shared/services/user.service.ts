import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/User';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  collectionName = 'Users';

  constructor(private afs: AngularFirestore) { }

  // CRUD (Create, Read, Update, Delete)

  // Create
  create(user: User){
    return this.afs.collection<User>(this.collectionName).doc(user.id).set(user);
  }

  // Read All
  // NINCS HASZNÁLVA
  getAll() {
    return this.afs.collection<User>(this.collectionName).valueChanges();
  }

  // Read filter (one)
  getById(id: string){
    return this.afs.collection<User>(this.collectionName).doc(id).valueChanges();
  }

  // Update
  updateHealth(userId: string, gameHealth: number){
    const userRef = this.afs.collection<User>(this.collectionName).doc(userId);
    return userRef.update({ gameHealth: gameHealth });
  }

  updateDiscount(userId: string, userDiscount: number, getDiscount: number) {
    const userRef = this.afs.collection<User>(this.collectionName).doc(userId);
    return userRef.update({ discount: userDiscount + getDiscount });
  }

  updateDiscountToLink(userId: string, userDiscount: number, userDiscountToLink: boolean) {
    const userRef = this.afs.collection<User>(this.collectionName).doc(userId);
    if(userDiscountToLink === false){
      return userRef.update({ discount: userDiscount + 5, discountToLink: true });
    } else {
      return userRef.update({ discount: userDiscount + 0 });
    }
  }

  // Delete
  // NINCS HASZNÁLVA
  delete(id: string){
    return this.afs.collection<User>(this.collectionName).doc(id).delete();
  }
}
