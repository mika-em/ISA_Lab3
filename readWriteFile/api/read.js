import {
    initializeApp
} from 'firebase/app';
import {
    getDatabase,
    ref,
    get
} from 'firebase/database';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default async function handler(req, res) {
    try {
        const fileRef = ref(database, 'file.txt');
        const snapshot = await get(fileRef);

        if (!snapshot.exists()) {
            res.status(404).json({
                error: 'File file.txt does not exist'
            });
            return;
        }

        const content = snapshot.val();
        res.status(200).send(`<pre>${content}</pre>`);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}