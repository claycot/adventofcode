const fs = require('fs');
const readline = require('readline');

// read puzzle from file
const fileIter = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

const eqs = [];

fileIter.on('line', function (line) {
    let equation = line.split(": ");
    eqs.push({
        "sum": parseInt(equation[0], 10),
        "vals": equation[1].split(" ").map(val => parseInt(val, 10)),
    });
});

fileIter.on('close', function (_) {
    const ops = ["+", "*"];
    let sum = 0;

    // loop over each equation, validating if it's possible with the given operators
    eqs.forEach(eq => {
        if (validEq(eq, ops)) {
            sum += eq.sum;
        }
    });

    console.log(sum);
});

// returns boolean to determine if equation can be made with given operators
function validEq(equation, operators) {
    // console.log(`validating equation: ${JSON.stringify(equation)}`);
    // backtracking algo that attempts to use ops in sequential order
    return backtrackEq(equation.sum, 0, equation.vals, operators, []);
}

function backtrackEq(goalSum, currSum, numsLeft, operators, path) {
    // console.log(`current sum is ${currSum}, we have ${numsLeft} left, and operator path is ${path}`);
    // base case: if we made the goal value, it's true
    if (goalSum === currSum) {
        return true;
    }
    // base case: if we didn't and we're out of numbers to try, it's false
    else if (!numsLeft.length) {
        return false;
    }

    // otherwise, try each operator
    for (let o = 0; o < operators.length; o++) {
        path.push(operators[o]);
        if (backtrackEq(goalSum, useOperator(currSum, numsLeft[0], operators[o]), numsLeft.slice(1), operators, path)) {
            return true;
        }
        path.pop();
    }

    // if we used all the operators and nothing worked, return false
    return false;
}

function useOperator(num1, num2, operator) {
    let val = -1;
    if (operator === "+") {
        val = num1 + num2;
    }
    else if (operator === "*") {
        val = num1 * num2;
    }
    // console.log(`performing operation ${num1} ${operator} ${num2} results in ${val}`);
    return val;
}