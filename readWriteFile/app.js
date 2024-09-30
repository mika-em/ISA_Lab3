const http = require('http');
const {
    URL
} = require('url');
const {
    handleError,
    formatTextFile
} = require('./modules/utils.js');

let path = path.join(__dirname, 'file.txt');

//Write
http.createServer(async function (req, res) {
    const myURL = new URL(req.url, `http://${req.headers.host}`);
    if (myURL.searchParams.has("text")) {
        const text = myURL.searchParams.get("text");
        try {
            if (!fs.existsSync(repoFilePath)) {
                return res.writeHead(404, {
                    'Content-Type': 'text/html'
                }).end("File not found");
            }

            fs.appendFileSync(path, text);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.write(`File updated. "${text}" appended to file.`);
        } catch (err) {
            handleError(res, '500', err.message);
        }
        res.end();

    } else if (myURL.pathname.startsWith("/read/")) {
        const fileName = path.basename(pathname);
        const possibleFilePath = path.join(__dirname, fileName);
        try {
            if (!fs.existsSync(possibleFilePath)) {
                return res.writeHead(404, {
                    'Content-Type': 'text/html'
                }).end(` ${fileName} does not exist or is not found`);
            }
            const text = fs.readFileSync(possibleFilePath, 'utf-8');
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
            <p>Or use the following endpoints:</p>
            <ul>
                <li><strong>/?text=YourTextHere</strong>: Appends the specified text to the file <code>file.txt</code>.</li>
                <li><strong><a href="/read">/read</a></strong>: Reads the contents of the file <code>file.txt</code> and displays it on the screen.</li>
            </ul>
        `);
        res.end();
    }
}).listen(port);