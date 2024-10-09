import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book, BookService } from '../book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './book-edit.component.html',
  styleUrl: './book-edit.component.css'
})
export class BookEditComponent implements OnInit {
  bookForm: FormGroup;
  bookId!: number;
  coverImagePreview: string | null = null;
  isDraggingOver: boolean = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      description: [''],
      publishYear: [null, [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]],
      coverUrl: ['']
    });
  }

  ngOnInit() {
    this.bookId = +this.route.snapshot.paramMap.get('id')!;
    this.loadBook();
  }

  loadBook() {
    this.bookService.getBook(this.bookId).subscribe({
        next: (book: Book) => {
            this.bookForm.patchValue({
                title: book.title,
                author: book.author,
                description: book.description,
                publishYear: book.publish_year,
                coverUrl: book.cover_url
            });
            this.coverImagePreview = book.cover_url ? 'http://localhost:3000' + book.cover_url : null;
        },
        error: (error) => {
            console.error('Error loading book:', error);
        }
    });
}

  onSubmit() {
    if (this.bookForm.valid) {
      const formData = new FormData();
      Object.keys(this.bookForm.value).forEach(key => {
        formData.append(key, this.bookForm.value[key]);
      });

      this.bookService.updateBook(this.bookId, formData).subscribe(
        () => {
          this.router.navigate(['/books']);
        },
        error => console.error('Error updating book:', error)
      );
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.bookForm.patchValue({ coverUrl: file });
      this.previewImage(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver = false;
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.bookForm.patchValue({ coverUrl: file });
      this.previewImage(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver = true;
  }

  onDragLeave() {
    this.isDraggingOver = false;
  }

  previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.coverImagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  goBack() {
    this.router.navigate(['/books']);
  }
}
