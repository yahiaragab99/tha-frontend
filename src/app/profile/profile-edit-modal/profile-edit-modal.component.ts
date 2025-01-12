import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/models/user.model';
import {
  IonHeader,
  IonInput,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonItem,
  IonButtons,
  IonSpinner,
  IonModal,
} from '@ionic/angular/standalone';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-profile-edit-modal',
  templateUrl: './profile-edit-modal.component.html',
  styleUrls: ['./profile-edit-modal.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [
    IonHeader,
    IonInput,
    IonToolbar,
    IonTitle,
    IonButton,
    IonContent,
    IonItem,
    IonButtons,
    IonSpinner,
    IonModal,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class ProfileEditModalComponent implements OnInit {
  @Input() userData?: User | null;
  @Input() editProfileModalRef!: IonModal;
  @Output() save = new EventEmitter<{ formData: any }>();

  isEditLoading: boolean = false;
  constructor() {}

  editProfileForm = new FormGroup({
    firstName: new FormControl('', []),
    lastName: new FormControl('', []),
    email: new FormControl('', []),
    phoneNumber: new FormControl('', []),
  });
  async ngOnInit() {
    if (this.userData) {
      this.editProfileForm.patchValue({
        firstName: this.userData.firstName,
        lastName: this.userData.lastName,
        email: this.userData.email,
        phoneNumber: this.userData.phoneNumber,
      });
    }
  }

  async submitEdit() {
    if (!this.editProfileForm.valid) return;
    this.isEditLoading = true;
    const formData = {
      ...this.editProfileForm.value,
    };
    this.save.emit({ formData });
    await this.closeModal();
  }

  async closeModal() {
    if (this.editProfileModalRef) {
      await this.editProfileModalRef.dismiss();
    }
  }
}
