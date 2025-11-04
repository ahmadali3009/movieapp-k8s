#!/bin/sh

# This script generates runtime environment variables for the React app
# It replaces placeholders in the index.html with actual environment variables

# Path to the HTML file
HTML_FILE=/usr/share/nginx/html/index.html

# Replace environment variables in the HTML file
if [ -f "$HTML_FILE" ]; then
  echo "Injecting environment variables into $HTML_FILE"
  
  # Create a JavaScript snippet that will define the runtime environment variables
  ENV_SCRIPT="<script>window.env = {"
  
  # Add API URL if provided
  if [ ! -z "$API_URL" ]; then
    ENV_SCRIPT="${ENV_SCRIPT}\"API_URL\":\"$API_URL\","
  fi
  
  # Add other environment variables as needed
  if [ ! -z "$APP_ENV" ]; then
    ENV_SCRIPT="${ENV_SCRIPT}\"APP_ENV\":\"$APP_ENV\","
  fi
  
  # Remove trailing comma if it exists
  ENV_SCRIPT="${ENV_SCRIPT%,}"
  
  # Close the JavaScript object and script tag
  ENV_SCRIPT="${ENV_SCRIPT}};</script>"
  
  # Insert the script right after the opening head tag
  sed -i "s|<head>|<head>${ENV_SCRIPT}|" $HTML_FILE
  
  echo "Environment variables injected successfully"
else
  echo "Error: $HTML_FILE not found"
  exit 1
fi
