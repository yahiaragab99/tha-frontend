import { QrCode } from './qrCode.model';

export interface Message {
  id: string;
  qrCodeId: string;
  reciepientId: string | null | undefined;
  presetId?: string | null | undefined;

  itemName?: string | null | undefined;
  itemDetails?: string | null | undefined;
  message?: string | null | undefined;
  senderPhoneNumber?: string | null | undefined;
  isPreset?: boolean;
  qrCode?: Partial<QrCode>;

  createdAt: string;
}
