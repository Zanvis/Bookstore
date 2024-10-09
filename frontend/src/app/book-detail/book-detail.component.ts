import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Book, BookService } from '../book.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBook(id);
  }

  loadBook(id: number): void {
    this.bookService.getBook(id)
      .pipe(
        catchError((error) => {
          console.error('Error loading book:', error);
          return of(null); // Return an observable that emits null
        })
      )
      .subscribe((book) => {
        this.book = book;
      });
  }
  
  deleteBook() {
    if (this.book && confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(this.book.id)
        .pipe(
          catchError((error) => {
            console.error('Error deleting book:', error);
            return of(null);
          })
        )
        .subscribe(() => {
          this.router.navigate(['/books']);
        });
    }
  }
  editBook(): void {
    if (this.book) {
      this.router.navigate(['/books/edit', this.book.id]);
    }
  }
  goBack() {
    this.router.navigate(['/books']);
  }
}

