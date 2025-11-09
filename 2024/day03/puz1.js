const fs = require('fs');

// regex the string for 
const regexMul = /mul\((?<num1>[0-9]{1,3}),(?<num2>[0-9]{1,3})\)/gi;

// get the string input
fs.readFile('input.txt', 'utf8', (err, data) => {

    // for each match, multiply the first group by the second group, then add to the running total
    const mulGroups = data.matchAll(regexMul);
    let sum = 0;
    for (const match of mulGroups) {
        // console.log(match.index);
        sum += (parseInt(match.groups.num1, 10) * parseInt(match.groups.num2, 10));
    }

    console.log(sum);
})

