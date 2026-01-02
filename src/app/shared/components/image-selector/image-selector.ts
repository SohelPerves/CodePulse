import { Component, inject } from '@angular/core';
import { ImageSelectorService } from '../../services/image-selector-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-image-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './image-selector.html',
  styleUrl: './image-selector.css',
})
export class ImageSelector {
  private imageSelectorService = inject(ImageSelectorService);
  showImageSelector = this.imageSelectorService.showImageSelector.asReadonly();

  imageSelectorUploadForm = new FormGroup({
    file: new FormControl<File | null | undefined>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fileName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
  });

  closeModalImageSelector() {
    this.imageSelectorService.closeModalImageSelector();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.imageSelectorUploadForm.patchValue({ file: file });
  }

  onSubmit() {
    if (this.imageSelectorUploadForm.valid) {
      const formRawValue = this.imageSelectorUploadForm.getRawValue();
      this.imageSelectorService
        .uploadImage(formRawValue.file!, formRawValue.fileName, formRawValue.title)
        .subscribe({
          next: (response) => {
            console.log('Image uploaded successfully:', response);
          },
          error: (err) => {
            console.error('Error uploading image:', err);
          },
        });
    }
  }
}
