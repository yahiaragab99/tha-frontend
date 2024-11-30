import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  private authService = inject(AuthService);
  constructor() {
    this.checkEmail('ragabyahia+test7@yahoo.com');
  }

  checkEmail(email: string) {
    this.authService.isEmailRegistered(email).subscribe((data) => {
      console.log(data);
    });
  }
}
