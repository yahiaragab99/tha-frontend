import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { QrCode } from 'src/app/models/qrCode.model';
import {
  IonModal,
  IonSpinner,
  IonList,
  IonItem,
  IonInput,
  IonSelect,
  IonButton,
  IonSelectOption,
  IonHeader,
  IonToolbar,
  IonLabel,
  IonTitle,
  IonButtons,
  IonContent,
} from '@ionic/angular/standalone';
import { ItemCategory } from 'src/app/models/itemCategory.model';
import { QrCodeService } from 'src/app/services/qr-code.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-claim-by-code-modal',
  templateUrl: './claim-by-code-modal.component.html',
  styleUrls: ['./claim-by-code-modal.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButtons,
    IonTitle,
    IonLabel,
    IonToolbar,
    IonHeader,
    IonModal,
    IonSpinner,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonButton,
    IonSelectOption,
    ReactiveFormsModule,
  ],
})
export class ClaimByCodeModalComponent {
  @Input() codeClaimModalRef!: IonModal;
  @Input() itemCategories: ItemCategory[] = [];
  @Output() claim = new EventEmitter<{ formData: any }>();

  refCodeForm!: FormGroup;
  claimQrCodeForm!: FormGroup;
  isCheckLoading: boolean = false;
  isClaimMode: boolean = false;
  private _qrcodeService = inject(QrCodeService);
  private _toastService = inject(ToastService);
  private _qrCodeToClaim!: QrCode;
  constructor() {
    this.refCodeForm = new FormGroup({
      refCode: new FormControl('', [Validators.required]),
    });
    this.claimQrCodeForm = new FormGroup({
      itemName: new FormControl('', [Validators.required]),
      itemDetails: new FormControl(''),
      itemCategory: new FormControl(''),
    });
  }

  closeModal() {
    if (this.codeClaimModalRef) {
      this.codeClaimModalRef.dismiss();
    }
  }

  checkQrCode() {
    this.isCheckLoading = true;
    if (!this.refCodeForm.valid) return;

    this._qrcodeService
      .getQrCodeByCode(this.refCodeForm.value.refCode)
      .subscribe({
        next: (qrCode: QrCode) => {
          this._qrCodeToClaim = qrCode;
          if (!qrCode.userId && !qrCode.isClaimed) {
            this._toastService.presentToast(
              'bottom',
              'QR code is available',
              2000,
              'tabsFooter'
            );
            this.isClaimMode = true;
            this.isCheckLoading = false;
            return;
          } else {
            this._toastService.presentToast(
              'bottom',
              'QR code is not available',
              2000,
              'tabsFooter'
            );
            this.isClaimMode = false;
            this.isCheckLoading = false;
            return;
          }
        },
        error: (err) => {
          this._toastService.presentToast(
            'bottom',
            err.error.message,
            2000,
            'tabsFooter'
          );
          this.isCheckLoading = false;
        },
      });
  }

  submitClaim() {
    if (!this.claimQrCodeForm.valid) return;
    this.isCheckLoading = true;
    this._toastService.presentToast(
      'bottom',
      'QR code claimed successfully',
      2000,
      'tabsFooter'
    );
    const formData = {
      id: this._qrCodeToClaim.id,
      ...this.claimQrCodeForm.value,
      isClaimed: true,
    };
    this.claim.emit({ formData });
    this.closeModal();
    this.isClaimMode = false;
    this.isCheckLoading = false;
  }
}
