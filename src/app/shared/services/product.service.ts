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

  loadImageMeta(sortABC: string = '', sortPrice: string = ''): Observable<Array<Product>> {
    if(sortABC === 'asc' || sortABC === 'desc'){
      return this.afs.collection<Product>(this.collectionName, ref => ref.orderBy('name', sortABC)).valueChanges();
    } else if(sortPrice === 'asc' || sortPrice === 'desc'){
      return this.afs.collection<Product>(this.collectionName, ref => ref.orderBy('price', sortPrice)).valueChanges();
    }
     return this.afs.collection<Product>(this.collectionName).valueChanges();
  }

  loadImageMetaByProductID(id: string) {
        return this.afs.collection<Product>(this.collectionName, ref => ref.where('id', '==', id)).valueChanges();
  }

  loadImageMetaByCategory(category: string, sortABC: string = '', sortPrice: string = ''){
    if(sortABC === 'asc' || sortABC == 'desc'){
      return this.afs.collection<Product>(this.collectionName, ref => ref.where('category', '==', category).orderBy('name', sortABC)).valueChanges();
    } else if(sortPrice === 'asc' || sortPrice === 'desc'){
      return this.afs.collection<Product>(this.collectionName, ref => ref.where('category', '==', category).orderBy('price', sortPrice)).valueChanges();
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
