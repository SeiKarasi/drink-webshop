import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/Product';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // HTTP kérés

  collectionName = 'Products';
  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private storage: AngularFireStorage) { }

  loadImageMeta(metaUrl: string): Observable<Array<Product>> {
     return this.afs.collection<Product>(this.collectionName).valueChanges();
     //return this.http.get(environment.hostUrl + '/assets/' + metaUrl) as Observable<Array<Product>>;
  }

  loadImage(imageUrls: string) {
    //return this.http.get(environment.hostUrl + '/assets/img' + imageUrl, {responseType: 'blob'});
    return this.storage.ref(imageUrls).getDownloadURL();
  }
}
