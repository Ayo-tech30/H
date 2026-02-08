const admin = require('firebase-admin');

// ====================================
// 🔥 FIREBASE CONFIGURATION 🔥
// ====================================
// Replace this entire object with your Firebase service account key
const serviceAccount = {
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "YOUR_PRIVATE_KEY",
  "client_email": "YOUR_CLIENT_EMAIL",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "YOUR_CERT_URL"
};

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com" // Change this to your database URL
  });
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
}

const db = admin.firestore();

// Database helper functions
const database = {
  // User operations
  async getUser(userId) {
    try {
      const doc = await db.collection('users').doc(userId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async setUser(userId, data) {
    try {
      await db.collection('users').doc(userId).set(data, { merge: true });
      return true;
    } catch (error) {
      console.error('Error setting user:', error);
      return false;
    }
  },

  async updateUser(userId, data) {
    try {
      await db.collection('users').doc(userId).update(data);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  },

  // Group operations
  async getGroup(groupId) {
    try {
      const doc = await db.collection('groups').doc(groupId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Error getting group:', error);
      return null;
    }
  },

  async setGroup(groupId, data) {
    try {
      await db.collection('groups').doc(groupId).set(data, { merge: true });
      return true;
    } catch (error) {
      console.error('Error setting group:', error);
      return false;
    }
  },

  async updateGroup(groupId, data) {
    try {
      await db.collection('groups').doc(groupId).update(data);
      return true;
    } catch (error) {
      console.error('Error updating group:', error);
      return false;
    }
  },

  // Card operations
  async getCards(userId) {
    try {
      const doc = await db.collection('cards').doc(userId).get();
      return doc.exists ? doc.data().cards || [] : [];
    } catch (error) {
      console.error('Error getting cards:', error);
      return [];
    }
  },

  async setCards(userId, cards) {
    try {
      await db.collection('cards').doc(userId).set({ cards }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error setting cards:', error);
      return false;
    }
  },

  // Global settings
  async getSettings() {
    try {
      const doc = await db.collection('settings').doc('global').get();
      return doc.exists ? doc.data() : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  },

  async setSetting(key, value) {
    try {
      await db.collection('settings').doc('global').set({ [key]: value }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error setting:', error);
      return false;
    }
  },

  // Get all users (for leaderboard)
  async getAllUsers() {
    try {
      const snapshot = await db.collection('users').get();
      const users = [];
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }
};

module.exports = { admin, db, database };
