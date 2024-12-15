import fs from 'node:fs';
import readline from 'node:readline';

const rl = readline.createInterface({
    input: fs.createReadStream('input_larger.txt'),
});

const map: string[][] = [];
const instructions: string[] = [];
const linkedCells: Record<string, string> = {};

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
                map[map.length - 1].push(char);
                map[map.length - 1].push(".");
            }
            else if (char === "O") {
                map[map.length - 1].push("[");
                map[map.length - 1].push("]");
                // link the boxes together
                const leftCell = `${map.length - 1},${map[map.length - 1].length - 2}`;
                const rightCell = `${map.length - 1},${map[map.length - 1].length - 1}`;

                linkedCells[leftCell] = rightCell;
                linkedCells[rightCell] = leftCell;
            }
            else {
                map[map.length - 1].push(char);
                map[map.length - 1].push(char);
            }
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
        if (moveInDir(map, [robLoc], instructions[i], ["."])) {
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
function moveInDir(map: string[][], cells: number[][], dir: string, carry: string[]): boolean {
    // verify all of the cells we want to move
    for (let i = 0; i < cells.length; i++) {
        const [r, c] = cells[i];

        // if any cell is out of bounds, return false
        if (r < 0 || r >= map.length || c < 0 || c >= map[0].length) {
            // console.log(`out of bounds!`);
            return false;
        }
        // if any cell is a wall, return false
        else if (map[r][c] === "#") {
            // console.log(`walls don't move!`);
            return false;
        }
    }

    // if all cells are empty, return true
    if (cells.every(cell => map[cell[0]][cell[1]] === ".")) {
        return true;
    }

    // otherwise, we need to move boxes or the robot itself
    const expandedCells: Record<string, boolean> = {};
    cells.forEach(cell => {
        const cellKey = `${cell[0]},${cell[1]}`;
        expandedCells[cellKey] = true;
        if (linkedCells.hasOwnProperty(cellKey)) {
            linkedCells[cellKey].split(",").map(str => parseInt(str, 10));
        }
    })

    cells = Object.keys(expandedCells).map(key => key.split(",").map(str => parseInt(str, 10)));
    console.log(cells);
    const cellsNext = cells.map(cell => [cell[0] + dirToVec[dir][0], cell[1] + dirToVec[dir][1]]);

    // console.log(`attempting to move ${map[r][c]} into space occupied by ${map[nextR][nextC]}, carrying ${carry}`);
    // if there are items in the cell the object tries to move to, try to move them and then take their place
    let moved = false;
    for (let i = 0; i < cellsNext.length; i++) {
        moved = moveInDir(map, [[cellsNext[i][0], cellsNext[i][1]]], dir, [map[cells[i][0]][cells[i][0]]]);
    }

    // if the cells moved, move the item to its place
    if (moved) {
        for (let i = 0; i < cellsNext.length; i++) {
            // console.log(`cleared space ahead, moving into space`);
            map[cellsNext[i][0]][cellsNext[i][1]] = map[cells[i][0]][cells[i][0]];
            map[cells[i][0]][cells[i][0]] = carry[i];
        }
    }

    return moved;
}

// calculate the score of the map
function scoreMap(map: string[][]): number {
    let score = 0;
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[0].length; c++) {
            if (map[r][c] === "[") {
                let lowestScore = Math.min(100 * r + c, 100 * r + (map[r].length - c));
                score += lowestScore;
            }

        }
    }

    return score;
}