const fs = require('fs');
const readline = require('readline');

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

// make a 2D map of the search area
const map = [];
const directions = {
    "^": {dir: [-1, 0], next: ">"},
    ">": {dir: [0, 1], next: "v"},
    "v": {dir: [1, 0], next: "<"},
    "<": {dir: [0, -1], next: "^"},
};
let pos = null;

// assemble the map
fileIter.on('line', function (line) {
    // add the line to the map
    map.push([]);
    line.split("").forEach((char, index) => {
        if (!pos && directions.hasOwnProperty(char)) {
            pos = [map.length - 1, index];
        }
        map[map.length - 1].push(char);
    });
});

// iterate while the guard is within the search area, counting their positions
fileIter.on('close', function (_) {
    let searchCount = 0;
    let directionChar = map[pos[0]][pos[1]];

    console.log(pos);
    console.log(directionChar);

    // while the guard is within the search area,
    while (pos[0] >= 0 && pos[0] <= map.length &&
        pos[1] >= 0 && pos[1] <= map[0].length) {
        // if the current space isn't an X, count it then mark it as visited
        if (map[pos[0]][pos[1]] !== "X") {
            searchCount++;
            map[pos[0]][pos[1]] = "X";
        }
        // if it is an X, do nothing!

        // if there is nothing blocking, move forward
        let nextPos = [pos[0] + directions[directionChar].dir[0], pos[1] + directions[directionChar].dir[1]];
        // if there is something blocking, turn right
        if (map[nextPos[0]][nextPos[1]] === "#") {
            directionChar = directions[directionChar].next;
            nextPos = [pos[0] + directions[directionChar].dir[0], pos[1] + directions[directionChar].dir[1]];
        }
        else {
        }

        pos = nextPos;
    }

    console.log(searchCount);
});