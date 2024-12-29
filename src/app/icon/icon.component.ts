import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: '[app-icon]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
})
export class IconComponent {
  @Input({required: true}) name!: 'arrow-left' | 'arrow-right' | 'arrow-down' | 'plus' | 'check'| 'moon'| 'sun';
}
