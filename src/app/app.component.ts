import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { InvoiceItemComponent } from './invoice-item/invoice-item.component';
import { IconComponent } from './icon/icon.component';
import { InvoiceCardComponent } from "./invoice-card/invoice-card.component";
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { DialogComponent } from "./dialog/dialog.component";
import { map, Observable } from 'rxjs';
import { Invoice } from '../data/data';
import { Store } from '@ngrx/store';
import { AppStore } from '../store';
import { selectAllInvoices } from '../store/selectors/invoice';
import { GlobalService } from './services/global.service';
import { FilterComponent } from './filter/filter.component';
import { Badges } from './status-badge/status-badge.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    HeaderComponent,
    InvoiceItemComponent,
    IconComponent,
    InvoiceCardComponent,
    FormComponent,
    DialogComponent,
    FilterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'invoice';
  isEmpty = !true;
  detailsView = !true;
  showForm = false;
  showDialog = false;
  viewAsHompage = true;
  filters: Badges | '' = '';
  invoices$: Observable<Invoice[]>;
  countPending$: Observable<number>;
  filteredInvoices: Invoice[] = [];

  constructor(
    private store: Store<AppStore>,
    private route: ActivatedRoute,
    public globalService: GlobalService
  ) {
    this.invoices$ = this.store.select(selectAllInvoices);
    this.invoices$.subscribe((data) => {
      this.filterItems(data);
    });

    this.countPending$ = this.invoices$.pipe(
      map((invoices: Invoice[]) =>
        invoices.reduce(
          (pre, data) => (data.status === 'pending' ? pre + 1 : pre),
          0
        )
      )
    );
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.viewAsHompage = !!data['isHome'];
    });
  }

  countPending() {
    return this.invoices$.subscribe((invoices) =>
      invoices.reduce(
        (pre, data) => (data.status === 'pending' ? pre + 1 : pre),
        0
      )
    );
  }

  filterItems(items: Invoice[]) {
    this.filteredInvoices =
      this.filters.length < 1
        ? items
        : items.filter((item) => item.status === this.filters);
  }

  onFilter(status: typeof this.filters) {
    this.filters = status;
    this.invoices$.subscribe((data) => {
      this.filterItems(data);
    });
  }

  onNewInvoice() {
    this.globalService.adding = true;
    this.globalService.editing = false;
    this.globalService.deleting = false;
  }
}
