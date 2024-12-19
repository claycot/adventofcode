import fs from "node:fs";
import readline from "node:readline";

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

const map: string[][] = [];
let start: number[] = [-1, -1];
let end: number[] = [-1, -1];

let finished: Record<string, number> = {};

const dirs: number[][] = [
    [0, 1], [-1, 0], [0, -1], [1, 0],
]

fileIter.on('line', function (line) {
    map.push([]);
    line.split("").forEach(char => {
        map[map.length - 1].push(char);

        if (char === "S") {
            start = [map.length - 1, map[map.length - 1].length - 1];
        }
        else if (char === "E") {
            end = [map.length - 1, map[map.length - 1].length - 1];
        }
    })
});

fileIter.on('close', function (line) {
    console.log(start);
    console.log(end);

    // use Dijkstra's algorithm to figure out the shortest time to reach each location
    seekEnd(map, start, end);

    // loop over the map to check the difference between dists on all 4 sides of each wall
    findCheats(map);

    console.log(finished[getKey(end)]);
    console.log(findCheats(map).filter(cheat => cheat >= 100).length);
});

function seekEnd(maze: string[][], start: number[], end: number[]) {
    // queue contains nodes in [r, c, t] triplet
    const queue: number[][] = [];

    queue.push([...start, 0]);

    while (queue.length) {
        // process shortest t node
        const node = queue.shift()!;
        const [r2, c2, t2] = node;

        // if we're at the end, look no further!
        if (r2 === end[0] && c2 === end[1]) {
            finished[getKey(node)] = t2;
            continue;
        }

        // look in all 4 directions
        dirs.forEach(dir => {
            const newNode = [node[0] + dir[0], node[1] + dir[1], node[2] + 1];

            if (checkBounds(maze, newNode) && maze[newNode[0]][newNode[1]] !== "#") {
                // memoize and return the cell, if it doesn't already exist or if this is a new shortest distance
                const cellKey = getKey(newNode);
                if (
                    !finished.hasOwnProperty(cellKey) ||
                    finished[cellKey] > newNode[2]
                ) {
                    finished[cellKey] = newNode[2];
                    // add to the queue
                    queue.push(newNode);
                }
            }
        });

        // sort nodes by ascending t (shortest t)
        queue.sort((a, b) => a[2] - b[2]);
    }
}

// check dists on all 4 sides of each wall, finding how much time is saved by cheating across each wall
function findCheats(maze: string[][]): number[] {
    const cheats: number[] = [];

    // exclude the perimeter of the map so we don't have to check bounds on everything
    for (let r = 1; r + 1 < maze.length; r++) {
        for (let c = 1; c + 1 < maze[r].length; c++) {
            // try to cheat if it's a wall
            if (maze[r][c] === "#") {
                // check vertical cheat
                let cellUp = [r - 1, c];
                let cellDown = [r + 1, c];
                const cheatVert = cheat(cellUp, cellDown);
                if (cheatVert > 0) {
                    cheats.push(cheatVert);
                }                

                // check horizontal cheat
                let cellLeft = [r, c - 1];
                let cellRight = [r, c + 1];
                const cheatHorz = cheat(cellLeft, cellRight);
                if (cheatHorz > 0) {
                    cheats.push(cheatHorz);
                }

            }
        }
    }

    return cheats;
}

function cheat(cell1: number[], cell2: number[]) {
    let cheat = 0;
    if (finished.hasOwnProperty(getKey(cell1)) && finished.hasOwnProperty(getKey(cell2))) {
        cell1[2] = finished[getKey(cell1)];
        cell2[2] = finished[getKey(cell2)];
        cheat = Math.abs(cell1[2] - cell2[2]) - 2;
    }
    return cheat;
}

function checkBounds(maze: string[][], cell: number[]): boolean {
    const [r, c] = cell;

    return (r >= 0 && r < maze.length && c >= 0 && c < maze[r].length);
}

function getKey(cell: number[]): string {
    return `${cell[0]},${cell[1]}`;
}