import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { ButtonsComponent } from '../buttons/buttons.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store';
import { Observable } from 'rxjs';
import { Invoice } from '../../data/data';
import { selectInvoice } from '../../store/selectors/invoice';
import { AsyncPipe, CommonModule } from '@angular/common';
import Actions from '../../store/actions/invoices';

@Component({
  selector: 'invoice-card',
  standalone: true,
  imports: [CommonModule, AsyncPipe, IconComponent, StatusBadgeComponent, ButtonsComponent],
  templateUrl: './invoice-card.component.html',
  styleUrl: './invoice-card.component.css',
})
export class InvoiceCardComponent {
  invoiceData?: Observable<Invoice>;

  constructor(
    private route: Router,
    router: ActivatedRoute,
    public globalService: GlobalService,
    private store: Store<AppStore>
  ) {
    router.params.subscribe(({ id }) => {
      this.invoiceData = this.store.select(selectInvoice({ id }));
    });
  }

  calculateTotal(items: any) {
    return items.reduce((acc: number, item: any) => acc + item.total, 0);
  }

  formatDate(date?: string) {

    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date as string));
  }

  formatAmount(amount?: number) {
    return (amount as number).toFixed(2);
  }

  onClick() {
    this.route.navigateByUrl('/');
  }

  onEdit() {
    this.globalService.editing = true;
    this.globalService.deleting = false;
    this.globalService.adding = false;
  }

  onDelete() {
    this.globalService.editing = false;
    this.globalService.adding = false;
    this.globalService.deleting = true;
  }

  markAsPaid(id: string) {
    this.store.dispatch(Actions.updateStatus({ id: id, status: 'paid' }));
  }
}


