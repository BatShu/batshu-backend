import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const { PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY } = {
  PROJECT_ID: process.env.PROJECT_ID,
  CLIENT_EMAIL: process.env.CLIENT_EMAIL,
  PRIVATE_KEY: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n') // 개행 문자 처리
};

if (PRIVATE_KEY === undefined) {
  throw new Error('PRIVATE_KEY is missing in the environment variables');
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: PROJECT_ID,
    clientEmail: CLIENT_EMAIL,
    privateKey: PRIVATE_KEY
  })
});

export { admin };
