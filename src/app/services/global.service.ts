import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  adding = false;
  editing = false;
  deleting = false;
  idCounts = 0;
  token = '';

  constructor() {
    this.token = localStorage.getItem('token') || '';
  }

  generateId() {
    // Generate two random alphabets
    const randomAlphabets = Math.random().toString(36).substring(2, 4);
    // Generate four numbers by increasing the idCounts by 1
    this.idCounts += 1;
    const randomNumbers = this.idCounts.toString().padStart(4, '0');
    return `${randomAlphabets}${randomNumbers}`.toUpperCase();
  }

  resetForm() {
    this.adding = false;
    this.editing = false;
    this.deleting = false;
  }
}
