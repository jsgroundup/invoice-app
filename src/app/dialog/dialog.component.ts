import { Component } from '@angular/core';
import { ButtonsComponent } from '../buttons/buttons.component';
import { PopupOverlayComponent } from '../popup-overlay/popup-overlay.component';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [ButtonsComponent, PopupOverlayComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  constructor(public globalService: GlobalService){}
  onExit(){
    this.globalService.deleting = false
  }
}
