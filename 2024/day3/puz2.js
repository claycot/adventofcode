const fs = require('fs');

// regex the string for 
const regexMul = /mul\((?<num1>[0-9]{1,3}),(?<num2>[0-9]{1,3})\)/gi;
const regexEnable = /do\(\)/gi;
const regexDisable = /don\'t\(\)/gi;

// get the string input
fs.readFile('input.txt', 'utf8', (err, data) => {
    // find the enable/disable indices
    const enableIndices = [];
    const enableMatches = [...data.matchAll(regexEnable)];
    const disableMatches = [...data.matchAll(regexDisable)];

    // while there are enable or disable indices remaining, process them
    let prevEnable = 0;
    while (enableMatches.length && disableMatches.length) {
        let enableMatch = enableMatches.shift();
        let disableMatch = disableMatches.shift();

        // console.log(`enable at ${enableMatch.index}, disable at ${disableMatch.index}`)

        // if the enableMatch index is first,
        if (enableMatch.index < disableMatch.index) {
            // if the groups are not currently enabled, enable them
            if (prevEnable === null) {
                prevEnable = enableMatch.index;
            }
            // if the groups are currently enabled, do nothing!

            // push back the disableMatch for next
            disableMatches.unshift(disableMatch);
        }
        else {
            // if the groups are currently enabled, disable them and track that
            if (prevEnable !== null) {
                enableIndices.push([prevEnable, disableMatch.index]);
            }
            // reset the prevEnable value
            prevEnable = null;
            // push back the enable for next time
            enableMatches.unshift(enableMatch);
        }
    }

    // edge case of the final enable
    if (enableMatches.length && prevEnable === null) {
        enableIndices.push([enableMatches[0].index, data.length]);
    }
    // edge case of final disable
    else if (disableMatches.length && prevEnable !== null) {
        enableIndices.push([prevEnable, disableMatches[0].index]);
    }

    console.log(enableIndices);

    // for each match, multiply the first group by the second group, then add to the running total
    const mulGroups = [...data.matchAll(regexMul)];
    let sum = 0;
    for (const match of mulGroups) {
        // console.log(match.index);
        while (enableIndices.length && enableIndices[0][0] < match.index) {
            if (enableIndices[0][1] > match.index) {
                sum += (parseInt(match.groups.num1, 10) * parseInt(match.groups.num2, 10));
                break;
            }
            else {
                enableIndices.shift();
            }
        }
    }

    console.log(sum);
})

