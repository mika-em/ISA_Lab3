const http = require('http');
const {
    URL
} = require('url');
const {
    message
} = require("./lang/en/user.js");
const {
    getDate
} = require("./modules/utils.js");
const port = process.env.PORT || 3000;

http.createServer(function (req, res) {
    const myURL = new URL(req.url, `http://${req.headers.host}`)
    const name = myURL.searchParams.get("name");
    const newMsg = message.replace("%1", name);
    const date = getDate();
    const response = `<div style="color: blue"> ${newMsg} ${date} </div>`;
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write(response);
    res.end();
}).listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});