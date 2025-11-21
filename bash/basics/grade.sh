#!/bin/bash

read -p "Enter your grade: " grade
if ! [[ $grade =~ ^[0-9]+$ ]]; then
    echo "Error: Please enter a valid non-negative number."
    exit 1
fi

if (( grade < 0 || grade > 100 )); then
    echo "Error: Grade must be between 0 and 100."
    exit 1
fi


if (( grade < 50 )); then
    rating="Failed"
elif (( grade < 65 )); then
    rating="Normal"
elif (( grade < 75 )); then
    rating="Good"
elif (( grade < 85 )); then
    rating="Very Good"
else
    rating="Excellent"
fi

echo "Your rating is $rating"
