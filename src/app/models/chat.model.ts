import { Message } from './message.model';

export interface Chat {
  id: string;
  qrCodeId: string;
  itemName?: string | null | undefined;
  itemDetails?: string | null | undefined;
  messages: Message[];
}
