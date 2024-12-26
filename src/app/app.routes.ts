import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth/guards/auth.guard';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { TabsComponent } from './tabs/tabs.component';
import { ProfileComponent } from './profile/profile.component';
import { reverseAuthGuard } from './auth/guards/reverse-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'login',
    component: SignInComponent,
    canActivate: [reverseAuthGuard],
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [reverseAuthGuard],
  },
];
