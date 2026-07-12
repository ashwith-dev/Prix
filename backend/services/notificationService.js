const admin = require('firebase-admin');

// Initialize Firebase Admin if credentials are provided in env
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully.');
  } else {
    console.log('FIREBASE_SERVICE_ACCOUNT not provided. Running FCM in mock mode.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error.message);
}

/**
 * Sends a push notification to a specific device using FCM.
 * 
 * @param {string} fcmToken - The device token to send the notification to.
 * @param {string} title - The title of the notification.
 * @param {string} body - The body/message of the notification.
 * @param {Object} [data] - Optional custom data payload.
 * @returns {Promise<boolean>} - True if successful, false otherwise.
 */
async function sendPushNotification(fcmToken, title, body, data = {}) {
  if (!fcmToken) {
    console.log(`[Notification Service] No FCM token provided. Skipping push notification: "${title}"`);
    return false;
  }

  const message = {
    notification: {
      title,
      body,
    },
    data: {
      ...data,
      click_action: 'FLUTTER_NOTIFICATION_CLICK' // Standard for cross-platform
    },
    token: fcmToken,
  };

  try {
    // If Firebase is initialized, send the message
    if (admin.apps.length > 0) {
      const response = await admin.messaging().send(message);
      console.log(`[Notification Service] Successfully sent message:`, response);
      return true;
    } else {
      // Mock mode logging
      console.log(`[Notification Service - MOCK MODE] Push Notification sent to token: ${fcmToken.substring(0, 15)}...`);
      console.log(`Title: ${title}`);
      console.log(`Body: ${body}`);
      return true;
    }
  } catch (error) {
    console.error(`[Notification Service] Error sending push notification:`, error.message);
    return false;
  }
}

module.exports = {
  sendPushNotification
};
