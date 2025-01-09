import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: '[app-button]',
  standalone: true,
  imports: [],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.css',
})
export class ButtonsComponent {
  @Input() buttonType?: ButtonTypes;
  @Input({ required: true }) title = '';

  @HostBinding('class') get className(): ButtonTypes {
    return ['neutral', 'danger', 'default'].includes(this.buttonType!)
      ? this.buttonType!
      : 'default';
  }
}

type ButtonTypes = 'danger' | 'default' | 'neutral';
