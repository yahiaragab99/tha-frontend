import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QrCode } from 'src/app/models/qrCode.model';
import { IonList } from '@ionic/angular/standalone';
import { QrCardComponent } from '../qr-card/qr-card.component';

@Component({
  selector: 'app-qr-list',
  templateUrl: './qr-list.component.html',
  styleUrls: ['./qr-list.component.scss'],
  standalone: true,
  imports: [IonList, QrCardComponent],
})
export class QrListComponent {
  @Input() qrCodes: QrCode[] = [];
  @Output() delete = new EventEmitter<QrCode>();
  @Output() edit = new EventEmitter<QrCode>();

  onDelete(qrCode: QrCode) {
    this.delete.emit(qrCode);
  }

  onEdit(qrCode: QrCode) {
    this.edit.emit(qrCode);
  }
}
