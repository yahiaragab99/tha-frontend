import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonModal,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-main-claim-modal',
  templateUrl: './main-claim-modal.component.html',
  styleUrls: ['./main-claim-modal.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonModal,
    IonButton,
    ReactiveFormsModule,
  ],
})
export class MainClaimModalComponent {
  @Input() claimModalRef!: IonModal;
  @Output() claimByScan = new EventEmitter<string>();
  @Output() claimByRef = new EventEmitter<string>();

  constructor() {}

  closeModal() {
    if (this.claimModalRef) {
      this.claimModalRef.dismiss();
    }
  }

  onClaimByScan() {
    this.claimByScan.emit();
  }

  onClaimByRef() {
    this.claimByRef.emit();
  }
}
