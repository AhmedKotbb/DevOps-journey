#!/bin/bash

hour_rate=50
read -p "please enter your working hours: " hours

salary=$((hours * hour_rate))
if [ $hours -lt 40 ]
then
    echo "there is salary deduction"
    salary=$((salary - (salary * 10 / 100)))
fi

echo "your salary is: $salary"
