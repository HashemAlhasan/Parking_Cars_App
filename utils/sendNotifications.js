import admin from 'firebase-admin'
const serviceAccount = require('./path/to/your/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const sendNotification = async (userId, message, token) => {
    const payload = {
        notification: {
            title: 'Repair Order Update',
            body: message,
        },
        token: token,
    };

    try {
        await admin.messaging().send(payload);
        console.log(`Notification sent to user ${userId}: ${message}`);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};
