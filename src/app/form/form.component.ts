import { Component} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { ButtonsComponent } from '../buttons/buttons.component';
import { PopupOverlayComponent } from '../popup-overlay/popup-overlay.component';
import { GlobalService } from '../services/global.service';
import { Invoice } from '../../data/data';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store';
import { selectInvoice } from '../../store/selectors/invoice';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconComponent,
    ButtonsComponent,
    PopupOverlayComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  formState!: FormGroup<{[k in keyof FormFields]: FormControl<string|null>}>;
  invoice!: Observable<Invoice>;
  newItems: (Invoice['items'][number] & { id: string })[] = [];

  constructor(
    public globalService: GlobalService,
    public store: Store<AppStore>,
    private route: ActivatedRoute
  ) {

    this.createFormGroup();

    // Populate form fields with invoice data if form is in editting mode
    this.globalService.editing&&
    this.route.params.subscribe(({ id }) => {
      this.invoice = store.select(selectInvoice({ id }));
      this.invoice.subscribe((data) => {
        this.newItems = data.items.map((item) => ({
          ...item,
          id: `${Math.random()}`,
        }));
        this.setFormFieldValues({
          senderStreet: data.senderAddress.street,
          senderCity: data.senderAddress.city,
          senderPostCode: data.senderAddress.postCode,
          senderCountry: data.senderAddress.country,

          clientEmail: data.clientEmail,
          clientName: data.clientName,
          clientStreet: data.clientAddress.street,
          clientCity: data.clientAddress.city,
          clientPostCode: data.clientAddress.postCode,
          clientCountry: data.clientAddress.country,

          invoiceDate: data.createdAt,
          paymentTerms: '',
        });
      });
    });
  }

  private getControl(controlName: keyof FormFields) {
    return this.formState.controls[controlName];
  }

  controllErrored(controlName: keyof FormFields) {
    const control = this.getControl(controlName);
    return control.touched && control.errors;
  }

  setFormFieldValues(values: Partial<FormFields>) {
    const fields = Object.keys(values) as Array<keyof FormFields>;
    fields.forEach((key) => {
      this.formState.controls[key].setValue(values[key] as string);
    });
  }

  createFormGroup(){
    this.formState = new FormGroup({
      senderStreet: new FormControl('', [
        Validators.required,
        Validators.minLength(0),
        Validators.pattern(/[^\s+]/),
      ]),
      senderCity: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/[^\s+]/),
      ]),
      senderCountry: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/[^\s+]/),
      ]),
      senderPostCode: new FormControl('', [
        Validators.required,
        Validators.minLength(0),
        Validators.pattern(/[a-zA-Z0-9]/),
      ]),

      clientName: new FormControl('', [
        Validators.required,
        Validators.minLength(0),
        Validators.pattern(/[^\s+]/),
      ]),
      clientEmail: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(5),
        Validators.pattern(/[^\s+]/),
      ]),
      clientStreet: new FormControl('', [
        Validators.required,
        Validators.minLength(0),
        Validators.pattern(/[^\s+]/),
      ]),
      clientCity: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/[^\s+]/),
      ]),
      clientCountry: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/[^\s+]/),
      ]),
      clientPostCode: new FormControl('', [
        Validators.required,
        Validators.minLength(0),
        Validators.pattern(/[a-zA-Z0-9]/),
      ]),

      invoiceDate: new FormControl('', [
        Validators.required,
        Validators.minLength(0),
      ]),
      paymentTerms: new FormControl('', [
        Validators.required,
        Validators.minLength(0),
      ]),
    });
  }

  onExit() {
    this.globalService.editing = false;
    this.globalService.adding = false;
    this.globalService.deleting = false;
  }

  onAddNewItem(e:MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.newItems.push({
      name: '',
      price: 0,
      quantity: 0,
      total: 0,
      id: `${Math.random()}`,
    });
  }
  onDeleteItem(itemId: string, e:MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.newItems = this.newItems.filter((item) => item.id !== itemId);
  }

  onEnterKeyPressed(e: KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.key.toLowerCase() === 'enter') {
      const form = document.getElementById('form');
      const allInputs = Object.values(
        form?.getElementsByTagName('input') || {}
      );
      const index = allInputs.findIndex((element) => element === e.target);
      const next = index + 1;
      if (next > 0) {
        allInputs[next].focus();
      }
    }
  }
}

const FormFieldKeys: (keyof FormFields)[] = [
  'senderStreet',
  'senderCity',
  'senderPostCode',
  'senderCountry',

  'clientEmail',
  'clientName',
  'clientStreet',
  'clientCity',
  'clientPostCode',
  'clientCountry',

  'invoiceDate',
  'paymentTerms',
]

interface FormFields{
  senderStreet: string;
  senderCity: string;
  senderPostCode: string;
  senderCountry: string;

  clientEmail: string;
  clientName: string;
  clientStreet: string;
  clientCity: string;
  clientPostCode: string;
  clientCountry: string;

  invoiceDate: string;
  paymentTerms: string;
}
