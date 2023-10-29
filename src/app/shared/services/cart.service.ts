import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/Cart';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart = new BehaviorSubject<Cart>({items: []});


  constructor(private toastr: ToastrService) {
    if(localStorage.getItem('cart') !== null){
      this.cart.value.items = JSON.parse(localStorage.getItem("cart")!)
    }
   }

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];
    const itemInCart = items.find((_item) => _item.id === item.id);
    if(itemInCart){
      itemInCart.quantity += item.quantity;
    } else {
      items.push(item);
    }
    localStorage.setItem("cart", JSON.stringify(items));
    this.cart.next({items});
  }

  addQuantity(item: CartItem): void {
    const items = [...this.cart.value.items];
    const itemInCart = items.find((_item) => _item.id === item.id);
    if(item.quantity + 1 <= item.storageQuantity){
      if(itemInCart){
        itemInCart.quantity++;
      }
      localStorage.setItem("cart", JSON.stringify(items));
      this.cart.next({items});
      this.toastr.success('1 db ' + item.name + ' sikeresen a kosárba került!', 'Kosár');
    } else {
      this.toastr.error('Csak annyi ' + item.name + 'nevezetű terméket tudsz a kosaradba elhelyezni ameddig a készlet tart!', 'Kosár');
    }
    
  }

  removeQuantity(item: CartItem): void {
    const items = [...this.cart.value.items];
    const itemInCart = items.find((_item) => _item.id === item.id);
    if(itemInCart){
      if(itemInCart.quantity > 1){
        itemInCart.quantity--;
        this.toastr.success('1 db ' + item.name + ' eltávolításra került a kosárból!', 'Kosár');
      } else {
        this.toastr.info('Már csak 1 db ' + item.name + ' van a kosaradban! Nem tudod csökkenteni a mennyiséget!', 'Kosár');
      }
    }
    localStorage.setItem("cart", JSON.stringify(items));
    this.cart.next({items});
    
  }

  getTotal(items: Array<CartItem>): number {
    return items.
    map((item) => item.price * item.quantity).reduce((prev, current) =>
    prev + current, 0);
  }

  clearCart(successPayment = false): void {
    this.cart.next({items: []});
    localStorage.removeItem("cart");
    if(successPayment){
      this.toastr.success('A vásárlás sikeres volt!', 'Kosár');
    } else {
      this.toastr.success('A teljes kosarad kiürült!', 'Kosár');
    }
  }

  removeFromCart(item: CartItem): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter((_item) =>
    _item.id !== item.id);

    localStorage.setItem("cart", JSON.stringify(filteredItems));
    this.cart.next({items: filteredItems});
    this.toastr.success('Az összes ' + item.name + ' eltávolításra került a kosárból!', 'Kosár');
    return filteredItems;
  }
}
