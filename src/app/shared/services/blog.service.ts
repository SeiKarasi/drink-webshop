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

  create(blog: Blog){
    blog.id = this.afs.createId();
    return this.afs.collection<Blog>(this.collectionName).doc(blog.id).set(blog);
  }

  updateIsWholeText(blogId: string, isWholeText: boolean = false) {
    const blogRef = this.afs.collection<Blog>(this.collectionName).doc(blogId);
    return blogRef.update({ isWholeText: isWholeText });
  }

  update(blogId: string, newTitle: string, newText: string) {
    const blogRef = this.afs.collection<Blog>(this.collectionName).doc(blogId);
    return blogRef.update({ title: newTitle, text: newText });
  }

  delete(id: string){
    return this.afs.collection<Blog>(this.collectionName).doc(id).delete();
  }

}
