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

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.actRoute.params.subscribe((param: any) => {
      this.category = param.category as string;
      console.log(this.category);
      if(this.category == 'All'){
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
      } else {
      this.productService.loadImageMetaByCategory(this.category).subscribe((data: Array<Product>) => {
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
  });
}

  navigateThisProduct() {
  }

  addToCart(product: Product) {
    this.toastr.success(product.name + ' sikeresen a kosárba került!', 'Kosár');
  }
}
