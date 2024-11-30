import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
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
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [
    IonList,
    IonInput,
    IonContent,
    IonItem,
    IonButton,
    IonSpinner,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SignInComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  signInFormData!: FormGroup;
  isLoading: Boolean = false;
  constructor() {}

  ngOnInit(): void {
    this.signInFormData = new FormGroup({
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
    });
  }

  signInUser() {
    if (!this.signInFormData.valid) return;

    this.isLoading = true;
    const email = this.signInFormData.value.email;
    const password = this.signInFormData.value.password;
    // let isEmailRegistered: Boolean = false;
    // this.authService.isEmailRegistered(email).subscribe({
    //   next: (res) => {
    //     isEmailRegistered = res;
    //     console.log('r u there', isEmailRegistered);
    //   },
    // });

    this.authService.signIn(email, password).subscribe({
      next: (res) => {
        console.log(res);
        if (!res || Object.keys(res).length === 0)
          throw new Error('Invalid credentials');
        this.authService.setUserData(res as User);
        this.isLoading = false;
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
      },
    });
  }
}
