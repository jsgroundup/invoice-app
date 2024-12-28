import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { InvoiceItemComponent } from './invoice-item/invoice-item.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, InvoiceItemComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'invoice';
}
