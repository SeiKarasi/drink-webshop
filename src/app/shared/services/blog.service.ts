import { Injectable } from '@angular/core';
import { Blog } from '../models/Blog';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  collectionName = 'Blogs';

  constructor(private afs: AngularFirestore) { }

  // READ functions
  getAll(){
    return this.afs.collection<Blog>(this.collectionName).valueChanges();
  }

  getAllByAuthor(username: string){
    return this.afs.collection<Blog>(this.collectionName, ref => ref.where('author', '==', username)).valueChanges();
  }

  // CREATE functions
  create(blog: Blog){
    blog.id = this.afs.createId();
    return this.afs.collection<Blog>(this.collectionName).doc(blog.id).set(blog);
  }
  
  // UPDATE functions
  updateAuthor(blogId: string, username: string) {
    const blogRef = this.afs.collection<Blog>(this.collectionName).doc(blogId);
    return blogRef.update({ author: username });
  }

  update(blog: Blog) {
    return this.afs.collection<Blog>(this.collectionName).doc(blog.id).set(blog);
  }

  // DELETE functions
  delete(id: string){
    return this.afs.collection<Blog>(this.collectionName).doc(id).delete();
  }

}
