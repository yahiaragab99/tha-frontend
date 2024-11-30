import { QrCode } from './qrCode.model';
export interface User {
  id: string | null;
  email: string | null;
  profile_pic_url: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;

  qrCodes: QrCode[];
}
