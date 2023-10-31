import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../shared/models/Product';
import { ProductService } from '../../shared/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../shared/services/cart.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  user?: User;

  productObject?: Array<Product>;
  loadedImages: Array<string> = [];
  category?: string;
  productQuantity: { [productId: string]: number } = {};

  ascSortAccordingToABC: boolean | undefined;
  ascSortAccordingToPrice: boolean | undefined;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private toastr: ToastrService,
    private cartService: CartService,
    private userService: UserService) {}

  ngOnInit(): void {
      this.actRoute.params.subscribe((param: any) => {
        this.category = param.category as string;
        console.log(this.category);
        this.productObject = [];
        this.loadedImages = [];
        if(this.category === 'All'){
          this.productService.loadImageMeta().subscribe((data: Array<Product>) => {
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
      const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
      if (user != null) {
        this.userService.getById(user.uid).subscribe(data => {
          this.user = data;
        }, error => {
          console.error(error);
        });
      }
    });
  }

  isCorrectCategory(){
    if(this.category === 'All' || this.category === 'Beer' || this.category === 'Wine' || this.category === 'Champagne' ||
    this.category === 'Whisky' || this.category === 'Vodka' || this.category === 'Gin' || this.category === 'Firewater' ||
    this.category === 'Bitter'|| this.category === 'Drink')
    {
      return true;
    } else {
      return false;
    }
  }

  onSortAccordingToABC(){
    this.ascSortAccordingToPrice = undefined;
    if(this.ascSortAccordingToABC){
      if(this.category === 'All'){
        this.productService.loadImageMeta('asc').subscribe((data: Array<Product>) => {
          if(this.productObject !== data){
            this.productObject = data;
          }});
      } else {
        this.productService.loadImageMetaByCategory(this.category!, 'asc').subscribe((data: Array<Product>) => {
          if(this.productObject !== data){
            this.productObject = data;
          }});
      }
    } else {
      if(this.category === 'All'){
        this.productService.loadImageMeta('desc').subscribe((data: Array<Product>) => {
          if(this.productObject !== data){
            this.productObject = data;
          }});
      } else {
        this.productService.loadImageMetaByCategory(this.category!, 'desc').subscribe((data: Array<Product>) => {
          if(this.productObject !== data){
            this.productObject = data;
          }});
      }
    }
    this.ascSortAccordingToABC = !this.ascSortAccordingToABC;
  }

  onSortAccordingToPrice(){
    this.ascSortAccordingToABC = undefined;
    if(this.ascSortAccordingToPrice){
      if(this.category === 'All'){
        this.productService.loadImageMeta('', 'asc').subscribe((data: Array<Product>) => {
          if(this.productObject !== data){
            this.productObject = data;
          }});
      } else {
        this.productService.loadImageMetaByCategory(this.category!, '', 'asc').subscribe((data: Array<Product>) => {
          if(this.productObject !== data){
            this.productObject = data;
          }});
      }
    } else {
      if(this.category === 'All'){
        this.productService.loadImageMeta('', 'desc').subscribe((data: Array<Product>) => {
          if(this.productObject !== data){
            this.productObject = data;
          }});
      } else {
        this.productService.loadImageMetaByCategory(this.category!, '', 'desc').subscribe((data: Array<Product>) => {
          if(this.productObject !== data){
            this.productObject = data;
          }});
      }
    }
    this.ascSortAccordingToPrice = !this.ascSortAccordingToPrice;
  }

  onCancelSort(){
    this.ascSortAccordingToABC = undefined;
    this.ascSortAccordingToPrice = undefined;
    if(this.category === 'All'){
      this.productService.loadImageMeta().subscribe((data: Array<Product>) => {
        if(this.productObject !== data){
          this.productObject = data;
        }
      });
    } else {
      this.productService.loadImageMetaByCategory(this.category!).subscribe((data: Array<Product>) => {
        if(this.productObject !== data){
          this.productObject = data;
        }  
      });
    }
  }

  navigateThisProduct() {
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
        price: product.marker === "discount" ? 
        (!this.user?.discount ? Math.ceil(product.price * 0.5) : Math.ceil(product.price * (0.5-(this.user.discount/100)))):
        (this.user?.discount ? Math.ceil(product.price * (1-(this.user.discount/100))) : product.price),
        quantity: quantity === 0 ? quantity + 1 : quantity,
        storageQuantity: product.quantity,
        id: product.id
      });
      if (!this.productQuantity[product.id]) {
        this.productQuantity[product.id] = 1;
      }
      this.toastr.success(this.productQuantity[product.id] + " db " + product.name + ' sikeresen a kosárba került!', 'Kosár');
      this.productQuantity[product.id] = 1;
    }

    getImageUrl(product: Product): string | undefined{
      let loadedImage = this.loadedImages.find(imageUrl => imageUrl.includes(product.id));
      return loadedImage;
    } 
}
