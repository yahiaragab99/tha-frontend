import { CanActivateFn } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = await authService.isLoggedIn();
  if (isLoggedIn !== true) {
    router.navigate(['login']);
    return false;
  }
  return true;
};
