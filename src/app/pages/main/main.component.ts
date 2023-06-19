import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/Product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  productObject?: Array<Product>;
  loadedImages: Array<string> = [];
  currentStartIndex = 0;
  currentEndIndex = 4;
  productCounts: { [productId: string]: number } = {};

  constructor(private router: Router, private productService: ProductService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.productService.loadImageMeta().subscribe((data: Array<Product>) => {
      console.log(data);
      this.productObject = data;
      if (this.productObject) {
        for (let i = 0; i < this.productObject.length; i++) {
          this.productService.loadImage(this.productObject[i].photo_url).subscribe(data => {
            this.loadedImages?.push(data);
          });
        }
      }
    });
  }

  navigateThisProduct() {
  }

  nextProduct(){
    if(this.currentEndIndex == this.productObject?.length){
      console.error("Nincs előrefele már több termék!");
    } else {
      this.currentStartIndex++;
      this.currentEndIndex++;
    } 
  }

  previousProduct(){
    if(this.currentStartIndex == 0){
      console.error("Nincs visszafele több termék!")
    } else {
      this.currentStartIndex--;
      this.currentEndIndex--;
    }
  }

  // product.id alapján megy ami egyedi
  increaseCount(productId: string) {
    if (!this.productCounts[productId]) {
      this.productCounts[productId] = 1;
    }
    this.productCounts[productId]++;
  }

  decreaseCount(productId: string) {
    if (this.productCounts[productId] > 1) {
      this.productCounts[productId]--;
    }
  }


  addToCart(product: Product, productId: string) {
    if (!this.productCounts[productId]) {
      this.productCounts[productId] = 1;
    }
    this.toastr.success(this.productCounts[productId] + " db " + product.name + ' sikeresen a kosárba került!', 'Kosár');
  }
}
