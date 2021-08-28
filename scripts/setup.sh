#!/bin/bash
# Run this script on startup

# Create the tmp folder
mkdir .tmp/ || true

# Move potential credentials in enviroment variables to the config folder
if [ -n "$CREDENTIALS" ]; then
    echo "Found a credentials file in the enviroment variables."

    if [ -f "config/credentials.json" ]; then
        mv "config/credentials.json" "config/old-credentials.json"
        echo "Found an already existing credentials file. Moved the old credentials file to config/old-credentials.json"
    fi

    echo "$CREDENTIALS" > "config/credentials.json"
fi

echo "Setup complete."
