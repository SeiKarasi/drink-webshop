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
  // NINCS HASZNÁLVA
  update(user: User){
    return this.afs.collection<User>(this.collectionName).doc(user.id).set(user);
  }

  updateDiscountToLink(userId: string, discountToLink: boolean) {
    const userRef = this.afs.collection<User>(this.collectionName).doc(userId);
    return userRef.update({ discountToLink : discountToLink });
  }

  // Delete
  // NINCS HASZNÁLVA
  delete(id: string){
    return this.afs.collection<User>(this.collectionName).doc(id).delete();
  }
}
