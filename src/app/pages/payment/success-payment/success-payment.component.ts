import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Cart } from '../../../shared/models/Cart';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from 'src/app/shared/models/Product';

@Component({
  selector: 'app-success-payment',
  templateUrl: './success-payment.component.html',
  styleUrls: ['./success-payment.component.scss']
})
export class SuccessPaymentComponent implements OnInit {

  cart: Cart = {items: []};
  products: Array<Product> = [];

  constructor(private productService: ProductService, private cartService: CartService) { }

    ngOnInit() {
      if(localStorage.getItem('cart') !== null){
        this.cart.items = JSON.parse(localStorage.getItem("cart")!);
          for (let i = 0; i < this.cart.items.length; i++) {
              this.productService.loadImageMetaByProductID(this.cart.items[i].id).pipe(take(1)).subscribe(data => {
              if (!this.products.includes(data[0])) {
                this.products?.push(data[0]);
              }
              data[0].quantity -= this.cart.items[i].quantity;
              if(data[0].quantity <= 10){
                data[0].marker = "sale";
              }
              try {
                this.productService.create(data[0]);
                if(this.products.length === this.cart.items.length){
                  this.cartService.clearCart(true);
                }
              } catch (error) {
                console.error(error);
              }
          })
        }  
      }
    }
}
