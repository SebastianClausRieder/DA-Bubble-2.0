import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class EmailVerificationService {
  constructor(public firestore: Firestore) { }

  async checkEmailExists(email: string): Promise<boolean> {
    const usersCollection = collection(this.firestore, 'usersData');
    const q = query(usersCollection, where('email', '==', email));

    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  }

  async getUserIdByEmail(email: string): Promise<string | null> {
    const usersCollection = collection(this.firestore, 'usersData');
    const q = query(usersCollection, where('email', '==', email));

    console.log(q);
    
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.id;
    }

    return null;
  }
}
