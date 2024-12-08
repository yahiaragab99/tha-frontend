import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import {
  IonContent,
  IonSpinner,
  IonCard,
  IonList,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { addIcons } from 'ionicons';
import { add, create, trashOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { QrCodeService } from '../services/qr-code.service';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { QrCode } from '../models/qrCode.model';
import { CommonModule } from '@angular/common';
import {
  catchError,
  EMPTY,
  filter,
  finalize,
  firstValueFrom,
  Subject,
  takeUntil,
} from 'rxjs';
import { ItemCategory } from '../models/itemCategory.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonButton,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonList,
    IonCard,
    IonContent,
    IonSpinner,
    CommonModule,
    IonIcon,
    IonFab,
    IonFabButton,
    IonModal,
    FormsModule,
    ReactiveFormsModule,
    IonInput,
    IonSelect,
    IonSelectOption,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  qrCodeService = inject(QrCodeService);
  authService = inject(AuthService);
  isLoading: boolean = false; // Indicates if data is loading
  isDeleteLoading: boolean = false;
  isEditLoading: boolean = false;
  qrCodeIdToDelete: string | null = null;
  qrCodeToEdit: string | null = null;
  currentUser!: User | null; // Holds the current authenticated user
  noItemsFound: Boolean = false;
  qrCodes: QrCode[] = []; // List of fetched QR codes
  scannedQrCode: string | null = null;
  scannedQrObject: QrCode | null = null;
  claimQrCodeFormData!: FormGroup;
  isClaimLoading: boolean = false;
  itemName: string | null = null;
  itemCategories: ItemCategory[] = [];
  @ViewChild('modal', { static: false }) modal?: IonModal;

  private destroy$ = new Subject<void>();

  constructor() {
    addIcons({
      create,
      trashOutline,
      add,
    });
  }

  async ngOnInit() {
    this.isLoading = true;
    this.currentUser = this.authService.getCurrentUser();
    this.itemCategories = await firstValueFrom(
      this.qrCodeService.getItemCategories()
    );
    console.log(this.itemCategories);
    this.claimQrCodeFormData = new FormGroup({
      itemName: new FormControl('', [Validators.required]),
      itemDetails: new FormControl(''),
      itemCategory: new FormControl(''),
      isClaimed: new FormControl(false),
    });
    this.authService.authUser
      .pipe(
        takeUntil(this.destroy$),
        filter((user) => user !== null) // Only proceed with a valid user
      )
      .subscribe((user) => {
        if (user && (!user.qrCodes || user.qrCodes.length === 0)) {
          this.fetchQrCodes();
        } else if (user?.qrCodes) {
          this.qrCodes = user.qrCodes;
        }
      });
    this.isLoading = false;
  }

  async openModal() {
    if (this.modal) {
      await this.modal.present();
    } else {
      console.error('Modal reference is not available');
    }
  }
  async closeModal() {
    if (this.modal) {
      await this.modal.dismiss();
    } else {
      console.error('Modal reference is not available');
    }
  }

  checkPermission = async () => {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  };
  startScan = async () => {
    try {
      // console.log(this.authService.getCurrentUser()?.email);
      const permission = await this.checkPermission();
      if (!permission) return;

      await BarcodeScanner.hideBackground();

      document.querySelector('body')?.classList.add('scanner-active');

      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        this.scannedQrCode = result.content.split('=')[1];
        console.log(this.scannedQrCode);

        if (this.scannedQrCode) {
          this.isLoading = true;
          this.scannedQrObject = await firstValueFrom(
            this.qrCodeService.getQrCodeByCode(this.scannedQrCode)
          );
          console.log(this.scannedQrObject);

          await this.openModal();
          if (this.scannedQrObject?.isClaimed) {
            this.isLoading = false;
            return;
          } else if (!this.scannedQrObject?.isClaimed) {
          }

          this.isLoading = false;
        }
        BarcodeScanner.showBackground();
        document.querySelector('body')?.classList.remove('scanner-active');
      }
    } catch (error) {
      console.log(error);
      await this.stopScan();
      throw new Error();
    }
  };

  stopScan = async () => {
    try {
      BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
      document.querySelector('body')?.classList.remove('scanner-active');
    } catch (error) {
      console.log(error);
    }
  };
  claimQrCode() {
    if (!this.claimQrCodeFormData.valid) return;

    this.isClaimLoading = true;
    const itemName = this.claimQrCodeFormData.value.itemName;
    const itemDetails = this.claimQrCodeFormData.value.itemDetails;
    const itemCategory = this.claimQrCodeFormData.value.itemCategory;
    const isClaimed = true;
    const userEmail = this.authService.getCurrentUser()?.email;
    const qrCode = this.scannedQrCode;
    console.log(itemCategory);
    console.log(this.claimQrCodeFormData.value);
    this.qrCodeService
      .updateQrCode(
        qrCode,
        itemName,
        itemDetails,
        itemCategory,
        isClaimed,
        userEmail
      )
      .subscribe((data) => {
        console.log(data);
        this.isClaimLoading = false;
        this.closeModal();
        this.fetchQrCodes();
      });
  }
  private fetchQrCodes(): void {
    // Remove userId parameter
    // Use getCurrentUser to dynamically get the current user
    const currentUser = this.authService.getCurrentUser();
    console.log(currentUser);
    // Early return if no user is found
    if (!currentUser || !currentUser.id) {
      console.warn('No authenticated user found');
      this.isLoading = false;
      this.noItemsFound = true;
      return;
    }

    // Use the user ID from getCurrentUser
    this.isLoading = true;
    this.qrCodeService
      .getUserQrCodes(currentUser.id) // Pass user ID from getCurrentUser
      .pipe(
        catchError((err) => {
          console.error('Error fetching QR Codes:', err);
          this.isLoading = false;
          this.noItemsFound = true;
          return EMPTY;
        })
      )
      .subscribe({
        next: (res: any) => {
          if (!res || res.length === 0) {
            this.noItemsFound = true;
          } else {
            const lostQrsCasted: QrCode[] = res.map(
              (qrCode: {
                id: string;
                userId: string;
                code: string;
                itemName: any;
                itemDetails?: string;
                itemCategory?: string;
              }) =>
                ({
                  id: qrCode.id,
                  itemName: qrCode.itemName,
                  userId: qrCode.userId,
                  code: qrCode.code,
                  itemDetails: qrCode.itemDetails,
                  itemCategory: qrCode.itemCategory,
                  user: currentUser, // Use the current user from getCurrentUser
                } as QrCode)
            );

            // Update user in auth service
            const updatedUser: User = {
              ...currentUser,
              qrCodes: [...(currentUser.qrCodes || []), ...lostQrsCasted],
            };

            this.authService.setUserData(updatedUser);
            this.qrCodes = lostQrsCasted;
            this.noItemsFound = false;
          }

          this.isLoading = false;
        },
      });
  }

  deleteQrCode(qrCode: QrCode) {
    // Get the current user from the AuthService
    // const currentUser = this.authService.getCurrentUser();

    // Early return if no user is authenticated
    if (!this.currentUser) {
      console.error('No authenticated user found');
      return;
    }

    // Set loading state
    this.isDeleteLoading = true;
    this.qrCodeIdToDelete = qrCode.id;

    // Call the delete service method
    this.qrCodeService
      .deleteQrCode(qrCode.id!)
      .pipe(
        // Error handling
        catchError((err) => {
          console.error('Error deleting QR Code:', err);
          this.isDeleteLoading = false;
          // Optionally show user-friendly error toast
          return EMPTY;
        }),
        // Finalize ensures loading state is reset even if error occurs
        finalize(() => {
          this.isDeleteLoading = false;
        })
      )
      .subscribe({
        next: () => {
          // Filter out the deleted QR code from local array
          this.qrCodes = this.qrCodes.filter((c) => c.id !== qrCode.id);

          // Update the user's QR codes in the authentication service
          const updatedUser: User = {
            id: this.currentUser?.id,
            email: this.currentUser?.email,
            profile_pic_url: this.currentUser?.profile_pic_url,
            firstName: this.currentUser?.firstName,
            lastName: this.currentUser?.lastName,
            phoneNumber: this.currentUser?.phoneNumber,
            qrCodes: this.qrCodes,
          };

          // Update user data in AuthService (which also updates localStorage)
          this.authService.setUserData(updatedUser);

          // Optionally show success toast
        },
      });
  }

  editQrCode(qrCode: QrCode) {
    if (!this.currentUser) {
      console.error('No authenticated user found');
      return;
    }
    this.isEditLoading = true;
    this.qrCodeToEdit = qrCode.id;
  }

  // trackItems(index: number, qrCode: QrCode) {
  //   return qrCode.id;
  // }
  // trackCatItems(index: number, itemCat: ItemCategory) {
  //   return itemCat.id;
  // }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
