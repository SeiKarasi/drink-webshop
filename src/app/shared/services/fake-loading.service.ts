import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FakeLoadingService {

  constructor() { }

  // CRUD műveletek (Create, Read, Update, Delete)


  // Async művelet => Callback, Promise, Observable
  // Callback nem használatos
  // Most 3 másodpercet fogunk várni
  // 1 másodperc = 1000 ms (ennyi időnként)
  loadingWithPromise(email: string, password: string): Promise<boolean> {
    // resolve = pozitív esetben fut le
    // reject = negatív esetben fut le
    return new Promise((resolve, reject) => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        if (i === 3) {
          clearInterval(interval);
          if (email === 'test@gmail.com' && password === 'testpw') {
            resolve(true)
          } else {
            reject(false);
          }
        }
      }, 1000);
    });
  }

  // adatfolyam nyílik = valamennyi adatot már megkaphatunk, de még kaphatunk pluszba utána
  loadingWithObservable(email: string, password: string): Observable<boolean> {
    // változás követéseket figyeli, ha fel vagyunk rá iratkozva
    return new Observable((subscriber: Subscriber<boolean>) => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        // subscriber.next(i);
        if(i === 3){
          if (email === 'test@gmail.com' && password === 'testpw') {
            subscriber.next(true);
            subscriber.complete();
          } else {
            subscriber.error(false);
          }
        }
      }, 1000)
    })
  }
}
