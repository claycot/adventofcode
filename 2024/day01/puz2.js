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
    // create a map from the second list, counting how many times each number occurs
    let list2Map = {};
    list2.forEach(num => {
        if (!list2Map.hasOwnProperty(num)) {
            list2Map[num] = 0;
        }

        list2Map[num]++;
    });

    // for each number in the first list, multiply its value by the amount of times it appeared in list2
    let similarityScore = 0;
    list1.forEach(num => {
        if (list2Map.hasOwnProperty(num)) {
            similarityScore += (num * list2Map[num]);
        }
    });

    // return the score
    console.log(similarityScore);
});;