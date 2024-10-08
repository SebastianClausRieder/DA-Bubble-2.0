import { inject, Injectable } from '@angular/core';

import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { Observable, of } from 'rxjs';
import { UserProfile } from '../models/user-profile';

@Injectable({
  providedIn: 'root',
})
export class UserdataService {
  firestore: Firestore = inject(Firestore);
  allUsers: any = [];
  currentUser: any = {};

  constructor() {}

  getJsonData(collectionName: string): Observable<any[]> {
    const coll = collection(this.firestore, collectionName);
    return collectionData(coll, { idField: 'id' });
  }

  async addUserProfile(userProfile: UserProfile, image: any): Promise<void> {
    try {
      const userProfilesCollection = collection(this.firestore, 'usersData');

      const docRef = await addDoc(userProfilesCollection, userProfile);
      const uid = docRef.id;

      await setDoc(docRef, { ...userProfile, uid: uid });
      this.saveProfileImg(docRef, userProfile, image);
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Benutzerprofils:', error);
    }
  }

  async getCurrentUser(userId: string) {
    const docRef = doc(this.firestore, `usersData/${userId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.currentUser = docSnap.data();
    }
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    console.log(
      'function getCurrentUser: save local Storage current user',
      this.currentUser
    );
  }

  async getAllUsers() {
    this.allUsers = [];
    const ref = collection(this.firestore, 'usersData');
    const querySnapshot = await getDocs(ref);
    querySnapshot.forEach((doc: any) => {
      // let data = doc.data();
      // data.id = doc.id;
      // console.log('received Users from data', data);
      this.allUsers.push(doc.data());
    });
    localStorage.setItem('allUsers', JSON.stringify(this.allUsers));
  }

  async saveProfileImg(querySnapshot: any, userProfile: any, image: any) {
    const storage = getStorage();
    const storageRef = ref(storage, `profiles/${querySnapshot.id}`);
    const uploadTask = uploadBytesResumable(storageRef, image).then(
      (snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          await setDoc(querySnapshot, { ...userProfile, avatar: downloadURL });
        });
      }
    );
  }

  async getOtherUser(userId: string) {
    const docRef = doc(this.firestore, `usersData/${userId}`);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }
}
