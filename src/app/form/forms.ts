import { FormControl, FormGroup, Validators } from "@angular/forms";

export const createForm = ()=> new FormGroup({
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
