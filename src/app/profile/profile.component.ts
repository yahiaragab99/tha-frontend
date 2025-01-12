import {
  Component,
  inject,
  OnChanges,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonModal,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { addIcons } from 'ionicons';
import { mail, person, call, pricetags, create, logOut } from 'ionicons/icons';
import { ProfileEditModalComponent } from './profile-edit-modal/profile-edit-modal.component';
import { ToastService } from '../services/toast.service';

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
    IonModal,
    CommonModule,
    ProfileEditModalComponent,
  ],
})
export class ProfileComponent implements OnInit {
  currentUser!: User | null;
  isLoading: boolean = false;
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);

  @ViewChild('editProfileModal') editProfileModal!: IonModal;
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

  openEditModal() {
    this.editProfileModal.present();
  }

  onSaveProfile(eventData: { formData: any }) {
    const { formData } = eventData;
    const userId = this.currentUser?.id;
    formData.id = userId;
    this.authService.updateUser(formData).subscribe({
      next: (res) => {
        this.authService.getUser(userId).subscribe({
          next: (updatedUser: any) => {
            this.authService.setUserData(updatedUser);
            this.currentUser = updatedUser.user;
            console.log(this.currentUser);
            this.cdr.detectChanges();
            // this.currentUser = this.authService.getCurrentUser();
            this.editProfileModal.dismiss();
            this.toastService.presentToast(
              'bottom',
              'Profile updated',
              2000,
              'tabsFooter'
            );
          },
        });
      },
    });
  }
}
