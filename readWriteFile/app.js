const http = require('http');
const {
    URL
} = require('url');
const {
    handleError,
    formatTextFile
} = require('./modules/utils.js');
var fs = require('fs');
const port = process.env.PORT || 3000;


http.createServer(function (req, res) {
    const myURL = new URL(req.url, `https://${req.headers.host}`);
    const path = "text.txt"


    if (myURL.searchParams.has("text")) {
        const text = myURL.searchParams.get("text");
        fs.appendFile(path, `${text}\n`, function (err) {
            if (err) {
                handleError(res, '500', err.message)
            } else {
                if (!fs.existsSync(path)) {
                    fs.writeFileSync(path, "");
                }
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                })
            }
            res.write(`File updated. "${text}" appended to file.`);
            res.end();
        })
    } else if (myURL.pathname === ("/read")) {
        fs.readFile(path, function (err, text) {
            const formattedText = formatTextFile(text)
            if (err) {
                handleError(res, '500', err.message)
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write(formattedText);
                return res.end();
            }
        })
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
                <li><strong>/?text=YourTextHere</strong>: Appends the specified text to the file <code>text.txt</code>.</li>
                <li><strong><a href="/read">/read</a></strong>: Reads the contents of the file <code>text.txt</code> and displays it on the screen.</li>
            </ul>
`)
    }
}).listen(port);