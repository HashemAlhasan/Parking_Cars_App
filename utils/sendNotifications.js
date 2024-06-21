import admin from 'firebase-admin'
//  const serviceAccount = require('../fir-e8b4f-firebase-adminsdk-7jn1h-1d173a25b7.json')
//import * as serviceAccount1 from '../fir-e8b4f-firebase-adminsdk-7jn1h-1d173a25b7.json' with {type : "json"}
import s from '../fir-e8b4f-firebase-adminsdk-7jn1h-1d173a25b7.json' with {type : "json"}
s.auth_provider_x509_cert_url
//const serviceAccount = JSON.parse(serviceAccount1) 
//console.log(serviceAccount.project_id);
const project_id="fir-e8b4f"
const client_email= "firebase-adminsdk-7jn1h@fir-e8b4f.iam.gserviceaccount.com"
const private_key =  "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCcraJkW+OmtzC+\naotKcgCSxVFathqecRJ1JHWr5SdQfiMS6fA25oYA2J1F2+j93SgtX1QbwG6gcQYK\nCzgdhRjJrOpFkKzEi7zCOANKPOIsXmJVdh6PRUTLOn6V4FcxJFT5jMEuGM2e/oLr\ncoa7ij7BZsNs1I6f84/PsLxcqd2qrLFhHm4NpD2qQKERWRarTKnLr31kw3aLzaxP\nTw2y/EHNzaegpC8uwd+LbL9auZe0ESaFFTWFevsStutTZ2xAmbcfvDC4HfGdp7Ta\npBLGzqYin35vx+jp1YRSHNAEaCFB5J57elzkDBwbNbOzJ6+DSkc3gTDoZFQrPfSc\nw/OUsSS9AgMBAAECggEAALm/IEbaqYl8pM0agwg/H27hfxGL0wMECl3WW6rugS1s\nXSiPL7nmkfdu1wV7MT3Gc1tXKN+9w2lylTZTFrPolvqBhTvzyN86yw12WnAovfrb\n6rhm0NQJywUk0+3biYM5D4TK2jtMLHnSQmPf4ttzifK/YfAkDvKSTmxrmuRAfgtX\n1Wc6wXUjxlrXhhxzdiW11gS74FGQUbHLGj5n7oADdpb3dCz/Gc5k8Hw77gVG575O\nZpxio9AJEJi11xaSwX3voFU0vIxrUxyh5vR+j42FBqFUXtJ3g3Tox1NAX5veIuEZ\nJJRXoR0vctS2zrhbxdt2QkPK9fdyaiSCZaXcjCW4swKBgQDTQfVPCqoEewsT/yKA\nm+MpVYyRxz5F+BfmnzXhty/Sw48f6ZfuzbA8pwlMQARBvzJ1foualwtPw3oM1w8w\nOcTS/tBzY/Wl5lMqFh2KoGsfVO9kX2h5dtqEOD7WtTRigMtSEcsSB59aMtyQ6tVn\nmqSxgAdtkKhmwJ91qfO1+NMKZwKBgQC93Hiydwu9ngeu2bhsOXEbeJug7AQE61ag\n9vHNK4CM5ZyK+Ano0oXUwoCfLD9PMQBPQBNOAbBMuiEWU4Iecw7+DNGIZVFP6En8\nkLzsfFtybuq5Wyi/OUQvj4JJjxqnxYpOyx7hCiE2S748/HpaSJtdbuRGSXj4Tm0e\nPGajqfrpOwKBgHER+38bwRX22V4Rj2Dwjqv/6uXXk2AVwo0gJ9Gwn3saSk+VUklx\nc+Nyr8pM9TpPYG18lrHeKCLACGI49RslwFACLIWmOcNavKZpAdTBubQiXKMHYb6p\nO5nLFO8MO4aBUtGRTnRO+h5n3J//4Mq7/Ww3j0I4S7n7XR24IgYCsMn/AoGAZCHW\n9iia5JJn8uuYvFs/MAHX8nMHW6DSu2oB9PcwgR7IBPL0JvqA4skCFPC9IwLw6tsc\nU1PIq26u7Jt2UKDWE16nU4w76izUeIPNX9vmTt/4o3FUeCW3tG23hRwYLsucOhoe\nWwmAoqYn2vo9fUg1yH0nn3o4dpzGJ+ArMb4AOukCgYATyhq19+Wy2M5eVcohpGCZ\ndL44rO17KLG5ics/neIZF32zKthQYKEGc3j0MgYmlguBWf1oUx8Hk5dDLocJoFHQ\nh17QxAhFZbt00UIz/CHO6C4wcTMBPDXqfN8uD7vGEzwQUWQc6YHFhAOrnykYkViK\nxfTznO6bw+OQnt7dpoh4AQ==\n-----END PRIVATE KEY-----\n"


admin.initializeApp({
    credential: admin.credential.cert({
        projectId:project_id,
        clientEmail:client_email,
        privateKey:private_key
    }),
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
