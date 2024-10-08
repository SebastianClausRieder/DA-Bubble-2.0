import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Setzen eines Wertes im Local Storage
  setItem(key: string, value: any): void {
    const jsonData = JSON.stringify(value);
    localStorage.setItem(key, jsonData);
  }

  // Abrufen eines Wertes aus dem Local Storage
  getItem<T>(key: string): T | null {
    const jsonData = localStorage.getItem(key);
    return jsonData ? JSON.parse(jsonData) as T : null;
  }

  // Entfernen eines Wertes aus dem Local Storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Überprüfen, ob ein bestimmter Schlüssel im Local Storage existiert
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // Entfernen aller Einträge aus dem Local Storage
  clear(): void {
    localStorage.clear();
  }
}