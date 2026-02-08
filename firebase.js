const admin = require('firebase-admin');

// ====================================
// 🔥 FIREBASE CONFIGURATION 🔥
// ====================================
// Replace this entire object with your Firebase service account key
const serviceAccount = {
  "type": "service_account",
  "project_id": "nexora-d94b9",
  "private_key_id": "7366e68066a1bc7f9db7713c8c535cc8af3af395",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyiDPs66sJn9iU\n/xcUV0dIQ4zwlkeGGrqMcoNkDka1XNf+fhGUIX7kukTQ4VeuJ7utO+2ruYcD5C90\nR0S93Cc9Ly67GSCSvMJExEEBMjdgwu/1gvIGUKXwSuHocnwwtYpkj1Wkxl2ox8tm\nQqT6jWgVSmgBxEMivk397SSvUc2s5XeAOK71/m9I8LfxdvorzjY6Kl9uuXipalLD\nUdIXJ1VhSU3bM4UlL13cZ/ptlz1gzRsQBSvZiO/E0lq2PCI+IjxqhDrDaCRbXaj7\nAzd6WJd5zISIsq+/AKPyzFkyjYC8lPgwsHXyYbzXpWwCc+Hj3MQ0yxGpszQKVcMr\nRua6PyYPAgMBAAECggEAJr3Kss9jMrf2qkJ+siHMbKCH/Y9G3xF+yMpyu6wjaOjI\nUEfwLZplLGJFW6SCv96Maee2yAx/AXerWoq6no6fDzZlaCFoQZ9ncr+5sXZBsSQs\nKTUsqvUmRTIiuqvZSkKi0PaPqa2IFn+gokS1A0/bNb+LOVLrFKeCSieDTe4s+ScH\neQW1o2NFHDc/4uIYaonYPILJCOLMjPl1gnUNBpRqpFeTvaRbm8WMAJ/M+l0Nb2u3\nkjW6n4jnQz5K5xws3AiLYPw0nqz3j3okazkeaFflyCwZb43qqgRu0QNUemM0CeFN\nBZFFsDadAmbIBu6wo13dGe0eUmnLTac9Ld4QIkP8eQKBgQDf4xW51oYVmKuunBRu\nB8TtteRjGHos8T2EoSDQ3cezRY+LCFDSLO2kMLIx+lSXi31PiI5r62tm6F47Ii0h\n109prxaTFMKN684PJRDVXtAHpAWFraFWbW0AOcTopsM7xE03VamPhbPqR7BwQuE0\n9vYRYdsC+I3x6d40ErBcRnf5+QKBgQDMI7niHwffJcg7+gomBzZMcYi22azHSnD3\nSQAUH2rTaHyQwBKj2L5LsOp4R7vMLPkxWkazBMvJf/IndJwOqeM92Jaa7kKvtcdj\nO31CB9W/XX9SrJnfdnDbE5kYHNaVV6k4l01ee1zAWqj3gVlQdnI0yQ0f2KV+MBUB\nyXXuoWPiRwKBgQC+/FZyO2ASWDRMNXTwD8ycA0gaiKzgXcJeu5zkz+wlL7etoKBh\nSlZGdAvuul8jD6kMCa+EvETYemy4AQWDEsr5mpSlT1ZP/tG+9Z2QhtrrSa40RNOW\niK4tPRqOZIOzHlfIVljYx/OcbR9EBKlcpzdtyI4t0J41uY0F2tN7Q9ng8QKBgCaM\nuJWS9pGVOPLajQARbJeS+RZOlOotjJemGXWzWSEDIkLTgrGeRJFWn3CHW1d7RrOj\nMKatyS4ME1aQFshOHLOZKxem1sEHutdqbIUDpcG1jk22enhQjY9RbB+5kmwxWatu\nJxYohaNte2sB6jPfqkF9lhTlfJsPyWfE+5hMsegRAoGAaRUwFY+LTd/n0buVTbaj\nxOl0WTPP4WJYIHVDB/wN3dKrNSt7ufffLbwfgM71c8Bt9B9/nE4WoIh5/fimqnjl\np4u+MmmHqEg6KxmJL87f67byQugJBwvyGKf3NdY7yWBZOwgBw+ijo5yLOAK7K7OL\nO/Y3RotyAtMnbHjdD4zm3E8=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@nexora-d94b9.iam.gserviceaccount.com",
  "client_id": "114630873450891990423",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40nexora-d94b9.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
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
