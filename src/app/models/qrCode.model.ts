import { User } from './user.model';

export interface QrCode {
  id: string | null;
  code: string | null;

  itemName: string | null;
  itemDetails?: string | null;
  itemCategory?: string | null;

  userId?: string;
  user?: User;
}
