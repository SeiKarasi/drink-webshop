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
    comment.id = this.afs.createId();
    return this.afs.collection<Comment>(this.collectionName).doc(comment.id).set(comment);
  }

  // Read
  getAll(){
    return this.afs.collection<Comment>(this.collectionName).valueChanges();
  }

  getAllByUsername(username: string){
    return this.afs.collection<Comment>(this.collectionName, ref => ref.where('username', '==', username)).valueChanges();
  }

  updateUsername(commentId: string, username: string) {
    const commentRef = this.afs.collection<Comment>(this.collectionName).doc(commentId);
    return commentRef.update({ username: username });
  }

  // Update
  update(comment: Comment){
    return this.afs.collection<Comment>(this.collectionName).doc(comment.id).set(comment);
  }

  // Delete
  delete(id: string){
    return this.afs.collection<Comment>(this.collectionName).doc(id).delete();
  }

  // Read filter
  getCommentsByProductId(productId: string){
    return this.afs.collection<Comment>(this.collectionName,
       ref => ref.where('productId', '==', productId).orderBy('date', 'asc')).valueChanges();
  }
}


