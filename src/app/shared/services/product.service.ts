import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/Product';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  collectionName = 'Products';
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage) { }

  loadImageMeta(): Observable<Array<Product>> {
     return this.afs.collection<Product>(this.collectionName).valueChanges();
     //return this.http.get(environment.hostUrl + '/assets/' + metaUrl) as Observable<Array<Product>>;
  }

  loadImageMetaByCategory(category: string){
    return this.afs.collection<Product>(this.collectionName, ref => ref.where('category', '==', category)).valueChanges();
  }

  loadImage(imageUrls: string) {
    //return this.http.get(environment.hostUrl + '/assets/img' + imageUrl, {responseType: 'blob'});
    return this.storage.ref(imageUrls).getDownloadURL();
  }
}
