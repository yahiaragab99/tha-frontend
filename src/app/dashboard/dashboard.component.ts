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
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { QrListComponent } from '../dashboard/qr-list/qr-list.component';
import { QrScannerComponent } from '../dashboard/qr-scanner/qr-scanner.component';
import { ClaimModalComponent } from '../dashboard/claim-modal/claim-modal.component';
import { EditModalComponent } from '../dashboard/edit-modal/edit-modal.component';
import { ItemCategory } from '../models/itemCategory.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonButtons,
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
    // Angular/Ionic modules...
    // Our newly created components:
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private qrCodeService = inject(QrCodeService);
  private authService = inject(AuthService);

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

  ngOnInit() {
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
    if (!this.currentUser?.id) return;
    // Call your service...
    this.qrCodeService.getUserQrCodes(this.currentUser.id).subscribe({
      next: (res: any) => {
        this.qrCodes = res.items;
        // Also update user in AuthService
      },
    });
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
    this.scannedQrCode = code;
    // Possibly fetch the details from the backend:
    this.qrCodeService.getQrCodeByCode(code).subscribe({
      next: (qr) => {
        this.selectedQrForClaim = qr;
        this.claimModal.present();
      },
    });
  }

  onDeleteQrCode(qrCode: QrCode) {
    // Called when QrListComponent emits delete
    console.log(qrCode);
    this.qrCodeService.deleteQrCode(qrCode.id).subscribe(() => {
      this.fetchQrCodes();
      this.qrCodes = this.qrCodes.filter((c) => c.id !== qrCode.id);
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
    console.log(this.scannedQrCode);
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
      });
  }

  // Handle edit form submission from the EditModalComponent
  onSaveQrCode(eventData: { formData: any }) {
    const { formData } = eventData;
    console.log(formData);
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
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';

// import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
// import {
//   IonContent,
//   IonSpinner,
//   IonList,
//   IonIcon,
//   IonFab,
//   IonFabButton,
//   IonModal,
// } from '@ionic/angular/standalone';
// import {
//   FormControl,
//   FormGroup,
//   Validators,
//   FormsModule,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { addIcons } from 'ionicons';
// import { add, create, trashOutline } from 'ionicons/icons';
// // import { Router } from '@angular/router';
// import { QrCodeService } from '../services/qr-code.service';
// import { User } from '../models/user.model';
// import { AuthService } from '../services/auth.service';
// import { QrCode } from '../models/qrCode.model';
// import { CommonModule } from '@angular/common';
// import {
//   catchError,
//   EMPTY,
//   filter,
//   finalize,
//   firstValueFrom,
//   Subject,
//   takeUntil,
// } from 'rxjs';
// import { ItemCategory } from '../models/itemCategory.model';
// import * as _ from 'lodash';
// import { EditQrComponent } from './edit-qr/edit-qr.component';
// import { QrCardComponent } from './qr-card/qr-card.component';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss'],
//   standalone: true,
//   imports: [
//     IonList,
//     IonContent,
//     IonSpinner,
//     CommonModule,
//     IonIcon,
//     IonFab,
//     IonFabButton,
//     FormsModule,
//     ReactiveFormsModule,
//     QrCardComponent,
//     IonModal,
//     EditQrComponent,
//   ],
// })
// export class DashboardComponent implements OnInit, OnDestroy {
//   qrCodeService = inject(QrCodeService);
//   authService = inject(AuthService);
//   isLoading: boolean = false; // Indicates if data is loading
//   isDeleteLoading: boolean = false;
//   isEditLoading: boolean = false;
//   qrCodeIdToDelete!: string;
//   qrCodeToEdit: string | null = null;
//   currentUser!: User | null; // Holds the current authenticated user
//   noItemsFound: Boolean = false;
//   qrCodes: QrCode[] = []; // List of fetched QR codes
//   scannedQrCode: string | null = null;
//   scannedQrObject: QrCode | null = null;
//   claimQrCodeFormData!: FormGroup;
//   editQrCodeFormData!: FormGroup;
//   isClaimLoading: boolean = false;
//   itemName: string | null = null;
//   itemCategories: ItemCategory[] = [];
//   editQrCodeCode!: string | null | undefined;
//   editQrName!: string | null | undefined;
//   editQrDetails!: string | null | undefined;
//   editQrCategory!: string | null | undefined;
//   editQrCodeObject: QrCode | null = null;
//   @ViewChild('claimModal', { static: false }) claimModal!: IonModal;
//   @ViewChild('editModal', { static: false }) editModal!: IonModal;

//   private destroy$ = new Subject<void>();

//   constructor() {
//     addIcons({
//       create,
//       trashOutline,
//       add,
//     });
//   }

//   async ngOnInit() {
//     this.isLoading = true;
//     this.currentUser = this.authService.getCurrentUser();
//     this.itemCategories = await firstValueFrom(
//       this.qrCodeService.getItemCategories()
//     );

//     this.claimQrCodeFormData = new FormGroup({
//       itemName: new FormControl('', [Validators.required]),
//       itemDetails: new FormControl(''),
//       itemCategory: new FormControl(''),
//       isClaimed: new FormControl(false),
//     });

//     this.authService.authUser
//       .pipe(
//         takeUntil(this.destroy$),
//         filter((user) => user !== null) // Only proceed with a valid user
//       )
//       .subscribe((user) => {
//         if (user && (!user.qrCodes || user.qrCodes.length === 0)) {
//           this.fetchQrCodes();
//         } else if (user?.qrCodes) {
//           this.qrCodes = _.uniqBy(user.qrCodes, 'id');
//         }
//       });
//     // console.log(this.qrCodes);
//     this.isLoading = false;
//   }

//   async openModal(modal: IonModal) {
//     if (modal) {
//       await modal.present();
//     } else {
//       console.error('Modal reference is not available');
//     }
//   }
//   async closeModal(modal: IonModal) {
//     if (modal) {
//       await modal.dismiss();
//     } else {
//       console.error('Modal reference is not available');
//     }
//   }

//   checkPermission = async () => {
//     try {
//       const status = await BarcodeScanner.checkPermission({ force: true });
//       if (status.granted) {
//         return true;
//       } else return false;
//     } catch (error) {
//       console.log(error);
//       throw new Error();
//     }
//   };
//   async startScan() {
//     // console.log(this.authService.getCurrentUser()?.email);
//     const permission = await this.checkPermission();
//     if (!permission) return;

//     await BarcodeScanner.hideBackground();

//     document.querySelector('body')?.classList.add('scanner-active');

//     const result = await BarcodeScanner.startScan();
//     if (result.hasContent) {
//       this.scannedQrCode = result.content.split('=')[1];
//       console.log(this.scannedQrCode);

//       this.isLoading = false;
//       this.scannedQrObject = await firstValueFrom(
//         this.qrCodeService.getQrCodeByCode(this.scannedQrCode)
//       );
//       console.log(this.scannedQrObject);

//       await this.openModal(this.claimModal);
//       if (this.scannedQrObject?.isClaimed) {
//         console.log('already claimed');
//         this.isLoading = false;
//         return;
//       } else if (!this.scannedQrObject?.isClaimed) {
//       }

//       this.isLoading = false;

//       BarcodeScanner.showBackground();
//       document.querySelector('body')?.classList.remove('scanner-active');
//     }
//   }

//   stopScan = async () => {
//     try {
//       BarcodeScanner.showBackground();
//       await BarcodeScanner.stopScan();
//       document.querySelector('body')?.classList.remove('scanner-active');
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   claimQrCode() {
//     if (!this.claimQrCodeFormData.valid) return;

//     this.isClaimLoading = true;
//     const itemName = this.claimQrCodeFormData.value.itemName;
//     const itemDetails = this.claimQrCodeFormData.value.itemDetails;
//     const itemCategory = this.claimQrCodeFormData.value.itemCategory;
//     const isClaimed = true;
//     const userEmail = this.authService.getCurrentUser()?.email;
//     const qrCode = this.scannedQrCode;
//     // console.log(itemCategory);
//     // console.log(this.claimQrCodeFormData.value);
//     this.qrCodeService
//       .updateQrCode(
//         qrCode,
//         itemName,
//         itemDetails,
//         itemCategory,
//         isClaimed,
//         userEmail
//       )
//       .subscribe((data) => {
//         // console.log(data);
//         this.isClaimLoading = false;
//         this.closeModal(this.claimModal);
//         this.fetchQrCodes();
//       });
//   }
//   fetchQrCodes(): void {
//     // Remove userId parameter
//     // Use getCurrentUser to dynamically get the current user
//     const currentUser = this.authService.getCurrentUser();
//     // console.log(currentUser);
//     // Early return if no user is found
//     if (!currentUser || !currentUser.id) {
//       console.warn('No authenticated user found');
//       this.isLoading = false;
//       this.noItemsFound = true;
//       return;
//     }

//     // Use the user ID from getCurrentUser
//     this.isLoading = true;
//     this.qrCodeService
//       .getUserQrCodes(currentUser.id) // Pass user ID from getCurrentUser
//       .pipe(
//         catchError((err) => {
//           console.error('Error fetching QR Codes:', err);
//           this.isLoading = false;
//           this.noItemsFound = true;
//           return EMPTY;
//         })
//       )
//       .subscribe({
//         next: (res: any) => {
//           if (!res.items || res.items.length === 0) {
//             this.noItemsFound = true;
//           } else {
//             const lostQrsCasted: QrCode[] = res.items.map(
//               (qrCode: {
//                 id: string;
//                 userId: string;
//                 code: string;
//                 itemName: any;
//                 itemDetails?: string;
//                 itemCategory?: string;
//               }) =>
//                 ({
//                   id: qrCode.id,
//                   itemName: qrCode.itemName,
//                   userId: qrCode.userId,
//                   code: qrCode.code,
//                   itemDetails: qrCode.itemDetails,
//                   itemCategory: qrCode.itemCategory,
//                   user: currentUser, // Use the current user from getCurrentUser
//                 } as QrCode)
//             );

//             // Update user in auth service
//             const updatedUser: User = {
//               ...currentUser,
//               qrCodes: _.uniqBy([...lostQrsCasted], 'id'),
//             };

//             this.authService.setUserData(updatedUser);
//             this.qrCodes = lostQrsCasted;
//             console.log(this.qrCodes);
//             this.noItemsFound = false;
//           }

//           this.isLoading = false;
//         },
//       });
//   }

//   deleteQrCode(qrCode: QrCode) {
//     // Get the current user from the AuthService
//     // const currentUser = this.authService.getCurrentUser();

//     // Early return if no user is authenticated
//     if (!this.currentUser) {
//       console.error('No authenticated user found');
//       return;
//     }

//     // Set loading state
//     this.isDeleteLoading = true;
//     this.qrCodeIdToDelete = qrCode.id;

//     // Call the delete service method
//     this.qrCodeService
//       .deleteQrCode(qrCode.id!)
//       .pipe(
//         // Error handling
//         catchError((err) => {
//           console.error('Error deleting QR Code:', err);
//           this.isDeleteLoading = false;
//           // Optionally show user-friendly error toast
//           return EMPTY;
//         }),
//         // Finalize ensures loading state is reset even if error occurs
//         finalize(() => {
//           this.isDeleteLoading = false;
//         })
//       )
//       .subscribe({
//         next: () => {
//           // Filter out the deleted QR code from local array
//           this.qrCodes = this.qrCodes.filter((c) => c.id !== qrCode.id);

//           // Update the user's QR codes in the authentication service
//           const updatedUser: User = {
//             id: this.currentUser?.id,
//             email: this.currentUser?.email,
//             profile_pic_url: this.currentUser?.profile_pic_url,
//             firstName: this.currentUser?.firstName,
//             lastName: this.currentUser?.lastName,
//             phoneNumber: this.currentUser?.phoneNumber,
//             qrCodes: this.qrCodes,
//           };

//           // Update user data in AuthService (which also updates localStorage)
//           this.authService.setUserData(updatedUser);

//           // Optionally show success toast
//         },
//       });
//   }

//   async editQrCode(qrCode?: QrCode) {
//     if (!this.currentUser) {
//       console.error('No authenticated user found');
//       return;
//     }
//     // this.qrCodeToEdit = qrCode.id;
//     if (qrCode) {
//       this.editQrCodeCode = qrCode.code;
//       this.editQrCodeFormData = new FormGroup({
//         itemName: new FormControl(qrCode.itemName, [Validators.required]),
//         itemDetails: new FormControl(qrCode.itemDetails),
//         itemCategory: new FormControl(qrCode.itemCategory),
//         isClaimed: new FormControl(true),
//       });
//       await this.openModal(this.editModal);
//     } else {
//       this.isEditLoading = true;
//       this.qrCodeService
//         .updateQrCode(
//           this.editQrCodeCode,
//           this.editQrCodeFormData.value.itemName,
//           this.editQrCodeFormData.value.itemDetails!,
//           this.editQrCodeFormData.value.itemCategory!,
//           this.editQrCodeFormData.value.isClaimed!,
//           this.currentUser.email
//         )
//         .subscribe({
//           next: (data) => {
//             this.isEditLoading = false;
//             this.closeModal(this.editModal);
//             this.fetchQrCodes();
//           },
//         });
//     }
//   }

//   // trackItems(index: number, qrCode: QrCode) {
//   //   return qrCode.id;
//   // }
//   // trackCatItems(index: number, itemCat: ItemCategory) {
//   //   return itemCat.id;
//   // }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }
// }
