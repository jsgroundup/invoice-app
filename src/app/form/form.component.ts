import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ButtonsComponent } from '../buttons/buttons.component';
import { PopupOverlayComponent } from '../popup-overlay/popup-overlay.component';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [IconComponent, ButtonsComponent, PopupOverlayComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  constructor(public globalService: GlobalService){}
  onExit(){
    this.globalService.editing = false
  }
}
