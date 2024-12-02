const fs = require('fs');
const readline = require('readline');

// read reports from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let safeCount = 0;
fileIter.on('line', function (line) {
    let report = line.split(" ").map(strInt => parseInt(strInt, 10));

    // track if increasing or decreasing
    let minDiff;
    let maxDiff;
    // set magic numbers for min and max diffs between vals
    if (report[0] < report[1]) {
        minDiff = 1;
        maxDiff = 3;
    }
    else if (report[0] > report[1]) {
        minDiff = -3;
        maxDiff = -1;
    }
    else {
        return;
    }

    // compare pairs of adjacent values
    for (let i = 0; i + 1 < report.length; i++) {
        let diff = report[i + 1] - report[i];

        // sign already accounts for increasing/decreasing
        if (diff < minDiff || diff > maxDiff) {
            return;
        }
    }

    // if neither failure case was reached, add to safeCount
    safeCount++;
    return;
});

fileIter.on('close', function (_) {
    console.log(safeCount);
});