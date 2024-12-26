import { CanActivateFn } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // console.log('AUTH GUARD CHECK !! ', authService.isLoggedIn);
  if (authService.isLoggedIn !== true) {
    router.navigate(['login']);
  }
  return true;
};
