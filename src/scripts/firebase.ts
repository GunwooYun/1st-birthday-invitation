// Lazy Firebase bootstrap. Only loaded when a Firestore-backed section scrolls into view.
import {
  PUBLIC_FIREBASE_API_KEY,
  PUBLIC_FIREBASE_APP_ID,
  PUBLIC_FIREBASE_AUTH_DOMAIN,
  PUBLIC_FIREBASE_PROJECT_ID,
} from 'astro:env/client';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore/lite';

export type FirebaseHandle = {
  app: FirebaseApp;
  db: Firestore;
  uid: string;
};

export function isFirebaseConfigured(): boolean {
  return Boolean(PUBLIC_FIREBASE_API_KEY && PUBLIC_FIREBASE_PROJECT_ID && PUBLIC_FIREBASE_APP_ID);
}

let handlePromise: Promise<FirebaseHandle> | undefined;

export function getFirebase(): Promise<FirebaseHandle> {
  if (!handlePromise) {
    handlePromise = bootstrap().catch((error) => {
      handlePromise = undefined;
      throw error;
    });
  }
  return handlePromise;
}

async function bootstrap(): Promise<FirebaseHandle> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured');
  }
  const [{ initializeApp }, { getAuth, signInAnonymously }, { getFirestore }] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore/lite'),
  ]);

  const app = initializeApp({
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
  });
  const credential = await signInAnonymously(getAuth(app));
  return { app, db: getFirestore(app), uid: credential.user.uid };
}

// Runs `callback` once when `el` first enters the viewport (used to defer Firebase loading).
export function whenVisible(el: Element, callback: () => void): void {
  if (!('IntersectionObserver' in window)) {
    callback();
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    callback();
  });
  observer.observe(el);
}
