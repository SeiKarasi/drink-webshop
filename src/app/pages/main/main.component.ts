import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/Product';

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

  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.loadImageMeta('').subscribe((data: Array<Product>) => {
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
}
