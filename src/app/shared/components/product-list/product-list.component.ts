import { Component, HostListener, OnInit, OnDestroy, Input } from '@angular/core';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/Product';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {

  @Input() marker: string = '';

  markerFirstWord: string = "HAMAROSAN";
  markerSecondWord: string = "ÉRKEZIK";

  user?: User;

  currentStartIndex = 0;
  currentEndIndex = 4;

  productObject?: Array<Product>;

  loadedImages: Array<string> = [];

  productQuantity: { [productId: string]: number } = {};

  windowWidth: number = window.innerWidth;
  windowHeight: number = window.innerHeight;

  // Kizárólag arra szolgál, hogy ne fusson le minden egyes pixel változásnál egy for ciklus
  isWindowHelpers: Array<boolean> = [false, false, false, false];

  constructor(private productService: ProductService,
    private toastr: ToastrService,
    private userService: UserService,
    private cartService: CartService) {
    }


  
    @HostListener('window:resize', ['$event'])
    onWindowResize(event: Event) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      if (this.windowWidth > 1676 && this.isWindowHelpers[0] === false) {
          if((4 + this.currentStartIndex) < this.loadedImages?.length){
            this.currentEndIndex = 4 + this.currentStartIndex;
          } else {
            this.currentStartIndex--;
          }
          console.log(this.currentEndIndex);
        this.isWindowHelpers[0] = true;
        this.isWindowHelpers[1] = false;
      } else if (this.windowWidth < 1676 && this.windowWidth > 1282
        && this.isWindowHelpers[1] === false) {
          if((3 + this.currentStartIndex) < this.loadedImages?.length){
            this.currentEndIndex = 3 + this.currentStartIndex;
          } else {
            this.currentStartIndex--;
          }
          console.log(this.currentEndIndex);
        this.isWindowHelpers[0] = false;
        this.isWindowHelpers[1] = true;
        this.isWindowHelpers[2] = false;
      } else if (this.windowWidth < 1282 && this.windowWidth > 740
        && this.isWindowHelpers[2] === false) {
          if((2 + this.currentStartIndex) < this.loadedImages?.length){
            this.currentEndIndex = 2 + this.currentStartIndex;
          } else {
            this.currentStartIndex--;
          }
          console.log(this.currentEndIndex);
        this.isWindowHelpers[1] = false;
        this.isWindowHelpers[2] = true;
        this.isWindowHelpers[3] = false;
      } else if (this.windowWidth < 740 && this.isWindowHelpers[3] === false) {
          if((1 + this.currentStartIndex) < this.loadedImages?.length){
            this.currentEndIndex = 1 + this.currentStartIndex;
          } else {
            this.currentStartIndex--;
          }
          console.log(this.currentEndIndex);
        this.isWindowHelpers[2] = false;
        this.isWindowHelpers[3] = true;
      }
      // Képernyő méret változásának kezelése
      //console.log('Szélesség:' + this.windowWidth);
      //console.log('Magasság:' + this.windowHeight);
    }
  
  ngOnInit(): void {
    if(this.marker == 'soon'){
      this.markerFirstWord = "HAMAROSAN";
      this.markerSecondWord = "ÉRKEZIK";
    }else if(this.marker == 'new'){
      this.markerFirstWord = "ÚJ";
      this.markerSecondWord = "TERMÉK";
    }else if(this.marker == 'discount'){
      this.markerFirstWord = "-50%";
      this.markerSecondWord = "AKCIÓ";
    }else if(this.marker == 'sale'){
      this.markerFirstWord = "KIÁRUSÍTÁS";
      this.markerSecondWord = "";
    }
      
    if (this.windowWidth > 1676) {
      this.isWindowHelpers[0] = true;
        this.currentEndIndex = 4;
    } else if (this.windowWidth < 1676 && this.windowWidth > 1282) {
      this.isWindowHelpers[1] = true;
        this.currentEndIndex = 3;
    } else if (this.windowWidth < 1282 && this.windowWidth > 700) {
      this.isWindowHelpers[2] = true;
        this.currentEndIndex = 2;    
    } else if (this.windowWidth < 700) {
      this.isWindowHelpers[3] = true;
        this.currentEndIndex = 1;
    }
    

    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    if (user != null) {
      this.userService.getById(user.uid).subscribe(data => {
        this.user = data;
      }, error => {
        console.error(error);
      });
    }
    this.productService.loadImageMetaByMarker(this.marker).subscribe((data: Array<Product>) => {
      console.log(data);
      if (this.productObject !== data) {
        this.productObject = data;
      }
      if (this.productObject) {
        for (let i = 0; i < this.productObject.length; i++) {
          this.productService.loadImage(this.productObject[i].photo_url).subscribe(data => {
            if (!this.loadedImages.includes(data)) {
              this.loadedImages?.push(data);
            }
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.productObject = [];
    this.loadedImages = [];
  }

  navigateThisProduct() {
  }

  nextProduct() {
      if (this.currentEndIndex == this.productObject?.length) {
        this.toastr.info("Nincs már több termék!", "Termék");
        console.error("Nincs előrefele már több termék!");
      } else {
        this.currentStartIndex++;
        this.currentEndIndex++;
      }
  }

  previousProduct() {
      if (this.currentStartIndex == 0) {
        this.toastr.info("Nincs már több termék!", "Termék");
        console.error("Nincs visszafele több termék!")
      } else {
        this.currentStartIndex--;
        this.currentEndIndex--;
      }
  }

  increaseCount(productId: string, productStorageQuantity: number) {
    if (!this.productQuantity[productId]) {
      this.productQuantity[productId] = 1;
    }
    if(productStorageQuantity >= this.productQuantity[productId] + 1){
      this.productQuantity[productId]++;
    } else {
      this.toastr.error("Csak annyi terméket tudsz a kosaradban elhelyezni ameddig a készlet tart!", 'Kosár');
    }
  }

  decreaseCount(productId: string) {
    if (this.productQuantity[productId] > 1) {
      this.productQuantity[productId]--;
    }
  }


  onAddToCart(product: Product): void {
    const quantity = this.productQuantity[product.id] || 0;
    this.cartService.addToCart({
      product : product.photo_url,
      name: product.name,
      price: product.marker == "discount" ? Math.ceil(product.price * 0.5) : product.price,
      quantity: quantity === 0 ? quantity + 1 : quantity,
      id: product.id
    });
    if (!this.productQuantity[product.id]) {
      this.productQuantity[product.id] = 1;
    }
    this.toastr.success(this.productQuantity[product.id] + " db " + product.name + ' sikeresen a kosárba került!', 'Kosár');
    this.productQuantity[product.id] = 1;
  }

}
