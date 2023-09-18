import * as admin from 'firebase-admin';
import dotenv from "dotenv";
dotenv.config();


const { PROJECT_ID, CLIENT_EMAIL } = process.env;
var { PRIVATE_KEY } = process.env;


if (PRIVATE_KEY) {
  PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, '\n');
}


export const administrator = admin.initializeApp({
  credential: admin.credential.cert({
      projectId: PROJECT_ID,
      clientEmail: CLIENT_EMAIL,  
      privateKey: PRIVATE_KEY
  }),
});

