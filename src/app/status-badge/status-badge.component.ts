import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'status-badge',
  standalone: true,
  imports: [],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css'
})
export class StatusBadgeComponent {
  @HostBinding('class') get className(){
    return this.badge
  }
  @Input({required: true}) badge!: 'paid'|'pending'|'draft';
}

export type Badges = 'paid' | 'pending' | 'draft';
