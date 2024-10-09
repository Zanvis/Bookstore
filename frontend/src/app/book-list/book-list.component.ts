import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book, BookService } from '../book.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = '';
  sortBy: string = 'title';

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        // console.log(data);
        this.books = data;
        this.filterBooks();
      },
      error: (error) => console.error('Error loading books:', error)
    });
  }

  filterBooks() {
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortBooks();
  }

  sortBooks() {
    this.filteredBooks.sort((a, b) => {
      if ((a as any)[this.sortBy] < (b as any)[this.sortBy]) return -1;
      if ((a as any)[this.sortBy] > (b as any)[this.sortBy]) return 1;
      return 0;
    });
  }
}
