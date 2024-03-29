import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from '../../shared/models/Comment';
import { Rating } from '../../shared/models/Rating';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/Product';
import { CommentService } from '../../shared/services/comment.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/User';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/shared/services/cart.service';
import { RatingService } from 'src/app/shared/services/rating.service';

import { take } from 'rxjs/operators';

const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  user?: User;

  imageSource?: string;
  comments: Array<Comment> = [];
  actProduct?: Product;
  loadedImage?: string;

  similarProducts?: Array<Product>;
  similarLoadedImages?: Array<string> = [];

  commentsForm = this.createCommentForm({
    id: '',
    username: '',
    comment: '',
    date: 0,
    productId: this.actProduct?.id
  });

  ratingsForm = this.createRatingForm({
    id: '',
    username: '',
    rating: 0,
    productId: this.actProduct?.id
  });

  ratingStars: number[] = [1, 2, 3, 4, 5];
  selectedStar: number = 0;
  totalRatingValue: number = 0;

  productQuantity: number = 1;

  quantityInput: boolean = false;
  descriptionInput: boolean = false;

  addComment: boolean = false;

  constructor(
    private actRoute: ActivatedRoute,
    private fBuilder: UntypedFormBuilder,
    private productService: ProductService,
    private commentService: CommentService,
    private ratingService: RatingService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.actRoute.params.subscribe((param: any) => {
      this.imageSource = param.imageSource as string;
      this.productService.loadImageMetaByProductID(this.imageSource).pipe(take(1)).subscribe((data: Array<Product>) => {
        if (this.imageSource === data[0]['id']) {
          this.actProduct = data[0];
          this.productService.loadImageMetaByCategory(this.actProduct?.category).subscribe((data: Array<Product>) => {
            const index = data.findIndex(product => product.id === this.actProduct?.id);
            if (index !== -1) {
              data.splice(index, 1);
            }
            if(data.length > 8 ){
              this.similarProducts = data.slice(0, 8);
            } else {
              this.similarProducts = data;
            } 
            if (this.similarProducts) {
              for (let i = 0; i < this.similarProducts.length; i++) {
                this.productService.loadImage(this.similarProducts[i].photo_url).subscribe(data => {
                  if(!this.similarLoadedImages?.includes(data)){
                    this.similarLoadedImages?.push(data);
                  }
                });
              }
            }
          });
        }
        
        if (this.actProduct?.id) {
          this.commentsForm.get('productId')?.setValue(this.actProduct.id);
          this.ratingsForm.get('productId')?.setValue(this.actProduct.id);
          this.productService.loadImage(this.actProduct.photo_url).subscribe(data => {
            this.loadedImage = data;
          });
          this.commentService.getCommentsByProductId(this.actProduct.id).subscribe(comments => {
            this.comments = comments;
          });
          this.totalRatingValue = 0;
          this.ratingService.getRatingsByProductId(this.actProduct.id).pipe(take(1)).subscribe(ratings => {
            if(ratings.length > 0){
              ratings.forEach(rat => {
                this.totalRatingValue += rat.rating;
              });
              this.totalRatingValue /= ratings.length;
            }   
          });
        }
    
        if (user != null) {
          this.userService.getById(user.uid).subscribe(data => {
            this.user = data;
            this.commentsForm.get('username')?.setValue(this.user?.username);
            this.ratingsForm.get('username')?.setValue(this.user?.username);
            if(this.actProduct?.id && this.user?.username){
              this.ratingService.getRatingByProductIdAndUsername(this.actProduct.id, this.user.username).pipe(take(1)).subscribe((ratings) => {
                if(ratings.length !== 0){
                  this.selectedStar = ratings[0].rating;
                  this.ratingsForm.get('rating')?.setValue(ratings[0].rating);
                } else {
                  this.selectedStar = 0;
                  this.ratingsForm.get('rating')?.setValue(0);
                }
               });
            }
          }, error => {
            console.error(error);
          });
        }
      }); 
    });
  }

  navigateThisProduct(): void {}

  // Arra kell, hogy garantálni tudjuk a Comment típust
  // simán az fBuilder.grouppal ez nem tehető meg!
  createCommentForm(model: Comment) {
    let formGroup = this.fBuilder.group(model);
    // Validátorokat rendelünk az egyes elemekhez!
    formGroup.get('username')?.addValidators([Validators.required]);
    formGroup.get('comment')?.addValidators([Validators.required, Validators.minLength(3)]);
    return formGroup;
  }

  onDeleteProduct(): void {
    if(confirm("Biztos törölni szeretnéd ezt a terméket?") && this.actProduct && this.user?.admin){
      this.productService.delete(this.actProduct?.id);
      this.commentService.getCommentsByProductId(this.actProduct?.id).subscribe(comments => {
        comments.forEach(comment => {
          this.commentService.delete(comment.id);
        });
      });
      this.ratingService.getRatingsByProductId(this.actProduct?.id).subscribe(ratings => {
        ratings.forEach(rating => {
          this.ratingService.delete(rating.id);
        })
      });
      this.productService.deleteImage(this.actProduct.photo_url);
      this.router.navigateByUrl("/main");
    }
  }

  onAddComment(): void {
    if(this.addComment){
      if (this.commentsForm.valid) {
        this.commentsForm.get('date')?.setValue(new Date().getTime());
        this.commentService.create(this.commentsForm.value).then(_ => {
          this.addComment = false;
          this.toastr.success("Sikeresen hozzászóltál a termékhez!", 'Hozzászólás');
          this.commentsForm.get('comment')?.reset();
        }).catch(error => {
          this.toastr.error("Sikertelen hozzászólás!", 'Hozzászólás');
          console.error(error);
        })
      } else {
        this.toastr.error("A hozzászólás túl rövid!", 'Hozzászólás');
      }
    } else {
      this.addComment = true;
    }
  }

  onAddCommentCancel(): void {
    this.commentsForm.get('comment')?.reset();
    this.addComment = false;
  }

  updateQuantity(): void {
    if(!this.quantityInput){
      this.quantityInput = true;
    } else {
      if(confirm("Biztos módosítani szeretnéd ennek a terméknek a darabszámát?") && this.actProduct){
        if(this.actProduct.quantity < 0){
          this.actProduct.quantity = 0;
        }
        this.quantityInput = false;
        if(this.actProduct.quantity <= 10){
          this.actProduct.marker = 'sale';
        }
        if(this.actProduct.quantity > 10 && this.actProduct.marker === 'sale'){
          this.actProduct.marker = '';
        }
        this.productService.create(this.actProduct);
      }
    }
  }

  updateDescription(): void {
    if(!this.descriptionInput){
      this.descriptionInput = true;
    } else {
      if(confirm("Biztos módosítani szeretnéd ennek a terméknek a leírását?") && this.actProduct){
        this.descriptionInput = false;
        this.productService.create(this.actProduct);
      }
    }
  }

  cancelUpdate(): void {
    this.descriptionInput = false;
    this.quantityInput = false;
  }

  createRatingForm(model: Rating) {
    let formGroup = this.fBuilder.group(model);
    formGroup.get('rating')?.addValidators([Validators.required, Validators.min(1), Validators.max(5)]);
    return formGroup;
  }

  addOrUpdateRating(): void {
    if (this.ratingsForm.valid) {
      if (this.user?.username && this.ratingsForm.get('rating') && this.actProduct?.id) {       
        this.ratingService.getRatingByProductIdAndUsername(this.actProduct.id, this.user.username).pipe(take(1)).subscribe((ratings) => {
          if(ratings.length === 0){
            this.ratingService.create(this.ratingsForm.value).then(() => {
              this.toastr.success("Sikeresen értékelted a terméket! Köszönjük!", "Értékelés");
            }).catch(() => {
              this.toastr.error("A termék értékelése sikertelen!", "Értékelés");
            })
          } else {
            const existingRating = ratings[0];
            existingRating.rating = this.ratingsForm.get('rating')?.value;
            this.ratingService.update(existingRating).then(() => {
              this.toastr.success("Sikeresen frissítetted az értékelésedet ehhez a termékhez! Köszönjük!", "Értékelés");
            }).catch(() => {
              this.toastr.error("A termék értékelésének frissítése sikertelen!", "Értékelés");
            });
          }
        }); 
      } else {
        this.toastr.info("Jelentkezz be, hogy értékelni tudd a termékeket!", "Értékelés");
      }
    }
  }

  onRatingProduct(star: number): void {
    this.ratingsForm.get('rating')?.setValue(star);
    this.selectedStar = star;
  }

  increaseCount(productStorageQuantity: number | undefined): void {
    if (!this.productQuantity) {
      this.productQuantity = 1;
    }
    if(productStorageQuantity !== undefined && productStorageQuantity >= this.productQuantity + 1){
      this.productQuantity++;
    } else {
      this.toastr.error("Csak annyi terméket tudsz a kosaradban elhelyezni ameddig a készlet tart!", 'Kosár');
    }
  }

  decreaseCount(): void {
    if (this.productQuantity > 1) {
      this.productQuantity--;
    }
  }

  onAddToCart(product: Product | undefined): void {
    const quantity = this.productQuantity || 0;
    if(product !== undefined) {
      if(product.quantity !== 0){
        this.cartService.addToCart({
          product : product.photo_url,
          name: product.name,
          price: product.marker === "discount" ? 
          (!this.user?.discount ? Math.round(product.price * 0.5) : Math.round(product.price * (0.5-(this.user.discount/100)))):
          (this.user?.discount ? Math.round(product.price * (1-(this.user.discount/100))) : product.price),
          quantity: quantity === 0 ? quantity + 1 : quantity,
          storageQuantity: product.quantity,
          id: product.id
        });
        if (!this.productQuantity) {
          this.productQuantity = 1;
        }
        this.toastr.success(this.productQuantity + " db " + product.name + ' sikeresen a kosárba került!', 'Kosár');
        this.productQuantity = 1;
      } else {
        this.toastr.error("Sajnáljuk, de a(z) " + product.name + ' nevezetű termék jelenleg nem elérhető!', 'Kosár');
      }
    }
  }

  isCorrectProduct(): boolean {
    if(this.actProduct){
      return true;
    } else {
      return false;
    }
  }
}
