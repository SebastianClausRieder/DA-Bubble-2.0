import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyALsBZYgKqUvx9BRW0-lLnZVPtogcl4GmM",
        authDomain: "da-bubble-a84a8.firebaseapp.com",
        projectId: "da-bubble-a84a8",
        storageBucket: "da-bubble-a84a8.appspot.com",
        messagingSenderId: "343295348118",
        appId: "1:343295348118:web:a9259d4e2dff727e9561b7",
        measurementId: "G-Q06R7NB39E"
      })
    ),
    provideFirestore(() => getFirestore()),
    // provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),
  ]
};
// function provideAnimationsAsync(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
//   throw new Error('Function not implemented.');
// }

