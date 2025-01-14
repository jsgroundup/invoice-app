import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('issueDateInput', { static: true }) input: ElementRef | undefined;
  @ViewChild('calendar', { static: true }) calendar: ElementRef | undefined;
  @ViewChild('calendarDays', { static: true }) calendarDays:
    | ElementRef
    | undefined;
  @ViewChild('calendarTitle', { static: true }) calendarTitle:
    | ElementRef
    | undefined;

  currentDate: Date = new Date();
  selectedDate: string = '';
  isCalendarHidden: boolean = true;

  // Array to hold the calendar days
  daysInMonth: number[] = [];

  constructor() {}

  ngOnInit(): void {
    this.renderCalendar();
  }

  renderCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Update calendar title
    if (this.calendarTitle?.nativeElement) {
      this.calendarTitle.nativeElement.textContent = `${this.currentDate.toLocaleString(
        'default',
        { month: 'long' }
      )} ${year}`;
    }

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = [];

    // Fill empty days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      this.daysInMonth.push(0); // Push empty days
    }

    // Add days of the current month
    for (let i = 1; i <= lastDate; i++) {
      this.daysInMonth.push(i);
    }
  }

  selectDay(day: number, year: number, month: number): void {
    if (day === 0) return; // Skip empty days

    this.selectedDate = `${day} ${this.currentDate.toLocaleString('default', {
      month: 'short',
    })} ${year}`;

    // Set the input value
    if (this.input?.nativeElement) {
      this.input.nativeElement.value = this.selectedDate;
    }

    // Close the calendar
    this.isCalendarHidden = true;
  }

  toggleCalendar(): void {
    this.isCalendarHidden = !this.isCalendarHidden;
    this.renderCalendar();
  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.renderCalendar();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.renderCalendar();
  }

  closeCalendar(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.date-picker-container') &&
      this.calendar?.nativeElement
    ) {
      this.isCalendarHidden = true;
    }
  }
}
