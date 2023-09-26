import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from '../../../shared/models/Comment';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/models/Product';
import { CommentService } from '../../../shared/services/comment.service';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/User';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  user?: User

  imageSource?: string;
  comments: Array<Comment> = [];
  actProduct?: Product;
  loadedImage?: string;

  similarProducts?: Array<Product>;
  similarLoadedImages?: Array<string> = [];

  commentsForm = this.createForm({
    id: '',
    username: '',
    comment: '',
    date: 0,
    productId: this.actProduct?.id
  });

  productCount: number = 1;

  constructor(
    private actRoute: ActivatedRoute,
    private fBuilder: UntypedFormBuilder,
    private productService: ProductService,
    private commentService: CommentService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService) { }

  // a params egy adatfolyam (Observable), ezért kell feliratkozni
  ngOnInit(): void {
    this.actRoute.params.subscribe((param: any) => {
      this.imageSource = param.imageSource as string;
      console.log(this.imageSource);
      this.productService.loadImageMetaByProductID(this.imageSource).subscribe((data: Array<Product>) => {
        console.log(data);
        if (this.imageSource === data[0]['id']) {
          this.actProduct = data[0];
          console.log(this.actProduct);
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
          this.productService.loadImage(this.actProduct.photo_url).subscribe(data => {
            this.loadedImage = data;
          });
          this.commentService.getCommentsByProductId(this.actProduct.id).subscribe(comments => {
            this.comments = comments;
          })
        }
      });
    });


    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    if (user != null) {
      this.userService.getById(user.uid).subscribe(data => {
        this.user = data;
        this.commentsForm.get('username')?.setValue(this.user?.username);
      }, error => {
        console.error(error);
      });
    }
  }

  navigateThisProduct() {

  }

  // Arra kell, hogy garantálni tudjuk a Comment típust
  // simán az fBuilder.grouppal ez nem tehető meg!
  createForm(model: Comment) {
    let formGroup = this.fBuilder.group(model);
    // Validátorokat rendelünk az egyes elemekhez!
    formGroup.get('username')?.addValidators([Validators.required]);
    formGroup.get('comment')?.addValidators([Validators.required, Validators.minLength(3)]);
    return formGroup;
  }

  addComment() {
    // Ha a validátorok mindegyik helyes csak akkor fut le!
    if (this.commentsForm.valid) {
      if (this.commentsForm.get('username') && this.commentsForm.get('comment')) {
        // A kérdőjel azt jelzi, ha undefined érték lenne
        // akkor megáll a futás, és nem dob hibát
        this.commentsForm.get('date')?.setValue(new Date().getTime());
        // Spread operátor: Teljes másolatot hoz létre
        // Ennek segítségével új objektumot hozunk létre mindig
        //this.comments.push({ ...this.commentsForm.value });


        this.commentService.create(this.commentsForm.value).then(_ => {
          console.log('Sikeres komment hozzáadás!');
          this.commentsForm.get('comment')?.reset();
        }).catch(error => {
          console.error(error);
        })
      }
    }
  }

  deleteComment(commentId: string, username: string) {
    if (this.user?.username === username) {
      this.commentService.delete(commentId);
    } else {
      console.log('Más hozzászólását nem törölheted!');
    }
  }

  increaseCount() {
    this.productCount++;
  }

  decreaseCount() {
    if (this.productCount > 1) {
      this.productCount--;
    }
  }

  addToCart() {
    this.toastr.success(this.productCount + " db " + this.actProduct?.name + ' sikeresen a kosárba került!', 'Kosár');
  }
}
