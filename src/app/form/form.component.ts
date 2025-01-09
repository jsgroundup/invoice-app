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
import { InputsComponent } from '../inputs/inputs.component';
import { createForm } from './forms';
import Actions from '../../store/actions/invoices';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconComponent,
    ButtonsComponent,
    PopupOverlayComponent,
    InputsComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  formState!: FormGroup<{[k in keyof FormFields]: FormControl<string|null>}>;
  invoice!: Observable<Invoice>;
  newItems: (Invoice['items'][number] & { id: string })[] = [];
  editingInvoiceId: string = '';

  constructor(
    public globalService: GlobalService,
    public store: Store<AppStore>,
    private route: ActivatedRoute
  ) {

    this.createFormGroup();

    // Populate form fields with invoice data if form is in editting mode
    this.globalService.editing&&
    this.route.params.subscribe(({ id }) => {
      // Set the editing invoice id
      this.editingInvoiceId = id;

      // Get the invoice from the store
      this.invoice = store.select(selectInvoice({ id }));

      // Subscribe to the invoice observable
      this.invoice.subscribe((data) => {
        this.newItems = data.items.map((item) => ({
          ...item,
          id: `${Math.random()}`,
        }));

        // Set the form fields with the invoice data
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
    this.formState = createForm()
  }

  getFormControl(controlName: keyof FormFields) {
    return this.formState.get(controlName) as FormControl<string | null>;
  }

  onExit() {
    this.globalService.editing = false;
    this.globalService.adding = false;
    this.globalService.deleting = false;
  }

  onSave(saveAs: 'new' | 'update') {
    // Early return if form is invalid
    if (this.formState.invalid) {
      return;
    }

    const formValues = this.formState.value as Required<{[K in keyof typeof this.formState.value]: string}>;
    const invoice: Invoice = {
      id: this.editingInvoiceId || this.globalService.generateId(),
      senderAddress: {
        street: formValues.senderStreet,
        city: formValues.senderCity,
        postCode: formValues.senderPostCode,
        country: formValues.senderCountry,
      },
      clientEmail: formValues.clientEmail,
      clientName: formValues.clientName,
      clientAddress: {
        street: formValues.clientStreet,
        city: formValues.clientCity,
        postCode: formValues.clientPostCode,
        country: formValues.clientCountry,
      },
      createdAt: formValues.invoiceDate,
      paymentDue: formValues.paymentTerms,
      status: 'pending',
      total: this.newItems.reduce((acc, item) => acc + item.total, 0),
      items: this.newItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      description: '',
      paymentTerms: 89,
    };

    // Dispatch the add invoice action
    this.store.dispatch(saveAs === 'new' ? Actions.add(invoice) : Actions.update(invoice));

    this.globalService.resetForm();
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

export interface FormFields{
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
