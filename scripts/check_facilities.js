import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf8');
const match = envContent.match(/FIREBASE_SERVICE_ACCOUNT_JSON='([^']+)'/);
if (!match) {
  console.error('Could not find FIREBASE_SERVICE_ACCOUNT_JSON in .env');
  process.exit(1);
}

const serviceAccount = JSON.parse(match[1]);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function run() {
  const snapshot = await db.collection('facilities').get();
  console.log(`Total items in facilities collection: ${snapshot.docs.length}`);
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    console.log(`- [${doc.id}] title: "${data.title}", order: ${data.order}, deletedAt: ${data.deletedAt}`);
  });
}

run().then(() => process.exit(0)).catch(console.error);
