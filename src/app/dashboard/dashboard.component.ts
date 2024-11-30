import { Component, OnInit } from '@angular/core';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [IonContent, IonSpinner],
})
export class DashboardComponent implements OnInit {
  isLoading: Boolean = false;
  constructor() {}

  ngOnInit() {
    console.log('Hi');
  }
}
