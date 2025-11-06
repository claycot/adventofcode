import fs from "node:fs";
import readLine from "node:readline";

const lineReader = readLine.createInterface({
    input: fs.createReadStream("input.txt"),
});

// each key is an array of heights from bottom (leftmost pin = 0)
const keys: number[][] = [];
// each lock is an array of heights from top (leftmost pin = 0)
const locks: number[][] = [];

// store state of reader (within key, within lock, neither)
let state: string = "n";

// read in the keys and locks
lineReader.on("line", function (line) {
    // if the line is blank, reset the state
    if (!line.length) {
        state = "n";
    }
    // if the line is not blank...
    // and the state is "n", we're in the first line of a lock or key!
    else if (state === "n") {
        // locks are blocks that have # as the first character on their first line
        if (line[0] === "#") {
            state = "l";
            locks.push(new Array(line.length).fill(0));
        }
        // keys are blocks that have . as the first character on their first line
        else if (line[0] === ".") {
            state = "k";
            // start at -1 because we don't discard the ##### row as we do with locks
            keys.push(new Array(line.length).fill(-1));
        }
    }
    // if we're within a lock or key, iterate over the line and increment when we see a #
    else {
        buildLockOrKey(line);
    }

});

lineReader.on("close", function () {
    console.log("keys and locks read in!\r\n");

    let combinations: number = 0;

    // try each key in each lock
    console.log(`jamming every key into every lock...`);
    locks.forEach(lock => {
        keys.forEach(key => {
            let fits: boolean = true;
            for (let p = 0; p < key.length; p++) {
                if (lock[p] + key[p] >= 6) {
                    fits = false;
                    break;
                }
            }
            if (fits) {
                combinations++;
            }
        });
    });

    console.log(`I jammed ${keys.length} keys into ${locks.length} locks and ${combinations} worked!\r\n`);
});

function buildLockOrKey(line: string): void {
    let rowIndex: number = 0;

    if (state === "l") {
        rowIndex = locks.length - 1;

        for (let i: number = 0; i < line.length; i++) {
            if (line[i] === "#") {
                locks[rowIndex][i]++;
            }
        }
    }
    else if (state === "k") {
        rowIndex = keys.length - 1;

        for (let i: number = 0; i < line.length; i++) {
            if (line[i] === "#") {
                keys[rowIndex][i]++;
            }
        }
    }
    
    return;
}
