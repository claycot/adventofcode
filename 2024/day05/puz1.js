const fs = require('fs');
const readline = require('readline');

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

// maintain a list of pages that can not come after a given number!
let rules = {};

// maintain the sets of ordered pages
let pages = [];

// assemble the rules and page sets
fileIter.on('line', function (line) {
    // if the line is a rule, add it
    if (line.includes("|")) {
        const nums = line.split("|");

        if (!rules.hasOwnProperty(nums[1])) {
            rules[nums[1]] = [];
        }
        rules[nums[1]].push(nums[0]);
    }

    // if the line is a set of pages, add them
    else if (line.includes(",")) {
        pages.push(line.split(","));
    }
});

// iterate over the page sets and see if each is valid
fileIter.on('close', function (_) {
    let checksum = 0;

    // check each page set for validity
    for (let i = 0; i < pages.length; i++) {
        // console.log(`page set is ${pages[i]}`);
        // map all of the banned nums in the sequence
        let bannedNums = {};
        let valid = true;

        // loop over the nums in the sequence
        for (let p = 0; p < pages[i].length; p++) {
            const page = pages[i][p];
            // console.log(`checking page ${page}`);
            // if the current page number is banned, stop trying to validate
            if (bannedNums.hasOwnProperty(page)) {
                // console.log(`that page was banned!`);
                valid = false;
                break;
            }
            // otherwise, load the banned map and proceed
            if (rules.hasOwnProperty(page)) {
                // console.log(`banning pages ${rules[page]}`);
                rules[page].forEach(bannedPage => {
                    bannedNums[bannedPage] = true;
                });
            }
        }

        // if the pages were valid, add the middle digit to the sum
        if (valid) {
            // console.log(`set was valid`);
            let val = null;
            if (pages[i].length % 2 === 0) {
                // console.log(`even`);
                val = (parseInt(pages[i][Math.floor(pages[i].length / 2)], 10) + parseInt(pages[i][Math.ceil(pages[i].length / 2)], 10)) / 2;
            }
            else {
                // console.log(`odd`);
                val = parseInt(pages[i][Math.floor(pages[i].length / 2)], 10);
            }
            checksum += val;
        }

    }

    console.log(checksum);
});