import { Message } from './message.model';

export interface Notification {
  id: string;
  userid: string;
  qrcodeid: string;
  isread: boolean;
  createdat: string;
  deletedat: string;

  notificationtypeid: string;
  notificationtypetitle: string;
  notificationtypedescription: string;

  itemname: string;
  itemdetails: string;

  messageid?: string;
  senderphonenumber?: string;
  message: Message;
}
