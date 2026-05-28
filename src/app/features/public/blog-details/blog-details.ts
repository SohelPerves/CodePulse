import { Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MarkdownComponent } from 'ngx-markdown';

import { BlogPostService } from '../../blogpost/services/blog-post-service';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css',
  imports: [
    DatePipe,
    MarkdownComponent
  ],
})
export class BlogDetails {

  private blogPostService = inject(BlogPostService);

  url = input<string>();

  blogPostResource =
    this.blogPostService.getBlogPostByUrlHandle(this.url);
}