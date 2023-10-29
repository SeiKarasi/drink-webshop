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

  loadImageMeta(sort: string = ''): Observable<Array<Product>> {
    if(sort === 'asc' || sort == 'desc'){
      return this.afs.collection<Product>(this.collectionName, ref => ref.orderBy('name', sort)).valueChanges();
    }
     return this.afs.collection<Product>(this.collectionName).valueChanges();
  }

  loadImageMetaByProductID(id: string) {
        return this.afs.collection<Product>(this.collectionName, ref => ref.where('id', '==', id)).valueChanges();
  }

  loadImageMetaByCategory(category: string, sort: string = ''){
    if(sort === 'asc' || sort == 'desc'){
      return this.afs.collection<Product>(this.collectionName, ref => ref.where('category', '==', category).orderBy('name', sort)).valueChanges();
    }
    return this.afs.collection<Product>(this.collectionName, ref => ref.where('category', '==', category)).valueChanges();
  }

  loadImageMetaByMarker(marker: string){
    return this.afs.collection<Product>(this.collectionName, ref => ref.where('marker', '==', marker)).valueChanges();
  }


  loadImage(imageUrls: string) {
    return this.storage.ref(imageUrls).getDownloadURL();
  }

  deleteImage(imageUrls: string){
    return this.storage.ref(imageUrls).delete();
  }

  create(product: Product){
    return this.afs.collection<Product>(this.collectionName).doc(product.id).set(product);
  }

  delete(id: string){
    return this.afs.collection<Product>(this.collectionName).doc(id).delete();
  }
}
