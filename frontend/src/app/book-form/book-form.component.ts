import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent {
  bookForm = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    description: [''],
    publishYear: [null, [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]]
  });

  coverImage: File | null = null;
  coverImagePreview: string | null = null;
  isDraggingOver: boolean = false;

  constructor(
    private bookService: BookService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.setCoverImage(event.target.files[0]);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files.length) {
      this.setCoverImage(event.dataTransfer.files[0]);
    }
    this.isDraggingOver = false;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver = true;
  }

  onDragLeave() {
    this.isDraggingOver = false;
  }

  setCoverImage(file: File) {
    this.coverImage = file;

    // Image preview
    const reader = new FileReader();
    reader.onload = () => {
      this.coverImagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.bookForm.valid) {
      const formData = new FormData();
      Object.keys(this.bookForm.value).forEach(key => {
        formData.append(key, (this.bookForm.value as { [key: string]: any })[key]);
      });
      if (this.coverImage) {
        formData.append('coverImage', this.coverImage);
      }

      this.bookService.addBook(formData).subscribe(
        () => this.router.navigate(['/books']),
        (error) => console.error('Error adding book:', error)
      );
    }
  }

  goBack() {
    this.router.navigate(['/books']);
  }
  removeCoverImage() {
    this.coverImage = null;
    this.coverImagePreview = null;
    // Reset the file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
