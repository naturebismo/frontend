import express from 'express';
import proxy from 'express-http-proxy';
import parseUrl from 'parseurl';
import fs from 'fs';
import send from 'send';
import path from 'path';
import renderOnServer from './renderOnServer'

const APP_PORT = 8080;

var app = express();

app.use('/graphql', proxy('localhost:9090', {
  forwardPath: function(req, res) {
    return '/graphql';
  }
}));

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

app.listen(APP_PORT, () => {
    console.log(`App is now running on http://localhost:${APP_PORT}`);
});
