import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[app-header]',
  standalone: true,
  imports: [IconComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  theme: ThemeMode = 'light'

  get isLightMode(){
    return this.theme === 'light';
  }

  toggleTheme(){
    const theme: ThemeMode = this.theme = this.isLightMode ? 'dark' : 'light';
    localStorage.setItem('theme',theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  constructor(){
    let theme = localStorage.getItem('theme') as ThemeMode|null;
    if(theme&&['dark'].includes(theme)){
      this.theme = theme;
      document.documentElement.setAttribute('data-theme', theme);

    }
  }
}

type ThemeMode = 'dark'|'light'
