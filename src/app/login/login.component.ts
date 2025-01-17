import { Component } from '@angular/core';
import { InputsComponent } from "../inputs/inputs.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonsComponent } from '../buttons/buttons.component';
import { PopupOverlayComponent } from "../popup-overlay/popup-overlay.component";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, InputsComponent, ButtonsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form!: FormGroup<FormFields>;
  fb: FormBuilder = new FormBuilder();

  constructor() {
    this.form = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  getFormControl(name: keyof FormFields) {
    return this.form.controls[name];
  }

  onClose() {
    alert('Close');
  }
}

type FormFields = { email: FormControl; password: FormControl };
