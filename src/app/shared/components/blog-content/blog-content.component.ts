import { Component, Input, OnInit } from '@angular/core';
import { Blog } from '../../models/Blog';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Rating } from '../../models/Rating';
import { RatingService } from '../../services/rating.service';
import { BlogService } from '../../services/blog.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';

const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;

@Component({
  selector: 'app-blog-content',
  templateUrl: './blog-content.component.html',
  styleUrls: ['./blog-content.component.scss']
})
export class BlogContentComponent implements OnInit {
  @Input() blog?: Blog;

  user?: User;

  ratingsForm = this.createRatingForm({
    id: '',
    username: '',
    rating: 0,
    productId: ''
  });

  ratingStars: number[] = [1, 2, 3, 4, 5];
  selectedStar: number = 0;
  
  shortText: string = '';
  isEditing: boolean = false;
  isWholeText: boolean = false;
  totalRatingValue: number = 0;

  constructor(
    private fBuilder: UntypedFormBuilder,
    private ratingService: RatingService,
    private userService: UserService,
    private blogService: BlogService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    if (user != null) {
      this.userService.getById(user.uid).subscribe(data => {
        this.user = data;
        if(this.blog){
          this.shortText = this.blog.text.substring(0, 200);
          if(this.user){
            this.ratingsForm.get('productId')?.setValue(this.blog?.id);
            this.ratingsForm.get('username')?.setValue(this.user?.username);
            this.ratingService.getRatingByProductIdAndUsername(this.blog.id, this.user.username).pipe(take(1)).subscribe((ratings) => {
              if(ratings.length !== 0){
                this.selectedStar = ratings[0].rating;
                this.ratingsForm.get('rating')?.setValue(ratings[0].rating);
              } else {
                this.selectedStar = 0;
                this.ratingsForm.get('rating')?.setValue(0);
              }
             });
          }
          this.ratingService.getRatingsByProductId(this.blog?.id).pipe(take(1)).subscribe(ratings => {
            if(ratings.length > 0){
              ratings.forEach(rat => {
                this.totalRatingValue += rat.rating;
              });
              this.totalRatingValue /= ratings.length;
            }
            
          });

        }
      }, error => {
        console.error(error);
      });
    }
  }

  createRatingForm(model: Rating) {
    let formGroup = this.fBuilder.group(model);
    // Validátorokat rendelünk az egyes elemekhez!
    formGroup.get('rating')?.addValidators([Validators.required, Validators.min(1), Validators.max(5)]);
    return formGroup;
  }


  onReadMoreOrLess(): void {
    this.isWholeText = !this.isWholeText;
  }
    

  onSubText(): string {
    return this.shortText;
  }

  onDeleteBlog(): void {
    if(this.blog && confirm("Biztosan törölni szeretnéd ezt a bejegyzést?")){
      this.ratingService.getRatingsByProductId(this.blog.id).subscribe(ratings => {
        ratings.forEach(rating => {
          this.ratingService.delete(rating.id).then(() => {
          }).catch(() => {
            this.toastr.error("Hiba adódott a bejegyzés értékeléseinek törlésekor!");
          });
        });
      });
      this.blogService.delete(this.blog.id).then(() => {
        this.toastr.success("A bejegyzés sikeresen törölve!", "Blog");
      }).catch(() => {
        this.toastr.error("A bejegyzés törlése sikertelen", "Blog");
      });
      
    } else {
      this.toastr.info("A bejegyzés nem lett törölve!", "Blog");
    }
  }

  onUpdateBlog(): void {
    if(!this.isEditing){
      this.isEditing = true;
    } else if(this.blog && confirm("Biztos, hogy módosítani szeretnéd ezt a bejegyzést?") && this.blog.text.length >= 200 && this.blog.title.length <= 100) {
      this.blogService.update(this.blog).then(() => {
        this.toastr.success("A bejegyzés sikeresen módosult!", "Blog");
        this.isEditing = false;
      }).catch(() => {
        this.toastr.error("A bejegyzés frissítése közben hibák léptek fel!", "Blog");
      });
    } else {
      this.toastr.error("Túl rövid blog bejegyzést írtál! A minimum elvárás legalább 200 karakter!", "Blog");
    }  
  }

  onUpdateBlogCancel(): void {
    this.isEditing = false;
  }

  onRatingBlog(star: number): void {
    this.ratingsForm.get('rating')?.setValue(star);
    this.selectedStar = star;
  }

  addOrUpdateRating() {
    if (this.ratingsForm.valid && this.blog && this.user && this.ratingsForm.get('rating')) {
      this.ratingService.getRatingByProductIdAndUsername(this.blog.id, this.user?.username).pipe(take(1)).subscribe((ratings) => {
        if(ratings.length === 0){
          this.ratingService.create(this.ratingsForm.value).then(_ => {
            this.toastr.success("Sikeresen értékelted a bejegyzést!", "Értékelés");
          }).catch(_ => {
            this.toastr.error("Sikertelen értékelés!", "Értékelés");
          })
        } else {
          const existingRating = ratings[0];
          existingRating.rating = this.ratingsForm.get('rating')?.value;
          this.ratingService.update(existingRating).then(_ => {
            this.toastr.success("Sikeresen frissítetted a bejegyzés értékelésedet!", "Értékelés");
          }).catch(_ => {
            this.toastr.error("Sikertelen értékelés frissítés!", "Értékelés");
          });
        }
      }); 
    }
  }
}
