import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

const SCAN_INSTRUCTIONS = 'Scan the code on the sticker.';
// const SCAN_BUTTON = true;
// const SCAN_TEXT = 'Scan';
@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss'],
  standalone: true,
  imports: [IonFab, IonFabButton, IonIcon],
})
export class QrScannerComponent implements OnDestroy {
  // scannerActive = false;
  @Output() scanned = new EventEmitter<string>();

  constructor() {
    addIcons({ add });
  }

  async startScan() {
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: 17,
        scanInstructions: SCAN_INSTRUCTIONS,
      });
      if (result.ScanResult) {
        const qrCodeValue = result.ScanResult.split('=')[1];
        // console.log(qrCodeValue);
        this.scanned.emit(qrCodeValue);
      }
      return result.ScanResult;
    } catch (error) {
      throw new Error();
    }
  }

  // async stopScan() {
  //   this.scannerActive = false; // Hide scanner UI
  //   document.body.classList.remove('scanner-active');
  //   document.body.classList.remove('hide-other-components'); // Show UI components again
  //   // await BarcodeScanner.stopScan();
  // }

  ngOnDestroy() {
    // Make sure to stop scanning if component destroyed
    // this.stopScan();
    console.log('destroy');
  }
}
