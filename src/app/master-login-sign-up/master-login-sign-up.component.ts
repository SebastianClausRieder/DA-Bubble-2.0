import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ToggleContainComponent } from './toggle-contain/toggle-contain.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { StartLogoComponent } from "../useful-apps/start-logo/start-logo.component";
import { Observable, of } from 'rxjs';
import { UserProfile } from '../models/user-profile';
import { GlobalJSService } from '../services/global-js.service';
import { UserdataService } from '../services/userdata.service';

@Component({
  selector: 'app-master-login-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    SignInComponent,
    SignUpComponent,
    ToggleContainComponent,
    ForgotPasswordComponent,
    StartLogoComponent
  ],
  templateUrl: './master-login-sign-up.component.html',
  styleUrl: './master-login-sign-up.component.scss'
})
export class MasterLoginSignUpComponent implements OnInit {
  signUp: boolean = false;

  globalJSData = inject(GlobalJSService);
  firestoreService = inject(UserdataService);

  jsonData$: Observable<any[]> = of([]);
  jsonDABubble: UserProfile[] = [];

  constructor() { }

  ngOnInit() {
    this.globalJSData.signUp$.subscribe(value => this.signUp = value);
    // this.jsonData$ = this.firestoreService.getJsonData('usersData');
    // this.jsonData$.subscribe(data => {
    //   this.jsonDABubble = data;
    //   // console.log(this.jsonDABubble);

    // });
  }

}
