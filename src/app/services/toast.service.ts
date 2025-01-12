import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toastController = inject(ToastController);

  constructor() {}

  async presentToast(
    position: 'top' | 'middle' | 'bottom',
    message: string,
    duration: number,
    positionAnchor?: string
  ) {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      positionAnchor,
      swipeGesture: 'vertical',
    });

    await toast.present();
  }
}
