import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Cart } from '../../../shared/models/Cart';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-success-payment',
  templateUrl: './success-payment.component.html',
  styleUrls: ['./success-payment.component.scss']
})
export class SuccessPaymentComponent implements OnInit {

  cart: Cart = {items: []};

  constructor(private productService: ProductService, private cartService: CartService) { }

    ngOnInit() {
      if(localStorage.getItem('cart') !== null){
        this.cart.items = JSON.parse(localStorage.getItem("cart")!);
          for (let i = 0; i < this.cart.items.length; i++) {
              this.productService.loadImageMetaByProductID(this.cart.items[i].id).pipe(take(1)).subscribe(data => {
              data[0].quantity -= this.cart.items[i].quantity;
              if(data[0].quantity <= 10){
                data[0].marker = "sale";
              }
              this.productService.update(data[0]).catch(error => {
                console.error(error);
              });
          })
        }
        this.cartService.clearCart(true);  
      }
    }
}
