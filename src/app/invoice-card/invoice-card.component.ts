import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { ButtonsComponent } from '../buttons/buttons.component';

@Component({
  selector: 'invoice-card',
  standalone: true,
  imports: [IconComponent, StatusBadgeComponent, ButtonsComponent],
  templateUrl: './invoice-card.component.html',
  styleUrl: './invoice-card.component.css'
})
export class InvoiceCardComponent {

}
