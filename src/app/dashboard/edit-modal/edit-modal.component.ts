import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSpinner,
  IonList,
  IonSelectOption,
  IonSelect,
} from '@ionic/angular/standalone';
import { QrCode } from 'src/app/models/qrCode.model';
import { ItemCategory } from 'src/app/models/itemCategory.model';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [
    IonSelectOption,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonInput,
    IonSpinner,
    IonSelect,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class EditModalComponent implements OnInit {
  isEditLoading = false;

  @Input() itemCategories: ItemCategory[] = [];
  @Input() qrCode!: QrCode | null;
  @Input() editModalRef!: IonModal;
  @Output() save = new EventEmitter<{ formData: any }>();

  editQrCodeForm = new FormGroup({
    itemName: new FormControl('', [Validators.required]),
    itemDetails: new FormControl(''),
    itemCategoryId: new FormControl(''),
  });

  async ngOnInit() {
    // Patch form if qrCode is provided
    if (this.qrCode) {
      this.editQrCodeForm.patchValue({
        itemName: this.qrCode.itemName,
        itemDetails: this.qrCode.itemDetails,
        itemCategoryId: this.qrCode.itemCategoryId,
      });
    }
  }

  async submitEdit() {
    if (!this.editQrCodeForm.valid) return;
    this.isEditLoading = true;

    const formData = {
      ...this.editQrCodeForm.value,
      isClaimed: true,
    };
    this.save.emit({ formData });
    await this.closeModal();
  }

  async closeModal() {
    if (this.editModalRef) {
      await this.editModalRef.dismiss();
    }
  }
}
