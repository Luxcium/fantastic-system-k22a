#!/bin/bash

# Start Next.js dev server in background
cd "$(dirname "$0")/../../web" || exit 1
next dev -p 3022 &
DEV_PID=$!

echo "Starting development server..."

# Wait for port 3022 to be available (max 30 seconds)
timeout=30
while ! curl -s http://localhost:3022 > /dev/null 2>&1; do
    sleep 0.5
    timeout=$(echo "$timeout - 0.5" | bc)
    if (( $(echo "$timeout <= 0" | bc -l) )); then
        echo "Timeout waiting for server to start"
        kill $DEV_PID
        exit 1
    fi
done

echo "Server ready! Opening Chrome..."
/usr/bin/google-chrome http://localhost:3022 &

# Wait for the dev server process
wait $DEV_PID
