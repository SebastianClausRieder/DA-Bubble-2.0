import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { concatMap, from, map, Observable, take, tap } from 'rxjs';
import { Chat, Message } from './../models/chat';

import { UserProfile } from './../models/user-profile';

import { NgForm } from '@angular/forms';
import { limit, onSnapshot } from 'firebase/firestore';
import { UserdataService } from './userdata.service';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  firestore: Firestore = inject(Firestore);
  currentUser: any = {};
  currentChatId?: string;
  allChats: any = [];
  currentChat: any = {};

  constructor(public userdataService: UserdataService) {
    // const item = localStorage.getItem('currentUser');
    // if (item) {
    //   this.currentUser = JSON.parse(item);
    // }
  }

  async createChat(otherUser: any) {
    console.log(
      'function: createChat: creating chat with',
      this.currentUser,
      'and',
      otherUser
    );
    let data = {
      usersIds: [this.currentUser.uid, otherUser.uid],
      users: [
        {
          displayName: this.currentUser.name.firstName,
        },
        {
          displayName: otherUser.name.firstName,
        },
      ],
    };
    const docRef = collection(this.firestore, 'chats');
    const querySnapshot = await addDoc(docRef, data);
    await setDoc(querySnapshot, { ...data, uid: querySnapshot.id });
  }

  async isExistingChat(otherUserID: string): Promise<boolean> {
    const docRef = query(collection(this.firestore, 'chats'));
    const querySnapshot = await getDocs(docRef);
    let found = false;
    querySnapshot.forEach((doc: any) => {
      if (
        otherUserID == this.currentUser.uid &&
        doc.data().usersIds[0] == otherUserID &&
        doc.data().usersIds[1] == this.currentUser.uid
      ) {
        found = true;
        console.log(
          'function: isExistingChat: myself',
          otherUserID,
          this.currentUser.uid
        );
        return;
      } else if (
        (doc.data().usersIds[0] == otherUserID &&
          doc.data().usersIds[1] == this.currentUser.uid) ||
        (doc.data().usersIds[0] == this.currentUser.uid &&
          doc.data().usersIds[1] == otherUserID)
      ) {
        found = true;
        console.log(
          'function: isExistingChat: with others',
          otherUserID,
          this.currentUser.uid
        );
        return;
      }
    });
    return found;
  }

  async getCurrentChat(otherUserID: string) {
    await this.getAllChats();
    console.log(
      'function: getCurrentChat: allChats',
      this.allChats,
      '\n',
      'this is current user id',
      this.currentUser.uid,
      '\n',
      'this is other user id',
      otherUserID
    );
    const chat = this.allChats.find(
      (chat: { usersIds: string | any[] }) =>
        chat.usersIds.length === 2 &&
        ((chat.usersIds[0] == this.currentUser.uid &&
          chat.usersIds[1] == otherUserID) ||
          (chat.usersIds[0] == otherUserID &&
            chat.usersIds[1] == this.currentUser.uid))
    );
    // console.log('function: getCurrentChat: Current chat', chat);
    this.currentChat = chat;
    this.getMessages(this.currentChat);
  }
  async getAllChats() {
    const docRef = query(
      collection(this.firestore, 'chats'),
      where('usersIds', 'array-contains', this.currentUser.uid)
    );
    const querySnapshot = await getDocs(docRef);
    this.allChats = [];
    querySnapshot.forEach((doc: any) => {
      let data = doc.data();
      data.uid = doc.id;
      this.allChats.push(data);
    });

    // console.log('function: getAllChats: all chats', this.allChats);
  }

  async sendMessage(sentMessage: any, image: any) {
    const docRef = collection(
      this.firestore,
      'chats',
      this.currentChat.uid,
      'messages'
    );

    let data = {
      text: sentMessage.text,
      sentBy: this.currentUser.uid,
      sentByName: this.currentUser.name,
      sentAt: Timestamp.fromDate(new Date()),
    };
    const querySnapshot = await addDoc(docRef, data);
    const storage = getStorage();
    const storageRef = ref(storage, `chats/${querySnapshot.id}`);
    const uploadTask = uploadBytesResumable(storageRef, image).then(
      (snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          await setDoc(querySnapshot, { ...data, image: downloadURL });
        });
      }
    );
  }

  allMessages: any[] = [];

  async getMessages(currentChat: any) {
    // console.log('function: getMessages: current messages', currentChat);
    const docRef = collection(
      this.firestore,
      'chats',
      currentChat.uid,
      'messages'
    );
    if (docRef) {
      const querySnapshot = getDocs(docRef);
      this.allMessages = [];
      (await querySnapshot).forEach((doc: any) => {
        // console.log('this is doc', doc.data());
        let data = doc.data();
        data.id = doc.id;
        this.allMessages.push(data);
        this.allMessages.sort((a, b) => {
          if (a.sentAt.seconds === b.sentAt.seconds) {
            return a.sentAt.nanoseconds - b.sentAt.nanoseconds;
          } else {
            return a.sentAt.seconds - b.sentAt.seconds;
          }
        });
      });

      const querySnapshots = onSnapshot(docRef, (querySnapshot) => {
        this.allMessages = [];
        querySnapshot.forEach((doc: any) => {
          let data = doc.data();
          data.id = doc.id;
          this.allMessages.push(data);
          this.allMessages.sort((a, b) => {
            if (a.sentAt.seconds === b.sentAt.seconds) {
              return a.sentAt.nanoseconds - b.sentAt.nanoseconds;
            } else {
              return a.sentAt.seconds - b.sentAt.seconds;
            }
          });
        });
      });
    }
  }
}
