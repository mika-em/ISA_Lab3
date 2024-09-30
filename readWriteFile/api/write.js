import {
    initializeApp
} from 'firebase/app';
import {
    getDatabase,
    ref,
    push,
    get,
    set
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
        const url = new URL(req.url, `https://${req.headers.host}`);
        const text = url.searchParams.get('text');
        if (!text) {
            res.status(400).json({
                error: 'Query parameter "text" is required'
            });
            return;
        }

        const fileRef = ref(database, 'file.txt');
        const snapshot = await get(fileRef);
        let currentContent = snapshot.exists() ? snapshot.val() : '';
        const newContent = `${currentContent}\n${text}`;
        await set(fileRef, newContent);

        res.status(200).json({
            message: `Text "${text}" has been appended to file.txt`
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}