export interface Address {
  street?: string;
  city?: string;
}

export interface Name {
  firstName: string;
  lastName: string;
}

export interface UserProfile {
  name: Name;
  email: string;
  password: string;
  displayName?: string;
  avatar?: string;
  color?: string;
  phone?: string;
  address?: Address;
}
