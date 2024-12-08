import { Component, inject, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { QrCodeService } from '../services/qr-code.service';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonContent,
  IonSpinner,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { barcode } from 'ionicons/icons';
import { QrCode } from '../models/qrCode.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-claim-qr-code',
  templateUrl: './claim-qr-code.component.html',
  styleUrls: ['./claim-qr-code.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonIcon,
    IonFabButton,
    IonFab,
    IonContent,
    IonSpinner,
    IonList,
    IonButton,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ClaimQrCodeComponent implements OnInit {
  isLoading: boolean = false;
  scannedResult!: string;
  scannedQrCode!: string;
  qrCode: QrCode | null = null;
  qrCodeService = inject(QrCodeService);
  authService = inject(AuthService);
  claimQrCodeFormData!: FormGroup;
  isClaimLoading: boolean = false;
  constructor() {
    addIcons({
      add,
    });
  }

  async ngOnInit() {
    this.claimQrCodeFormData = new FormGroup({
      itemName: new FormControl('', [Validators.required]),
      itemDetails: new FormControl(''),
      itemCategory: new FormControl(''),
      isClaimed: new FormControl(false),
    });
  }

  claimQrCode() {
    if (!this.claimQrCodeFormData.valid) return;
    this.isClaimLoading = true;
    // const itemName = this.claimQrCodeFormData.value.itemName;
    // const itemDetails = this.claimQrCodeFormData.value.itemDetails;
    // const itemCategory = this.claimQrCodeFormData.value.itemCategory;
    // const isClaimed = true;
    // const userEmail = this.authService.getCurrentUser()?.email;
    console.log(this.claimQrCodeFormData.value);
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
        this.scannedResult = result.content;
        this.scannedQrCode = this.scannedResult.split('=')[1];
        console.log(this.scannedQrCode);

        if (this.scannedQrCode) {
          this.isLoading = true;
          this.qrCodeService
            .getQrCodeByCode(this.scannedQrCode)
            .subscribe((data: QrCode) => {
              if (!data) return;
              this.qrCode = data;
            });
          if (this.qrCode?.isClaimed) {
            this.scannedResult = 'This QR Code has already been claimed';
            this.isLoading = false;
            return;
          } else if (!this.qrCode?.isClaimed) {
            this.scannedResult = 'This QR Code has not been claimed';
            // await this.claimQrCode();
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
}
