const fs = require('fs');
const readline = require('readline');

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let disk = [];
let counter = 0;

// read in the current disk space
fileIter.on('line', function (line) {
    // digits in the string alternate
    for (let i = 0; i < line.length; i++) {
        // first digit: assign an ID from the counter, allocate as many spaces to that counter
        if (i % 2 === 0) {
            for (let j = 0; j < parseInt(line.charAt(i), 10); j++) {
                disk.push(counter);
            }
            counter++;
        }
        // second digit: allocate free spaces
        else {
            for (let j = 0; j < parseInt(line.charAt(i), 10); j++) {
                disk.push(".");
            }
        }
    }
});

fileIter.on('close', function (_) {
    // compact the disk space by pulling from the end of the disk first
    // two pointers:
    // one finding the leftmost . chunk (free space)
    let ptrFree = 0;

    // one finding the rightmost non-. chunk (next mover)
    let ptrLast = disk.length - 1;

    // swap pointers until they converge
    while (true) {
        while (disk[ptrFree] !== "." && ptrFree < disk.length - 1) {
            ptrFree++;
        }
        // console.log(`ptrFree is at index ${ptrFree} => ${disk[ptrFree]}`);
        while (disk[ptrLast] === "." && ptrLast > 1) {
            ptrLast--;
        }
        // console.log(`ptrLast is at index ${ptrLast} => ${disk[ptrLast]}`);

        if (ptrFree >= ptrLast) {
            break;
        }
        disk[ptrFree] = disk[ptrLast];
        disk[ptrLast] = ".";
    }

    // console.log(disk.join(" "));
    console.log(checkSum(disk));
});

// checksum the new disk by multiplying values by their position
function checkSum(diskArr) {
    let sum = 0n;
    for (let i = 0; i < diskArr.length; i++) {
        if (diskArr[i] === ".") {
            break;
        }
        sum += BigInt(i) * BigInt(diskArr[i]);
    }
    return sum;
}
