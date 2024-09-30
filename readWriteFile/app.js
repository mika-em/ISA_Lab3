const http = require('http');
const {
    URL
} = require('url');
const {
    handleError
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
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                })
            }
            res.write(`File updated`);
            res.end();
        })
    }
    if (myURL.pathname === ("/read")) {
        fs.readFile(path, function (err, data) {
            if (err) {
                handleError(res, '500', err.message)
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write(data);
                return res.end();
            }
        })
    }
}).listen(port);