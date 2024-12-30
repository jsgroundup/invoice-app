import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  title = 'invoice';
  isEmpty = !true;
  detailsView = !true;
  showForm = false;
  showDialog = false;

  invoices$: Observable<Invoice[]>;
  countPending$: Observable<number>;
  viewAsHompage: boolean = true


  constructor(private store: Store<AppStore>, private route: ActivatedRoute) {

    this.invoices$ = this.store.select(selectAllInvoices);

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
}
