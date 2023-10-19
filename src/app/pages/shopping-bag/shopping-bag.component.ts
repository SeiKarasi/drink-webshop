import { Component, OnInit } from '@angular/core';
import { Cart, CartItem } from '../../shared/models/Cart';
import { Product } from '../../shared/models/Product';
import { CartService } from '../../shared/services/cart.service';
import { ProductService } from '../../shared/services/product.service';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shopping-bag',
  templateUrl: './shopping-bag.component.html',
  styleUrls: ['./shopping-bag.component.scss']
})
export class ShoppingBagComponent implements OnInit {

  cart: Cart = {items: []};

  loadedImages: Array<string> = [];
  productObject: Array<Product> = [];

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ];


  constructor(private cartService: CartService, private productService: ProductService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
      for (let i = 0; i < this.dataSource.length; i++) {
        this.productService.loadImage(this.dataSource[i].product).subscribe(data => {
          if (!this.loadedImages.includes(data)) {
            this.loadedImages?.push(data);
            }
        });
        this.productService.loadImageMetaByProductID(this.dataSource[i].id).pipe(take(1)).subscribe(data => {
          if (!this.productObject.includes(data[0])) {
            this.productObject?.push(data[0]);
          }
      })
    }
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addQuantity(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onPayment(): void{
    for(let i = 0; i < this.productObject.length; i++){
      this.productObject[i].quantity -= this.dataSource[i].quantity;
      if(this.productObject[i].quantity <= 10){
        this.productObject[i].marker = "sale"
      }
      this.productService.create(this.productObject[i]).then(_ => {
        console.log('Termék frissítés sikeres');
        this.cartService.clearCart();
        this.toastr.success('A vásárlás sikeres volt!', 'Kosár');
      }).catch(error => {
        console.error(error);
      });;
    }
  }

}
