import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/Product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  productSoonObject?: Array<Product>;
  productNewObject?: Array<Product>;
  productDiscountObject?: Array<Product>;
  productSaleObject?: Array<Product>;

  loadedSoonImages: Array<string> = [];
  loadedNewImages: Array<string> = [];
  loadedDiscountImages: Array<string> = [];
  loadedSaleImages: Array<string> = [];

  currentStartIndex = [0, 0, 0, 0];
  currentEndIndex = [4, 4, 4, 4];

  productCounts: { [productId: string]: number } = {};

  windowWidth: number = window.innerWidth;
  windowHeight: number = window.innerHeight;

  // Kizárólag arra szolgál, hogy ne fusson le minden egyes pixel változásnál egy for ciklus
  isWindowHelpers: Array<boolean> = [false, false, false, false];

  constructor(private router: Router, private productService: ProductService, private toastr: ToastrService) { }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    if (this.windowWidth > 1676 && this.isWindowHelpers[0] === false) {
      for (let i = 0; i < this.currentEndIndex.length; i++) {
        if((4 + this.currentStartIndex[i]) < this.loadedSoonImages?.length){
          this.currentEndIndex[i] = 4 + this.currentStartIndex[i];
        } else {
          this.currentStartIndex[i]--;
        }
        
        console.log(this.currentEndIndex[i]);
      }
      this.isWindowHelpers[0] = true;
      this.isWindowHelpers[1] = false;
    } else if (this.windowWidth < 1676 && this.windowWidth > 1282
      && this.isWindowHelpers[1] === false) {
      for (let i = 0; i < this.currentEndIndex.length; i++) {
        if((3 + this.currentStartIndex[i]) < this.loadedNewImages?.length){
          this.currentEndIndex[i] = 3 + this.currentStartIndex[i];
        } else {
          this.currentStartIndex[i]--;
        }
        console.log(this.currentEndIndex[i]);
      }
      this.isWindowHelpers[0] = false;
      this.isWindowHelpers[1] = true;
      this.isWindowHelpers[2] = false;
    } else if (this.windowWidth < 1282 && this.windowWidth > 740
      && this.isWindowHelpers[2] === false) {
      for (let i = 0; i < this.currentEndIndex.length; i++) {
        if((2 + this.currentStartIndex[i]) < this.loadedDiscountImages?.length){
          this.currentEndIndex[i] = 2 + this.currentStartIndex[i];
        } else {
          this.currentStartIndex[i]--;
        }
        console.log(this.currentEndIndex[i]);
      }
      this.isWindowHelpers[1] = false;
      this.isWindowHelpers[2] = true;
      this.isWindowHelpers[3] = false;
    } else if (this.windowWidth < 740 && this.isWindowHelpers[3] === false) {
      for (let i = 0; i < this.currentEndIndex.length; i++) {
        if((1 + this.currentStartIndex[i]) < this.loadedSoonImages?.length){
          this.currentEndIndex[i] = 1 + this.currentStartIndex[i];
        } else {
          this.currentStartIndex[i]--;
        }
        console.log(this.currentEndIndex[i]);
      }
      this.isWindowHelpers[2] = false;
      this.isWindowHelpers[3] = true;
    }
    // Képernyő méret változásának kezelése
    //console.log('Szélesség:' + this.windowWidth);
    //console.log('Magasság:' + this.windowHeight);
  }

  ngOnDestroy(): void {
    this.productSoonObject = [];
    this.productNewObject = [];
    this.productDiscountObject = [];
    this.productSaleObject = [];

    this.loadedSoonImages = [];
    this.loadedNewImages = [];
    this.loadedDiscountImages = [];
    this.loadedSaleImages = [];
  }

  ngOnInit(): void {
    if (this.windowWidth > 1676) {
      this.isWindowHelpers[0] = true;
      for (let i = 0; i < this.currentEndIndex.length; i++) {
        this.currentEndIndex[i] = 4;
      }
    } else if (this.windowWidth < 1676 && this.windowWidth > 1282) {
      this.isWindowHelpers[1] = true;
      for (let i = 0; i < this.currentEndIndex.length; i++) {
        this.currentEndIndex[i] = 3;
      }
    } else if (this.windowWidth < 1282 && this.windowWidth > 700) {
      this.isWindowHelpers[2] = true;
      for (let i = 0; i < this.currentEndIndex.length; i++) {
        this.currentEndIndex[i] = 2;
      }
    } else if (this.windowWidth < 700) {
      this.isWindowHelpers[3] = true;
      for (let i = 0; i < this.currentEndIndex.length; i++) {
        this.currentEndIndex[i] = 1;
      }
    }

    this.productService.loadImageMetaByMarker("soon").subscribe((data: Array<Product>) => {
      console.log(data);
      if (this.productSoonObject !== data) {
        this.productSoonObject = data;
      }
      if (this.productSoonObject) {
        for (let i = 0; i < this.productSoonObject.length; i++) {
          this.productService.loadImage(this.productSoonObject[i].photo_url).subscribe(data => {
            if (!this.loadedSoonImages.includes(data)) {
              this.loadedSoonImages?.push(data);
            }
          });
        }
      }
    });
    this.productService.loadImageMetaByMarker("new").subscribe((data: Array<Product>) => {
      console.log(data);
      if (this.productNewObject !== data) {
        this.productNewObject = data;
      }
      if (this.productNewObject) {
        for (let i = 0; i < this.productNewObject.length; i++) {
          this.productService.loadImage(this.productNewObject[i].photo_url).subscribe(data => {
            if (!this.loadedNewImages.includes(data)) {
              this.loadedNewImages?.push(data);
            }
          });
        }
      }
    });
    this.productService.loadImageMetaByMarker("discount").subscribe((data: Array<Product>) => {
      console.log(data);
      if (this.productDiscountObject !== data) {
        this.productDiscountObject = data;
      }
      if (this.productDiscountObject) {
        for (let i = 0; i < this.productDiscountObject.length; i++) {
          this.productService.loadImage(this.productDiscountObject[i].photo_url).subscribe(data => {
            if (!this.loadedDiscountImages.includes(data)) {
              this.loadedDiscountImages?.push(data);
            }
          });
        }
      }
    });
    this.productService.loadImageMetaByMarker("sale").subscribe((data: Array<Product>) => {
      console.log(data);
      if (this.productSaleObject !== data) {
        this.productSaleObject = data;
      }
      if (this.productSaleObject) {
        for (let i = 0; i < this.productSaleObject.length; i++) {
          this.productService.loadImage(this.productSaleObject[i].photo_url).subscribe(data => {
            if (!this.loadedSaleImages.includes(data)) {
              this.loadedSaleImages?.push(data);
            }
          });
        }
      }
    });
  }



  navigateThisProduct() {
  }

  nextProduct(marker: string) {
    if (marker === "soon") {
      if (this.currentEndIndex[0] == this.productSoonObject?.length) {
        this.toastr.info("Nincs már több termék!", "Termék");
        console.error("Nincs előrefele már több termék!");
      } else {
        this.currentStartIndex[0]++;
        this.currentEndIndex[0]++;
      }
    } else if (marker === "new") {
      if (this.currentEndIndex[1] == this.productNewObject?.length) {
        this.toastr.info("Nincs már több termék!", "Termék");
        console.error("Nincs előrefele már több termék!");
      } else {
        this.currentStartIndex[1]++;
        this.currentEndIndex[1]++;
      }
    } else if (marker === "discount") {
      if (this.currentEndIndex[2] == this.productDiscountObject?.length) {
        this.toastr.info("Nincs már több termék!", "Termék");
        console.error("Nincs előrefele már több termék!");
      } else {
        this.currentStartIndex[2]++;
        this.currentEndIndex[2]++;
      }
    } else if (marker === "sale") {
      if (this.currentEndIndex[3] == this.productSaleObject?.length) {
        this.toastr.info("Nincs már több termék!", "Termék");
        console.error("Nincs előrefele már több termék!");
      } else {
        this.currentStartIndex[3]++;
        this.currentEndIndex[3]++;
      }
    }
  }


  previousProduct(marker: string) {
    if (marker === "soon") {
      if (this.currentStartIndex[0] == 0) {
        this.toastr.info("Nincs már több termék!", "Termék");
        console.error("Nincs visszafele több termék!")
      } else {
        this.currentStartIndex[0]--;
        this.currentEndIndex[0]--;
      }
    } else if (marker === "new") {
      if (this.currentStartIndex[1] == 0) {
        this.toastr.info("Nincs már több termék!", "Termék");
        console.error("Nincs visszafele több termék!")
      } else {
        this.currentStartIndex[1]--;
        this.currentEndIndex[1]--;
      }
    } else if (marker === "discount") {
      if (this.currentStartIndex[2] == 0) {
        this.toastr.info("Nincs már több termék!", "Termék");
        console.error("Nincs visszafele több termék!")
      } else {
        this.currentStartIndex[2]--;
        this.currentEndIndex[2]--;
      }
    } else if (marker === "sale") {
      if (this.currentStartIndex[3] == 0) {
        this.toastr.info("Nincs már több termék!", "Termék");
        console.error("Nincs visszafele több termék!")
      } else {
        this.currentStartIndex[3]--;
        this.currentEndIndex[3]--;
      }
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
