import * as admin from 'firebase-admin';
import dotenv from "dotenv";
dotenv.config();

let privateKey: string | undefined = process.env.FIREBASE_PRIVATE_KEY;

if (privateKey) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}


export const administrator = admin.initializeApp({
  credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID, 
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,  
      privateKey: privateKey
  }),
});

