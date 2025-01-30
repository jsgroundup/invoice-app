import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  @Input() state: 'load'|'retry' = 'load';
  @Input() message: string[] = ['Loading...', 'Please wait while we load the response'];
  @Output() onRetry = new EventEmitter<void>();

  isStatus(status: 'load'|'retry'){
    return this.state === status;
  }
  retry(){
    this.state = 'load';
    this.onRetry.emit();
  }
}
