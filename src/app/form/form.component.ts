import { Component} from '@angular/core';
import { Form, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { createForm, createItemInputFeilds, FormItem } from './forms';
import Actions from '../../store/actions/invoices';
import { CalendarComponent } from '../calendar/calendar.component';
import { DropdownComponent } from "../drop-down/drop-down.component";
import { CurrencyPipe } from './currency.pipe';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconComponent,
    ButtonsComponent,
    PopupOverlayComponent,
    InputsComponent,
    CalendarComponent,
    DropdownComponent,
    // CurrencyPipe,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  formState!: FormGroup<
    { [k in keyof FormFields]: FormControl<string | null> } & {
      formItems: FormArray<ReturnType<typeof createItemInputFeilds>>;
    }
  >;
  invoice!: Observable<Invoice>;
  newItems: (Invoice['items'][number] & { id: string })[] = [];
  editingInvoiceId: string = '';
  editingItemStaus: 'pending'|'draft'|'paid'|'' = '';

  constructor(
    public globalService: GlobalService,
    public store: Store<AppStore>,
    private route: ActivatedRoute
  ) {
    // Create the form group
    this.createFormGroup();

    // Populate form fields with invoice data if form is in editting mode
    this.globalService.editing &&
      this.route.params.subscribe(({ id, }) => {
        // Set the editing invoice id
        this.editingInvoiceId = id;

        // Get the invoice from the store
        this.invoice = store.select(selectInvoice({ id }));

        // Subscribe to the invoice observable
        this.invoice.subscribe((data) => {
          // Set the editing item status
          this.editingItemStaus = data.status as typeof this.editingItemStaus;


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
            paymentTerms: data.paymentTerms.toString(),
          });

          // Create and setup the items form array
          data.items.forEach((item) => this.addNewItem(item));
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

  createFormGroup() {
    this.formState = createForm() as typeof this.formState;
  }

  getFormControl(controlName: keyof FormFields) {
    return this.formState.get(controlName) as FormControl<string | null>;
  }

  getItemGroup(index: number) {
    return this.formState.controls.formItems.controls[index] as FormGroup;
  }

  getItemControl(formGroupIndex: number, controlName: keyof FormItem) {
    return this.getItemGroup(formGroupIndex).get(controlName) as FormControl<
      string | null
    >;
  }

  itemControllErrored(formGroupIndex: number, controlName: keyof FormItem) {
    const control = this.getItemGroup(formGroupIndex).get(controlName);
    if (!control) return false;
    return control.touched && control.errors;
  }

  onExit() {
    this.globalService.resetForm();
  }

  onSave(saveAsDraft?: boolean) {
    // Early return if form is invalid
    if (this.formState.invalid) {
      // Return if form is in edit mode
      if (this.globalService.editing) return;

      // Return only if entry is not a draft
      if (!saveAsDraft) return;
    }

    const formValues = this.formState.getRawValue() as FormFields;

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
      paymentDue: formValues.invoiceDate,
      status: saveAsDraft ? 'draft' : this.editingItemStaus||'pending',

      total: this.newItems.reduce((acc, item) => acc + item.total, 0),
      items: this.newItems.map(({ id, ...item }) => item),

      description: '',
      paymentTerms: Number(formValues.paymentTerms),
    };

    // Dispatch the add invoice action
    this.store.dispatch(
      this.globalService.adding ? Actions.add(invoice) : Actions.update(invoice)
    );

    this.globalService.resetForm();
  }

  onAddNewItem(e: MouseEvent){
     e.preventDefault();
     e.stopPropagation();
    this.addNewItem();
  }

  addNewItem(item?: FormItem) {
    const temporalId = `${Math.random()}`;
    const formItems = this.formState.controls.formItems as FormArray;
    const itemControl = createItemInputFeilds(item);
    formItems.push(itemControl);

    // Handle name changes
    itemControl.controls.name.valueChanges?.subscribe((name) => {
      // Set the name value in the newItems array
      const itemData = this.newItems.find((item) => item.id === temporalId);
      if (itemData && name) {
        itemData.name = name;
      }
    });

    // Handle price changes
    itemControl.controls.price.valueChanges?.subscribe((price) => {
      // Ensure price is not null
      if (!price) price = '0';

      // Remove all non-numeric characters from price
      price = price.replace(/[^0-9\.]/g, ''); // example: 1234.56

      // Ensure price is not null
      let priceAmount = Number(price);
      if (isNaN(priceAmount) || priceAmount < 0) {
        priceAmount = 0;
      }

      // Patch price value
      itemControl.patchValue(
        {
          price: `£ ${priceAmount}`,
        },
        { emitEvent: false }
      );

      // Set price value in the newItems array
      const itemData = this.newItems.find((item) => item.id === temporalId);
      if (itemData) {
        itemData.price = priceAmount;
        itemData.total = priceAmount * itemData.quantity;
      }
    });

    // Handle quantity changes
    itemControl.controls.quantity.valueChanges?.subscribe((quantity) => {
      // Ensure price is not null
      let quantityAmount = Math.floor(Number(quantity?.trim()));
      if (isNaN(quantityAmount) || quantityAmount < 1) {
        quantityAmount = 1;
      }

      // Patch price value
      itemControl.patchValue(
        {
          quantity: `${quantityAmount}`,
        },
        { emitEvent: false }
      );

      // Set the total amount in the newItems array
      const itemData = this.newItems.find((item) => item.id === temporalId);
      if (itemData) {
        itemData.quantity = quantityAmount;
        itemData.total = itemData.price * quantityAmount;
      }
    });

    // Add new item to the newItems array
    this.newItems.push({
      ...(item || { name: '', price: 0, quantity: 1, total: 0 }),
      id: `${temporalId}`,
    });

  }
  onDeleteItem(itemId: string, index: number, e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // Remove the item from the form array
    const formItems = this.formState.controls.formItems as FormArray;
    formItems.removeAt(index);

    // Remove the item from the newItems array
    this.newItems = this.newItems.filter((item) => item.id !== itemId);
  }

  onEnterKeyPressed(e: KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();

    // Handle enter key press
    if (e.key && e.key.toLowerCase() === 'enter') {
      const form = document.getElementById('form');
      const allInputs = Object.values(
        form?.getElementsByTagName('input') || {}
      );
      // Get the current input element
      const index = allInputs.findIndex((element) => element === e.target);
      const next = index + 1;
      if (next > 0) {
        allInputs[next].focus();
      }
    }
  }

  setPaymentTerm(terms: number) {
    this.formState.controls.paymentTerms.setValue(`${terms}`);
  }

  setDate(date: string) {
    this.formState.controls.invoiceDate.setValue(date);
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

