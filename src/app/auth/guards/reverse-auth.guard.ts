import { CanActivateFn } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const reverseAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn == true) {
    router.navigate(['dashboard']);
  }
  return true;
};
