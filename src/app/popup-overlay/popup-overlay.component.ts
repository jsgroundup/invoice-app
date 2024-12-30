import { Component, input, OnDestroy, OnInit, output } from '@angular/core';

@Component({
  selector: 'app-popup-overlay',
  standalone: true,
  imports: [],
  templateUrl: './popup-overlay.component.html',
  styleUrl: './popup-overlay.component.css',
})
export class PopupOverlayComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  close = output({ alias: 'onClose' });

  onClick() {
    this.close.emit();
  }
}
