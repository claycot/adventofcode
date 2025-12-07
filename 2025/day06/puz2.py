OPERATOR_LIST = "+*"

def main():
    lines = []
    prob_widths = []
    op_line = -1
    sum = 0

    with open("input.txt") as file:
        for line in file:
            lines.append(line)

    for i in range(len(lines) - 1, 0, -1):
        if lines[i][0] in OPERATOR_LIST:
            op_line = i
            prob_widths = find_widths(lines[i])
            break
        elif lines[i].strip():
            raise ValueError("invalid input; final non-blank line is not operators")
        
    if len(prob_widths) == 0:
        raise ValueError("invalid input; no problems provided")
    
    # need the first offset to be -1 since there was no space consumed
    offset = -1
    for width in prob_widths:
        vals = []

        # jump to the last col in the problem so we can work backwards
        # +1 is to account for space between problems
        offset += width + 1

        # starting at the last col and working backwards, build col values
        for i in range(offset - 1, offset - width - 1, -1):
            sum_col = ""
            for line in lines[:op_line]:
                if line[i] != " ":
                    sum_col += line[i]
            vals.append(int(sum_col))

        sum += solve_problem(vals, lines[-1][offset - width])

    print(sum)
    return sum

def find_widths(op_line: str) -> list[int]:
    widths = []
    i_last_op = 0

    for i in range(1, len(op_line)):
        if op_line[i] in OPERATOR_LIST:
            widths.append(i - i_last_op - 1)
            i_last_op = i
        elif op_line[i] == "\n":
            widths.append(i - i_last_op)
            i_last_op = i

    return widths


def solve_problem(vals: list[int], operator: str) -> int:
    ans = 0

    if (operator == "+"):
        ans = sum(vals)
    elif (operator == "*"):
        ans = product(vals)

    return ans

def product(values: list[int]) -> int:
    prod = 1

    for val in values:
        prod *= val

    return prod

if __name__ == "__main__":
    main()