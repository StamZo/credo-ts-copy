#!/bin/bash

# Clear Credo agent storage
echo "Clearing Credo agent storage..."

# Default storage location for Askar wallets
rm -rf ~/.indy_client/
rm -rf ~/.aries/
rm -rf ~/.credo/

# Also check current directory
rm -rf ./.indy_client/
rm -rf ./.aries/
rm -rf ./.credo/

# Clear any SQLite files that might be used
rm -f *.sqlite
rm -f *.sqlite3
rm -f *.db

echo "Storage cleared successfully!"