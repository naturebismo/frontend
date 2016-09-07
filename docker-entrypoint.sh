#!/bin/bash
cp /usr/src/app/public/schema.json ./
npm run build # build deploy version


# Start Gunicorn processes
echo Starting Webpack.
exec webpack-dev-server
