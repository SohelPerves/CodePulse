import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogImage } from '../models/image.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageSelectorService {
  showImageSelector = signal<boolean>(false);
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;
  selectedImage = signal<string | null>(null);

  showModalImageSelector() {
    this.showImageSelector.set(true);
  }

  closeModalImageSelector() {
    this.showImageSelector.set(false);
  }

  uploadImage(file: File, fileName: string, title: string): Observable<BlogImage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('title', title);
    return this.http.post<BlogImage>(`${this.apiBaseUrl}/api/images`, formData);
  }

  getAllImages(id: WritableSignal<string | undefined>): HttpResourceRef<BlogImage[] | undefined> {
    return httpResource<BlogImage[] | undefined>(() => {
      id();
      return `${this.apiBaseUrl}/api/images`;
    });
  }

  selectImage(imageUrl: string) {
    this.selectedImage.set(imageUrl);
    this.closeModalImageSelector();
  }
}
