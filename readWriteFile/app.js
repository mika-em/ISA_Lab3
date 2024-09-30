const http = require('http');
const { URL } = require('url');
const { handleError, formatTextFile } = require('./modules/utils.js');

// Import Firebase dependencies
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, set, update, child } = require('firebase/database');

// Firebase configuration (replace these values with your own Firebase config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

// Initialize Firebase app and database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const port = process.env.PORT || 3000;

// Firebase path to store the file content (using `file.txt` as a node in the database)
const filePath = 'file.txt';

http.createServer(async function (req, res) {
    const myURL = new URL(req.url, `http://${req.headers.host}`);

    // Check if the request has the "text" query parameter
    if (myURL.searchParams.has("text")) {
        const text = myURL.searchParams.get("text");
        try {
            // Read the current content from Firebase
            const fileRef = ref(database, filePath);
            const snapshot = await get(fileRef);
            let currentContent = snapshot.exists() ? snapshot.val() : '';

            // Append the new text to the existing content
            const newContent = `${currentContent}\n${text}`;
            
            // Write the updated content back to Firebase
            await set(fileRef, newContent);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(`File updated. "${text}" appended to file.`);
        } catch (err) {
            handleError(res, '500', err.message);
        }
        res.end();

    // Check if the pathname is "/read" and try to read the content from Firebase
    } else if (myURL.pathname === "/read") {
        try {
            const fileRef = ref(database, filePath);
            const snapshot = await get(fileRef);

            if (snapshot.exists()) {
                const text = snapshot.val();
                const formattedText = formatTextFile(text);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(formattedText);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.write("File does not exist yet. Add some text first.");
            }
        } catch (err) {
            handleError(res, '500', err.message);
        }
        res.end();

    // Default response for the root path or other paths without parameters
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
            <h2>Enter Text to Add to the File</h2>
            <form action="/" method="GET">
                <label for="text">Text to Add:</label>
                <input type="text" id="text" name="text" required>
                <button type="submit">Submit</button>
            </form>
            <br>
            <p>Or use the following endpoints:</p>
            <ul>
                <li><strong>/?text=YourTextHere</strong>: Appends the specified text to the file <code>file.txt</code>.</li>
                <li><strong><a href="/read">/read</a></strong>: Reads the contents of the file <code>file.txt</code> and displays it on the screen.</li>
            </ul>
        `);
        res.end();
    }
}).listen(port);