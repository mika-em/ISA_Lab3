const http = require('http');
const {
    URL
} = require('url');
const {
    handleError,
    formatTextFile
} = require('./modules/utils.js');
const path = require('path');
let myPath = path.join(__dirname, 'file.txt');

//Write
http.createServer(async function (req, res) {
    const myURL = new URL(req.url, `http://${req.headers.host}`);

    if (myURL.searchParams.has("text")) {
        const text = myURL.searchParams.get("text");
        try {
            if (!fs.existsSync(myPath)) {
                return res.writeHead(404, {
                    'Content-Type': 'text/html'
                }).end("File not found");
            }

            fs.appendFileSync(myPath, text);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.write(`File updated. "${text}" appended to file ${myPath}.`);
        } catch (err) {
            handleError(res, '500', err.message);
        }
        res.end();

//Read
    } else if (myURL.pathname.startsWith("/read/")) {
        const requestedFileName = path.basename(pathname);
        const requestedFilePath = path.join(__dirname, requestedFileName);
        try {
            if (!fs.existsSync(requestedFilePath)) {
                return res.writeHead(404, {
                    'Content-Type': 'text/html'
                }).end(` ${requestedFileName} does not exist or is not found`);
            }
            const text = fs.readFileSync(requestedFilePath, 'utf-8');
            const formattedText = formatTextFile(text);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(formattedText);
        } catch (err) {
            handleError(res, '500', err.message);
        }
        res.end();

    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(`
            <h2>Enter Text to Add to the File</h2>
            <form action="/" method="GET">
                <label for="text">Text to Add:</label>
                <input type="text" id="text" name="text" required>
                <button type="submit">Submit</button>
            </form>
            <br>

            <h2>Enter the file you want to find:</h2>
            <form action="/read" method="GET">
                <label for="text">File to search (make sure to include the extension):</label>
                <input type="text" id="file" name="file" required>
                <button type="submit">Submit</button>
            </form>

            <p>Or use the following endpoints:</p>
            <ul>
                <li><strong>/?text=YourTextHere</strong>: Appends the specified text to the file <code>file.txt</code>.</li>
                <li><strong><a href="/read">/read</a></strong>: Reads the contents of the file <code>file.txt</code> and displays it on the screen.</li>
            </ul>
        `);
        res.end();
    }
}).listen(port);