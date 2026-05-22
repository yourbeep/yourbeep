import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onIdTokenChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';

import { env, hasFirebaseClientConfig } from '@/lib/config/env';

const firebaseConfig = {
  apiKey: env.firebaseApiKey,
  appId: env.firebaseAppId,
  authDomain: env.firebaseAuthDomain,
  messagingSenderId: env.firebaseMessagingSenderId,
  projectId: env.firebaseProjectId,
  storageBucket: env.firebaseStorageBucket,
};

const firebaseApp = hasFirebaseClientConfig
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

const firebaseAuth = firebaseApp
  ? getAuth(firebaseApp)
  : null;

export const hasFirebaseAuthClient = Boolean(firebaseAuth);

export function observeFirebaseIdToken(listener: (user: User | null) => void) {
  if (!firebaseAuth) {
    listener(null);
    return () => undefined;
  }

  return onIdTokenChanged(firebaseAuth, listener);
}

export async function signInWithFirebaseEmail(email: string, password: string) {
  if (!firebaseAuth) {
    throw new Error('Firebase client configuration is missing.');
  }

  return signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
}

export async function createFirebaseEmailUser(email: string, password: string) {
  if (!firebaseAuth) {
    throw new Error('Firebase client configuration is missing.');
  }

  return createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
}

export async function signOutFirebaseUser() {
  if (!firebaseAuth) {
    return;
  }

  await signOut(firebaseAuth);
}

export async function sendFirebasePasswordReset(email: string) {
  if (!firebaseAuth) {
    throw new Error('Firebase client configuration is missing.');
  }

  await sendPasswordResetEmail(firebaseAuth, email.trim());
}

export async function updateFirebasePassword(oldPassword: string, newPassword: string) {
  if (!firebaseAuth) {
    throw new Error('Firebase client configuration is missing.');
  }

  const user = firebaseAuth.currentUser;
  if (!user || !user.email) {
    throw new Error('No user is currently authenticated.');
  }

  // Re-authenticate with the old password
  const credential = EmailAuthProvider.credential(user.email, oldPassword);
  await reauthenticateWithCredential(user, credential);

  // Update to the new password
  await updatePassword(user, newPassword);
}

export async function signInWithFirebaseGoogleIdToken(idToken: string) {
  if (!firebaseAuth) {
    throw new Error('Firebase client configuration is missing.');
  }

  const credential = GoogleAuthProvider.credential(idToken);

  return signInWithCredential(firebaseAuth, credential);
}
