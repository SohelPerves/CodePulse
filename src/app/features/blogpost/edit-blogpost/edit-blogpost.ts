import { Component, effect, inject, input } from '@angular/core';
import { BlogPostService } from '../services/blog-post-service';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category-service';
import { UpdateBlogPostRequest } from '../models/blogpost.model';
import { Router } from '@angular/router';
import { ImageSelector } from '../../../shared/components/image-selector/image-selector';
import { ImageSelectorService } from '../../../shared/services/image-selector-service';

@Component({
  selector: 'app-edit-blogpost',
  imports: [ReactiveFormsModule, MarkdownComponent, ImageSelector],
  templateUrl: './edit-blogpost.html',
  styleUrl: './edit-blogpost.css',
})
export class EditBlogpost {
  id = input<string>();
  blogPostService = inject(BlogPostService);
  categoriesService = inject(CategoryService);
  imageSelectorService = inject(ImageSelectorService);

  private router = inject(Router);

  private blogPostRef = this.blogPostService.getBlogPostById(this.id);
  blogPostResponse = this.blogPostRef.value;

  private categoriesRef = this.categoriesService.getAllCategories();
  categoriesResponse = this.categoriesRef.value;

  editBlogpostForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(100)],
    }),
    shortDescription: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
    }),
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    featuredImageUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    urlHandle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    publishedDate: new FormControl<string>(new Date().toISOString().split('T')[0], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    author: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    isVisible: new FormControl<boolean>(true, {
      nonNullable: true,
    }),
    categories: new FormControl<string[]>([], {}),
  });

  effectRef = effect(() => {
    if (this.blogPostResponse()) {
      this.editBlogpostForm.patchValue({
        title: this.blogPostResponse()?.title || '',
        shortDescription: this.blogPostResponse()?.shortDescription || '',
        content: this.blogPostResponse()?.content || '',
        featuredImageUrl: this.blogPostResponse()?.featuredImageUrl || '',
        urlHandle: this.blogPostResponse()?.urlHandle || '',
        author: this.blogPostResponse()?.author || '',
        isVisible: this.blogPostResponse()?.isVisible || false,
        publishedDate: this.blogPostResponse()?.publishedDate
          ? new Date(this.blogPostResponse()?.publishedDate || '').toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        categories: this.blogPostResponse()?.categories.map((x) => x.id),
      });
    }
  });

  onSubmit() {
    const id = this.id();
    if (id && this.editBlogpostForm.valid) {
      const formValue = this.editBlogpostForm.getRawValue();
      const UpdateBlogPostRequest: UpdateBlogPostRequest = {
        title: formValue.title,
        shortDescription: formValue.shortDescription,
        content: formValue.content,
        featuredImageUrl: formValue.featuredImageUrl,
        urlHandle: formValue.urlHandle,
        author: formValue.author,
        isVisible: formValue.isVisible,
        publishedDate: new Date(formValue.publishedDate),
        categories: formValue.categories ?? [],
      };
      this.blogPostService.updateBlogPost(id, UpdateBlogPostRequest).subscribe({
        next: () => {
          this.router.navigate(['/admin/blogposts']);
        },
        error: () => {
          console.error('Error updating blog post');
        },
      });
    }
  }
  openImageSelector() {
    this.imageSelectorService.showModalImageSelector();
  }
}
