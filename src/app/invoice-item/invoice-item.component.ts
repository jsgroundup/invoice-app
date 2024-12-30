import { Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Badges, StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: '[invoice-listitem]',
  standalone: true,
  imports: [IconComponent, StatusBadgeComponent],
  templateUrl: './invoice-item.component.html',
  styleUrl: './invoice-item.component.css',
})
export class InvoiceItemComponent {
  @Input({ required: true }) status!: Badges;
}
