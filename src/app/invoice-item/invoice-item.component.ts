import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: '[invoice-listitem]',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './invoice-item.component.html',
  styleUrl: './invoice-item.component.css'
})
export class InvoiceItemComponent {

}
