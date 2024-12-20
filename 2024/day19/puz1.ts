import fs from "node:fs";
import readline from "node:readline";

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

const towels: string[] = [];
const goals: string[] = [];
const trie = {
    children: {},
    complete: true,
};

fileIter.on('line', function (line) {
    if (!towels.length) {
        line.split(",").forEach(towel => {
            towels.push(towel.trim())
            loadTrie(trie, towel.trim());
        });
    }
    else if (line.length) {
        goals.push(line);
    }
});

fileIter.on('close', function (_) {
    console.log(trie);

    let made = 0;

    // for each goal pattern, use backtracking to attempt to create it
    for (let g = 0; g < goals.length; g++) {
        console.log(`attempting to make pattern ${goals[g]}`);
        if(checkPattern(trie, goals[g])) {
            made++;
        }
    }

    console.log(made);
    console.log(goals.length);
});

function loadTrie(trie: Record<string, any>, towel: string): void {
    let node = trie;
    for (let c = 0; c < towel.length; c++) {
        if (!node.children.hasOwnProperty(towel.charAt(c))) {
            node.children[towel.charAt(c)] = {
                children: {},
                complete: false,
            }
        }
        node = node.children[towel.charAt(c)];
    }

    node.complete = true;

    return;
}

function checkTrie(trie: Record<string, any>, pattern: string): boolean {
    let node = trie;
    for (let c = 0; c < pattern.length; c++) {
        if (!node.children.hasOwnProperty(pattern.charAt(c))) {
            return false;
        }
        node = node.children[pattern.charAt(c)];
    }

    return node.complete;
}

function checkPattern(trie: Record<string, any>, pattern: string, memo: Record<string, boolean> = {}): boolean {
    if (memo.hasOwnProperty(pattern)) {
        return memo[pattern];
    }

    // console.log(`pattern length is ${pattern.length}`);
    
    // if there is no pattern left, we have successfully created it!
    if (!pattern.length) {
        return true;
    }

    // attempt to fill as much of the pattern as possible
    for (let c = pattern.length; c > 0; c--) {
        // if length of the pattern from 0 to c can be made with a given towel, attempt to create the rest
        if (checkTrie(trie, pattern.substring(0, c))) {
            // console.log(`covered first ${c} characters of pattern, checking the rest`);
            if (checkPattern(trie, pattern.substring(c), memo)) {
                memo[pattern] = true;
                return true;
            }
            // console.log(`that didn't work... let's try covering something shorter`);
        }
    }

    memo[pattern] = false;
    return false;
}
