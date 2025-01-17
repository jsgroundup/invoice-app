import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    data: { isHome: true },
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'invoice/:id',
    component: AppComponent,
    data: { isHome: false },
  },
];
