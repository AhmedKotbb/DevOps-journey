#!/bin/bash

read -p "please enter integer number: " num
if (( num % 2 == 0 ))
then
    echo "$num is even"
else
    echo "$num is odd"
fi
