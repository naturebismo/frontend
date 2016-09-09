import express from 'express';
import proxy from 'express-http-proxy';
import parseUrl from 'parseurl';
import fs from 'fs';
import send from 'send';
import path from 'path';
import renderOnServer from './renderOnServer';

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';

var app = express();

app.get('*', (req, res, next) => {
    var urlpath = parseUrl(req).pathname
    var filename = urlpath.substr(1);
    fs.exists(filename, function(exists) {
        if (exists) {
            express.static(path.resolve(__dirname, '.'))(req, res, next);
        } else {
            renderOnServer(req, res, next);
        }
    });
});

app.listen(PORT, HOST, () => {
    console.log(`App is now running on http://localhost:${PORT}`);
});
