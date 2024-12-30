import { Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Badges, StatusBadgeComponent } from '../status-badge/status-badge.component';
import { Invoice } from '../../data/data';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: '[invoice-listitem]',
  standalone: true,
  imports: [IconComponent, StatusBadgeComponent],
  templateUrl: './invoice-item.component.html',
  styleUrl: './invoice-item.component.css',
})
export class InvoiceItemComponent {
  constructor(private route: Router){}

  @Input({ required: true }) invoiceData!: Invoice

  formatDate(date: string){
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format((new Date(date)))
  }

  formatAmount(amount: number){
    return amount.toFixed(2)
  }

  onItemOnClick(){
    this.route.navigateByUrl(`/invoice/${this.invoiceData.id}`);
  }
}
