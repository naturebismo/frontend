#!/bin/bash
# build for production
wget http://naturebismo.com/public/schema.json -O /app/schema.json && npm_lifecycle_event=build NODE_ENV=production webpack -p

# Start Gunicorn processes
echo Starting Webpack.
exec webpack-dev-server
