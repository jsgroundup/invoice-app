import { Component, HostListener, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CommonModule } from '@angular/common';
import { Badges } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  expanded = false
  checked: Badges|'' = ''

  @HostListener('click') onClick(){
    this.expanded = !this.expanded;
  }

  onFilter = output<typeof this.checked>()

  onSelectStatus(status: Badges){
    this.checked = this.checked === status? '' : status;
    this.expanded = false;
    this.onFilter.emit(this.checked)
  }
}
