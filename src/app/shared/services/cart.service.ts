import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/Cart';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart = new BehaviorSubject<Cart>({items: []});


  constructor(private toastr: ToastrService) { }

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id);
    if(itemInCart){
      itemInCart.quantity += item.quantity;
    } else {
      items.push(item);
    }

    this.cart.next({items});
  }

  addQuantity(item: CartItem): void {
    const items = [...this.cart.value.items];
    const itemInCart = items.find((_item) => _item.id === item.id);
    if(itemInCart){
      itemInCart.quantity++;
    }
    this.cart.next({items});
    this.toastr.success('1 db ' + item.name + ' sikeresen a kosárba került!', 'Kosár');
  }

  removeQuantity(item: CartItem): void {
    let itemForRemoval: CartItem | undefined;
    let filteredItems =  this.cart.value.items.map((_item) => {
      if(_item.id === item.id){
        _item.quantity--;
        if(_item.quantity === 0){
          itemForRemoval = _item;
        }
      }

      return _item;
    });

    if(itemForRemoval) {
      filteredItems = this.removeFromCart(itemForRemoval, false);
    }
    this.cart.next({items: filteredItems});
    this.toastr.success('1 db ' + item.name + ' eltávolításra került a kosárból!', 'Kosár');
  }

  getTotal(items: Array<CartItem>): number {
    return items.
    map((item) => item.price * item.quantity).reduce((prev, current) =>
    prev + current, 0);
  }

  clearCart(): void {
    this.cart.next({items: []});
    this.toastr.success('A teljes kosarad kiürült!', 'Kosár');
  }

  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter((_item) =>
    _item.id !== item.id);

    if(update) {
      this.cart.next({items: filteredItems});
      this.toastr.success('Az összes ' + item.name + ' eltávolításra került a kosárból!', 'Kosár');
    }

    return filteredItems;
  }
}
