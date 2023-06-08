import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comment } from '../../../shared/models/Comment';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  imageSource: string = '';
  // commentObject: any = {};
  comments: Array<Comment> = [];

  commentsForm = this.createForm({
    username: '',
    comment: '',
    date: new Date()
  });

  constructor(private actRoute: ActivatedRoute,
    private fBuilder: FormBuilder) { }

  // a params egy adatfolyam (Observable), ezért kell feliratkozni
  ngOnInit(): void {
    this.actRoute.params.subscribe((param: any) => {
      this.imageSource = param.imageSource as string;
    })
  }

  // Arra kell, hogy garantálni tudjuk a Comment típust
  // simán az fBuilder.grouppal ez nem tehető meg!
  createForm(model: Comment) {
    let formGroup = this.fBuilder.group(model);
    // Validátorokat rendelünk az egyes elemekhez!
    formGroup.get('username')?.addValidators([Validators.required]);
    formGroup.get('comment')?.addValidators([Validators.required, Validators.minLength(10)]);
    return formGroup;
  }

  addComment() {
    // Ha a validátorok mindegyik helyes csak akkor fut le!
    if (this.commentsForm.valid) {
      if (this.commentsForm.get('username') && this.commentsForm.get('comment')) {
        // A kérdőjel azt jelzi, ha undefined érték lenne
        // akkor megáll a futás, és nem dob hibát
        this.commentsForm.get('date')?.setValue(new Date());
        // Spread operátor: Teljes másolatot hoz létre
        // Ennek segítségével új objektumot hozunk létre mindig
        this.comments.push({ ...this.commentsForm.value });
      }
    }
  }
}
