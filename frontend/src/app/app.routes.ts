import { Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookFormComponent } from './book-form/book-form.component';
import { BookEditComponent } from './book-edit/book-edit.component';

export const routes: Routes = [
    { path: '', redirectTo: '/books', pathMatch: 'full' },
    { path: 'books', component: BookListComponent },
    { path: 'books/:id', component: BookDetailComponent },
    { path: 'add', component: BookFormComponent },
    { path: 'books/edit/:id', component: BookEditComponent },
    { path: '**', redirectTo: '/books' }
];
