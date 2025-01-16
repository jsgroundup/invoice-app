import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AsyncValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";
import { FormFields } from "./form.component";

const fb = new FormBuilder();

interface FormProps {
  senderStreet: string;
  senderCity: string;
  senderCountry: string;
  senderPostCode: string;
  clientName: string;
  clientEmail: string;
  clientStreet: string;
  clientCity: string;
  clientCountry: string;
  clientPostCode: string;
  invoiceDate: string;
  paymentTerms: number;
}

export interface FormItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

const commonValidators = (
  { minLength }: { minLength: number },
  more?: any[]
) => {
  return [
    Validators.required,
    Validators.minLength(minLength),
    Validators.pattern(/[^\s+]/),
    ...(more || []),
  ];
};

// Take the required inputs as args and create a form group
export const createForm = (initialValue?: FormProps)=> {
  return fb.group({
    senderStreet: [
      initialValue?.senderStreet || '',
      { validators: commonValidators({ minLength: 0 }) },
    ],
    senderCity: [
      initialValue?.senderCity || '',
      { validators: commonValidators({ minLength: 2 }) },
    ],
    senderCountry: [
      initialValue?.senderCountry || '',
      { validators: commonValidators({ minLength: 3 }) },
    ],
    senderPostCode: [
      initialValue?.senderPostCode || '',
      {
        validators: [
          Validators.required,
          Validators.minLength(0),
          Validators.pattern(/[a-zA-Z0-9]/)
        ],
      },
    ],

    clientName: [
      initialValue?.clientName || '',
      { validators: commonValidators({ minLength: 3 }) },
    ],
    clientEmail: [
      initialValue?.clientEmail || '',
      { validators: commonValidators({ minLength: 5 }, [Validators.email]) },
    ],
    clientStreet: [
      initialValue?.clientStreet || '',
      { validators: commonValidators({ minLength: 0 }) },
    ],
    clientCity: [
      initialValue?.clientCity || '',
      { validators: commonValidators({ minLength: 2 }) },
    ],
    clientCountry: [
      initialValue?.clientCountry || '',
      { validators: commonValidators({ minLength: 3 }) },
    ],
    clientPostCode: [
      initialValue?.clientPostCode || '',
      {
        validators: commonValidators({ minLength: 0 }, [
          Validators.pattern(/[a-zA-Z0-9]/),
        ]),
      },
    ],

    invoiceDate: [
      '',
      { validators: [Validators.required, Validators.minLength(0)] },
    ],
    paymentTerms: [
      initialValue?.paymentTerms || '',
      { validators: [Validators.min(1), Validators.required] },
    ],

    formItems: fb.array<ReturnType<typeof createItemInputFeilds>>([]),
  });
};


export const createItemInputFeilds = (item?: FormItem)=>{
  return fb.group({
    name: [item?.name||'', { validators: commonValidators({ minLength: 3 }) }],
    quantity: [
      item?.quantity.toString()||'',
      {
        validators: [
          Validators.required,
          Validators.min(1)
        ],
      },
    ],
    price: [item?.price.toString()||'', { validators: [Validators.required] }],
    total: [
      { value: item?.total.toString()||'', disabled: true },
      { validators: [Validators.required] },
    ],
  });
}
