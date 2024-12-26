import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonIcon,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { addIcons } from 'ionicons';
import { mail, person, call, pricetags, create, logOut } from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonItem,
    IonContent,
    IonLabel,
    IonList,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
  ],
})
export class ProfileComponent implements OnInit {
  currentUser!: User | null;
  isLoading: boolean = false;
  authService = inject(AuthService);
  constructor() {
    addIcons({ person, mail, call, pricetags, create, logOut });
  }

  ngOnInit() {
    this.isLoading = true;
    this.currentUser = this.authService.getCurrentUser();
  }

  logout() {
    // this.isLoading = true;
    this.authService.signOut();
  }
}
