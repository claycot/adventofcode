import fs from "node:fs";
import readLine from "node:readline";

const lineReader = readLine.createInterface({
    input: fs.createReadStream("input.txt"),
});

let stones: Record<string, number> = {};

// memoize the stones that result from blinking a given stone
const stoneMemo: Record<string, string[]> = {};

// read in the stones
lineReader.on("line", function (line) {
    line.split(" ").forEach((stone) => {
        if (!stones.hasOwnProperty(stone)) {
            stones[stone] = 0;
        }
        stones[stone]++;
    });
});

lineReader.on("close", function () {
    // iterate over the blink cycles
    for (let b = 0; b < 75; b++) {
        stones = blinkStones(stones);
    }
    console.log(
        Object.values(stones).reduce((acc, curr) => acc += curr, 0),
    );
});

// given a set of stones and a number of blinks, return the resulting stones
function blinkStones(stones: Record<string, number>): Record<string, number> {
    const newStones: Record<string, number> = {};

    Object.keys(stones).map((stone) => {
        blinkStone(stone).forEach((newStone) => {
            if (!newStones.hasOwnProperty(newStone)) {
                newStones[newStone] = 0;
            }
            // we are always going to have 1 stone, multiplied by the number of parent stones
            newStones[newStone] += stones[stone];
        });
    });

    return newStones;
}

// given a SINGLE stone, return the resulting stones
function blinkStone(stone: string): string[] {
    let newStones: string[] = [];

    // if we have already done this stone, return the result from before
    if (stoneMemo.hasOwnProperty(stone)) {
        newStones = stoneMemo[stone];
    } // otherwise, calculate the new stones
    else {
        if (stone === "0") {
            newStones.push("1");
        } else if (stone.length % 2 === 0) {
            newStones.push(
                parseInt(stone.substring(0, stone.length / 2), 10).toString(),
            );
            newStones.push(
                parseInt(stone.substring(stone.length / 2), 10).toString(),
            );
        } else {
            newStones.push((parseInt(stone, 10) * 2024).toString());
        }

        stoneMemo[stone] = newStones;
    }

    return newStones;
}
