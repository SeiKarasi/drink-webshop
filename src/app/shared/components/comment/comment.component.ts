import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../models/Comment';
import { User } from '../../models/User';
import { CommentService } from '../../services/comment.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { RatingService } from '../../services/rating.service';
import { take } from 'rxjs';

const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment?: Comment;
  @Input() productId?: string;

  user?: User;
  users?: Array<User>;
  profilePictureLoadedImages?: Array<string> = [];

  ratingStars: number[] = [1, 2, 3, 4, 5];
  ratingValue: number = 0;
  isEditing: boolean = false;

  constructor(
    private commentService: CommentService,
    private ratingService: RatingService,
    private userService: UserService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    if (user != null) {
      this.userService.getById(user.uid).subscribe(data => {
        this.user = data;
      }, error => {
        console.error(error);
      });
    }
    if(this.productId && this.comment){
      this.ratingService.getRatingByProductIdAndUsername(this.productId, this.comment.username).pipe(take(1)).subscribe((rating) => {
        if(rating.length !== 0){
          this.ratingValue = rating[0].rating;
        }       
      });
    }
    
    this.userService.getAll().subscribe(users => {
      this.users = users;
      for(let i = 0; i < users.length; i++){
        if(this.users[i].photo_url !== undefined && this.users[i].photo_url !== ""){
          this.userService.loadImage(this.users[i].photo_url).pipe(take(1)).subscribe((imageUrl: string) => {
            this.profilePictureLoadedImages?.push(imageUrl);
          });
        }
      }
    });
  }

  onDeleteComment(): void {
    if(this.comment &&
       (this.user?.username === this.comment.username || this.user?.admin) &&
        confirm("Biztos akarod törölni ezt a kommentet?")){
      this.commentService.delete(this.comment.id).then(() => {
          this.toastr.success("A komment sikeresen törölve!", "Komment");
      }).catch(() => {
          this.toastr.error("A komment törlése sikertelen!", "Komment");
      });
    } else {
      this.toastr.info("A komment nem lett törölve!", "Komment");
    }
  }

  onUpdateComment(): void {
    if(!this.isEditing){
      this.isEditing = true;
    } else if(this.comment && confirm("Biztos frissíteni szeretnéd ezt a kommentet?") && this.comment.comment.length >= 3) {  
      this.comment.date = new Date().getTime();
      this.commentService.update(this.comment).then(() => {
        this.toastr.success("A komment sikeresen módosult!", "Komment");
        this.isEditing = false;
      }).catch(() => {
        this.toastr.error("A komment frissítése közben hibák léptek fel!", "Komment");
      });
    } else {
      this.toastr.error("Túl rövid kommentet írtál! A minimum elvárás legalább 3 karakter!", "Komment");
    }
  }

  onUpdateCommentCancel(): void {
    this.isEditing = false;
  }

  getImageUrl(commentUsername: string): string | undefined{
    let actUser = this.users?.find(user => user.username === commentUsername);
    if(actUser){
      let email = actUser.email.replace('@', '%40');
      let loadedImage = this.profilePictureLoadedImages?.find(imageUrl => imageUrl.includes(email));
      return loadedImage;
    }
    return '';
  } 

}
