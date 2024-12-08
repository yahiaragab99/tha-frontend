import { User } from './user.model';

export interface QrCode {
  id: string | null;
  code: string | null;

  itemName: string | null;
  itemDetails?: string | null;
  itemCategory?: string | null;
  isClaimed?: boolean;

  userId?: string;
  user?: User;
}
