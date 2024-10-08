import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BackArrowComponent } from '../../useful-apps/back-arrow/back-arrow.component';
import { UserProfile } from '../../models/user-profile';
import { EmailVerificationService } from '../../services/email-verification.service';
import { GlobalJSService } from '../../services/global-js.service';
import { UserdataService } from '../../services/userdata.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, BackArrowComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  signUp: boolean = false;
  ready: boolean = true;

  nameResult: boolean | null = null;
  mailExist: boolean = false;
  passwordConfirm: boolean | null = null;
  PPaccept: boolean | null = null;
  avatarSelected: boolean = false;
  loadImageArea: boolean = false;

  globalJSData = inject(GlobalJSService);
  mailVerifi = inject(EmailVerificationService);
  userdataService = inject(UserdataService);

  passwordFieldTypeOne: string = 'password';
  passwordFieldEyeOne: string = 'assets/img/icons/eye-out.png';

  passwordFieldTypeTwo: string = 'password';
  passwordFieldEyeTwo: string = 'assets/img/icons/eye-out.png';

  myAvatar: string = 'assets/img/avatars/Default-Avatar.png';

  registOneData = {
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '',
  };

  ngOnInit() {
    this.globalJSData.signUp$.subscribe((value) => (this.signUp = value));
  }

  async onSubmit(ngForm: NgForm) {
    if (ngForm.form.valid && this.PPaccept) {
      if (this.registOneData.password === this.registOneData.confirmPassword) {
        const inputMailExist = await this.mailVerifi.checkEmailExists(
          this.registOneData.email
        );
        if (!inputMailExist) {
          this.ready = true;
          this.mailExist = false;
          this.splitName(this.registOneData.name);
        } else {
          this.mailExist = true;
        }
      } else {
        this.passwordConfirm = false;
      }
    }
  }

  splitName(name: string) {
    const nameArray = name.split(' ');

    this.registOneData.firstName = nameArray[0];
    this.registOneData.lastName = nameArray[1];
  }

  registerWithDABubble(ngForm: NgForm) {
    this.addNewUser();
    this.resetAll();
    ngForm.resetForm();
  }

  resetAll() {
    this.ready = false;
    this.globalJSData.toggleSignUp();

    this.myAvatar = 'assets/img/avatars/Default-Avatar.png';
    this.avatarSelected = false;

    this.passwordConfirm = null;
    this.PPaccept = null;
    this.passwordStrength = '';
  }

  validateFullName(name: string) {
    if (name !== null) {
      const parts = name.trim().split(' ');
      this.nameResult =
        parts.length >= 2 && parts.every((part) => part.length > 0);
    }
  }

  togglePasswordFieldOne() {
    this.passwordFieldTypeOne =
      this.passwordFieldTypeOne === 'password' ? 'text' : 'password';
    this.passwordFieldEyeOne =
      this.passwordFieldEyeOne === 'assets/img/icons/eye-out.png'
        ? 'assets/img/icons/eye.png'
        : 'assets/img/icons/eye-out.png';
  }

  togglePasswordFieldTwo() {
    this.passwordFieldTypeTwo =
      this.passwordFieldTypeTwo === 'password' ? 'text' : 'password';
    this.passwordFieldEyeTwo =
      this.passwordFieldEyeTwo === 'assets/img/icons/eye-out.png'
        ? 'assets/img/icons/eye.png'
        : 'assets/img/icons/eye-out.png';
  }

  selectAvatar(img: string) {
    this.myAvatar = img;
    this.registOneData.avatar = img;
    this.avatarSelected = true;
  }

  oneStepBack() {
    this.ready = false;
  }

  // Strong Password Check

  passwordStrength: string = '';
  showPassword: boolean = false;

  checkStrength() {
    const strength = this.getStrength(this.registOneData.password);
    if (strength == 0) {
      this.passwordStrength = '';
    } else if (strength <= 2) {
      this.passwordStrength = 'weak';
    } else if (strength > 2 && strength <= 4) {
      this.passwordStrength = 'moderate';
    } else if (strength > 4) {
      this.passwordStrength = 'strong';
    }
  }

  getStrength(password: string): number {
    let i = 0;
    if (password.length > 6) {
      i++;
    }
    if (password.length >= 10) {
      i++;
    }
    if (/[A-Z]/.test(password)) {
      i++;
    }
    if (/[0-9]/.test(password)) {
      i++;
    }
    if (/[a-z]/.test(password)) {
      i++;
    }
    return i;
  }

  // Upload Image

  openLoadImage() {
    this.loadImageArea = !this.loadImageArea;
  }

  // Created By Hanbit
  image: any;
  loadImage(event: any) {
    this.image = event.target.files[0];
    this.myAvatar = URL.createObjectURL(this.image);
    this.avatarSelected = true;
    console.log(this.image)
  }

  // Add new User to Firebase

  addNewUser() {
    const newUserProfile: UserProfile = {
      name: {
        firstName: this.registOneData.firstName,
        lastName: this.registOneData.lastName,
      },
      email: this.registOneData.email,
      password: this.registOneData.password,
      displayName: this.registOneData.firstName,
      avatar: this.registOneData.avatar,
      color: '#000000',
      phone: '',
      address: {
        street: '',
        city: '',
      },
    };

    this.userdataService
      .addUserProfile(newUserProfile, this.image)
      .then(() => {
        this.globalJSData.alert = this.globalJSData.isGerman
          ? 'Du hast dich erfolgreich Registriert'
          : 'You have successfully registered';
        setTimeout(() => {
          this.globalJSData.alert = '';
        }, 5000);
      })
      .catch((error) => {
        console.error('Fehler beim Hinzufügen des Benutzerprofils:', error);
        this.globalJSData.alert = this.globalJSData.isGerman
          ? 'Bei der Registrierung ist etwas schief gegangen'
          : 'Something went wrong during registration';
        setTimeout(() => {
          this.globalJSData.alert = '';
        }, 5000);
      });
  }
}
