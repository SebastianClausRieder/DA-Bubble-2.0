import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { doc, getDoc } from 'firebase/firestore';
import { Router } from '@angular/router';

import { UserdataService } from '../../services/userdata.service';

import { GlobalJSService } from '../../services/global-js.service';
import { EmailVerificationService } from '../../services/email-verification.service';
import { LocalStorageService } from '../../services/local-storage.service';


@Component({
  selector: 'app-sign-in',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
],

  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit {
  signUp: boolean = false;

  formValid: boolean | null = null;
  mailExist: boolean | null = null;
  remember: boolean = false;
  wrongPassword: boolean = false;

  globalJSData = inject(GlobalJSService);
  router = inject(Router);

  passwordFieldType: string = 'password';
  passwordFieldEye: string = 'assets/img/icons/eye-out.png';

  loginData = {
    mail: '',
    password: '',
  };


  constructor(public userService: UserdataService) { }

  ngOnInit() {
    this.globalJSData.signUp$.subscribe(value => this.signUp = value);
    // if (typeof window !== 'undefined') {
    //   this.loadData();
    // }


    if (typeof localStorage !== 'undefined') {
      // Safe to use localStorage
      this.loadData();
    } else {
      console.warn('localStorage is not available');
    }
  }

  async onSubmit(ngForm: NgForm) {
    await this.checkUserMail(this.loginData.mail, ngForm);
  }

  togglePasswordFieldType() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
    this.passwordFieldEye =
      this.passwordFieldEye === 'assets/img/icons/eye-out.png'
        ? 'assets/img/icons/eye.png'
        : 'assets/img/icons/eye-out.png';
  }

  toggleForgotPassword() {
    this.globalJSData.forgotPW = !this.globalJSData.forgotPW;
  }

  // Login

  mailVerifi = inject(EmailVerificationService);

  async checkUserMail(mail: string, ngForm: NgForm) {
    const userId = await this.mailVerifi.getUserIdByEmail(mail);

    if (userId) {
      this.mailExist = true;
      this.checkUserPassword(this.loginData.password, userId, ngForm);
    } else {
      this.mailExist = false;
    }
  }

  async checkUserPassword(password: string, userId: string, ngForm: NgForm) {
    const userDocRef = doc(this.mailVerifi.firestore, `usersData/${userId}`);
    const userDocSnap = await getDoc(userDocRef);

    const userData = userDocSnap.data();

    if (userData && userData['password'] === password) {
      this.wrongPassword = false;
      this.router.navigate(['/main', userId]);
      ngForm.resetForm();
    } else if (!userData) {
      console.error();
    } else {
      this.wrongPassword = true;
    }
  }

  // Guest Login

  async guestLogin(ngForm: NgForm) {
    this.loginData.mail = 'gast@da-bubble.tirol';
    this.loginData.password = 'Guest123';

    await this.checkUserMail(this.loginData.mail, ngForm);
  }

  // Remember Login

  localStorageService = inject(LocalStorageService)

  saveData() {
    const data = { remember: this.remember, email: this.loginData.mail, password: this.loginData.password };
    this.localStorageService.setItem('userData', data);
    console.log('Daten gespeichert');
  }

  loadData() {
    const userData = this.localStorageService.getItem<{ remember: boolean, email: string, password: string }>('userData');
    if (userData) {
      this.remember = userData.remember;
      this.loginData.mail = userData.email;
      this.loginData.password = userData.password;
    } else {
      console.log('Keine Daten gefunden');
    }
  }

  removeData() {
    this.localStorageService.removeItem('userData');
    console.log('Daten entfernt');
  }

  rememberLogin() {
    this.remember = !this.remember;

    if (this.remember) {
      this.saveData();
      this.globalJSData.alert = this.globalJSData.isGerman ? 'Deine Login Daten werden gespeichert' : 'Your login details will be saved';
      setTimeout(() => {
        this.globalJSData.alert = '';
      }, 5000);
    } else {
      this.removeData();
      this.globalJSData.alert = this.globalJSData.isGerman ? 'Deine Login Daten werden nicht mehr gespeichert' : 'Your login data will no longer be saved';
      setTimeout(() => {
        this.globalJSData.alert = '';
      }, 5000);
    }
  }
}
