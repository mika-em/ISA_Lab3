const http = require('http');
const {
    URL
} = require('url');
const {
    handleError,
    formatTextFile
} = require('./modules/utils.js');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 3000;
const myPath = path.join('/tmp', 'file.txt');

http.createServer(async function (req, res) {
    const myURL = new URL(req.url, `http://${req.headers.host}`);
    if (myURL.searchParams.has("text")) {
        const text = myURL.searchParams.get("text");
        try {
            if (!fs.existsSync(myPath)) {
                fs.writeFileSync(myPath, '');
            }
            fs.appendFile(myPath, `\n${text}`, (err) => {
                if (err) {
                    handleError(res, '500', err.message);
                    return;
                }
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write(`File updated. "${text}" appended to file.txt`);
                res.end();
            });
        } catch (err) {
            handleError(res, '500', err.message);
            res.end();
        }

        // Handle reading the file
    } else if (myURL.pathname.startsWith("/read/")) {
        const requestedFileName = path.basename(myURL.pathname);
        const requestedFilePath = path.join('/tmp', requestedFileName);

        try {
            if (!fs.existsSync(requestedFilePath)) {
                return res.writeHead(404, {
                    'Content-Type': 'text/html'
                }).end(`${requestedFileName} does not exist or is not found`);
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


    } else if (myURL.pathname === "/view-file") {
        try {
            if (!fs.existsSync(myPath)) {
                return res.writeHead(404, {
                    'Content-Type': 'text/html'
                }).end("file.txt does not exist or is not found in /tmp");
            }

            const fileContents = fs.readFileSync(myPath, 'utf-8');
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(`<h2>Contents of file.txt:</h2><pre>${fileContents}</pre>`);
            res.end();
        } catch (err) {
            handleError(res, '500', err.message);
            res.end();
        }
    } else {

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(`
            <h2>Enter text to add to file.txt</h2>
            <form action="/" method="GET">
                <label for="text">Text to Add:</label>
                <input type="text" id="text" name="text" required>
                <button type="submit">Submit</button>
            </form>
            <br>

<h2>Enter the file you want to find</h2>
<form id="searchForm" method="GET">
    <label for="file">File to search (make sure to include the extension):</label>
    <input type="text" id="file" name="file" required>
    <button type="submit" onclick="this.form.action = '/read/' + encodeURIComponent(document.getElementById('file').value);">Submit</button>
</form>
<br>

        <h2>View Contents of file.txt</h2>
            <p>Click <a href="/view-file">here</a> to view the contents of <code>file.txt</code> in the /tmp directory.</p>
            <p>Or use the following endpoints:</p>
            <ul>
            
                <li><strong>/?text=YourTextHere</strong>: Appends the specified text to the file <code>file.txt</code>.</li>
                <li><strong><a href="/read/file.txt">/read/file.txt</a></strong>: Reads the contents of the file <code>file.txt</code> and displays it on the screen.</li>
            </ul>
        `);
        res.end();
    }
}).listen(port);