import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Comment } from '../models/Comment';


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  collectionName = 'Comments';

  constructor(private afs: AngularFirestore) { }

  // Create
  create(comment: Comment){
    // Így kreálhatunk id-t
    comment.id = this.afs.createId();
    return this.afs.collection<Comment>(this.collectionName).doc(comment.id).set(comment);
  }

  // Read
  getAll(){
    return this.afs.collection<Comment>(this.collectionName).valueChanges();
  }

  // Update
  // NINCS HASZNÁLVA
  update(comment: Comment){
    return this.afs.collection<Comment>(this.collectionName).doc(comment.id).set(comment);
  }

  // Delete
  // NINCS HASZNÁLVA
  delete(id: string){
    return this.afs.collection<Comment>(this.collectionName).doc(id).delete();
  }

  // Read filter
  getCommentsByProductId(productId: string){
    return this.afs.collection<Comment>(this.collectionName,
       ref => ref.where('productId', '==', productId).orderBy('date', 'asc')).valueChanges();
  }
}


