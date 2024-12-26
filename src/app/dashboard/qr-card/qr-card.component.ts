import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { create, trashOutline } from 'ionicons/icons';
import { QrCode } from 'src/app/models/qrCode.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { QrCodeService } from 'src/app/services/qr-code.service';

@Component({
  selector: 'app-qr-card',
  templateUrl: './qr-card.component.html',
  styleUrls: ['./qr-card.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class QrCardComponent {
  currentUser!: User | null;
  authService = inject(AuthService);
  qrCodeService = inject(QrCodeService);

  editQrCodeCode!: string | null | undefined;
  editQrName!: string | null | undefined;
  editQrDetails!: string | null | undefined;
  editQrCategory!: string | null | undefined;
  editQrCodeObject: QrCode | null = null;

  isEditLoading: boolean = false;

  @Input() qrCode!: QrCode;
  @Input() isDeleteLoading!: boolean;
  @Input() qrCodeIdToDelete!: string;

  @Output() editClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<void>();

  constructor() {
    addIcons({ create, trashOutline });
  }
}
