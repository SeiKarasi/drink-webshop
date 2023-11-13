import { Injectable } from '@angular/core';
import { Blog } from '../models/Blog';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  collectionName = 'Blogs';

  constructor(private afs: AngularFirestore) { }

  getAll(){
    return this.afs.collection<Blog>(this.collectionName).valueChanges();
  }
}
