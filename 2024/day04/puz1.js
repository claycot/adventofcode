const fs = require('fs');
const readline = require('readline');

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

const word = 'XMAS';
let puzzle = [];

const directions = [
    [-1, 0], // up
    [-1, 1], // up-right
    [0, 1], // right
    [1, 1], // down-right
    [1, 0], // down
    [1, -1], // down-left
    [0, -1], // left
    [-1, -1], // up-left
];

// given a cell, look in all directions for the word
function findWord(word, puzzle, cell) {
    let foundCount = 0;

    // look in all 8 directions to find the word
    for (let i = 0; i < directions.length; i++) {
        // console.log(`looking for ${word} at ${cell} in direction ${directions[i]}`);
        foundCount += findWordInDir(word, puzzle, cell, directions[i]);
    }

    // return how many of the 0-8 possibilities were found
    return foundCount;
}

// return 0 or 1 if the word is found
function findWordInDir(word, puzzle, cell, direction, letterIndex = 1) {
    let letterToFind = word.charAt(letterIndex);

    let letterFound = null;
    try {
        letterFound = puzzle[cell[0] + direction[0]].charAt(cell[1] + direction[1]);
    }
    catch (err) {
        true;
    }

    // console.log(`letter to find was ${letterToFind} and letter found was ${letterFound}`);
    if (letterFound === letterToFind) {
        if (letterIndex + 1 === word.length) {
            // console.log(`that's a match!`);
            return 1;
        }
        else {
            return findWordInDir(word, puzzle, [cell[0] + direction[0], cell[1] + direction[1]], direction, letterIndex + 1);
        }
    }

    return 0;
}

// assemble the puzzle
fileIter.on('line', function (line) {
    puzzle.push(line);
});

// iterate over the lines of the puzzle
fileIter.on('close', function (_) {
    let wordCount = 0;

    // look for 'X' characters, since the string will always start with them

    // loop over each row of the puzzle
    for (let r = 0; r < puzzle.length; r++) {
        // loop over each char in the row
        for (let c = 0; c < puzzle[r].length; c++) {
            // if the char is the start of XMAS, look for the word
            if (puzzle[r].charAt(c) === word.charAt(0)) {
                wordCount += findWord(word, puzzle, [r, c]);
            };
        }
    }

    console.log(wordCount);
});