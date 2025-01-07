import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFields } from '../form/form.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.css',
})
export class InputsComponent {
  @Input({}) errored: boolean = false;
  @Input({}) controlName: string | null = null;
  @Input({}) inputType: string = 'text';
  @Input({required: true}) inputTitle: string = '';
  @Input({}) placeHolder: string = '';
  @Input({}) hideLabelText: boolean = false
  @Input({}) inputValue?: string|number|boolean|null;
  @Input({}) disabled: boolean = false
  @Input({}) form!: FormGroup<{[k in keyof FormFields]: FormControl<string|null>}>;

  onNext = output<KeyboardEvent>();

  onEnterKeyPressed(e: KeyboardEvent) {
    this.onNext.emit(e);
  }
}
