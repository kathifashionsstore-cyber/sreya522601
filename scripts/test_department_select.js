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

import { serviceDepartments, getLockedServiceDepartments } from '../src/mockData/services.js';

async function run() {
  const snapshot = await db.collection('departments').get();
  const firestoreData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  console.log('--- FIRESTORE DATA ---');
  console.log(firestoreData.map(d => ({ id: d.id, name: d.name })));

  const result = getLockedServiceDepartments(firestoreData);
  console.log('--- RESULT FROM getLockedServiceDepartments ---');
  console.log(result.map(r => ({ id: r.id, name: r.name })));
}

run().then(() => process.exit(0)).catch(console.error);
