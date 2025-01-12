import { Component, OnInit, OnDestroy, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { QrCodeService } from '../services/qr-code.service';
import { QrCode } from '../models/qrCode.model';
import { User } from '../models/user.model';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonModal,
  IonRefresher,
  IonRefresherContent,
  IonText,
} from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { QrListComponent } from '../dashboard/qr-list/qr-list.component';
import { QrScannerComponent } from '../dashboard/qr-scanner/qr-scanner.component';
import { ClaimModalComponent } from '../dashboard/claim-modal/claim-modal.component';
import { EditModalComponent } from '../dashboard/edit-modal/edit-modal.component';
import { ItemCategory } from '../models/itemCategory.model';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    EditModalComponent,
    QrListComponent,
    CommonModule,
    ReactiveFormsModule,
    QrScannerComponent,
    ClaimModalComponent,
    IonRefresher,
    IonRefresherContent,
    IonText,
    // Angular/Ionic modules...
    // Our newly created components:
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private qrCodeService = inject(QrCodeService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  @ViewChild('editModal') editModal!: IonModal;
  @ViewChild('claimModal') claimModal!: IonModal;

  currentUser!: User | null;
  itemCategories!: ItemCategory[] | [];
  qrCodes: QrCode[] = [];
  scannedQrCode: string | null = null;

  // Track modals being open or not
  isClaimModalOpen = false;
  isEditModalOpen = false;
  selectedQrForEdit: QrCode | null = null;
  selectedQrForClaim: QrCode | null = null;

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.fetchItemCategories();

    // Subscribe to user updates
    this.authService.authUser
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
          // If user.qrCodes already loaded, set them, else fetch
          this.qrCodes = user.qrCodes || [];
          if (!user.qrCodes || user.qrCodes.length === 0) {
            this.fetchQrCodes();
          }
        }
      });
  }

  fetchQrCodes() {
    if (!this.currentUser || !this.currentUser.id) return;
    this.qrCodeService.getUserQrCodes(this.currentUser.id).subscribe({
      next: (res: any) => {
        this.qrCodes = res.items;
        if (this.currentUser) {
          this.currentUser.qrCodes = this.qrCodes;
        }
        this.authService.setUserData(this.currentUser);
        // Also update user in AuthService
      },
    });

    // Call your service...
  }

  fetchItemCategories() {
    this.qrCodeService.getItemCategories().subscribe({
      next: (res: any) => {
        this.itemCategories = res.items;
        // Also update user in AuthService
      },
    });
  }
  onQrScanned(code: string) {
    // This is fired from QrScannerComponent
    // Possibly fetch the details from the backend:
    this.qrCodeService.getQrCodeByCode(code).subscribe({
      next: (qr) => {
        this.selectedQrForClaim = qr;
        this.scannedQrCode = qr.id;
        this.claimModal.present();
      },
    });
  }

  onDeleteQrCode(qrCode: QrCode) {
    // Called when QrListComponent emits delete
    this.qrCodeService.deleteQrCode(qrCode.id).subscribe(() => {
      this.fetchQrCodes();
      this.qrCodes = this.qrCodes.filter((c) => c.id !== qrCode.id);
      this.toastService.presentToast(
        'bottom',
        'QR code deleted',
        2000,
        'tabsFooter'
      );
      // Update user in AuthService...
    });
  }

  onEditQrCodeRequest(qrCode: QrCode) {
    // Called when QrListComponent emits edit
    this.selectedQrForEdit = qrCode;
    // this.isEditModalOpen = true;
    this.editModal.present();
  }

  // Handle claim form submission from the ClaimModalComponent
  onClaimQrCode(eventData: { formData: any }) {
    const { formData } = eventData;
    console.log(formData);
    if (!this.scannedQrCode) return;
    this.qrCodeService
      .updateQrCode(
        this.scannedQrCode,
        formData.itemName,
        formData.itemDetails,
        formData.itemCategory,
        true,
        this.currentUser?.id
      )
      .subscribe(() => {
        this.fetchQrCodes();
        this.claimModal.dismiss();
        this.toastService.presentToast(
          'bottom',
          'QR code claimed',
          2000,
          'tabsFooter'
        );
      });
  }

  // Handle edit form submission from the EditModalComponent
  onSaveQrCode(eventData: { formData: any }) {
    const { formData } = eventData;
    if (!this.selectedQrForEdit) return;
    this.qrCodeService
      .updateQrCode(
        this.selectedQrForEdit.id,
        formData.itemName,
        formData.itemDetails,
        formData.itemCategory,
        formData.isClaimed,
        this.currentUser?.id
      )
      .subscribe(() => {
        this.fetchQrCodes();
        this.toastService.presentToast(
          'bottom',
          'QR code deleted',
          2000,
          'tabsFooter'
        );
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.fetchQrCodes();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
}
