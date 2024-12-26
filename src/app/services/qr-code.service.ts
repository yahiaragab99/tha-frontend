import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QrCode } from '../models/qrCode.model';

const API_BASE_URL = environment.serverUrl + '/qrcode';
const CATEGORIES_BASE_URL = environment.serverUrl + '/category';
@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  private http = inject(HttpClient);
  constructor() {}

  getUserQrCodes(userId: string) {
    return this.http.get(API_BASE_URL + '/user/' + userId, {
      withCredentials: true,
    });
  }

  deleteQrCode(id: string) {
    return this.http.delete(API_BASE_URL + '/' + id, {
      withCredentials: true,
    });
  }

  getQrCodeByCode(code: string): Observable<QrCode> {
    return this.http.get<QrCode>(API_BASE_URL + '/code/' + code, {
      withCredentials: true,
    });
  }

  updateQrCode(
    code: string | null | undefined,
    itemName: string,
    itemDetails: string,
    itemCategoryId: string,
    isClaimed: boolean,
    userId: string | null | undefined
  ): Observable<any> {
    return this.http.put<any>(
      API_BASE_URL + '/' + code,
      {
        itemName,
        itemDetails,
        itemCategoryId,
        isClaimed,
        userId,
      },
      {
        withCredentials: true,
      }
    );
  }

  getItemCategories() {
    return this.http.get(CATEGORIES_BASE_URL + '/', {
      withCredentials: true,
    });
  }
}
