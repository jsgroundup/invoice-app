import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.css',
})
export class DropdownComponent {
  @Input() selectedOption: string = 'Select an option';
  @Output() onSelection: EventEmitter<number> = new EventEmitter<number>();

  dropdownOpen: boolean = false;
  options: string[] = ['Net 1 Day', 'Net 7 Days', 'Net 14 Days', 'Net 30 Days'];
  optionValues: { [k: string]: number } = {
    'Net 1 Day': 1,
    'Net 7 Days': 7,
    'Net 14 Days': 14,
    'Net 30 Days': 30,
  };

  onToggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onSelectOption(option: string) {
    this.dropdownOpen = false;
    this.selectedOption = option;
    this.onSelection.emit(this.optionValues[option]);
  }
}
