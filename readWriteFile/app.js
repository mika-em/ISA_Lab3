const http = require('http');
const { URL } = require('url');
const { handleError, formatTextFile } = require('./modules/utils.js');
const fs = require('fs');

const port = process.env.PORT || 3000;
const path = "/tmp/text.txt"; // Ensure compatibility with Vercel

http.createServer(function (req, res) {
    // Use http in URL, not https (for local servers)
    const myURL = new URL(req.url, `http://${req.headers.host}`);

    // Check if the request has the "text" query parameter
    if (myURL.searchParams.has("text")) {
        const text = myURL.searchParams.get("text");
        try {
            // Append text to the file using fs.appendFileSync
            fs.appendFileSync(path, `${text}\n`);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(`File updated. "${text}" appended to file.`);
        } catch (err) {
            // Handle errors using the handleError function
            handleError(res, '500', err.message);
        }
        res.end();

    // Check if the pathname is "/read" and try to read the file
    } else if (myURL.pathname === "/read") {
        try {
            if (fs.existsSync(path)) {
                const text = fs.readFileSync(path, 'utf-8');
                const formattedText = formatTextFile(text);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(formattedText);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write("File does not exist yet. Add some text first.");
            }
        } catch (err) {
            handleError(res, '500', err.message);
        }
        res.end();

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
                <li><strong>/?text=YourTextHere</strong>: Appends the specified text to the file <code>text.txt</code>.</li>
                <li><strong><a href="/read">/read</a></strong>: Reads the contents of the file <code>text.txt</code> and displays it on the screen.</li>
            </ul>
        `);
        res.end();
    }
}).listen(port);