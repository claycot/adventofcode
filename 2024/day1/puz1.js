const fs = require('fs');
const readline = require('readline');

// create both lists
let list1 = [];
let list2 = [];

// read lists from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

fileIter.on('line', function (line) {
    let vals = line.split(" ");

    list1.push(vals[0]);
    list2.push(vals[vals.length - 1]);
});

fileIter.on('close', function (_) {
    // sort both lists
    list1.sort();
    list2.sort();

    // compare at each index, adding to the sum
    let sum = 0;
    for (let i = 0; i < list1.length; i++) {
        let diff = list1[i] - list2[i];

        if (diff < 0) {
            sum -= diff;
        }
        else {
            sum += diff;
        }
    }

    // return the sum
    console.log(sum);
});