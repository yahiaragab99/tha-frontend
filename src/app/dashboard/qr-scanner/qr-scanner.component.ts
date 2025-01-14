import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
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
export class QrScannerComponent implements OnChanges {
  // scannerActive = false;
  @Output() scanned = new EventEmitter<string>();
  @Output() openedClaimModal = new EventEmitter<void>();
  @Input() scanEvent = false;
  // @Input() startScan = false;

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['scanEvent'] && this.scanEvent) {
      await this.startScan();
    }
  }
  constructor() {
    addIcons({ add });
  }

  async onOpenClaimModal() {
    this.openedClaimModal.emit();
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
}
