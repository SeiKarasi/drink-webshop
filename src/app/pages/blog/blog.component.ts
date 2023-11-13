import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Blog } from '../../shared/models/Blog';
import { User } from '../../shared/models/User';
import { BlogService } from '../../shared/services/blog.service';
import { UserService } from '../../shared/services/user.service';

interface subText {
  id: string;
  text: string;
}

const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})

export class BlogComponent implements OnInit, OnDestroy {

  user?: User;
  containerHeight?: string;

  blogsForm = this.createForm({
    id: '',
    author: '',
    title: '',
    text: '',
    isWholeText: false,
  });

  blogs?: Array<Blog>;
  shortTexts?: subText[] = [];
  addBlog: boolean = false;


  constructor(private userService: UserService, private blogService: BlogService, private fBuilder: UntypedFormBuilder, private toastr: ToastrService) {
   }

  ngOnInit(): void {
    this.blogService.getAll().subscribe(blogs => {
      this.blogs = blogs;
      this.containerHeight = this.blogs!.length < 3 ? '100vh' : 'auto';
      blogs.forEach(blog => {
        let subText: string = blog.text.substring(0, 200);
        this.shortTexts?.push({id: blog.id, text: subText});
        
      });
    });
    if (user != null) {
      this.userService.getById(user.uid).subscribe(data => {
        this.user = data;
      }, error => {
        console.error(error);
      });
    }
  }

  ngOnDestroy(): void {
    this.blogs?.forEach(blog => {
      this.blogService.updateIsWholeText(blog.id, false);
    })
  }

  createForm(model: any) {
    let formGroup = this.fBuilder.group(model);
    // Validátorokat rendelünk az egyes elemekhez!
    formGroup.get('title')?.addValidators([Validators.required, Validators.maxLength(100)]);
    formGroup.get('text')?.addValidators([Validators.required, Validators.minLength(200)]);
    return formGroup;
  }


  onReadMoreOrLess(blogId: string, more: boolean): void {
    this.blogService.updateIsWholeText(blogId, more);
  }

  onSubText(blogId: string): string {
    let subtext = ''
    this.shortTexts?.forEach(shortText => {
      if(shortText.id == blogId){
        subtext = shortText.text;
      }
    });
    return subtext;
  }

  onAddBlog() {
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

  onDeleteBlog(blogId: string){
    if(confirm("Biztosan törölni szeretnéd ezt a bejegyzést?")){
      this.blogService.delete(blogId).then(() => {
        this.toastr.success("A bejegyzés sikeresen törölve!", "Blog");
      }).catch(() => {
        this.toastr.error("A bejegyzés törlése sikertelen", "Blog");
      })
    }
  }

  onAddBlogCancel() {
    this.blogsForm.get('title')?.reset();
    this.blogsForm.get('text')?.reset();
    this.addBlog = false;
  }



}
