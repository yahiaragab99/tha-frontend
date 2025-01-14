import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'app-claim-modal',
  templateUrl: './claim-modal.component.html',
  styleUrls: ['./claim-modal.component.scss'],
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
export class ClaimModalComponent implements OnInit {
  @Input() qrCode?: QrCode | null; // or just the code string
  @Input() isLoading: boolean = false;
  @Output() claim = new EventEmitter<{ formData: any }>();
  @Input() itemCategories: ItemCategory[] = [];
  @Input() claimModalRef!: IonModal;

  // Usually best to define the form in OnInit, but you can do it inline
  claimQrCodeForm = new FormGroup({
    itemName: new FormControl('', [Validators.required]),
    itemDetails: new FormControl(''),
    itemCategory: new FormControl(''),
  });

  isClaimLoading = false;

  async ngOnInit() {
    if (this.qrCode) {
      this.claimQrCodeForm.patchValue({
        itemName: this.qrCode.itemName,
        itemDetails: this.qrCode.itemDetails,
        itemCategory: this.qrCode.itemCategoryId,
      });
    }
  }
  // Reference to IonModal if you want two-way control from outside

  async submitClaim() {
    if (!this.claimQrCodeForm.valid) return;
    this.isClaimLoading = true;

    // Gather the form data
    const formData = {
      id: this.qrCode?.id,
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
