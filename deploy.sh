#!/bin/bash

# === CONFIG SECTION ===
PEM_FILE=~/scripts/frankfurt-key.pem
REMOTE_USER=ubuntu
REMOTE_HOST=app.wedevz.io
REMOTE_PATH=/home/ubuntu/scripts/angular-client/browser
DIST_FOLDER=dist/cv-tracker/browser

# === Start Script ===
echo "🔧 Building Angular app..."
npm run build -- --configuration production

# === Check build output ===
if [ ! -d "$DIST_FOLDER" ]; then
  echo "❌ Build failed or output folder not found: $DIST_FOLDER"
  exit 1
fi

echo "🧹 Cleaning target folder on EC2..."
ssh -i "$PEM_FILE" $REMOTE_USER@$REMOTE_HOST "rm -rf $REMOTE_PATH/*"

echo "🚀 Uploading to $REMOTE_USER@$REMOTE_HOST..."
scp -i "$PEM_FILE" -r $DIST_FOLDER/* $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/

if [ $? -eq 0 ]; then
  echo "✅ Deployed successfully: https://$REMOTE_HOST"
else
  echo "❌ Deployment failed"
  exit 1
fi
