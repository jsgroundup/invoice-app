import { Component } from '@angular/core';
import { InputsComponent } from "../inputs/inputs.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonsComponent } from '../buttons/buttons.component';
import { PopupOverlayComponent } from "../popup-overlay/popup-overlay.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputsComponent, ButtonsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form!: FormGroup<FormFields>;
  fb = new FormBuilder();
  authenticating = false;
  loadingInvoices = false;

  constructor() {
    this.form = this.fb.group({
      email: [
        '',
        {
          validators: [
            Validators.email,
            Validators.pattern(/(\.[^\.]+)$/),
            Validators.maxLength(64),
            Validators.maxLength(5),
            Validators.pattern(/[^\s+]/),
          ],
        },
      ],
      password: [
        '',
        {
          validators: [Validators.minLength(7), Validators.maxLength(64)],
        },
      ],
    });
  }

  getFormControl(name: keyof FormFields) {
    return this.form.controls[name];
  }

  controllErrored(controlName: keyof FormFields) {
    const control = this.form.controls[controlName];
    return control.touched && control.errors;
  }

  onClose() {
    alert('Close');
  }

  onSignIn(){
    this.authenticating = true;
    setTimeout(() => {
      this.loadingInvoices = true;
      this.authenticating = false;
    }, 8000);
  }
}

type FormFields = { email: FormControl; password: FormControl };
