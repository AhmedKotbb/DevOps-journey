#!/bin/bash

STATUS_FILE="ticket_status"
EVENTS_FILE="events_tickets.txt"
OUTPUT_FILE="events_status.txt"

# Ask user to enter incident number
read -p "Enter the incident number: " INC

# Check if incident exists in ticket_status
STATUS=$(grep "^$INC " "$STATUS_FILE" | awk '{print $2}')

if [ -z "$STATUS" ]; then
    echo "Incident number not found."
    exit 1
fi

# Get the event ID from events_tickets.txt
EVENT=$(grep "^$INC " "$EVENTS_FILE" | awk '{print $2}')

if [ -z "$EVENT" ]; then
    echo "Event not found for this incident."
    exit 1
fi

# If incident is closed then write to events_status.txt, else do nothing
if [ "$STATUS" == "closed" ]; then
    echo "$EVENT closed" > "$OUTPUT_FILE"
    echo "Event: $EVENT  | Status: CLOSED"
    echo "A record has been created in $OUTPUT_FILE"
else
    echo "Event: $EVENT  | Status: STILL OPEN"
fi
