import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss'],
  standalone: true,
  imports: [IonFab, IonFabButton, IonIcon],
})
export class QrScannerComponent implements OnDestroy {
  @Output() scanned = new EventEmitter<string>();

  constructor() {
    addIcons({ add });
  }
  async startScan() {
    // Check permission, hide background, etc.
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (!status.granted) return;

    await BarcodeScanner.hideBackground();
    document.body.classList.add('scanner-active');

    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      // Assuming your content is something like "qrCode=12345"
      const qrCodeValue = result.content.split('=')[1];
      this.scanned.emit(qrCodeValue);
      await this.stopScan();
    }
  }

  async stopScan() {
    await BarcodeScanner.showBackground();
    await BarcodeScanner.stopScan();
    document.body.classList.remove('scanner-active');
  }

  ngOnDestroy() {
    // Make sure to stop scanning if component destroyed
    this.stopScan();
  }
}
