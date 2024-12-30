import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    data: { isHome: true },
  },
  {
    path: 'invoice/:id',
    component: AppComponent,
    data: { isHome: false },
  },
];
