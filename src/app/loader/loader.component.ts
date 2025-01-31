import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Host, HostBinding, Input, Output } from '@angular/core';
import { ButtonsComponent } from '../buttons/buttons.component';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, ButtonsComponent],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {
  @Input() state: 'load' | 'retry' = 'load';
  @Input() message: string[] = [
    'Loading...',
    'Please wait while we load the response',
  ];
  @Input() setBackground: boolean = true;
  @Output() onRetry = new EventEmitter<void>();

  @HostBinding('class') get overlayBackground() {
    return {
      'overlay-background': this.setBackground,
    };
  }

  isStatus(status: 'load' | 'retry') {
    return this.state === status;
  }
  retry() {
    this.state = 'load';
    this.onRetry.emit();
  }
}
