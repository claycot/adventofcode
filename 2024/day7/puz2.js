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
        "sum": BigInt(equation[0]),
        "vals": equation[1].split(" ").map(val => BigInt(val)),
    });
});

fileIter.on('close', function (_) {
    const ops = ["+", "*", "||"];
    let sum = 0n;
    let counter = 0;

    // loop over each equation, validating if it's possible with the given operators
    eqs.forEach(eq => {
        if (validEq(eq, ops)) {
            sum += eq.sum;
            counter++;
        }
    });

    console.log(sum);
    console.log(counter);
    console.log(eqs.length);
});

// returns boolean to determine if equation can be made with given operators
function validEq(equation, operators) {
    // console.log(`validating equation: ${JSON.stringify(equation)}`);
    // backtracking algo that attempts to use ops in sequential order
    let path = [];
    let valid = backtrackEq(equation.sum, equation.vals[0], equation.vals.slice(1), operators, path);

    if (valid) {
        console.log(`can equate ${equation.sum} from vals ${equation.vals} valid with operators ${path}`);
        checkEquation(equation, path);
    }

    return valid;
}

function backtrackEq(goalSum, currSum, numsLeft, operators, path) {
    // console.log(`current sum is ${currSum}, we have ${numsLeft} left, and operator path is ${path}`);
    // base case: if we made the goal value, it's true
    if (goalSum === currSum && !numsLeft.length) {
        return true;
    }
    // base case: if we didn't and we're out of numbers to try, or we already exceeded the sum, it's false
    else if (!numsLeft.length || currSum > goalSum) {
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
    else if (operator === "||") {
        val = BigInt(num1.toString() + num2.toString());
    }
    // console.log(`performing operation ${num1} ${operator} ${num2} results in ${val}`);
    return val;
}

function checkEquation(equation, operators) {
    let sum = equation.vals[0];
    let eqString = sum;

    for (let i = 1; i < equation.vals.length; i++) {
        sum = useOperator(sum, equation.vals[i], operators[i - 1]);
        eqString += operators[i - 1];
        eqString += equation.vals[i];
    }

    if (sum !== equation.sum) {
        console.log(`========err! invalid equation above=========`);
        console.log(eqString);
    }
}