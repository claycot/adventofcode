import fs from 'node:fs';
import readline from 'node:readline';

const rl = readline.createInterface({
    input: fs.createReadStream('input_larger.txt'),
});

// map to hold content IDs
const map: number[][] = [];

// the contents of the map, including walls
const contents: Record<number, Content> = {};
interface Content {
    type: string,
    symbol: string,
    location?: number[], // anchor location
};

// key to convert input to contents
const contentTypes: Record<string, Content[]> = {
    ".": [
        {
            type: "empty",
            symbol: ".",
        },
        {
            type: "empty",
            symbol: ".",
        },
    ],
    "#": [
        {
            type: "wall",
            symbol: "#",
        },
        {
            type: "wall",
            symbol: "#",
        },
    ],
    "O": [
        {
            type: "box",
            symbol: "[]",
        }
    ],
    "@": [
        {
            type: "robot",
            symbol: "@",
        },
        {
            type: "empty",
            symbol: ".",
        }
    ],
}

// movement instructions
const instructions: string[] = [];

// direction char to movement vector
const dirToVec: Record<string, number[]> = {
    "^": [-1, 0],
    ">": [0, 1],
    "v": [1, 0],
    "<": [0, -1],
};

let robId: number = -1;

rl.on('line', (line) => {
    // assemble the map and track contents
    // deno-lint-ignore no-prototype-builtins
    if (contentTypes.hasOwnProperty(line.charAt(0)) && contentTypes[line.charAt(0)][0].type === "wall") {
        // create the content, which also loads the map
        map.push([]);
        line.split("").forEach(char => {
            const contentIds = createContent(char, map);
            if (contents[contentIds[0]].type === "robot") {
                robId = contentIds[0];
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
    console.log(contents);
    console.log(instructions);
    for (let i = 0; i < instructions.length; i++) {
        moveInDir(map, contents, robId, instructions[i]);
    };

    renderMap(map, contents).forEach(row => {
        console.log(row.join(" "));
    });

    // console.log(scoreMap(map));
});

function createContent(inputSymbol: string, map: number[][]): number[] {
    const contentIds: number[] = [];
    if (Object.prototype.hasOwnProperty.call(contentTypes, inputSymbol)) {
        // for each content represented by the symbol, 
        contentTypes[inputSymbol].forEach(cell => {
            // create the content
            const contentId = Object.keys(contents).length;
            contentIds.push(contentId);
            contents[contentId] = {
                ...cell,
                location: [map.length - 1, map[map.length - 1].length],
            }
            // for each space taken up by the content, assign its ID to the map
            for (let i = 0; i < cell.symbol.length; i++) {
                map[map.length - 1].push(contentId);
            }

        })
    }
    else {
        throw new Error(`Could not create content from input symbol ${inputSymbol}.`);
    }

    return contentIds;
}

// given a contentId, move the content in a given direction
// return the contentId that it replaced
function moveInDir(map: number[][], contents: Record<number, Content>, contentId: number, dir: string): number {
    console.log(`attempting to move ${contents[contentId].type} in direction: ${dir}`);

    // if the current content is a wall, do nothing
    if (contents[contentId].type === "wall") {
        console.log(`walls don't move!`);
        return -1;
    }
    // if the current content is a blank space, say it moved so that it can be occupied
    else if (contents[contentId].type === "empty") {
        console.log(`blank space filled!`);
        return contentId;
    }

    // move contents in the direction given
    const currentCells: number[][] = [];
    const nextCells: number[][] = [];
    const [rOrigin, cOrigin] = contents[contentId].location!;
    for (let i = 0; i < contents[contentId].symbol.length; i++) {
        currentCells.push([rOrigin, cOrigin + i]);
        nextCells.push([rOrigin + dirToVec[dir][0], cOrigin + i + dirToVec[dir][1]]);
    }
    console.log(`content currently occupies ${currentCells.join(" ")}`);
    // if we're moving out of bounds (wall failure!), return false
    if (nextCells.some(cell => cell[0] < 0 || cell[0] >= map.length || cell[1] < 0 || cell[1] >= map[0].length)) {
        console.log(`move would be out of bounds`);
        return -1;
    }
    console.log(`content will occupy ${nextCells.join(" ")}`);
    // console.log(`attempting to move ${map[r][c]} into space occupied by ${map[nextR][nextC]}, carrying ${carryId}`);
    // if there are items in the cells the content tries to move to, try to move them and then take their place
    const idsToSwap: Record<number, number> = {};
    nextCells.forEach(cell => {
        idsToSwap[map[cell[0]][cell[1]]] = -1;
    });
    for (const id of Object.keys(idsToSwap)) {
        // if any movement fails, stop trying
        const replacedId = moveInDir(map, contents, parseInt(id, 10), dir);
        console.log(`when moving ${JSON.stringify(contents[contentId])} in direction ${dir}, replaced content ${JSON.stringify(contents[replacedId])}`);
        if (replacedId === -1) {
            return -1;
        }
        else {
            idsToSwap[parseInt(id, 10)] = replacedId;
        }
    }

    return contentId;

    // // swap the ids from above
    // console.log(`cleared space ahead, moving into space`);
    // contents[contentId].location = contents[];
    // // swap the shifted cells
    // for (let c = 0; c < currentCells.length; c++) {
    //     // update the map
    //     map[nextCells[c][0]][nextCells[c][1]] = map[currentCells[c][0]][currentCells[c][1]];
    // }
    // Object.keys(shiftedIds).forEach(id => {
    //     const idNum = parseInt(id, 10);
    //     contents[idNum].location = shiftedIds[idNum];
    //     map[shiftedIds[idNum][0]][shiftedIds[idNum][1]] = idNum;
    // });
    // return contentId;
}

// calculate the score of the map
function scoreMap(contents: string[][]): number {
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

// convert a contents array into a 2D map with chars
function renderMap(map: number[][], contents: Record<number, Content>): string[][] {
    const strMap: string[][] = [];
    for (let r = 0; r < map.length; r++) {
        strMap.push([]);
        for (let c = 0; c < map[0].length; c++) {
            // find what content ID lives in the cell
            const content = contents[map[r][c]];
            // find which char within the content is occupying the cell
            const offsetFromOrigin = c - content.location![1];
            // console.log(`there is a ${content.type} in cell [${r}, ${c}], its origin is ${content.location}`)
            strMap[strMap.length - 1].push(content.symbol.charAt(offsetFromOrigin));
        }
    }

    return strMap;
}