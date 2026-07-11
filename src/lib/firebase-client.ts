import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  type Auth,
  type UserCredential,
} from 'firebase/auth'

let app: FirebaseApp | undefined
let auth: Auth | undefined

function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }
}

export function getClientApp(): FirebaseApp {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(getFirebaseConfig()) : getApps()[0]
  }
  return app
}

export function getClientAuth(): Auth {
  if (!auth) {
    auth = getAuth(getClientApp())
  }
  return auth
}

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(getClientAuth(), email, password)
}

export async function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(getClientAuth(), email, password)
}

export async function signOutClient() {
  return signOut(getClientAuth())
}

export async function signInWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  return signInWithPopup(getClientAuth(), provider)
}
