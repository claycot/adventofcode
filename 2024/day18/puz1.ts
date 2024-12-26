import fs from "node:fs";
import readLine from "node:readline";

const lineReader = readLine.createInterface({
    input: fs.createReadStream("input.txt"),
});

interface Node {
    cell: number[];
    distance: number;
    via?: Node;
}

// save the maze as a 2D arr of chars
const maze: string[][] = [];
for (let i = 0; i <= 70; i++) {
    maze.push([]);
    for (let j = 0; j <= 70; j++) {
        maze[maze.length - 1].push(".");
    }
}

// track nodes in the map, with key `${row},${col}`
const nodes: Record<string, Node> = {};
let startPos: number[] = [0, 0];
let endPos: number[] = [70, 70];

const directions: number[][] = [[0, 1], [1, 0], [0, -1], [-1, 0]];
let counter = 1;

// read the maze
lineReader.on("line", function (line) {
    if (counter > 1024) {
        return;
    }
    const [c, r] = line.split(",").map((num) => parseInt(num, 10));

    maze[r][c] = "#";
    counter++;
});

// after the maze is ready, use dijkstra's algo to solve it in the shortest time
// going forward costs 1, going left or right costs 1001
lineReader.on("close", function () {
    printMaze(maze);
    console.log(counter);
    console.log(seekDijkstra(maze, {
        cell: startPos,
        distance: 0,
        via: undefined,
    }));
});

// util to print maze and start/end positions
function printMaze(maze: string[][]): void {
    maze.forEach((row) => {
        console.log(row.join(" "));
    });

    console.log(`start:\t${startPos}`);
    console.log(`end:\t${endPos}`);
}

// what is the next move to explore?
// find the shortest distance from the goal and seek from there, adding each option to the queue
// organize the potential nodes with a minheap
function seekDijkstra(maze: string[][], node: Node): number {
    let queue: Node[] = [node];

    // while we aren't at the end, seek paths
    while (queue.length) {
        let workingNode: Node = queue.shift()!;
        // console.log(`working node is ${workingNode.cell}`);
        let nextNodes: Node[] = [];

        // find nodes in all directions
        directions.forEach((dir) => {
            let nextNode = {
                cell: [
                    workingNode.cell[0] + dir[0],
                    workingNode.cell[1] + dir[1],
                ],
                distance: workingNode.distance + 1,
                via: workingNode,
            };
            // console.log(`seeking in dir ${dir}, new node is ${nextNode.cell}`)

            if (isPassable(nextNode.cell, maze)) {
                // console.log(`that's passable! pushing to queue.`)
                nextNodes.push(nextNode);
            }
        });

        // console.log(`next nodes from ${workingNode.cell} are:`);
        // console.log(nextNodes.filter((node) => node !== null));
        // for each node, if it already exists, add it to the memo map
        nextNodes.forEach((node) => {
            // memoize and return the cell, if it doesn't already exist or if this is a new shortest distance
            const cellKey = getCellKey(node.cell);
            if (
                !nodes.hasOwnProperty(cellKey) ||
                nodes[cellKey].distance > node.distance
            ) {
                nodes[cellKey] = node;
                // add to the queue
                queue.push(node);
            }
        });

        // // if the end was found, break so it can be returned
        // if (nodes.hasOwnProperty(getCellKey(endPos))) {
        //     break;
        // }

        // sort the queue
        queue.sort((a, b) => {
            return a.distance - b.distance;
        });
    }

    // console.log(nodes);
    // console.log(getPathString(nodes[getCellKey(endPos)]));
    return nodes.hasOwnProperty(getCellKey(endPos))
        ? nodes[getCellKey(endPos)].distance
        : -1;
}

// what is the path taken?
// all of the last nodes "via"
function getPathString(node?: Node): number[][] {
    const path: number[][] = [];

    while (node) {
        path.unshift(node.cell);
        node = node.via;
    }

    return path;
}

function getCellKey(cell: number[]): string {
    return `${cell[0]},${cell[1]}`;
}

function isPassable(cell: number[], maze: string[][]): boolean {
    const [r, c] = cell;

    return (r >= 0 && r < maze.length && c >= 0 && c < maze[r].length &&
        maze[r][c] !== "#");
}
