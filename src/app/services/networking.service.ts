import { Injectable } from '@angular/core';
import { type Invoice } from '../../data/data';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { GlobalService } from './global.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
  // deps: [HttpClientModule, Store, GlobalService, Router, HttpClient]
})
export class NetworkingService {
  apiUrl = 'https://invoice-app-bknd-strapi-cloud.onrender.com';
  timeout?: ReturnType<typeof setTimeout>;

  constructor(
    private http: HttpClient,
    private globalService: GlobalService,
    private navigation: Router
  ) {}

  logIn<T = { token: string }>({ onError, onNext, ...props }: LoginProps<T>) {
    // Log in request
    return this.http.post<T>(`${this.apiUrl}/login`, props).subscribe({
      next: onNext,
      error: onError,
    });
  }
  loadInvoices({ token, onNext, onError }: LoadInvoicesProps) {
    // Request for data
    return this.http
      .get<Invoice[]>(`${this.apiUrl}/invoices`, {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      })
      .subscribe({
        next: onNext,
        error: (err) => {
          if (err.status > 399 && err.status < 404) {
            // Token expired
            this.globalService.token = '';
            localStorage.removeItem('token');

            // Redirect to login page
            this.navigation.navigate(['/']);

            return;
          }
          onError(err);
        },
      });
  }
  loadInvoiceData({ invoiceId, onNext, onError }: LoadInvoiceDataProps) {
    const token = this.globalService.token;
    // Request for data
    return this.http
      .get<Invoice>(`${this.apiUrl}/invoices/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      })
      .subscribe({
        next: onNext,
        error: (err) => {
          if(err.status > 399 && err.status < 404) {
            // Token expired
            this.globalService.token = '';
            localStorage.removeItem('token');

            // Redirect to login page
            this.navigation.navigate(['/']);

            return;
          }
          onError(err);
        },
      });
  }
}


type LoadInvoicesProps = { token: string , onNext: (invoices: Invoice[]) => void, onError: (error: HttpErrorResponse) => void }
type LoadInvoiceDataProps = { invoiceId: string , onNext: (invoices: Invoice) => void, onError: (error: HttpErrorResponse) => void }
type LoginProps<T> = {username: string; password: string; onNext: (response: T) => void, onError: (error: HttpErrorResponse) => void }
