import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { ButtonsComponent } from '../buttons/buttons.component';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'invoice-card',
  standalone: true,
  imports: [IconComponent, StatusBadgeComponent, ButtonsComponent],
  templateUrl: './invoice-card.component.html',
  styleUrl: './invoice-card.component.css',
})
export class InvoiceCardComponent {
  constructor(private route: Router, public globalService: GlobalService) {}

  onClick() {
    this.route.navigateByUrl('/');
  }

  onEdit() {
    this.globalService.editing = true;
    this.globalService.deleting = false;
  }

  onDelete() {
    this.globalService.editing = false;
    this.globalService.deleting = true;
  }
}
