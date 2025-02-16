import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { LoginComponent } from "./login/login.component";
import { NetworkingService } from './services/networking.service';
import Actions from '../store/actions/invoices';
import { LoaderComponent } from './loader/loader.component';

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
    LoginComponent,
    LoaderComponent,
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
  loadingInvoiceData = false;
  noInternetConection = false;
  loadingMessages = ['Loading invoice data.', 'Please wait a minute...'];
  filters: Badges | '' = '';
  invoices$: Observable<Invoice[]>;
  countPending$: Observable<number>;
  filteredInvoices: Invoice[] = [];

  constructor(
    private store: Store<AppStore>,
    private navigation: Router,
    private route: ActivatedRoute,
    public globalService: GlobalService,
    private network: NetworkingService
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

      if (this.viewAsHompage) {
        if (this.filteredInvoices.length < 1) {
          // Invoice data is empty, try loading invoinces
          this.loadInvoiceData();
          return;
        }
      }
    });
  }

  loadInvoiceData() {
    this.loadingInvoiceData = true;
    this.noInternetConection = false;

    setTimeout(() => {
      this.network.loadInvoices({
        token: this.globalService.token,

        onNext: (invoices) => {
          this.loadingInvoiceData = false;
          // Save the invoices in the store
          this.store.dispatch(
            Actions.addInitial({ invoices: invoices as Array<Invoice> })
          );
        },

        onError: (error) => {
          this.loadingInvoiceData = false;
          if (error.status === 401) {
            // Token expired
            this.globalService.token = '';
            localStorage.removeItem('token');

            // Redirect to login page
            this.navigation.navigate(['/']);
            return;
          }

          // Show reload button if no internet connection
          if (error.status === 0) {
            this.noInternetConection = true;
          }
        },
      });
    }, 2000);
  }

  userIsLoggedIn() {
    this.globalService.token = localStorage.getItem('token') || '';
    return !!this.globalService.token;
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
