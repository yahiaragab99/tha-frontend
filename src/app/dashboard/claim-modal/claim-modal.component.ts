import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-claim-modal',
  templateUrl: './claim-modal.component.html',
  styleUrls: ['./claim-modal.component.scss'],
  standalone: true,
  imports: [
    IonModal,
    IonSpinner,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonButton,
    IonSelectOption,
  ],
})
export class ClaimModalComponent {
  @Input() qrCode?: QrCode | null; // or just the code string
  @Input() isLoading: boolean = false;
  @Output() claim = new EventEmitter<{ formData: any }>();

  // Usually best to define the form in OnInit, but you can do it inline
  claimQrCodeForm = new FormGroup({
    itemName: new FormControl('', [Validators.required]),
    itemDetails: new FormControl(''),
    itemCategory: new FormControl(''),
  });

  isClaimLoading = false;

  // Reference to IonModal if you want two-way control from outside
  @Input() claimModalRef!: IonModal;

  async submitClaim() {
    if (!this.claimQrCodeForm.valid) return;
    this.isClaimLoading = true;

    // Gather the form data
    const formData = {
      ...this.claimQrCodeForm.value,
      isClaimed: true,
    };

    // Emit it to the parent
    this.claim.emit({ formData });

    // Optionally close the modal
    await this.closeModal();
  }

  async closeModal() {
    if (this.claimModalRef) {
      await this.claimModalRef.dismiss();
    }
  }
}
