const fs = require('fs');
const readline = require('readline');

// read reports from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let safeCount = 0;
fileIter.on('line', function (line) {
    let report = line.split(" ").map(strInt => parseInt(strInt, 10));

    // evaluate the report
    let success = evaluateReport(report);

    // if the report was unsafe, try removing a single digit from each position
    let iOmit = 0;
    while (success === 0 && iOmit < report.length) {
        let trialReport = report.filter((elem, index) => {
            return index !== iOmit;
        })

        success = evaluateReport(trialReport);
        iOmit++;
    }

    safeCount += success;
});

function evaluateReport(report) {
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
        return 0;
    }

    // compare pairs of adjacent values
    for (let i = 0; i + 1 < report.length; i++) {
        let diff = report[i + 1] - report[i];

        // sign already accounts for increasing/decreasing
        if (diff < minDiff || diff > maxDiff) {
            return 0;
        }
    }

    // if neither failure case was reached, add to safeCount
    return 1;
}

fileIter.on('close', function (_) {
    console.log(safeCount);
});