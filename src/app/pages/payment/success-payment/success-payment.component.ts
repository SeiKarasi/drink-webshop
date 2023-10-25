import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { Cart, CartItem } from '../../../shared/models/Cart';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from 'src/app/shared/models/Product';

@Component({
  selector: 'app-success-payment',
  templateUrl: './success-payment.component.html',
  styleUrls: ['./success-payment.component.scss']
})
export class SuccessPaymentComponent implements OnInit {

  cart = new BehaviorSubject<Cart>({items: []});
  productObject: Array<Product> = [];

  constructor(private productService: ProductService, private cartService: CartService, private toastr: ToastrService) { }

  ngOnInit(): void {
    //TODO This function is not work
    if(localStorage.getItem('cart') !== null){
      this.cart.value.items = JSON.parse(localStorage.getItem("cart")!);
      const items = [...this.cart.value.items];
      for (let i = 0; i < items.length; i++) {
          this.productService.loadImageMetaByProductID(items[i].id).pipe(take(1)).subscribe(data => {
            if (!this.productObject.includes(data[0])) {
              this.productObject?.push(data[0]);
            }
        })
      }
      for(let i = 0; i < this.productObject.length; i++){
        this.productObject[i].quantity -= items.find(item => item.id === this.productObject[i].id)!.quantity;
        if(this.productObject[i].quantity <= 10){
          this.productObject[i].marker = "sale"
        }
        this.productService.create(this.productObject[i]).then(_ => {
          console.log("asd");
          this.toastr.success('A vásárlás sikeres volt!', 'Kosár');
        }).catch(error => {
          console.error(error);
        });;
      }
      this.cartService.clearCart();
    }
      
  }
}
