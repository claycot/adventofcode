import fs from 'node:fs';
import readline from 'node:readline';

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt'),
});

const map: string[][] = [];
const instructions: string[] = [];

// direction char to movement vector
const dirToVec: Record<string, number[]> = {
    "^": [-1, 0],
    ">": [0, 1],
    "v": [1, 0],
    "<": [0, -1],
};

let robLoc: number[];

rl.on('line', (line) => {
    // assemble the map
    if (line.charAt(0) === "#") {
        map.push([]);
        line.split("").forEach((char, index) => {
            if (char === "@") {
                robLoc = [map.length - 1, index];
            }
            map[map.length - 1].push(char);
        });
    }
    // add instructions
    else {
        line.split("").forEach(instruction => {
            instructions.push(instruction);
        });
    }
});

rl.on('close', () => {
    console.log(map);
    console.log(instructions);
    console.log(robLoc);

    for (let i = 0; i < instructions.length; i++) {
        if (moveInDir(map, robLoc, instructions[i], ".")) {
            robLoc = [robLoc[0] + dirToVec[instructions[i]][0], robLoc[1] + dirToVec[instructions[i]][1]];
        };
    };

    map.forEach(row => {
        console.log(row.join(" "));
    });

    console.log(scoreMap(map));
});

// given a cell, move the contents in a given direction
// carry the contents from behind
function moveInDir(map: string[][], cell: number[], dir: string, carry: string): boolean {
    // the current cell that we want to move
    const [r, c] = cell;
    // the next cell we want to move into
    const [nextR, nextC] = [r + dirToVec[dir][0], c + dirToVec[dir][1]];

    // if the current cell is out of bounds, do nothing
    if (r < 0 || r >= map.length || c < 0 || c >= map[0].length) {
        // console.log(`out of bounds!`);
        return false;
    }
    // if the current cell is a wall, do nothing
    else if (map[r][c] === "#") {
        // console.log(`walls don't move!`);
        return false;
    }
    // if the current cell is a blank space, say it moved so that it can be occupied
    else if (map[r][c] === ".") {
        // console.log(`blank space filled!`);
        return true;
    }

    // move into the next cell
    // console.log(`attempting to move ${map[r][c]} into space occupied by ${map[nextR][nextC]}, carrying ${carry}`);
    // if there are items in the cell the object tries to move to, try to move them and then take their place
    const moved = moveInDir(map, [nextR, nextC], dir, map[r][c]);

    // if the cell moved, move the item to its place
    if (moved) {
        // console.log(`cleared space ahead, moving into space`);
        map[nextR][nextC] = map[r][c];
        map[r][c] = carry;
        return true;
    }
    // if the cell did not move, do nothing
    else {
        return false;
    }
}

// calculate the score of the map
function scoreMap(map: string[][]): number {
    let score = 0;
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[0].length; c++) {
            if (map[r][c] === "O") {
                score += (100 * r + c);
            }
        }
    }

    return score;
}