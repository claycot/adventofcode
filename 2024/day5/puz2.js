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

function validatePages(pages, rules) {
    let bannedNums = {};

    // loop over the nums in the sequence
    for (let p = 0; p < pages.length; p++) {
        const page = pages[p];
        // console.log(`checking page ${page}`);
        // if the current page number is banned, stop trying to validate
        if (bannedNums.hasOwnProperty(page)) {
            // console.log(`that page was banned!`);
            valid = false;
            return false;
        }
        // otherwise, load the banned map and proceed
        if (rules.hasOwnProperty(page)) {
            // console.log(`banning pages ${rules[page]}`);
            rules[page].forEach(bannedPage => {
                bannedNums[bannedPage] = true;
            });
        }
    }

    return true;
}

function checksumPages(pages) {
    if (pages.length % 2 === 0) {
        // console.log(`even`);
        return (parseInt(pages[Math.floor(pages.length / 2)], 10) + parseInt(pages[Math.ceil(pages.length / 2)], 10)) / 2;
    }
    else {
        // console.log(`odd`);
        return parseInt(pages[Math.floor(pages.length / 2)], 10);
    }
}

// iterate over the page sets and see if each is valid
fileIter.on('close', function (_) {
    let checksum = 0;
    let invalidPages = [];

    // check each page set for validity
    for (let i = 0; i < pages.length; i++) {
        // console.log(`page set is ${pages[i]}`);
        // map all of the banned nums in the sequence
        let valid = validatePages(pages[i], rules);

        // if the pages were valid, add the middle digit to the sum
        if (valid) {
            // console.log(`set was valid`);
            let val = checksumPages(pages[i]);

            checksum += val;
        }
        else {
            invalidPages.push(pages[i]);
        }
    }

    // for all sets of pages with an invalid order, repair the order
    let checksumRepaired = 0;
    invalidPages.forEach(set => {
        // new order
        let newSet = [];

        // iterate over all pages in the original set, initially attempting to add to the start
        // and then moving them backwards until all rules are satisfied
        set.forEach(num => {
            if (!newSet.length) {
                newSet.push(num);
            }
            else {
                // loop over each number that can't come after this number
                // find the latest one in the current string, then insert after
                for (let i = newSet.length - 1; i >= 0; i--) {
                    if (rules[num].includes(newSet[i])) {
                        newSet.splice(i + 1, 0, num);
                        break;
                    }
                    else if (i === 0) {
                        newSet.unshift(num);
                    }
                }
            }

        });

        let valid = validatePages(newSet, rules);

        // if the pages were valid, add the middle digit to the sum
        if (valid) {
            // console.log(`set was valid`);
            let val = checksumPages(newSet);

            checksumRepaired += val;
        }
    })

    console.log(checksum);
    console.log(invalidPages.length);
    console.log(checksumRepaired);

});