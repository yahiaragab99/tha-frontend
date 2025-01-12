import { Component, inject, OnInit } from '@angular/core';
import {
  IonInput,
  IonContent,
  IonItem,
  IonButton,
  IonList,
  IonSpinner,
} from '@ionic/angular/standalone';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { closeCircle, lockClosed } from 'ionicons/icons';
import { ToastService } from 'src/app/services/toast.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonContent,
    IonItem,
    IonButton,
    IonList,
    IonSpinner,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class SignUpComponent implements OnInit {
  authService = inject(AuthService);
  isLoading: Boolean = false;
  router = inject(Router);
  toastService = inject(ToastService);
  signUpFormData!: FormGroup;
  isEmailValid: Boolean = true;
  constructor() {
    addIcons({ closeCircle });
  }

  ngOnInit() {
    this.signUpFormData = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        // Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
        /*
        Contains at least one letter (both uppercase and lowercase)
        Contains at least one digit
        Has a minimum length of 6 characters
        Only contains letters and digits  
        */
      ]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
    });
  }

  signUpUser() {
    if (!this.signUpFormData.valid) return;

    this.isLoading = true;
    const email = this.signUpFormData.value.email;
    const password = this.signUpFormData.value.password;
    const firstName = this.signUpFormData.value.firstName;
    const lastName = this.signUpFormData.value.lastName;
    const phoneNumber = this.signUpFormData.value.phoneNumber;
    this.authService
      .signUp(email, password, firstName, lastName, phoneNumber)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.toastService.presentToast('bottom', 'Signup successful', 2000);
          this.authService.setUserData(res.user as User, res.token);
          this.isLoading = false;

          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.toastService.presentToast('bottom', err.error.message, 2000);
        },
      });
  }

  checkEmail() {
    const email = this.signUpFormData.value.email;
    this.authService.isEmailRegistered(email).subscribe({
      next: (res) => {
        if (res == true) {
          this.isEmailValid = false;
          return;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
