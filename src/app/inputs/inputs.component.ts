import { CommonModule } from '@angular/common';
import { Component, inject, Input, output, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms';
import { FormFields } from '../form/form.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.css',
})
export class InputsComponent implements ControlValueAccessor {
  @Input() errored: boolean = false;
  @Input() controlName: string | null = null;
  @Input() inputType: string = 'text';
  @Input({ required: true }) inputTitle: string = '';
  @Input() placeHolder: string = '';
  @Input() hideLabelText: boolean = false;
  @Input() inputValue?: string | number | boolean | null;
  @Input() disabled: boolean = false;
  @Input() formControl!: FormControl<string | null>;
  @Self() ngControl = inject(NgControl);

  constructor() {
    this.ngControl.valueAccessor = this;
  }
  onNext = output<KeyboardEvent>();
  onFocus = output<FocusEvent>();

  onEnterKeyPressed(e: KeyboardEvent) {
    this.onNext?.emit(e);
  }

  onFocused(e: FocusEvent) {
    this.onFocus?.emit(e);
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
}
