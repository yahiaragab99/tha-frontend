import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QrCode } from '../models/qrCode.model';
import { body } from 'ionicons/icons';
import { ItemCategory } from '../models/itemCategory.model';

const API_BASE_URL = environment.serverUrl + '/qr-code';
@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  private http = inject(HttpClient);
  constructor() {}

  getUserQrCodes(userId: string) {
    return this.http.get(API_BASE_URL + '/user-qrs/' + userId);
  }

  deleteQrCode(id: string) {
    return this.http.delete(API_BASE_URL + '/delete/' + id);
  }

  getQrCodeByCode(code: string): Observable<QrCode> {
    return this.http.get<QrCode>(API_BASE_URL + '/code/' + code);
  }

  updateQrCode(
    code: string | null,
    itemName: string,
    itemDetails: string,
    itemCategory: string,
    isClaimed: boolean,
    email: string | null | undefined
  ): Observable<any> {
    return this.http.put<any>(API_BASE_URL + '/claim/' + code, {
      itemName,
      itemDetails,
      itemCategory,
      isClaimed,
      email,
    });
  }

  getItemCategories(): Observable<ItemCategory[]> {
    return this.http.get<ItemCategory[]>(API_BASE_URL + '/categories');
  }
}
