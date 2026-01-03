const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize Firebase Admin SDK
let db = null;

try {
  let serviceAccount = null;

  // Priority 1: Check for key file in server directory (hackathon-friendly)
  const keyFilePath = path.join(__dirname, 'firebase-key.json');
  if (fs.existsSync(keyFilePath)) {
    console.log('📁 Found firebase-key.json file, loading credentials...');
    serviceAccount = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
  }
  // Priority 2: Check environment variable for JSON string
  else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('🔑 Loading Firebase credentials from environment variable...');
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
  // Priority 3: Check for project ID (for emulator/default credentials)
  else if (process.env.FIREBASE_PROJECT_ID) {
    console.log('🔧 Using Firebase Project ID from environment...');
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  } else {
    console.warn('⚠️  Firebase not configured.');
    console.warn('   Options:');
    console.warn('   1. Place firebase-key.json in server/ directory');
    console.warn('   2. Set FIREBASE_SERVICE_ACCOUNT in .env (JSON string)');
    console.warn('   3. Set FIREBASE_PROJECT_ID in .env');
    console.warn('   Firestore operations will be skipped.');
  }

  // Initialize with service account if we have one
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  // Only initialize Firestore if admin app was initialized
  if (admin.apps.length > 0) {
    db = admin.firestore();
    console.log('✅ Firebase Firestore initialized successfully');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  console.warn('   Firestore operations will be skipped.');
}

/**
 * Save feedback analysis to Firestore
 * @param {string} feedback - The feedback text
 * @param {Object} analysis - The AI analysis result
 * @returns {Promise<string>} Document ID
 */
async function saveFeedbackToFirestore(feedback, analysis) {
  if (!db) {
    console.warn('Firestore not initialized, skipping save operation');
    return null;
  }

  try {
    const docRef = await db.collection('feedbacks').add({
      feedback: feedback,
      sentiment: analysis.sentiment,
      category: analysis.category,
      summary: analysis.summary,
      suggestions: analysis.suggestions,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Saved feedback to Firestore with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error saving to Firestore:', error.message);
    // Don't throw - allow the API to continue even if Firestore fails
    return null;
  }
}

/**
 * Get all feedback documents from Firestore
 * @returns {Promise<Array>} Array of feedback documents
 */
async function getAllFeedbacksFromFirestore() {
  if (!db) {
    console.warn('Firestore not initialized, returning empty array');
    return [];
  }

  try {
    const snapshot = await db.collection('feedbacks')
      .orderBy('createdAt', 'desc')
      .get();

    const feedbacks = [];
    snapshot.forEach(doc => {
      feedbacks.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`✅ Retrieved ${feedbacks.length} feedback documents from Firestore`);
    return feedbacks;
  } catch (error) {
    console.error('Error fetching from Firestore:', error.message);
    return [];
  }
}

module.exports = {
  saveFeedbackToFirestore,
  getAllFeedbacksFromFirestore
};

