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
        let id = null;
        // first digit: assign an ID from the counter, allocate as many spaces to that counter
        if (i % 2 === 0) {
            id = counter;
            counter++;
        }
        // second digit: allocate free spaces

        // push the correct chunk of memory to the disk
        disk.push({
            "contents": id,
            "size": parseInt(line.charAt(i), 10),
        });
    }
});

fileIter.on('close', function (_) {
    // compact the disk space by pulling from the end of the disk first
    // two pointers:
    // one finding the leftmost null chunk (free space)
    let ptrFree = 0;

    // one finding the rightmost non-null chunk (next mover)
    let ptrLast = disk.length - 1;

    while (ptrLast > 0) {
        // find the rightmost chunk that needs to move
        while (ptrLast > 0 && disk[ptrLast].contents === null) {
            ptrLast--;
        }

        // find the first free space that it will fit into
        while (ptrFree < ptrLast && (disk[ptrFree].contents !== null || disk[ptrLast].size > disk[ptrFree].size)) {
            ptrFree++;
        }

        // console.log(`free pointer: ${ptrFree} => ${JSON.stringify(disk[ptrFree])}`);
        // console.log(`full pointer: ${ptrLast} => ${JSON.stringify(disk[ptrLast])}`);

        // if found, move that chunk
        if (ptrFree < ptrLast) {
            moveMemToFree(disk, ptrFree, ptrLast);
        }
        // otherwise, give up on moving this chunk
        else {
            // console.log(`giving up on moving chunk ${JSON.stringify(disk[ptrLast])}`);
            ptrLast--;
        }

        // restart seek index
        ptrFree = 0;
    }

    // console.log(disk.join(" "));
    console.log(checkSum(disk));
});

// checksum the new disk by multiplying values by their position
function checkSum(diskArr) {
    let sum = 0n;
    let counter = 0n;
    let diskString = "";
    for (let i = 0; i < diskArr.length; i++) {
        for (let j = 0; j < diskArr[i].size; j++) {
            if (diskArr[i].contents !== null) {
                sum += counter * BigInt(diskArr[i].contents);
            }
            diskString += diskArr[i].contents + " "
            counter++;
        }
    }
    console.log(diskString);
    return sum;
}

// move from src to dest
function moveMemToFree(disk, ptrDest, ptrSrc) {
    // console.log(`before:`);
    // console.log(disk.map(mem => JSON.stringify(mem)).join(" "));
    // depending on the amount of space, move the chunk to the free memory
    let leftoverSpace = disk[ptrDest].size - disk[ptrSrc].size;

    // if the destination has more size than the source, fill the start of it
    if (leftoverSpace > 0) {
        disk[ptrDest] = {
            "contents": disk[ptrSrc].contents,
            "size": disk[ptrSrc].size,
        };
        disk[ptrSrc].contents = null;
        // create a new element to represent the leftover null space
        disk.splice(ptrDest + 1, 0, {
            "contents": null,
            "size": leftoverSpace,
        });
    }
    // if the destination has the same size as the source, swap their contents
    else if (leftoverSpace === 0) {
        let swap = disk[ptrDest].contents;
        disk[ptrDest].contents = disk[ptrSrc].contents;
        disk[ptrSrc].contents = swap;
    }
    // if the destination has less size than the source, do nothing
    else {
    }

    let status = {
        "moved": leftoverSpace >= 0,
        "free": leftoverSpace,
    };

    // console.log(`after:`);
    // console.log(disk.map(mem => JSON.stringify(mem)).join(" "));

    // console.log(status);

    return status;
}


