import { Component, OnInit } from '@angular/core';
import { Blog } from 'src/app/shared/models/Blog';
import { BlogService } from 'src/app/shared/services/blog.service';

interface subText {
  id: string;
  text: string;
  wholeText: boolean;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})

export class BlogComponent implements OnInit {

  blogs?: Array<Blog>;
  shortTexts?: subText[] = [];
  wholeText: boolean = false;


  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.blogService.getAll().subscribe(blogs => {
      this.blogs = blogs;
      blogs.forEach(blog => {
        let subText: string = blog.text.substring(0, 200);
        this.shortTexts?.push({id: blog.id, text: subText, wholeText: false});
        
      });
    });
  }

  onReadContinue(): void {
    this.wholeText = true;

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

}
