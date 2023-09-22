import * as admin from 'firebase-admin';
import dotenv from "dotenv";
dotenv.config(); 

const { PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY } = process.env;

if (!PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY is missing in the environment variables');
}


export const administrator = admin.initializeApp({
  credential: admin.credential.cert({
      projectId: PROJECT_ID,
      clientEmail: CLIENT_EMAIL,  
      privateKey: PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
});