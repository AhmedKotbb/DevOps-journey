#!/bin/bash

cities=("cairo" "alexandria" "giza")

echo "the second city in the array is: ${cities[1]}"

read -p "enter new city: " new_city
cities+=("$new_city")
echo "cities now are: ${cities[@]}"
echo "number of current cities: ${#cities[@]}"


read -p "Enter another city name (to replace first one): " replace_city
cities[0]="$replace_city"
echo "cities are: ${cities[@]}"
