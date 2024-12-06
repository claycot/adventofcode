const fs = require('fs');
const readline = require('readline');

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input_small.txt')
});

// make a 2D map of the search area
const map = [];
const directions = {
    "^": { dir: [-1, 0], next: ">" },
    ">": { dir: [0, 1], next: "v" },
    "v": { dir: [1, 0], next: "<" },
    "<": { dir: [0, -1], next: "^" },
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
    let directionChar = map[pos[0]][pos[1]];
    let obstacleCount = 0;

    console.log(pos);
    console.log(directionChar);

    // while the guard is within the search area,
    while (true) {
        if (map[pos[0]][pos[1]] !== ".") {
            console.log(`I'm heading in ${directionChar} and I just came across ${map[pos[0]][pos[1]]}`);
        }
        
        // if the current space has been visited before, and is the result of turning right, adding an obstacle in front would loop
        if (map[pos[0]][pos[1]] === directions[directionChar].next) {
            console.log(`found a loop! adding obstacle at ${pos}`);
            obstacleCount++;
        }

        // mark the current space with the current direction
        map[pos[0]][pos[1]] = directionChar;

        // if there is nothing blocking, move forward
        let nextPos = [pos[0] + directions[directionChar].dir[0], pos[1] + directions[directionChar].dir[1]];

        // break when the guard leaves the search area
        if (nextPos[0] < 0 || nextPos[0] >= map.length ||
            nextPos[1] < 0 || nextPos[1] >= map[0].length) {
            break;
        }

        // if there is something blocking, turn right
        if (map[nextPos[0]][nextPos[1]] === "#") {
            directionChar = directions[directionChar].next;
            nextPos = [pos[0] + directions[directionChar].dir[0], pos[1] + directions[directionChar].dir[1]];
        }

        pos = nextPos;
    }

    console.log(obstacleCount);
    map.forEach(line => {
        console.log(line.join(""))
    })
});