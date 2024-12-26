import { User } from './user.model';

export interface QrCode {
  id: string;
  code: string | null | undefined;

  itemName: string | null | undefined;
  itemDetails?: string | null | undefined;
  itemCategoryId?: string | null | undefined;
  isClaimed?: boolean;

  userId?: string;
  user?: User;
}
