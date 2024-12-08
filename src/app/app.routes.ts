import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { HomePage } from './home/home.page';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth/guards/auth.guard';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ClaimQrCodeComponent } from './claim-qr-code/claim-qr-code.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    // Reverse auth guard
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    // Reverse auth guard
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'claim-qr-code',
    component: ClaimQrCodeComponent,
    canActivate: [authGuard],
  },
];
