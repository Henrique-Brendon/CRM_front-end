import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from './components/default-login-layout/default-login-layout.component';

@Component({
  selector: 'app-root',
  imports: [
    DefaultLoginLayoutComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend-crm';
}
