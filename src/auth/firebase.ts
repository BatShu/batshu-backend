import admin from "firebase-admin";

// FIREBASE_SERVICE_ACCOUNT_KEY 환경 변수가 정의되지 않았을 때를 대비하여 기본값을 빈 문자열로 설정
const serviceAccountKeyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '';

  // JSON.parse를 사용하여 문자열을 객체로 파싱
  const serviceAccountKey = JSON.parse(serviceAccountKeyString);

  // 파싱된 객체를 사용하여 Firebase Admin 초기화
  export const administrator = admin.initializeApp({
    credential : admin.credential.cert(serviceAccountKey)
  })