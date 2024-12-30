import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { InvoiceItemComponent } from './invoice-item/invoice-item.component';
import { IconComponent } from './icon/icon.component';
import { InvoiceCardComponent } from "./invoice-card/invoice-card.component";
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, InvoiceItemComponent, IconComponent, InvoiceCardComponent, FormComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'invoice';
  isEmpty = !true;
  detailsView = true;
}
