import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { NetworkingService } from '../services/networking.service';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'invoice-card',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    StatusBadgeComponent,
    ButtonsComponent,
    LoaderComponent
],
  templateUrl: './invoice-card.component.html',
  styleUrl: './invoice-card.component.css',
})
export class InvoiceCardComponent implements OnInit, OnDestroy {
  invoiceData?: Invoice;
  timeout?: ReturnType<typeof setTimeout>;
  invoiceId = '';
  noInternetConection = false;
  loadingInvoiceData = false;
  loadingMessages =  ['Loading invoice data.', 'Please wait a minute...'];

  constructor(
    private route: Router,
    router: ActivatedRoute,
    public globalService: GlobalService,
    private store: Store<AppStore>,
    private network: NetworkingService
  ) {
    router.params.subscribe(({ id }) => {
      this.invoiceId = id;
      // this.invoiceData = this.store.select(selectInvoice({ id }));
    });
  }
  ngOnInit(): void {
    this.loadInvoiceData();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
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

  loadInvoiceData() {
    this.loadingInvoiceData = true;
    // Loads invoinces data before page loads
    // this.network.loadInvoiceData({
    //   invoiceId: this.invoiceId,
    //   onNext: (invoice) => {
    //     this.loadingInvoiceData = false;

    //     console.log(invoice);

    //     this.invoiceData = invoice;
    //   },
    //   onError: (error) => {
    //     this.loadingInvoiceData = false;
    //     if(error.status === 0){
    //       this.noInternetConection = true;
    //       return;
    //     }
    //   },
    // });
  }

  retry() {
    this.noInternetConection = false;
    this.loadInvoiceData();
  }
}


