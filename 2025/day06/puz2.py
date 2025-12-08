OPERATOR_LIST = "+*"
WHITESPACE_LIST = "\r\n\t"

def main():
    lines = []
    sum = 0

    with open("input.txt") as file:
        for line in file:
            lines.append(line.strip(WHITESPACE_LIST))

    vals = []
    for i in range(len(lines[0]) - 1, -1, -1):
        val = ""
        for line in lines:
            if line[i] in OPERATOR_LIST:
                vals.append(int(val))
                sum += solve_problem(vals, line[i])
                val = ""
                vals = []
            elif line[i] != " ":
                val += line[i]

        if len(val):
            vals.append(int(val))

    print(sum)
    return sum

def solve_problem(vals: list[int], operator: str) -> int:
    ans = 0

    if (operator == "+"):
        ans = sum(vals)
    elif (operator == "*"):
        ans = product(vals)

    # print(f"solution to {operator} problem with vals {vals} is {ans}")
    return ans

def product(values: list[int]) -> int:
    prod = 1

    for val in values:
        prod *= val

    return prod

if __name__ == "__main__":
    main()