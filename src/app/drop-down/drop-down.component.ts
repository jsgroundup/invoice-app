import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.css',
})
export class DropdownComponent {
  dropdownOpen: boolean = false;
  selectedOption: string = 'Select an option';
  options: string[] = ['Net 1 Day', 'Net 7 Days', 'Net 14 Days', 'Net 30 Days'];

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.dropdownOpen = false;
  }
}
