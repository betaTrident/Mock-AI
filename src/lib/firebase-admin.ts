// SERVER-ONLY — never import this in a Client Component or 'use client' file
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { getAuth, type Auth } from 'firebase-admin/auth'

let firestore: Firestore | undefined
let auth: Auth | undefined

function ensureAdmin() {
  if (firestore && auth) return

  const app =
    getApps().length === 0
      ? initializeApp({
          credential: cert(
            JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)
          ),
        })
      : getApps()[0]

  firestore = getFirestore(app)
  auth = getAuth(app)
}

export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_target, prop, receiver) {
    ensureAdmin()
    return Reflect.get(firestore!, prop, receiver)
  },
})

export const adminAuth: Auth = new Proxy({} as Auth, {
  get(_target, prop, receiver) {
    ensureAdmin()
    return Reflect.get(auth!, prop, receiver)
  },
})
