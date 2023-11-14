import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Rating } from '../models/Rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  collectionName = 'Ratings';

  constructor(private afs: AngularFirestore) { }

  // Create
  create(rating: Rating){
    // Így kreálhatunk id-t
    rating.id = this.afs.createId();
    return this.afs.collection<Rating>(this.collectionName).doc(rating.id).set(rating);
  }

  // Read
  getAll(){
    return this.afs.collection<Rating>(this.collectionName).valueChanges();
  }

  getAllByUsername(username: string){
    return this.afs.collection<Rating>(this.collectionName, ref => ref.where('username', '==', username)).valueChanges();
  }

  updateUsername(ratingId: string, username: string) {
    const ratingRef = this.afs.collection<Rating>(this.collectionName).doc(ratingId);
    return ratingRef.update({ username: username });
  }

  // Update
  update(rating: Rating){
    return this.afs.collection<Rating>(this.collectionName).doc(rating.id).set(rating);
  }

  // Delete
  delete(id: string){
    return this.afs.collection<Rating>(this.collectionName).doc(id).delete();
  }

  // Read filter
  getRatingByProductIdAndUsername(productId: string, username: string){
    return this.afs.collection<Rating>(this.collectionName,
       ref => ref.where('productId', '==', productId).where('username', '==', username)).valueChanges();
  }

  getRatingsByProductId(productId: string){
    return this.afs.collection<Rating>(this.collectionName,
       ref => ref.where('productId', '==', productId)).valueChanges();
  }

}
