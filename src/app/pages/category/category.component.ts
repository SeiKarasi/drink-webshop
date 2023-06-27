import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../shared/models/Product';
import { ProductService } from '../../shared/services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  productObject?: Array<Product>;
  loadedImages: Array<string> = [];
  category?: string;
  productCounts: { [productId: string]: number } = {};

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
      this.actRoute.params.subscribe((param: any) => {
        this.category = param.category as string;
        console.log(this.category);
        this.productObject = [];
        this.loadedImages = [];
        if(this.category === 'All'){
          this.productService.loadImageMeta().subscribe((data: Array<Product>) => {
            console.log(data);
            if(this.productObject !== data){
              this.productObject = data;
            }
            if (this.productObject) {
              for (let i = 0; i < this.productObject.length; i++) {
                this.productService.loadImage(this.productObject[i].photo_url).subscribe(data => {
                  if(!this.loadedImages.includes(data)){
                    this.loadedImages?.push(data);
                  }     
                });
              }
            }
          });
        } else {
        this.productService.loadImageMetaByCategory(this.category).subscribe((data: Array<Product>) => {
          console.log(data);
          if(this.productObject !== data){
            this.productObject = data;
          }   
          if (this.productObject) {
            for (let i = 0; i < this.productObject.length; i++) {
              this.productService.loadImage(this.productObject[i].photo_url).subscribe(data => {
                if(!this.loadedImages.includes(data)){
                  this.loadedImages?.push(data);
                } 
              });
            }
          }
        });
      }
    });
}

  navigateThisProduct() {
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
