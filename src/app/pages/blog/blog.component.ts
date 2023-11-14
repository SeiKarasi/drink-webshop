import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Blog } from '../../shared/models/Blog';
import { User } from '../../shared/models/User';
import { BlogService } from '../../shared/services/blog.service';
import { UserService } from '../../shared/services/user.service';

const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})

export class BlogComponent implements OnInit {

  user?: User;
  containerHeight?: string;

  blogsForm = this.createBlogForm({
    id: '',
    author: '',
    title: '',
    text: ''
  });

  blogs?: Array<Blog>;
  addBlog: boolean = false;

  constructor(
    private userService: UserService,
    private blogService: BlogService,
    private fBuilder: UntypedFormBuilder,
    private toastr: ToastrService) {
   }

  ngOnInit(): void {
    if (user != null) {
      this.userService.getById(user.uid).subscribe(data => {
        this.user = data;
        this.blogService.getAll().subscribe(blogs => {
          this.blogs = blogs;
          this.containerHeight = blogs.length < 2 ? '100vh' : '100%';

        });
      }, error => {
        console.error(error);
      });
    } 
  }

  createBlogForm(model: Blog) {
    let formGroup = this.fBuilder.group(model);
    // Validátorokat rendelünk az egyes elemekhez!
    formGroup.get('title')?.addValidators([Validators.required, Validators.maxLength(100)]);
    formGroup.get('text')?.addValidators([Validators.required, Validators.minLength(200)]);
    return formGroup;
  }



  onAddBlog(): void {
    if(!this.addBlog){
      this.addBlog = true;
    } else {
      if(this.blogsForm.valid){
        this.blogsForm.get('author')?.setValue(this.user?.username);
        this.blogService.create(this.blogsForm.value).then(_ => {
          this.toastr.success("Sikeresen rögzítetted a blog bejegyzésedet!", "Blog");
          this.blogsForm.get('title')?.reset();
          this.blogsForm.get('text')?.reset();
          this.addBlog = false;
        }).catch(error => {
          this.toastr.error("Sikertelen a blog bejegyzés hozzáadása!", "Blog");
          console.error(error);
        })
      } else {
        this.toastr.error("Túl rövid blog bejegyzést írtál! A minimum elvárás legalább 200 karakter!", "Blog")
      }
    }
  }

  onAddBlogCancel(): void {
    this.blogsForm.get('title')?.reset();
    this.blogsForm.get('text')?.reset();
    this.addBlog = false;
  }

}
