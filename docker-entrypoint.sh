#!/bin/bash
cp /usr/src/app/public/schema.json ./

# Start Gunicorn processes
echo Starting Webpack.
exec webpack-dev-server
