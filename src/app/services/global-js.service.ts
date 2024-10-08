import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalJSService {
  private signUpSubject = new BehaviorSubject<boolean>(false); // false wenn Login fertig ist
  signUp$ = this.signUpSubject.asObservable();

  isGerman: boolean = true;
  forgotPW: boolean = false;
  alert: string = '';

  toggleSignUp() {
    this.signUpSubject.next(!this.signUpSubject.value);
  }
}