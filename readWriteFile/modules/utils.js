

export function handleError(res, status, message) {
    res.writeHead(status, {'Content-Type': 'text/html'});
    res.write(`<div style="color: red"> ${message} </div>`);
    res.end();
}

export function formatTextFile(text) {
    return String(text).replace(/\n/g, '<br>');
}