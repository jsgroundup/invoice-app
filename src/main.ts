import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';


@Component({
  selector: 'app-origin',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class AppOrigin {}

bootstrapApplication(AppOrigin, appConfig)
  .catch((err) => console.error(err));
