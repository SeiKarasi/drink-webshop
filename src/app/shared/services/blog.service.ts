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

  updateWholeText(blogId: string, wholeText: boolean = false) {
    const blogRef = this.afs.collection<Blog>(this.collectionName).doc(blogId);
    return blogRef.update({ wholeText: wholeText });
  }

}
