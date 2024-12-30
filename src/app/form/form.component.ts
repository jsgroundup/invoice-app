import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ButtonsComponent } from '../buttons/buttons.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [IconComponent, ButtonsComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

}
